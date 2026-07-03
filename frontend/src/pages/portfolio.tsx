import React, { useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  Landmark,
  BriefcaseBusiness,
  Building2,
} from "lucide-react";
import {
  MetricCard,
  SearchBar,
  SectionCard,
  StatusBadge,
  Skeleton,
} from "../components/ui";
import { motion } from "framer-motion";

import { usePortfolio } from "../hooks/userportfolio";

export default function Portfolio() {
  const {
    data: portfolio,
    isLoading,
    error,
  } = usePortfolio();

  const [search, setSearch] = useState("");

  const filteredHoldings = useMemo(() => {
    if (!portfolio) return [];

    return portfolio.holdings.filter(
      (holding) =>
        holding.symbol
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        holding.company_name
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [portfolio, search]);

  if (isLoading) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-3xl" />
        ))}
      </div>

      <Skeleton className="h-14 rounded-2xl" />

      <Skeleton className="h-[520px] rounded-3xl" />
    </div>
  );
}

  if (error || !portfolio) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-400">
        {error instanceof Error
          ? error.message
          : "Unable to load portfolio."}
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* Header */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-5xl font-bold text-zinc-100">
          Portfolio
        </h1>

        <p className="mt-3 text-lg text-zinc-400">
          Track investments, monitor gains and analyse performance.
        </p>
      </motion.div>

      {/* Summary Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  <MetricCard
    title="Portfolio Value"
    value={`₹${portfolio.total_value.toLocaleString("en-IN")}`}
    subtitle="Current Market Value"
    icon={<Wallet size={24} />}
    accent="blue"
    positive
  />

  <MetricCard
    title="Total Invested"
    value={`₹${portfolio.total_invested.toLocaleString("en-IN")}`}
    subtitle="Capital Deployed"
    icon={<Landmark size={24} />}
    accent="amber"
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
    title="Active Holdings"
    value={portfolio.holdings.length}
    subtitle={`${portfolio.holdings.length} Stocks`}
    icon={<BriefcaseBusiness size={24} />}
    accent="purple"
    positive
  />

</div>

      {/* Search */}

      <SearchBar
  value={search}
  onChange={setSearch}
  placeholder="Search holdings by company or symbol..."
/>

      {/* Holdings */}

      <SectionCard
  title="Portfolio Holdings"
  subtitle={`${filteredHoldings.length} Holdings`}
>

        <table className="min-w-full">

          <thead className="sticky top-0 bg-zinc-950/90 backdrop-blur">

            <tr className="border-b border-zinc-800 text-left text-xs font-semibold uppercase tracking-widest text-zinc-500">

              <th className="p-5">Company</th>
              <th>Sector</th>
              <th>Qty</th>
              <th>Current</th>
              <th>Value</th>
              <th>P/L</th>
              <th>Return</th>

            </tr>

          </thead>

          <tbody>

            {filteredHoldings.map((holding) => (              <motion.tr
                key={holding.symbol}
                whileHover={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
                transition={{
                  duration: 0.2,
                }}
                className="border-t border-zinc-800"
              >

                {/* Company */}

                <td className="px-8 py-5">

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10">

                      <Building2
                        size={20}
                        className="text-emerald-400"
                      />

                    </div>

                    <div>

                      <div className="font-semibold text-zinc-100">
                        {holding.company_name}
                      </div>

                      <div className="mt-1 font-mono text-xs text-zinc-500">
                        {holding.symbol}
                      </div>

                    </div>

                  </div>

                </td>

                {/* Sector */}

                <td>

                 <StatusBadge positive>
                    {holding.sector}
                 </StatusBadge>
                </td>

                {/* Quantity */}

                <td className="font-mono text-zinc-200">

                  {holding.quantity}

                </td>

                {/* Current Price */}

                <td className="font-mono text-zinc-200">

                  ₹{holding.current_price.toLocaleString()}

                </td>

                {/* Market Value */}

                <td className="font-mono font-semibold text-zinc-100">

                  ₹{holding.market_value.toLocaleString()}

                </td>

                {/* Profit / Loss */}

                <td
                  className={`font-mono font-semibold ${
                    holding.pnl >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >

                  {holding.pnl >= 0 ? "+" : "-"}

                  ₹
                  {Math.abs(
                    holding.pnl
                  ).toLocaleString()}

                </td>

                {/* Return */}

                <td>

                  <StatusBadge
                    positive={holding.pnl_pct >= 0}
                  >   
                    {holding.pnl_pct >= 0 ? "+" : ""}
                    {holding.pnl_pct.toFixed(2)}%
                  </StatusBadge>

                </td>

              </motion.tr>

            ))}

          </tbody>

        </table>

      </SectionCard>

    </div>
  );
}



