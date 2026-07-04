export interface Holding {
  symbol: string;
  company_name: string;
  sector: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  market_value: number;
  pnl: number;
  pnl_pct: number;
}

export interface PortfolioSummary {
  user_id: string;
  user_name: string;
  risk_tolerance: string;

  total_value: number;
  total_invested: number;
  total_pnl: number;
  total_pnl_pct: number;

  sector_allocation: Record<string, number>;

  holdings: Holding[];
}

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change_pct: number;
  sector: string;
}

export interface Citation {
  source: string;
  title: string;
  excerpt: string;
  relevance: number;
}

export interface SentimentInsight {
  overall_label: string;
  overall_score: number;
  headline_count: number;
  sample_headlines: string[];
}

export interface RiskInsight {
  risk_level: string;
  concentration_warnings: string[];
  anomaly_flags: string[];
  portfolio_health_score: number;
}

export interface PortfolioInsight {
  total_value: number;
  sector_allocation: Record<string, number>;
  holdings_summary: {
    symbol: string;
    company: string;
    sector: string;
    value: number;
    pnl_pct: number;
  }[];
  relevant_exposure: string | null;
}

export interface AgentTrace {
  agent: string;
  status: string;
  summary: string;
}

export interface ChatResponse {
  answer: string;

  citations: Citation[];

  sentiment: SentimentInsight | null;

  risk: RiskInsight | null;

  portfolio: PortfolioInsight | null;

  agent_trace: AgentTrace[];

  ticker: string | null;
}

export interface HealthResponse {
  status: string;
  llm_provider: string;
  vector_documents?: number;
  message?: string;
}

export interface ApiError {
  detail: string;
}
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  response?: ChatResponse;
}