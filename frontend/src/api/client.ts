import type { ChatResponse, MarketQuote, PortfolioSummary } from "../types";

const API_BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
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
        // FastAPI/Pydantic validation errors: [{ loc, msg, ... }]
        message = parsed.detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join("; ") || message;
      }
    } catch {
      // response wasn't JSON — keep the raw text
    }
    throw new Error(message);
  }
  return response.json();
}

export async function fetchPortfolio(): Promise<PortfolioSummary> {
  return request<PortfolioSummary>("/portfolio");
}

export async function fetchMarket(): Promise<{ quotes: MarketQuote[] }> {
  return request<{ quotes: MarketQuote[] }>("/market");
}

export async function sendChat(message: string): Promise<ChatResponse> {
  return request<ChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function fetchHealth(): Promise<{ status: string; llm_provider: string }> {
  return request("/health");
}