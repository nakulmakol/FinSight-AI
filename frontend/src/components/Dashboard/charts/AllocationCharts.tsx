import { motion } from "framer-motion";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { PortfolioSummary } from "../../../types";

import { SectionCard, Skeleton } from "../../ui";

interface AllocationChartProps {
  portfolio: PortfolioSummary | null;
  loading: boolean;
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#EF4444",
  "#84CC16",
];

export default function AllocationChart({
  portfolio,
  loading,
}: AllocationChartProps) {
  if (loading) {
    return (
      <SectionCard
        title="Portfolio Allocation"
        subtitle="Allocation by holding"
      >
        <Skeleton className="h-[420px] w-full rounded-2xl" />
      </SectionCard>
    );
  }

  if (!portfolio || portfolio.holdings.length === 0) {
    return (
      <SectionCard
        title="Portfolio Allocation"
        subtitle="Allocation by holding"
      >
        <div className="flex h-[420px] items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-800/30">
          <div className="text-center">
            <p className="text-lg font-semibold text-zinc-200">
              No allocation data
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Portfolio allocation will appear here.
            </p>
          </div>
        </div>
      </SectionCard>
    );
  }

  const data = portfolio.holdings.map((holding) => ({
    name: holding.symbol,
    value: Number(
      (
        (holding.market_value / portfolio.total_value) *
        100
      ).toFixed(2)
    ),
  }));

  return (
    <SectionCard
      title="Portfolio Allocation"
      subtitle="Allocation by holding"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                nameKey="name"
                paddingAngle={3}
                animationDuration={1000}
                label={({ percent }) =>
                  `${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value: number) => [
                  `${value}%`,
                  "Allocation",
                ]}
                contentStyle={{
                  background: "rgba(24,24,27,0.95)",
                  border: "1px solid rgba(63,63,70,.7)",
                  borderRadius: "16px",
                  color: "#fff",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,.35)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 space-y-3">
          {data.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-800/40 px-4 py-3 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-3.5 w-3.5 rounded-full"
                  style={{
                    background: COLORS[index % COLORS.length],
                  }}
                />

                <span className="font-medium text-zinc-200">
                  {item.name}
                </span>
              </div>

              <span className="font-semibold text-zinc-100">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </SectionCard>
  );
}