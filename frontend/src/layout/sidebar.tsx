import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquareText,
  BriefcaseBusiness,
  ChartCandlestick,
  Newspaper,
  Settings,
 Sparkles,
  Wifi,
  Database,
  Cpu,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "AI Copilot",
    icon: MessageSquareText,
    path: "/chat",
  },
  {
    title: "Portfolio",
    icon: BriefcaseBusiness,
    path: "/portfolio",
  },
  {
    title: "Analytics",
    icon: ChartCandlestick,
    path: "/analytics",
  },
  {
    title: "News",
    icon: Newspaper,
    path: "/news",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="flex w-72 flex-col border-r border-ink-600 bg-ink-900">

      {/* Logo */}

      <div className="border-b border-ink-600 px-7 py-8">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald shadow-glow">

            <Sparkles
              size={26}
              className="text-white"
            />

          </div>

          <div>

            <h1 className="font-display text-2xl font-bold tracking-wide text-parchment">
              FinSight
            </h1>

            <p className="mt-1 text-sm text-parchment-dim">
              AI Financial Terminal
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <div className="flex-1 px-5 py-8">

        <p className="mb-5 px-3 text-xs font-semibold uppercase tracking-[0.25em] text-parchment-dim">
          Workspace
        </p>

        <div className="space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-2xl px-4 py-4 transition-all duration-300 ${
                    isActive
                      ? "bg-emerald text-white shadow-panel"
                      : "text-parchment-muted hover:bg-ink-800 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-4">

                  <Icon size={20} />

                  <span className="font-medium">
                    {item.title}
                  </span>

                </div>

                <ChevronRight
                  size={18}
                  className="opacity-0 transition group-hover:opacity-100"
                />

              </NavLink>
            );
          })}

        </div>

      </div>

      {/* Status */}

      <div className="border-t border-ink-600 p-5">

        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-parchment-dim">
          System Status
        </p>

        <div className="space-y-3">

          <Status
            icon={<Wifi size={18} />}
            title="Backend"
            status="Connected"
          />

          <Status
            icon={<Cpu size={18} />}
            title="Groq"
            status="Ready"
          />

          <Status
            icon={<Database size={18} />}
            title="Vector DB"
            status="Online"
          />

        </div>

      </div>

    </aside>
  );
}

type StatusProps = {
  icon: ReactNode;
  title: string;
  status: string;
};

function Status({
  icon,
  title,
  status,
}: StatusProps) {
  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-800 p-4 transition hover:bg-ink-700">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="text-emerald">
            {icon}
          </div>

          <div>

            <div className="text-sm font-semibold text-parchment">
              {title}
            </div>

            <div className="text-xs text-parchment-dim">
              {status}
            </div>

          </div>

        </div>

        <div className="h-3 w-3 rounded-full bg-emerald shadow-glow" />

      </div>

    </div>
  );
}