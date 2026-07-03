from app.models.schemas import AgentTrace, RiskInsight
from app.risk.analyzer import analyze_portfolio_risk


class RiskAgent:
    role = "Risk Agent"
    goal = "Evaluate portfolio concentration and risk flags"

    def run(
        self,
        holdings: list[dict],
        ticker: str | None,
        sentiment_label: str,
    ) -> tuple[RiskInsight, AgentTrace]:
        insight = analyze_portfolio_risk(holdings, ticker, sentiment_label)
        summary = (
            f"Portfolio risk level: {insight.risk_level}. "
            f"Health score {insight.portfolio_health_score}/100 with "
            f"{len(insight.concentration_warnings)} concentration warnings."
        )
        return insight, AgentTrace(agent=self.role, status="completed", summary=summary)
