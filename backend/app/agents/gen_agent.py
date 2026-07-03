from langchain_core.messages import HumanMessage, SystemMessage

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

    async def run(
        self,
        query: str,
        history: list[dict],
        citations: list[Citation],
        sentiment: SentimentInsight,
        risk: RiskInsight,
        portfolio: PortfolioInsight,
        user_risk_tolerance: str,
    ) -> tuple[str, AgentTrace]:

        llm = get_llm()

        # -----------------------------------
        # Last 4 conversation messages only
        # -----------------------------------

        memory = ""

        for msg in history[-4:]:
            memory += f"{msg['role'].upper()}: {msg['content']}\n"

        # -----------------------------------
        # Only top 2 citations
        # -----------------------------------

        citation_text = "\n".join(
            f"- {c.title}: {c.excerpt[:120]}"
            for c in citations[:2]
        )

        # -----------------------------------
        # System Prompt
        # -----------------------------------

        system = SystemMessage(
            content="""
You are FinSight AI.

You are an intelligent Indian investment assistant.

Always:

- Remember previous conversation.
- Answer naturally.
- Be concise.
- Use headings.
- Never guarantee profits.
- Give educational guidance only.

Structure:

1. Summary

2. Analysis

3. Risks

4. Recommendation

Maximum 250 words.
"""
        )

        # -----------------------------------
        # Human Prompt
        # -----------------------------------

        human = HumanMessage(
            content=f"""
Conversation:

{memory}

Current Question:

{query}

Risk Tolerance:

{user_risk_tolerance}

Portfolio Value:

₹{portfolio.total_value:,.0f}

Relevant Exposure:

{portfolio.relevant_exposure}

Market Sentiment:

{sentiment.overall_label}

Risk Level:

{risk.risk_level}

Health Score:

{risk.portfolio_health_score}

Relevant Regulations:

{citation_text}
"""
        )

        try:

            response = await llm.ainvoke(
                [
                    system,
                    human,
                ]
            )

            answer = (
                response.content
                if hasattr(response, "content")
                else str(response)
            )

            if not isinstance(answer, str):
                answer = str(answer)

            trace = AgentTrace(
                agent=self.role,
                status="completed",
                summary="Generated response with conversation memory.",
            )

            return answer, trace

        except Exception as exc:

            trace = AgentTrace(
                agent=self.role,
                status="failed",
                summary=str(exc),
            )

            return (
                "Sorry, I couldn't generate a response.",
                trace,
            )