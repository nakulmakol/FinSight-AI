import { TrendingDown, TrendingUp } from "lucide-react";
import type { MarketQuote } from "../types";

interface MarketStripProps {
  quotes: MarketQuote[];
}

export function MarketStrip({ quotes }: MarketStripProps) {
  if (!quotes.length) return null;

  return (
    <div className="border-b border-white/[0.06] bg-ink-900/40">
      <div className="flex gap-3 overflow-x-auto px-4 py-3 md:px-8">
        {quotes.map((quote) => {
          const positive = quote.change_pct >= 0;
          return (
            <div
              key={quote.symbol}
              className="flex min-w-[160px] shrink-0 items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-2.5"
            >
              <div>
                <p className="text-xs font-medium text-parchment">{quote.name}</p>
                <p className="font-mono text-sm text-parchment-muted">
                  {quote.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div
                className={`ml-auto flex items-center gap-1 text-xs font-semibold ${
                  positive ? "text-sage-light" : "text-coral-light"
                }`}
              >
                {positive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {positive ? "+" : ""}
                {quote.change_pct.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
