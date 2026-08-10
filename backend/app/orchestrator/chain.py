import json
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

# Small talk / greetings that don't need the full financial-analysis pipeline.
_SMALL_TALK_PATTERN = re.compile(
    r"^(hi|hii+|hey+|hello+|yo|sup|good\s?(morning|afternoon|evening)|thanks?|thank\s?you|ok(ay)?|bye|goodbye)[\s!.?]*$",
    re.IGNORECASE,
)

_SMALL_TALK_REPLY = (
    "Hey! 👋 I'm FinSight AI, your financial co-pilot. Ask me about a stock, "
    "RBI/SEBI policy, market sentiment, or your own portfolio — for example, "
    "\"Is my portfolio too concentrated in banking?\" or \"Should I add to my TCS position?\""
)


class LangChainOrchestrator:
    """Central orchestrator routing queries through specialized agents."""

    def __init__(self) -> None:
        self.rag_agent = RAGAgent()
        self.nlp_agent = NLPAgent()
        self.risk_agent = RiskAgent()
        self.gen_agent = GenAIAgent()

    async def process(self, query: str, session: AsyncSession, user_id: str | None = None) -> ChatResponse:
        settings = get_settings()
        uid = user_id or settings.default_user_id
        trace = []

        # Short-circuit greetings/small talk — no need to run RAG, sentiment,
        # portfolio and risk analysis just to say "hi" back.
        if _SMALL_TALK_PATTERN.match(query.strip()):
            trace.append(
                AgentTrace(
                    agent="Router",
                    status="completed",
                    summary="Detected small talk — skipped full analysis pipeline.",
                )
            )
            return ChatResponse(
                answer=_SMALL_TALK_REPLY,
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