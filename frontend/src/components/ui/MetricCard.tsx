import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  positive?: boolean;
  accent?: "emerald" | "blue" | "amber" | "purple" | "red";
}

const accentStyles = {
  emerald: {
    border: "hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/10",
    icon: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400",
    line: "from-emerald-500 via-emerald-400 to-emerald-300",
    glow: "shadow-emerald-500/10",
  },

  blue: {
    border: "hover:border-blue-500/40",
    iconBg: "bg-blue-500/10",
    icon: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-400",
    line: "from-blue-500 via-blue-400 to-cyan-300",
    glow: "shadow-blue-500/10",
  },

  amber: {
    border: "hover:border-amber-500/40",
    iconBg: "bg-amber-500/10",
    icon: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400",
    line: "from-amber-500 via-yellow-400 to-amber-300",
    glow: "shadow-amber-500/10",
  },

  purple: {
    border: "hover:border-purple-500/40",
    iconBg: "bg-purple-500/10",
    icon: "text-purple-400",
    badge: "bg-purple-500/10 text-purple-400",
    line: "from-purple-500 via-fuchsia-400 to-pink-300",
    glow: "shadow-purple-500/10",
  },

  red: {
    border: "hover:border-red-500/40",
    iconBg: "bg-red-500/10",
    icon: "text-red-400",
    badge: "bg-red-500/10 text-red-400",
    line: "from-red-500 via-rose-400 to-orange-300",
    glow: "shadow-red-500/10",
  },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  positive = true,
  accent = "emerald",
}: MetricCardProps) {
  const style = accentStyles[accent];

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl transition-all ${style.border} hover:shadow-2xl ${style.glow}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${style.iconBg}`}
        >
          <div className={style.icon}>{icon}</div>
        </div>

        <div
          className={`h-2.5 w-2.5 rounded-full ${
            positive ? "bg-emerald-400" : "bg-red-400"
          } animate-pulse`}
        />
      </div>

      <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </p>

      <h2
        className={`relative mt-3 font-mono text-3xl font-bold ${
          positive ? "text-zinc-100" : "text-red-400"
        }`}
      >
        {value}
      </h2>

      <div className="relative mt-6 flex items-center justify-between">
        <span className="text-sm text-zinc-500">
          {subtitle}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
        >
          LIVE
        </span>
      </div>

      <div
        className={`relative mt-6 h-1 rounded-full bg-gradient-to-r ${style.line}`}
      />
    </motion.div>
  );
}