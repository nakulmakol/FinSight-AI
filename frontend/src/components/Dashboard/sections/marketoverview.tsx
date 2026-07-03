import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  LineChart,
} from "lucide-react";

import { SectionCard, StatusBadge } from "../../ui";

interface MarketItem {
  name: string;
  value: string;
  change: string;
  positive: boolean;
}

const markets: MarketItem[] = [
  {
    name: "NIFTY 50",
    value: "24,856.20",
    change: "+0.84%",
    positive: true,
  },
  {
    name: "SENSEX",
    value: "81,420.60",
    change: "+0.72%",
    positive: true,
  },
  {
    name: "BANK NIFTY",
    value: "53,218.10",
    change: "-0.18%",
    positive: false,
  },
  {
    name: "NASDAQ",
    value: "19,854.22",
    change: "+1.21%",
    positive: true,
  },
  {
    name: "S&P 500",
    value: "6,154.42",
    change: "+0.65%",
    positive: true,
  },
  {
    name: "USD / INR",
    value: "₹83.46",
    change: "-0.11%",
    positive: false,
  },
];

export default function MarketOverview() {
  return (
    <SectionCard
      title="Market Overview"
      subtitle="Major indices and currency snapshot"
      icon={<LineChart size={24} />}
    >
      <div className="space-y-4">
        {markets.map((market, index) => (
          <motion.div
            key={market.name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.05,
            }}
            className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-800/40 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-800/70"
          >
            <div>
              <h3 className="font-semibold text-zinc-100">
                {market.name}
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                {market.value}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge
                variant={market.positive ? "success" : "danger"}
              >
                <div className="flex items-center gap-1.5">
                  {market.positive ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {market.change}
                </div>
              </StatusBadge>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}