import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";

import { sendChat } from "../api/client";
import type { ChatResponse } from "../types";
import ReactMarkdown from "react-markdown";
import {
  MetricCard,
  SectionCard,
  StatusBadge,
  SearchBar,
  Skeleton,
} from "../components/ui";

interface Message {
  role: "user" | "assistant";
  content: string;
  response?: ChatResponse;
}

const suggestions = [
  "Analyze my portfolio",
  "Summarize today's market",
  "Compare TCS vs Infosys",
  "Should I rebalance my portfolio?",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome to FinSight AI.\n\nI'm your AI Financial Copilot.\n\nI can analyze your portfolio, explain financial news, compare companies and answer investment questions.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await sendChat(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.answer,
          response,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err instanceof Error
              ? `❌ ${err.message}`
              : "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-8 px-1 pb-4">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2 pt-2"
      >
        <h1 className="font-display text-5xl font-bold tracking-tight text-zinc-100">
          AI Financial Copilot
        </h1>
        <p className="text-lg text-zinc-400">
          Your personal AI investment advisor powered by FinSight Intelligence.
        </p>
      </motion.div>

      {/* metric cards removed */}

      {/* ── Suggested Prompts ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        {suggestions.map((item) => (
          <motion.button
            key={item}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setInput(item)}
            className="group inline-flex items-center gap-2.5 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-left transition hover:border-emerald-500/60 hover:bg-zinc-800"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 transition group-hover:bg-emerald-500/20">
              <Sparkles size={13} className="text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-zinc-200 group-hover:text-white">
              {item}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* ── Conversation ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex-1"
      >
        <SectionCard
          title="FinSight AI"
          subtitle={`${messages.length} Messages`}
          className="flex-1"
        >
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-4 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Assistant Avatar */}
                {msg.role === "assistant" && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
                    <Bot size={20} />
                  </div>
                )}

                {/* Bubble + Rich content */}
                <div className="flex max-w-3xl flex-col gap-4">
                  <div
                    className={`rounded-3xl px-6 py-5 shadow-lg ${
                      msg.role === "assistant"
                        ? "border border-l-2 border-zinc-800 border-l-blue-500/50 bg-zinc-950 text-zinc-100"
                        : "border border-emerald-500/20 bg-gradient-to-br from-emerald-500 to-blue-600 text-white"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-zinc-100 prose-strong:text-white prose-code:text-emerald-300">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>

                  {/* ── Portfolio Risk ── */}
                  {msg.role === "assistant" && msg.response?.risk && (
                    <div className="rounded-2xl border border-l-2 border-zinc-800 border-l-blue-500/50 bg-zinc-950 p-5 space-y-4">
                      <div className="border-b border-zinc-800 pb-3">
                        <p className="text-sm font-semibold text-zinc-100">Portfolio Risk</p>
                        <p className="text-xs text-zinc-500">AI Risk Analysis</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                          <p className="text-xs uppercase tracking-wider text-zinc-500">Risk Level</p>
                          <StatusBadge positive={msg.response.risk.risk_level === "low"}>
                            {msg.response.risk.risk_level.toUpperCase()}
                          </StatusBadge>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                          <p className="text-xs uppercase tracking-wider text-zinc-500">Portfolio Health</p>
                          <p className="text-xl font-bold text-blue-400">
                            {msg.response.risk.portfolio_health_score}
                            <span className="text-sm font-normal text-zinc-500">/100</span>
                          </p>
                        </div>
                      </div>
                      {msg.response.risk.concentration_warnings.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-red-400">Concentration Warnings</p>
                          {msg.response.risk.concentration_warnings.map((warning, wIdx) => (
                            <motion.div
                              key={wIdx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                            >
                              ⚠️ {warning}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Market Sentiment ── */}
                  {msg.role === "assistant" && msg.response?.sentiment && (
                    <div className="rounded-2xl border border-l-2 border-zinc-800 border-l-blue-500/50 bg-zinc-950 p-5 space-y-4">
                      <div className="border-b border-zinc-800 pb-3">
                        <p className="text-sm font-semibold text-zinc-100">Market Sentiment</p>
                        <p className="text-xs text-zinc-500">AI News Analysis</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                          <p className="text-xs uppercase tracking-wider text-zinc-500">Overall</p>
                          <StatusBadge positive={msg.response.sentiment.overall_score >= 0}>
                            {msg.response.sentiment.overall_label}
                          </StatusBadge>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                          <p className="text-xs uppercase tracking-wider text-zinc-500">Score</p>
                          <p className="text-xl font-bold text-cyan-400">
                            {msg.response.sentiment.overall_score.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                          <p className="text-xs uppercase tracking-wider text-zinc-500">Headlines</p>
                          <p className="text-xl font-bold text-zinc-100">
                            {msg.response.sentiment.headline_count}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Sample Headlines</p>
                        {msg.response.sentiment.sample_headlines.slice(0, 3).map((headline, hIdx) => (
                          <motion.div
                            key={hIdx}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-300"
                          >
                            • {headline}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Agent Trace ── */}
                  {msg.role === "assistant" && msg.response?.agent_trace && (
                    <div className="rounded-2xl border border-l-2 border-zinc-800 border-l-blue-500/50 bg-zinc-950 p-5 space-y-4">
                      <div className="border-b border-zinc-800 pb-3">
                        <p className="text-sm font-semibold text-zinc-100">Multi-Agent Pipeline</p>
                        <p className="text-xs text-zinc-500">{msg.response.agent_trace.length} AI Agents</p>
                      </div>
                      <div className="space-y-3">
                        {msg.response.agent_trace.map((agent, aIdx) => (
                          <motion.div
                            key={agent.agent}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: aIdx * 0.08 }}
                            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3"
                          >
                            <div className="min-w-0 flex-1 pr-4">
                              <p className="text-sm font-semibold text-zinc-100">{agent.agent}</p>
                              <p className="mt-0.5 text-xs text-zinc-400 leading-relaxed">{agent.summary}</p>
                            </div>
                            <StatusBadge positive>{agent.status}</StatusBadge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-700 text-white shadow-lg">
                    <User size={20} />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Loading bubble */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Loader2
                      size={18}
                      className="animate-spin text-emerald-400"
                    />
                    <span className="text-zinc-300">
                      Analyzing your portfolio...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Sticky Input ── */}
          <div className="sticky bottom-0 mt-6 border-t border-zinc-800/60 bg-transparent pt-6">
            <div className="flex items-end gap-4">
              <textarea
                value={input}
                disabled={loading}
                rows={1}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask FinSight AI about your portfolio, stocks or the market..."
                className="min-h-[56px] max-h-40 flex-1 resize-none rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-emerald-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                disabled={loading || !input.trim()}
                onClick={handleSend}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={22} className="animate-spin text-white" />
                ) : (
                  <Send size={22} className="text-white" />
                )}
              </motion.button>
            </div>
            <p className="mt-3 text-center text-xs text-zinc-500">
              FinSight AI may make mistakes. Verify important financial decisions independently.
            </p>
          </div>
        </SectionCard>
      </motion.div>
    </div>
  );
}