import type {
  ChatResponse,
  MarketQuote,
  PortfolioSummary,
} from "../types";

const API_BASE =
  "https://finsight-ai-production-4f97.up.railway.app/api";
  
  interface NewsHeadline {
  title: string;
  summary: string;
}

interface NewsResponse {
  headlines: NewsHeadline[];
  sentiment: {
    overall_label: string;
    overall_score: number;
    headline_count: number;
    sample_headlines: string[];
  };
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const raw = await response.text();

    let message = raw || `Request failed: ${response.status}`;

    try {
      const parsed = JSON.parse(raw);

      if (typeof parsed?.detail === "string") {
        message = parsed.detail;
      } else if (Array.isArray(parsed?.detail)) {
        message =
          parsed.detail
            .map((d: { msg?: string }) => d.msg)
            .filter(Boolean)
            .join("; ") || message;
      }
    } catch {
      // Response wasn't JSON
    }

    throw new Error(message);
  }

  return response.json();
}

export async function fetchPortfolio(): Promise<PortfolioSummary> {
  return request<PortfolioSummary>("/portfolio");
}

export async function fetchMarket(): Promise<{
  quotes: MarketQuote[];
}> {
  return request<{ quotes: MarketQuote[] }>("/market");
}

export async function sendChat(
  message: string,
  history: { role: string; content: string }[] = []
): Promise<ChatResponse> {
  return request<ChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      history,
    }),
  });
}

export async function fetchHealth(): Promise<{
  status: string;
  llm_provider: string;
}> {
  return request<{
    status: string;
    llm_provider: string;
  }>("/health");
}

/**
 * Fetch financial news and AI sentiment analysis.
 * If ticker is provided, news is filtered for that company.
 */
export async function fetchNews(
  ticker?: string
): Promise<NewsResponse> {
  const query = ticker
    ? `?ticker=${encodeURIComponent(ticker)}`
    : "";

  return request<NewsResponse>(`/news${query}`);
}