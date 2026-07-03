import asyncio

from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.gen_agent import GenAIAgent
from app.agents.nlp_agent import NLPAgent
from app.agents.rag_agent import RAGAgent
from app.agents.risk_agent import RiskAgent
from app.config import get_settings
from app.mcp.tools import mcp_server
from app.memory.chat_memory import memory
from app.models.schemas import ChatResponse
from app.services.portfolio import get_portfolio_summary


class LangChainOrchestrator:

    def __init__(self):

        self.rag_agent = RAGAgent()
        self.nlp_agent = NLPAgent()
        self.risk_agent = RiskAgent()
        self.gen_agent = GenAIAgent()

    async def process(
        self,
        query: str,
        session: AsyncSession,
        user_id: str | None = None,
    ) -> ChatResponse:

        settings = get_settings()

        uid = user_id or settings.default_user_id

        trace = []

        # -------------------------------------
        # Conversation Memory
        # -------------------------------------

        history = memory.get(uid)

        rag_task = asyncio.to_thread(
            self.rag_agent.run,
            query,
        )

        nlp_task = self.nlp_agent.run(query)

        portfolio_task = get_portfolio_summary(
            session,
            uid,
        )

        (
            rag_result,
            nlp_result,
            portfolio_summary,
        ) = await asyncio.gather(
            rag_task,
            nlp_task,
            portfolio_task,
        )

        citations, rag_trace = rag_result
        sentiment, ticker, nlp_trace = nlp_result

        trace.append(rag_trace)
        trace.append(nlp_trace)

        portfolio_context = mcp_server.get_portfolio_context(
            portfolio_summary.model_dump(),
            ticker,
        )

        holdings = [
            h.model_dump()
            for h in portfolio_summary.holdings
        ]

        risk, risk_trace = await asyncio.to_thread(
            self.risk_agent.run,
            holdings,
            ticker,
            sentiment.overall_label,
        )

        trace.append(risk_trace)

        answer, gen_trace = await self.gen_agent.run(
            query=query,
            history=history,
            citations=citations,
            sentiment=sentiment,
            risk=risk,
            portfolio=portfolio_context,
            user_risk_tolerance=portfolio_summary.risk_tolerance,
        )

        trace.append(gen_trace)

        # -----------------------------
        # Save Conversation
        # -----------------------------

        memory.add(
            uid,
            "user",
            query,
        )

        memory.add(
            uid,
            "assistant",
            answer,
        )

        return ChatResponse(
            answer=answer,
            citations=citations,
            sentiment=sentiment,
            risk=risk,
            portfolio=portfolio_context,
            agent_trace=trace,
            ticker=ticker,
        )


orchestrator = LangChainOrchestrator()