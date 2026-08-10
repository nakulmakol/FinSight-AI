import re

from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.gen_agent import GenAIAgent
from app.agents.nlp_agent import NLPAgent
from app.agents.rag_agent import RAGAgent
from app.agents.risk_agent import RiskAgent
from app.config import get_settings
from app.mcp.tools import mcp_server
from app.models.schemas import AgentTrace, ChatResponse
from app.services.portfolio import get_portfolio_summary

_FINANCE_KEYWORDS = re.compile(
    r"\b(stock|share|invest|portfolio|market|rbi|sebi|sector|risk|return|"
    r"buy|sell|price|nifty|sensex|mutual\s?fund|bond|equity|ipo|dividend|"
    r"tcs|infosys|hdfc|reliance|sbin?|bank(ing)?)\b",
    re.IGNORECASE,
)

_CONVERSATIONAL_PATTERN = re.compile(
    r"^(hi|hii+|hey+|hello+|yo|sup|good\s?(morning|afternoon|evening)|"
    r"thanks?|thank\s?you|ok(ay)?|bye|goodbye|how\s+are\s+you\??|"
    r"what('?s| is| do you| can you)\s.*|who\s+are\s+you\??)"
    r"[\s!.?]*$",
    re.IGNORECASE,
)


def _is_small_talk(query: str) -> bool:
    q = query.strip()
    if not q:
        return True
    if _FINANCE_KEYWORDS.search(q):
        return False
    if _CONVERSATIONAL_PATTERN.match(q):
        return True
    return len(q.split()) <= 4 and not _FINANCE_KEYWORDS.search(q)


class LangChainOrchestrator:
    """Central orchestrator routing queries through specialized agents."""

    def __init__(self) -> None:
        self.rag_agent = RAGAgent()
        self.nlp_agent = NLPAgent()
        self.risk_agent = RiskAgent()
        self.gen_agent = GenAIAgent()

    async def process(
        self,
        query: str,
        session: AsyncSession,
        user_id: str | None = None,
        history: list[dict] | None = None,
    ) -> ChatResponse:
        settings = get_settings()
        uid = user_id or settings.default_user_id
        history = history or []
        trace = []

        if _is_small_talk(query):
            reply, gen_trace = await self.gen_agent.run_lightweight(query, history=history)
            trace.append(
                AgentTrace(
                    agent="Router",
                    status="completed",
                    summary="Detected small talk — skipped full analysis pipeline.",
                )
            )
            trace.append(gen_trace)
            return ChatResponse(
                answer=reply,
                citations=[],
                sentiment=None,
                risk=None,
                portfolio=None,
                agent_trace=trace,
                ticker=None,
            )

        citations, rag_trace = self.rag_agent.run(query)
        trace.append(rag_trace)

        sentiment, ticker, nlp_trace = await self.nlp_agent.run(query)
        trace.append(nlp_trace)

        portfolio_summary = await get_portfolio_summary(session, uid)
        portfolio_insight = mcp_server.get_portfolio_context(
            portfolio_summary.model_dump(),
            ticker,
        )

        holdings_dicts = [h.model_dump() for h in portfolio_summary.holdings]
        risk, risk_trace = self.risk_agent.run(
            holdings_dicts,
            ticker,
            sentiment.overall_label,
        )
        trace.append(risk_trace)

        answer, gen_trace = await self.gen_agent.run(
            query=query,
            citations=citations,
            sentiment=sentiment,
            risk=risk,
            portfolio=portfolio_insight,
            user_risk_tolerance=portfolio_summary.risk_tolerance,
            history=history,
        )
        trace.append(gen_trace)

        return ChatResponse(
            answer=answer,
            citations=citations,
            sentiment=sentiment,
            risk=risk,
            portfolio=portfolio_insight,
            agent_trace=trace,
            ticker=ticker,
        )


orchestrator = LangChainOrchestrator()