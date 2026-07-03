import {
  BrainCircuit,
  ShieldAlert,
  TrendingUp,
  FileText,
} from "lucide-react";

import type { ChatResponse } from "../../types";

interface Props {
  response: ChatResponse;
}

export default function AIResponse({
  response,
}: Props) {
  return (
    <div className="space-y-5">

      {/* Main Answer */}

      <div className="rounded-3xl border border-white/10 bg-[#172235] p-6">

        <h2 className="mb-4 text-lg font-semibold">
          AI Analysis
        </h2>

        <p className="whitespace-pre-wrap leading-8 text-slate-300">
          {response.answer}
        </p>

      </div>

      {/* Sentiment */}

      {response.sentiment && (

        <div className="rounded-3xl border border-white/10 bg-[#172235] p-5">

          <div className="mb-3 flex items-center gap-3">

            <TrendingUp className="text-emerald-400" />

            <h3 className="font-semibold">
              Market Sentiment
            </h3>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <Metric
              label="Label"
              value={response.sentiment.overall_label}
            />

            <Metric
              label="Score"
              value={response.sentiment.overall_score.toString()}
            />

            <Metric
              label="Articles"
              value={response.sentiment.headline_count.toString()}
            />

          </div>

        </div>

      )}

      {/* Risk */}

      {response.risk && (

        <div className="rounded-3xl border border-white/10 bg-[#172235] p-5">

          <div className="mb-3 flex items-center gap-3">

            <ShieldAlert className="text-yellow-400" />

            <h3 className="font-semibold">
              Risk Assessment
            </h3>

          </div>

          <Metric
            label="Risk Level"
            value={response.risk.risk_level}
          />

        </div>

      )}

      {/* Portfolio */}

      {response.portfolio && (

        <div className="rounded-3xl border border-white/10 bg-[#172235] p-5">

          <div className="mb-3 flex items-center gap-3">

            <BrainCircuit className="text-blue-400" />

            <h3 className="font-semibold">
              Portfolio Insight
            </h3>

          </div>

          <Metric
            label="Portfolio Value"
            value={`₹${response.portfolio.total_value.toLocaleString()}`}
          />

        </div>

      )}

      {/* Citations */}

      {response.citations.length > 0 && (

        <div className="rounded-3xl border border-white/10 bg-[#172235] p-5">

          <div className="mb-4 flex items-center gap-3">

            <FileText className="text-cyan-400" />

            <h3 className="font-semibold">
              Sources
            </h3>

          </div>

          <div className="space-y-3">

            {response.citations.map((source, index) => (

              <div
                key={index}
                className="rounded-xl bg-slate-900/40 p-4"
              >

                <h4 className="font-medium">
                  {source.title}
                </h4>

                <p className="mt-2 text-sm text-slate-400">
                  {source.excerpt}
                </p>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({
  label,
  value,
}: MetricProps) {
  return (
    <div>

      <p className="text-sm text-slate-400">
        {label}
      </p>

      <h4 className="mt-1 text-lg font-semibold">
        {value}
      </h4>

    </div>
  );
}