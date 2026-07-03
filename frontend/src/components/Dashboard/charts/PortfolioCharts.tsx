import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { PortfolioSummary } from "../../../types";
import { SectionCard } from "../../ui";
import Skeleton from "../../ui/skeleton";

interface PortfolioChartProps {
  portfolio: PortfolioSummary | null;
  loading: boolean;
}

export default function PortfolioChart({
  portfolio,
  loading,
}: PortfolioChartProps) {
  if (loading) {
    return (
      <SectionCard
        title="Portfolio Distribution"
        subtitle="Current value of your holdings"
      >
        <Skeleton className="h-[320px] w-full rounded-2xl lg:h-[360px]" />
      </SectionCard>
    );
  }

  if (!portfolio || portfolio.holdings.length === 0) {
    return (
      <SectionCard
        title="Portfolio Distribution"
        subtitle="Current value of your holdings"
      >
        <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-800/30 text-center lg:h-[360px]">
          <div>
            <p className="text-lg font-semibold text-zinc-200">
              No portfolio data available
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Add holdings to visualize your portfolio distribution.
            </p>
          </div>
        </div>
      </SectionCard>
    );
  }

  const chartData = portfolio.holdings.map((holding) => ({
    name: holding.symbol,
    value: holding.market_value,
  }));

  return (
    <SectionCard
      title="Portfolio Distribution"
      subtitle="Current value of your holdings"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="h-[320px] lg:h-[360px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id="portfolioFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#10B981"
                  stopOpacity={0.45}
                />
                <stop
                  offset="100%"
                  stopColor="#10B981"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#3f3f46"
              strokeDasharray="3 3"
              opacity={0.4}
            />

            <XAxis
              dataKey="name"
              stroke="#a1a1aa"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#a1a1aa"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${Math.round(value / 1000)}K`}
            />

            <Tooltip
              formatter={(value: number) => [
                `₹${value.toLocaleString()}`,
                "Market Value",
              ]}
              contentStyle={{
                background: "rgba(24,24,27,0.95)",
                border: "1px solid rgba(63,63,70,.7)",
                borderRadius: "16px",
                color: "#fff",
                backdropFilter: "blur(16px)",
                boxShadow: "0 12px 40px rgba(0,0,0,.35)",
              }}
              cursor={{
                stroke: "#10B981",
                strokeOpacity: 0.3,
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={3}
              fill="url(#portfolioFill)"
              animationDuration={1200}
              animationEasing="ease-out"
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: "#10B981",
                fill: "#18181b",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </SectionCard>
  );
}