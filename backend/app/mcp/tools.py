from app.models.schemas import PortfolioInsight


class MCPToolServer:
    """MCP-style tool bridge for portfolio and market context."""

    name = "finsight-mcp"

    def get_portfolio_context(
        self,
        portfolio_summary: dict,
        ticker: str | None,
    ) -> PortfolioInsight:
        holdings = portfolio_summary.get("holdings", [])
        sector_allocation = portfolio_summary.get("sector_allocation", {})
        total_value = portfolio_summary.get("total_value", 0.0)

        relevant_exposure = None
        if ticker:
            ticker_base = ticker.replace(".NS", "").replace(".BO", "").upper()
            for h in holdings:
                symbol = h["symbol"].replace(".NS", "").replace(".BO", "").upper()
                if symbol == ticker_base:
                    relevant_exposure = (
                        f"You hold {h['quantity']} shares of {h['company_name']} "
                        f"({round((h['market_value'] / total_value) * 100, 1) if total_value else 0}% of portfolio)."
                    )
                    break
            if not relevant_exposure:
                relevant_exposure = f"No current holding in {ticker_base}; this would be a new position."

        return PortfolioInsight(
            total_value=total_value,
            sector_allocation=sector_allocation,
            holdings_summary=[
                {
                    "symbol": h["symbol"],
                    "company": h["company_name"],
                    "sector": h["sector"],
                    "value": h["market_value"],
                    "pnl_pct": h["pnl_pct"],
                }
                for h in holdings
            ],
            relevant_exposure=relevant_exposure,
        )

    def list_tools(self) -> list[dict]:
        return [
            {
                "name": "get_portfolio",
                "description": "Fetch user portfolio holdings and sector allocation",
            },
            {
                "name": "get_market_quote",
                "description": "Fetch live quote via yfinance (free, no API key)",
            },
            {
                "name": "search_regulatory_docs",
                "description": "Semantic search over RBI/regulatory documents in Chroma",
            },
        ]


mcp_server = MCPToolServer()
