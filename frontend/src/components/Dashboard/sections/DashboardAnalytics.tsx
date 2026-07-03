import { AlertCircle } from "lucide-react";

import HeroGrid from "./HeroGrid";
import PortfolioChart from "../charts/PortfolioCharts";
import AllocationChart from "../charts/AllocationCharts";

import { SectionCard } from "../../ui";

import { usePortfolio } from "../../../hooks/userportfolio";

export default function DashboardAnalytics() {
  const {
    data: portfolio,
    isLoading,
    error,
  } = usePortfolio();

  return (
    <div className="space-y-10">
      <HeroGrid
        portfolio={portfolio ?? null}
        loading={isLoading}
      />

      {error && (
        <SectionCard
          title="Portfolio Error"
          subtitle="Unable to fetch your portfolio"
          icon={<AlertCircle size={22} />}
        >
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
            <p className="text-sm text-red-300">
              {error instanceof Error
                ? error.message
                : "Unable to load portfolio."}
            </p>
          </div>
        </SectionCard>
      )}

      <div className="grid gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <PortfolioChart
            portfolio={portfolio ??null}
            loading={isLoading}
          />
        </div>

        <div className="xl:col-span-4">
          <AllocationChart
            portfolio={portfolio ?? null}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}