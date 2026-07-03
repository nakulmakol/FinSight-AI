import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  PieChart as PieChartIcon,
  BarChart3,
  Wallet,
  TrendingUp,
  Landmark,
  BriefcaseBusiness,
} from "lucide-react";

import { usePortfolio } from "../hooks/userportfolio";

import {
  MetricCard,
  SectionCard,
  StatusBadge,
  Skeleton,
} from "../components/ui";

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

export default function Analytics() {

  const {
    data: portfolio,
    isLoading,
    error,
  } = usePortfolio();

  if (isLoading) {

    return (

      <div className="space-y-8">

        <Skeleton className="h-16 rounded-3xl" />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />

        </div>

        <Skeleton className="h-[450px] rounded-3xl" />

      </div>

    );

  }

  if (error || !portfolio) {

    return (

      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-400">

        {error instanceof Error
          ? error.message
          : "Unable to load analytics."}

      </div>

    );

  }

  const allocation = portfolio.holdings.map((holding) => ({
    name: holding.symbol,
    value: holding.market_value,
  }));

  const pnlData = portfolio.holdings.map((holding) => ({
    symbol: holding.symbol.replace(".NS", ""),
    pnl: holding.pnl,
  }));

  const sectorData = Object.entries(
    portfolio.sector_allocation
  ).map(([sector, value]) => ({
    sector,
    value,
  }));

  return (

    <div className="space-y-10">

      {/* Header */}

      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >

        <h1 className="font-display text-5xl font-bold text-zinc-100">

          Portfolio Analytics

        </h1>

        <p className="mt-3 text-lg text-zinc-400">

          Deep insights into portfolio performance, allocation and sector exposure.

        </p>

      </motion.div>

      {/* Metrics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Portfolio Value"
          value={`₹${portfolio.total_value.toLocaleString("en-IN")}`}
          subtitle="Current Value"
          icon={<Wallet size={24} />}
          accent="blue"
          positive
        />

        <MetricCard
          title="Invested"
          value={`₹${portfolio.total_invested.toLocaleString("en-IN")}`}
          subtitle="Capital"
          icon={<Landmark size={24} />}
          accent="amber"
          positive
        />

        <MetricCard
          title="Overall P/L"
          value={`₹${portfolio.total_pnl.toLocaleString("en-IN")}`}
          subtitle={`${portfolio.total_pnl_pct.toFixed(2)}% Return`}
          icon={<TrendingUp size={24} />}
          accent={
            portfolio.total_pnl >= 0
              ? "emerald"
              : "red"
          }
          positive={
            portfolio.total_pnl >= 0
          }
        />

        <MetricCard
          title="Holdings"
          value={portfolio.holdings.length}
          subtitle="Active Stocks"
          icon={<BriefcaseBusiness size={24} />}
          accent="purple"
          positive
        />

      </div>

      {/* Charts */}

      <div className="grid gap-8 xl:grid-cols-2">

        <SectionCard
          title="Portfolio Allocation"
          subtitle="Distribution by Holdings"
          icon={<PieChartIcon size={24} />}
        >

          <ResponsiveContainer
            width="100%"
            height={340}
          >

            <PieChart>

              <Pie
                data={allocation}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={120}
              >

                {allocation.map((_, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </SectionCard>

        <SectionCard
          title="Profit / Loss"
          subtitle="Holding Performance"
          icon={<BarChart3 size={24} />}
        >

          <ResponsiveContainer
            width="100%"
            height={340}
          >

            <BarChart data={pnlData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
              />

              <XAxis
                dataKey="symbol"
                stroke="#71717a"
              />

              <YAxis
                stroke="#71717a"
              />

              <Tooltip />

              <Bar
                dataKey="pnl"
                fill="#10B981"
                radius={[8,8,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </SectionCard>

      </div>

      {/* Sector Allocation */}

      <SectionCard
        title="Sector Allocation"
        subtitle="Investment Distribution"
        icon={<BarChart3 size={24} />}
      >

        <ResponsiveContainer
          width="100%"
          height={360}
        >

          <BarChart data={sectorData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
            />

            <XAxis
              dataKey="sector"
              stroke="#71717a"
            />

            <YAxis
              stroke="#71717a"
            />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#3B82F6"
              radius={[8,8,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </SectionCard>

            {/* Holdings */}

      <SectionCard
        title="Holdings Performance"
        subtitle={`${portfolio.holdings.length} Holdings`}
        icon={<BriefcaseBusiness size={24} />}
      >

        <div className="space-y-4">

          {portfolio.holdings.map((holding, index) => (

            <motion.div
              key={holding.symbol}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.03,
              }}
              whileHover={{
                y: -2,
              }}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition-all hover:border-emerald-500/30"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold text-zinc-100">

                    {holding.company_name}

                  </h3>

                  <p className="mt-1 font-mono text-sm text-zinc-500">

                    {holding.symbol}

                  </p>

                </div>

                <StatusBadge
                  positive={
                    holding.pnl >= 0
                  }
                >

                  {holding.pnl >= 0
                    ? "+"
                    : ""}

                  {holding.pnl_pct.toFixed(2)}%

                </StatusBadge>

              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">

                <div>

                  <p className="text-xs uppercase tracking-wider text-zinc-500">

                    Market Value

                  </p>

                  <p className="mt-2 text-lg font-semibold text-zinc-100">

                    ₹
                    {holding.market_value.toLocaleString(
                      "en-IN"
                    )}

                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wider text-zinc-500">

                    Quantity

                  </p>

                  <p className="mt-2 text-lg font-semibold text-zinc-100">

                    {holding.quantity}

                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wider text-zinc-500">

                    Profit / Loss

                  </p>

                  <p
                    className={`mt-2 text-lg font-semibold ${
                      holding.pnl >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >

                    {holding.pnl >= 0
                      ? "+"
                      : "-"}

                    ₹
                    {Math.abs(
                      holding.pnl
                    ).toLocaleString("en-IN")}

                  </p>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </SectionCard>

    </div>

  );

}