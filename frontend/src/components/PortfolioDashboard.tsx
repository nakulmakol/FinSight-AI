import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ArrowUpRight, Wallet } from "lucide-react";
import type { PortfolioSummary } from "../types";

const COLORS = ["#c9a227", "#3d8f6e", "#5b8def", "#c45c4a", "#9b7edb", "#4fb5b5"];

interface PortfolioDashboardProps {
  portfolio: PortfolioSummary | null;
  loading: boolean;
}

export function PortfolioDashboard({ portfolio, loading }: PortfolioDashboardProps) {
  if (loading) {
    return (
      <div className="panel flex h-96 items-center justify-center">
        <p className="text-parchment-dim">Loading portfolio desk…</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="panel flex h-96 items-center justify-center">
        <p className="text-parchment-dim">Portfolio unavailable. Is the backend running?</p>
      </div>
    );
  }

  const chartData = Object.entries(portfolio.sector_allocation).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label-caps mb-2">Welcome back</p>
          <h1 className="font-display text-3xl font-semibold text-parchment md:text-4xl">
            {portfolio.user_name}
          </h1>
          <p className="mt-2 text-parchment-muted">
            Risk profile ·{" "}
            <span className="capitalize text-brass-light">{portfolio.risk_tolerance}</span>
          </p>
        </div>
        <div className="panel-inset flex items-center gap-3 px-5 py-3">
          <Wallet className="h-5 w-5 text-brass" />
          <div>
            <p className="text-xs text-parchment-dim">Net portfolio value</p>
            <p className="font-display text-2xl font-semibold">
              ₹{portfolio.total_value.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Invested capital" value={`₹${portfolio.total_invested.toLocaleString("en-IN")}`} />
        <StatCard
          label="Unrealized P&L"
          value={`₹${portfolio.total_pnl.toLocaleString("en-IN")}`}
          accent={portfolio.total_pnl >= 0 ? "sage" : "coral"}
          suffix={`${portfolio.total_pnl_pct >= 0 ? "+" : ""}${portfolio.total_pnl_pct.toFixed(2)}%`}
        />
        <StatCard label="Holdings" value={String(portfolio.holdings.length)} suffix="positions" />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="panel p-6 xl:col-span-2">
          <p className="label-caps mb-4">Sector allocation</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={3}
                  stroke="transparent"
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#141a22",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    color: "#f4f1ea",
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Allocation"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {chartData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-xs text-parchment-muted">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: COLORS[index % COLORS.length] }}
                />
                {item.name} · {item.value.toFixed(1)}%
              </div>
            ))}
          </div>
        </div>

        <div className="panel overflow-hidden xl:col-span-3">
          <div className="border-b border-white/[0.06] px-6 py-4">
            <p className="label-caps">Holdings</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04] text-left text-parchment-dim">
                  <th className="px-6 py-3 font-medium">Symbol</th>
                  <th className="px-4 py-3 font-medium">Sector</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">LTP</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-6 py-3 font-medium">P&L</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.holdings.map((h) => (
                  <tr
                    key={h.symbol}
                    className="border-b border-white/[0.03] transition hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-parchment">{h.symbol.replace(".NS", "")}</p>
                      <p className="text-xs text-parchment-dim">{h.company_name}</p>
                    </td>
                    <td className="px-4 py-4 text-parchment-muted">{h.sector}</td>
                    <td className="px-4 py-4 font-mono text-parchment-muted">{h.quantity}</td>
                    <td className="px-4 py-4 font-mono">₹{h.current_price.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-4 font-mono">
                      ₹{h.market_value.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          h.pnl >= 0 ? "text-sage-light" : "text-coral-light"
                        }`}
                      >
                        {h.pnl >= 0 && <ArrowUpRight className="h-3.5 w-3.5" />}
                        {h.pnl_pct >= 0 ? "+" : ""}
                        {h.pnl_pct.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: string;
  suffix?: string;
  accent?: "sage" | "coral";
}) {
  return (
    <div className="panel p-5">
      <p className="label-caps mb-3">{label}</p>
      <p
        className={`font-display text-2xl font-semibold ${
          accent === "sage"
            ? "text-sage-light"
            : accent === "coral"
              ? "text-coral-light"
              : "text-parchment"
        }`}
      >
        {value}
      </p>
      {suffix && <p className="mt-1 text-xs text-parchment-dim">{suffix}</p>}
    </div>
  );
}
