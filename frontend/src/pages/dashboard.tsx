import { motion } from "framer-motion";

import DashboardAnalytics from "../components/Dashboard/sections/DashboardAnalytics";
import DashboardInsights from "../components/Dashboard/sections/DashboardInsights";

export default function Dashboard() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="space-y-10">

      {/* Hero */}

      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
      >
        <h1 className="font-display text-5xl font-bold text-zinc-100">
          {greeting}
        </h1>

        <p className="mt-3 max-w-3xl text-lg leading-8 text-zinc-400">
          Welcome back to{" "}
          <span className="font-semibold text-zinc-100">
            FinSight AI
          </span>
          . Here's a quick overview of your portfolio, market activity,
          and AI-powered investment insights.
        </p>
      </motion.div>

      <DashboardAnalytics />

      <DashboardInsights />

    </div>
  );
}