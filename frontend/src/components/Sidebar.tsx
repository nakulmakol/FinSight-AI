import { Activity, BookOpen, LayoutDashboard, MessageSquareText, Shield, Sparkles } from "lucide-react";

export type View = "dashboard" | "advisor";

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
  llmProvider: string;
}

const navItems: { id: View; label: string; icon: typeof Activity }[] = [
  { id: "dashboard", label: "Portfolio Desk", icon: LayoutDashboard },
  { id: "advisor", label: "AI Advisor", icon: MessageSquareText },
];

export function Sidebar({ activeView, onNavigate, llmProvider }: SidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-white/[0.06] bg-ink-900/50 lg:flex">
      <div className="border-b border-white/[0.06] px-6 py-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brass/30 to-brass/5 ring-1 ring-brass/20">
            <Sparkles className="h-5 w-5 text-brass-light" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-parchment">
              FinSight AI
            </p>
            <p className="text-xs text-parchment-dim">Intelligent co-pilot</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                active
                  ? "bg-brass/10 text-brass-light ring-1 ring-brass/20"
                  : "text-parchment-muted hover:bg-white/[0.04] hover:text-parchment"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-white/[0.06] p-5">
        <div className="panel-inset p-4">
          <p className="label-caps mb-2">Active stack</p>
          <div className="space-y-2 text-xs text-parchment-muted">
            <div className="flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-brass" />
              Chroma RAG · Local embeddings
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-sage-light" />
              Risk + MCP portfolio tools
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-coral-light" />
              LLM: {llmProvider || "not configured"}
            </div>
          </div>
        </div>
        <p className="text-[11px] leading-relaxed text-parchment-dim">
          Educational guidance only. Not SEBI-registered investment advice.
        </p>
      </div>
    </aside>
  );
}
