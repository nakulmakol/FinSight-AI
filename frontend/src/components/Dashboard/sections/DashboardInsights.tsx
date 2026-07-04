import InsightCard from "../cards/InsightCard";
import MarketOverview from "./marketoverview";

export default function DashboardInsights() {
  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <InsightCard />
      <MarketOverview />
    </div>
  );
}