import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  BriefcaseBusiness,
} from "lucide-react";

import { MetricCard, Skeleton } from "../../ui";
import type { PortfolioSummary } from "../../../types";

interface HeroGridProps {
  portfolio: PortfolioSummary | null;
  loading: boolean;
}

export default function HeroGrid({
  portfolio,
  loading,
}: HeroGridProps) {
  if (loading || !portfolio) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-40 rounded-3xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Portfolio Value"
        value={`₹${portfolio.total_value.toLocaleString("en-IN")}`}
        subtitle="Current Market Value"
        icon={<Wallet size={24} />}
        accent="blue"
        positive
      />

      <MetricCard
        title="Overall Profit / Loss"
        value={`₹${portfolio.total_pnl.toLocaleString("en-IN")}`}
        subtitle={`${portfolio.total_pnl_pct.toFixed(2)}% Return`}
        icon={<TrendingUp size={24} />}
        accent={portfolio.total_pnl >= 0 ? "emerald" : "red"}
        positive={portfolio.total_pnl >= 0}
      />

      <MetricCard
        title="Total Invested"
        value={`₹${portfolio.total_invested.toLocaleString("en-IN")}`}
        subtitle="Capital Deployed"
        icon={<ShieldCheck size={24} />}
        accent="amber"
        positive
      />

      <MetricCard
        title="Active Holdings"
        value={portfolio.holdings.length}
        subtitle={
          portfolio.holdings.length === 1
            ? "1 Stock"
            : `${portfolio.holdings.length} Stocks`
        }
        icon={<BriefcaseBusiness size={24} />}
        accent="purple"
        positive
      />
    </div>
  );
}