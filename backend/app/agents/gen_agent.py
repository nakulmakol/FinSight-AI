from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from app.llm.factory import get_llm
from app.models.schemas import (
    AgentTrace,
    Citation,
    PortfolioInsight,
    RiskInsight,
    SentimentInsight,
)


class GenAIAgent:
    role = "Gen AI Agent"
    goal = "Synthesize a cited, risk-aware financial recommendation"

    async def run(
        self,
        query: str,
        citations: list[Citation],
        sentiment: SentimentInsight,
        risk: RiskInsight,
        portfolio: PortfolioInsight,
        user_risk_tolerance: str,
        history: list[dict] | None = None,
    ) -> tuple[str, AgentTrace]:
        history = history or []

        citation_block = "\n".join(
            f"- [{c.title}] ({c.source}): {c.excerpt[:300]}..." for c in citations
        ) or "No regulatory documents retrieved."

        system = SystemMessage(
            content=(
                "You are FinSight AI, a responsible financial co-pilot for Indian markets. "
                "Provide balanced, educational guidance — not guaranteed investment advice. "
                "Always cite retrieved documents when relevant. "
                "Factor in portfolio concentration, sentiment, and risk tolerance. "
                "Structure your answer with: Regulatory Context, Market Sentiment, "
                "Portfolio Fit, Risk Assessment, and Recommendation sections. "
                "Be concise but thorough."
            )
        )

        # Rebuild prior turns so the model has conversational memory.
        history_messages = []
        for turn in history:
            role = turn.get("role")
            content = turn.get("content", "")
            if not content:
                continue
            if role == "user":
                history_messages.append(HumanMessage(content=content))
            elif role == "assistant":
                history_messages.append(AIMessage(content=content))

        human = HumanMessage(
            content=f"""
User question: {query}

User risk tolerance: {user_risk_tolerance}

Retrieved documents:
{citation_block}

News sentiment: {sentiment.overall_label} (score {sentiment.overall_score})
Sample headlines: {', '.join(sentiment.sample_headlines[:3]) or 'None'}

Portfolio total value: ₹{portfolio.total_value:,.0f}
Sector allocation: {portfolio.sector_allocation}
Relevant exposure note: {portfolio.relevant_exposure or 'N/A'}

Risk level: {risk.risk_level}
Concentration warnings: {'; '.join(risk.concentration_warnings) or 'None'}
Anomaly flags: {'; '.join(risk.anomaly_flags) or 'None'}
Portfolio health score: {risk.portfolio_health_score}/100

Write a cited, risk-aware recommendation.
"""
        )

        try:
            llm = get_llm()
            response = await llm.ainvoke([system, *history_messages, human])
            raw = response.content if hasattr(response, "content") else str(response)
            answer = raw if isinstance(raw, str) else str(raw)
            trace = AgentTrace(
                agent=self.role,
                status="completed",
                summary="Generated final recommendation using free-tier LLM.",
            )
            return answer, trace
        except Exception as exc:
            fallback = self._fallback_answer(query, citations, sentiment, risk, portfolio)
            trace = AgentTrace(
                agent=self.role,
                status="fallback",
                summary=f"LLM unavailable ({exc}). Used rule-based synthesis.",
            )
            return fallback, trace

    async def run_lightweight(self, query: str, history: list[dict] | None = None) -> tuple[str, AgentTrace]:
        """Cheap conversational reply for small talk — no RAG/risk/portfolio context needed."""
        history = history or []

        system = SystemMessage(
            content=(
                "You are FinSight AI, a friendly financial co-pilot. "
                "The user is making small talk or asking what you can do — "
                "reply briefly and casually, in 1-3 sentences, no section headers, "
                "no markdown formatting. Mention you can help with stocks, RBI/SEBI "
                "policy, market sentiment, or their portfolio if it fits naturally."
            )
        )
        history_messages = []
        for turn in history:
            role = turn.get("role")
            content = turn.get("content", "")
            if not content:
                continue
            if role == "user":
                history_messages.append(HumanMessage(content=content))
            elif role == "assistant":
                history_messages.append(AIMessage(content=content))

        try:
            llm = get_llm()
            response = await llm.ainvoke([system, *history_messages, HumanMessage(content=query)])
            raw = response.content if hasattr(response, "content") else str(response)
            answer = raw if isinstance(raw, str) else str(raw)
            trace = AgentTrace(agent=self.role, status="completed", summary="Lightweight conversational reply.")
            return answer, trace
        except Exception:
            fallback = (
                "Hey! 👋 I'm FinSight AI, your financial co-pilot. Ask me about a stock, "
                "RBI/SEBI policy, market sentiment, or your own portfolio — for example, "
                "\"Is my portfolio too concentrated in banking?\" or \"Should I add to my TCS position?\""
            )
            trace = AgentTrace(agent=self.role, status="fallback", summary="LLM unavailable, used static reply.")
            return fallback, trace

    def _fallback_answer(
        self,
        query: str,
        citations: list[Citation],
        sentiment: SentimentInsight,
        risk: RiskInsight,
        portfolio: PortfolioInsight,
    ) -> str:
        cite = citations[0].title if citations else "available market data"
        rec = "Proceed with caution and consider a phased entry."
        if risk.risk_level == "high" or sentiment.overall_label == "negative":
            rec = "Wait for clearer signals before adding exposure."
        elif risk.risk_level == "low" and sentiment.overall_label == "positive":
            rec = "A modest allocation aligned with your risk tolerance may be reasonable."

        return f"""**Regulatory Context**
Based on {cite}, current policy guidance should be weighed against your timeline.

**Market Sentiment**
Recent headlines show {sentiment.overall_label} sentiment ({sentiment.overall_score}) across {sentiment.headline_count} articles.

**Portfolio Fit**
Your portfolio is valued at ₹{portfolio.total_value:,.0f}. {portfolio.relevant_exposure or 'Review sector weights before acting.'}

**Risk Assessment**
Risk level: {risk.risk_level}. Health score: {risk.portfolio_health_score}/100.
{chr(10).join('- ' + w for w in risk.concentration_warnings) or '- No major concentration issues detected.'}

**Recommendation**
Regarding "{query}": {rec}

*This is educational guidance, not personalized investment advice.*"""