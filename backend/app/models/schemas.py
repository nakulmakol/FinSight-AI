from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=3, max_length=2000)
    user_id: str | None = None


class Citation(BaseModel):
    source: str
    title: str
    excerpt: str
    relevance: float = 0.0


class SentimentInsight(BaseModel):
    overall_label: str
    overall_score: float
    headline_count: int
    sample_headlines: list[str] = Field(default_factory=list)


class RiskInsight(BaseModel):
    risk_level: str
    concentration_warnings: list[str] = Field(default_factory=list)
    anomaly_flags: list[str] = Field(default_factory=list)
    portfolio_health_score: float = 0.0


class PortfolioInsight(BaseModel):
    total_value: float
    sector_allocation: dict[str, float]
    holdings_summary: list[dict]
    relevant_exposure: str | None = None


class AgentTrace(BaseModel):
    agent: str
    status: str
    summary: str


class ChatResponse(BaseModel):
    answer: str
    citations: list[Citation] = Field(default_factory=list)
    sentiment: SentimentInsight | None = None
    risk: RiskInsight | None = None
    portfolio: PortfolioInsight | None = None
    agent_trace: list[AgentTrace] = Field(default_factory=list)
    ticker: str | None = None


class HoldingOut(BaseModel):
    symbol: str
    company_name: str
    sector: str
    quantity: float
    avg_price: float
    current_price: float
    market_value: float
    pnl: float
    pnl_pct: float


class PortfolioSummary(BaseModel):
    user_id: str
    user_name: str
    risk_tolerance: str
    total_value: float
    total_invested: float
    total_pnl: float
    total_pnl_pct: float
    sector_allocation: dict[str, float]
    holdings: list[HoldingOut]


class MarketQuote(BaseModel):
    symbol: str
    name: str
    price: float
    change_pct: float
    sector: str = ""


class HealthResponse(BaseModel):
    status: str
    llm_provider: str
    vector_documents: int
    message: str
