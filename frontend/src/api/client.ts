import type {
  ChatResponse,
  MarketQuote,
  PortfolioSummary,
} from "../types";

const API_BASE =
  import.meta.env.VITE_API_URL || "/api";
const REQUEST_TIMEOUT = 30000;

export interface NewsHeadline {
  title: string;
  summary: string;
}

export interface NewsSentiment {
  overall_label: string;
  overall_score: number;
  headline_count: number;
  sample_headlines: string[];
}

export interface NewsResponse {
  headlines: NewsHeadline[];
  sentiment: NewsSentiment;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        errorText ||
          `API Error ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeout);

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out.");
    }

    throw error;
  }
}

/* ------------------------------------------ */
/* Portfolio                                  */
/* ------------------------------------------ */

export function fetchPortfolio(): Promise<PortfolioSummary> {
  return request("/portfolio");
}

/* ------------------------------------------ */
/* Market                                     */
/* ------------------------------------------ */

export function fetchMarket(): Promise<{
  quotes: MarketQuote[];
}> {
  return request("/market");
}

export function refreshMarket(): Promise<{
  status: string;
  updated: number;
  total: number;
}> {
  return request("/refresh-market", {
    method: "POST",
  });
}

/* ------------------------------------------ */
/* Chat                                       */
/* ------------------------------------------ */

export function sendChat(
  message: string
): Promise<ChatResponse> {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
    }),
  });
}

/* ------------------------------------------ */
/* Health                                     */
/* ------------------------------------------ */

export function fetchHealth(): Promise<{
  status: string;
  llm_provider: string;
}> {
  return request("/health");
}
export function fetchNews(
  ticker?: string,
  limit = 10
): Promise<NewsResponse> {
  const params = new URLSearchParams();

  if (ticker) {
    params.append("ticker", ticker);
  }

  params.append("limit", String(limit));

  return request<NewsResponse>(
    `/news?${params.toString()}`
  );
}