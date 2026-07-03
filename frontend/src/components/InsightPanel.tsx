import { AlertTriangle, FileText, Newspaper, PieChart } from "lucide-react";
import type { ChatResponse } from "../types";

interface InsightPanelProps {
  response: ChatResponse | null;
}

export function InsightPanel({ response }: InsightPanelProps) {
  if (!response) {
    return (
      <div className="panel flex h-full min-h-[320px] flex-col justify-center p-6 text-center">
        <p className="font-display text-xl text-parchment">Analysis panel</p>
        <p className="mt-2 text-sm text-parchment-dim">
          Ask a question to see citations, sentiment, and risk insights here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {response.citations.length > 0 && (
        <section className="panel p-5">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-brass" />
            <p className="label-caps">Regulatory citations</p>
          </div>
          <div className="space-y-3">
            {response.citations.map((c, i) => (
              <div key={i} className="panel-inset p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-parchment">{c.title}</p>
                  <span className="shrink-0 rounded-full bg-brass/10 px-2 py-0.5 text-[10px] font-semibold text-brass-light">
                    {(c.relevance * 100).toFixed(0)}% match
                  </span>
                </div>
                <p className="mt-1 text-xs text-parchment-dim">{c.source}</p>
                <p className="mt-2 text-xs leading-relaxed text-parchment-muted">{c.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {response.sentiment && (
        <section className="panel p-5">
          <div className="mb-3 flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-sage-light" />
            <p className="label-caps">News sentiment</p>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-2xl capitalize text-parchment">
                {response.sentiment.overall_label}
              </p>
              <p className="text-xs text-parchment-dim">
                Score {response.sentiment.overall_score} · {response.sentiment.headline_count} headlines
              </p>
            </div>
            {response.ticker && (
              <span className="rounded-lg bg-white/[0.04] px-3 py-1 font-mono text-xs text-brass-light">
                {response.ticker.replace(".NS", "")}
              </span>
            )}
          </div>
          {response.sentiment.sample_headlines.length > 0 && (
            <ul className="mt-4 space-y-2 border-t border-white/[0.05] pt-4">
              {response.sentiment.sample_headlines.slice(0, 3).map((h, i) => (
                <li key={i} className="text-xs leading-relaxed text-parchment-muted">
                  · {h}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {response.risk && (
        <section className="panel p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-coral-light" />
            <p className="label-caps">Risk assessment</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm capitalize text-parchment">
              Level: <span className="font-semibold text-brass-light">{response.risk.risk_level}</span>
            </p>
            <p className="font-mono text-sm text-parchment-muted">
              Health {response.risk.portfolio_health_score}/100
            </p>
          </div>
          {response.risk.concentration_warnings.map((w, i) => (
            <p key={i} className="mt-2 text-xs leading-relaxed text-parchment-muted">
              {w}
            </p>
          ))}
        </section>
      )}

      {response.portfolio && (
        <section className="panel p-5">
          <div className="mb-3 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-brass" />
            <p className="label-caps">Portfolio context</p>
          </div>
          <p className="text-sm text-parchment-muted">{response.portfolio.relevant_exposure}</p>
        </section>
      )}
    </div>
  );
}
