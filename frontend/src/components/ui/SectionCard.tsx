import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}

export default function SectionCard({
  title,
  subtitle,
  icon,
  action,
  children,
}: SectionCardProps) {
  return (
    <motion.section
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.2,
      }}
      className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl transition-all hover:border-emerald-500/30"
    >
      {/* Header */}

      <div className="mb-8 flex items-start justify-between">

        <div className="flex items-center gap-4">

          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              {icon}
            </div>
          )}

          <div>

            <h2 className="text-3xl font-bold text-zinc-100">

              {title}

            </h2>

            {subtitle && (
              <p className="mt-1 text-zinc-500">

                {subtitle}

              </p>
            )}

          </div>

        </div>

        {action}

      </div>

      {children}

    </motion.section>
  );
}