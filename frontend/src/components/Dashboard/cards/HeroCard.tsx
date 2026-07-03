import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface HeroCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: LucideIcon;
  accent?: string;
}

export default function HeroCard({
  title,
  value,
  change,
  positive = true,
  icon: Icon,
  accent = "#22C55E",
}: HeroCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.015,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group relative overflow-hidden rounded-3xl border border-ink-600 bg-ink-800 shadow-panel"
    >
      {/* Glow */}

      <div
        className="absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl opacity-20"
        style={{
          background: accent,
        }}
      />

      {/* Accent Line */}

      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{
          background: accent,
        }}
      />

      <div className="relative p-6">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm tracking-wide text-parchment-dim uppercase">
              {title}
            </p>

            <h2 className="mt-4 font-mono text-4xl font-bold text-parchment">
              {value}
            </h2>

          </div>

          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: `${accent}20`,
            }}
          >
            <Icon
              size={30}
              color={accent}
            />
          </div>

        </div>

        {/* Footer */}

        <div className="mt-8 flex items-center justify-between">

          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              positive
                ? "bg-emerald/10 text-emerald-light"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {positive ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}

            {change}

          </div>

          <span className="text-xs uppercase tracking-widest text-parchment-dim">
            LIVE
          </span>

        </div>

      </div>
    </motion.div>
  );
}