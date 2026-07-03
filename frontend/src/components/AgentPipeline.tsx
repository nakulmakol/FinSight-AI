import { Bot, Brain, Database, LineChart, ShieldCheck } from "lucide-react";
import type { AgentTrace } from "../types";

const AGENT_ICONS: Record<string, typeof Bot> = {
  "RAG Agent": Database,
  "NLP Agent": LineChart,
  "Risk Agent": ShieldCheck,
  "Gen AI Agent": Brain,
};

interface AgentPipelineProps {
  trace: AgentTrace[];
  active: boolean;
}

export function AgentPipeline({ trace, active }: AgentPipelineProps) {
  const steps = active
    ? [
        { agent: "RAG Agent", status: "running", summary: "Searching regulatory vector store…" },
        { agent: "NLP Agent", status: "queued", summary: "Waiting for sentiment pass" },
        { agent: "Risk Agent", status: "queued", summary: "Waiting for portfolio context" },
        { agent: "Gen AI Agent", status: "queued", summary: "Waiting to synthesize answer" },
      ]
    : trace;

  return (
    <div className="panel p-5">
      <p className="label-caps mb-4">Agent pipeline</p>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = AGENT_ICONS[step.agent] || Bot;
          const running = step.status === "running";
          const done = step.status === "completed" || step.status === "fallback";
          return (
            <div key={`${step.agent}-${index}`} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ${
                    done
                      ? "bg-sage/10 text-sage-light ring-sage/20"
                      : running
                        ? "bg-brass/10 text-brass-light ring-brass/30 animate-pulse-soft"
                        : "bg-white/[0.03] text-parchment-dim ring-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {index < steps.length - 1 && (
                  <div className="my-1 h-full min-h-[20px] w-px bg-white/10" />
                )}
              </div>
              <div className="pb-2">
                <p className="text-sm font-medium text-parchment">{step.agent}</p>
                <p className="text-xs leading-relaxed text-parchment-dim">{step.summary}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
