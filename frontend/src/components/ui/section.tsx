import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  subtitle?: string;
  rightElement?: ReactNode;
  children: ReactNode;
}

export default function Section({
  title,
  subtitle,
  rightElement,
  children,
}: SectionProps) {
  return (
    <section className="space-y-5">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-400">
              {subtitle}
            </p>
          )}

        </div>

        {rightElement}

      </div>

      {children}

    </section>
  );
}