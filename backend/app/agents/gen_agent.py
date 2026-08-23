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
    goal = "Synthesize a concise, cited, risk-aware financial recommendation"

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

        # Keep only the most recent conversation turns.
        # This prevents the prompt from becoming unnecessarily large.
        history = history[-6:]

        # ---------------------------------------------------------
        # RAG CONTEXT
        # ---------------------------------------------------------
        citation_block = "\n".join(
            f"- [{c.title}] ({c.source}): {c.excerpt[:350]}"
            for c in citations[:5]
        )

        if not citation_block:
            citation_block = "No regulatory documents were retrieved."

        # ---------------------------------------------------------
        # SYSTEM PROMPT
        # ---------------------------------------------------------
        system = SystemMessage(
            content=(
                "You are FinSight AI, a responsible financial co-pilot "
                "for Indian markets.\n\n"

                "Your PRIMARY job is to answer the user's actual question "
                "clearly and directly. Do not write a long research report "
                "unless the user explicitly asks for detailed analysis.\n\n"

                "IMPORTANT RESPONSE RULES:\n"
                "1. Answer the user's question FIRST.\n"
                "2. Put the direct conclusion under '### Bottom Line'.\n"
                "3. The Bottom Line must be understandable in 1-2 sentences.\n"
                "4. Follow it with only the most important supporting reasons.\n"
                "5. Target approximately 400-700 words maximum for normal questions.\n"
                "6. Use short paragraphs and bullet points.\n"
                "7. Do NOT use Markdown tables.\n"
                "8. Do NOT repeat the same fact in multiple sections.\n"
                "9. Do NOT repeat all portfolio numbers supplied in the context.\n"
                "10. Only mention numbers that materially support your conclusion.\n"
                "11. Only include regulatory information if it is relevant to the question.\n"
                "12. Only include sentiment information if it materially affects the answer.\n"
                "13. Only include portfolio information that affects the decision.\n"
                "14. Clearly distinguish facts from your analysis.\n"
                "15. Never invent financial data, prices, returns, earnings, or regulations.\n"
                "16. If the available data is insufficient, explicitly say so.\n"
                "17. Do not give guaranteed returns or guaranteed investment outcomes.\n"
                "18. Keep the recommendation aligned with the user's risk tolerance.\n"
                "19. Retrieved documents should be cited when they materially support the answer.\n"
                "20. Do not discuss every retrieved document. Use only the relevant ones.\n\n"

                "Treat the supplied portfolio, risk, sentiment, and retrieved-document "
                "information as INTERNAL CONTEXT. Do not simply repeat the entire context "
                "back to the user.\n\n"

                "DEFAULT RESPONSE STRUCTURE:\n\n"

                "### Bottom Line\n"
                "Give the direct answer to the user's question.\n\n"

                "### Why\n"
                "Give 2-4 concise bullet points explaining the conclusion.\n\n"

                "### Portfolio & Risk\n"
                "Mention only the portfolio/risk factors that materially affect the answer.\n\n"

                "### Key Evidence\n"
                "Mention only the most relevant regulatory, sentiment, or fundamental evidence.\n\n"

                "### Takeaway\n"
                "End with one clear, concise takeaway.\n\n"

                "IMPORTANT:\n"
                "Do not force every section into every answer. "
                "If a section is irrelevant, omit it.\n\n"

                "For simple questions, give a simple answer. "
                "For comparison questions, clearly identify the preferred option "
                "for THIS portfolio and explain why. "
                "For questions asking whether to buy/sell/add/reduce a position, "
                "state the conclusion first and then explain the main risks.\n\n"

                "All guidance is educational and should not be presented as "
                "personalized guaranteed investment advice."
            )
        )

        # ---------------------------------------------------------
        # CONVERSATION MEMORY
        # ---------------------------------------------------------
        history_messages = []

        for turn in history:
            role = turn.get("role")
            content = turn.get("content", "")

            if not content:
                continue

            if role == "user":
                history_messages.append(
                    HumanMessage(content=content)
                )

            elif role == "assistant":
                history_messages.append(
                    AIMessage(content=content)
                )

        # ---------------------------------------------------------
        # CURRENT QUESTION + AGENT CONTEXT
        # ---------------------------------------------------------
        human = HumanMessage(
            content=f"""
CURRENT USER QUESTION:
{query}

USER RISK TOLERANCE:
{user_risk_tolerance}

RETRIEVED REGULATORY / KNOWLEDGE DOCUMENTS:
{citation_block}

MARKET SENTIMENT:
Label: {sentiment.overall_label}
Score: {sentiment.overall_score}
Headline count: {sentiment.headline_count}
Relevant sample headlines:
{', '.join(sentiment.sample_headlines[:3]) or 'None'}

PORTFOLIO CONTEXT:
Total value: ₹{portfolio.total_value:,.0f}
Sector allocation: {portfolio.sector_allocation}
Relevant exposure: {portfolio.relevant_exposure or 'None'}

RISK CONTEXT:
Risk level: {risk.risk_level}
Portfolio health score: {risk.portfolio_health_score}/100
Concentration warnings:
{'; '.join(risk.concentration_warnings) or 'None'}

Anomaly flags:
{'; '.join(risk.anomaly_flags) or 'None'}

TASK:
Answer the CURRENT USER QUESTION directly.

Do not produce a generic financial report.

Prioritize:
1. The direct answer.
2. The strongest reasons supporting it.
3. The portfolio/risk implications.
4. Only the evidence that materially supports the answer.

Do not repeat all supplied context.
Do not create a Markdown table.
Keep the response concise and easy to scan.
"""
        )

        # ---------------------------------------------------------
        # LLM CALL
        # ---------------------------------------------------------
        try:
            llm = get_llm()

            response = await llm.ainvoke(
                [
                    system,
                    *history_messages,
                    human,
                ]
            )

            raw = (
                response.content
                if hasattr(response, "content")
                else str(response)
            )

            answer = raw if isinstance(raw, str) else str(raw)

            # Safety cleanup if the model somehow returns excessive whitespace.
            answer = answer.strip()

            trace = AgentTrace(
                agent=self.role,
                status="completed",
                summary="Generated concise, risk-aware recommendation using LLM.",
            )

            return answer, trace

        except Exception as exc:

            fallback = self._fallback_answer(
                query=query,
                citations=citations,
                sentiment=sentiment,
                risk=risk,
                portfolio=portfolio,
            )

            trace = AgentTrace(
                agent=self.role,
                status="fallback",
                summary=f"LLM unavailable ({exc}). Used concise rule-based synthesis.",
            )

            return fallback, trace

    # =============================================================
    # LIGHTWEIGHT CHAT
    # =============================================================

    async def run_lightweight(
        self,
        query: str,
        history: list[dict] | None = None,
    ) -> tuple[str, AgentTrace]:

        history = history or []

        # Keep lightweight conversations genuinely lightweight.
        history = history[-4:]

        system = SystemMessage(
            content=(
                "You are FinSight AI, a friendly financial co-pilot "
                "for Indian markets.\n\n"

                "The user is making small talk or asking what you can do.\n\n"

                "Reply naturally in 1-3 short sentences.\n"
                "Do not use section headers.\n"
                "Do not use markdown.\n"
                "Do not give a long financial analysis.\n"
                "Mention stocks, RBI/SEBI policy, market sentiment, "
                "portfolio analysis, or risk analysis when relevant."
            )
        )

        history_messages = []

        for turn in history:
            role = turn.get("role")
            content = turn.get("content", "")

            if not content:
                continue

            if role == "user":
                history_messages.append(
                    HumanMessage(content=content)
                )

            elif role == "assistant":
                history_messages.append(
                    AIMessage(content=content)
                )

        try:
            llm = get_llm()

            response = await llm.ainvoke(
                [
                    system,
                    *history_messages,
                    HumanMessage(content=query),
                ]
            )

            raw = (
                response.content
                if hasattr(response, "content")
                else str(response)
            )

            answer = raw if isinstance(raw, str) else str(raw)

            trace = AgentTrace(
                agent=self.role,
                status="completed",
                summary="Lightweight conversational reply.",
            )

            return answer.strip(), trace

        except Exception:

            fallback = (
                "Hey! 👋 I'm FinSight AI, your financial co-pilot. "
                "I can help with stocks, RBI/SEBI policy, market sentiment, "
                "portfolio risk, and investment comparisons."
            )

            trace = AgentTrace(
                agent=self.role,
                status="fallback",
                summary="LLM unavailable, used static reply.",
            )

            return fallback, trace

    # =============================================================
    # FALLBACK RESPONSE
    # =============================================================

    def _fallback_answer(
        self,
        query: str,
        citations: list[Citation],
        sentiment: SentimentInsight,
        risk: RiskInsight,
        portfolio: PortfolioInsight,
    ) -> str:

        # Determine a simple recommendation.
        if (
            risk.risk_level == "high"
            or sentiment.overall_label.lower() == "negative"
        ):
            recommendation = (
                "Proceed cautiously and avoid increasing exposure aggressively."
            )

        elif (
            risk.risk_level == "low"
            and sentiment.overall_label.lower() == "positive"
        ):
            recommendation = (
                "A modest allocation may be reasonable if it fits your "
                "overall portfolio and risk tolerance."
            )

        else:
            recommendation = (
                "Consider a small, phased position rather than making "
                "a large allocation immediately."
            )

        # ---------------------------------------------------------
        # Keep fallback short and directly useful.
        # ---------------------------------------------------------
        citation_text = ""

        if citations:
            citation_text = (
                f"\n\n### Key Evidence\n"
                f"- Relevant source: {citations[0].title}"
            )

        warnings = risk.concentration_warnings[:3]

        warning_text = ""

        if warnings:
            warning_text = "\n".join(
                f"- {warning}"
                for warning in warnings
            )

        return f"""### Bottom Line

Regarding **"{query}"**: {recommendation}

### Portfolio & Risk

- Portfolio risk level: **{risk.risk_level}**
- Portfolio health score: **{risk.portfolio_health_score}/100**
- Market sentiment: **{sentiment.overall_label}**

{warning_text if warning_text else "- No major concentration warnings detected."}
{citation_text}

### Takeaway

Focus on position sizing and portfolio diversification rather than making a large allocation based on a single signal.

*Educational guidance only — not guaranteed or personalized investment advice.*
"""