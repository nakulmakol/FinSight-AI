import { FormEvent, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Loader2, SendHorizontal, Sparkles } from "lucide-react";
import { sendChat } from "../api/client";
import type { ChatMessage } from "../types";
import { AgentPipeline } from "./AgentPipeline";
import { InsightPanel } from "./InsightPanel";
import { Copy, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

const STARTER_PROMPTS = [
  "Should I invest in Infosys this month given RBI's latest rate decision?",
  "How exposed am I to banking sector risk after the recent RBI circular?",
  "Is my portfolio too concentrated in IT and banking?",
];

interface ChatPanelProps {
  onResponse?: () => void;
}

export function ChatPanel({ onResponse }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [latestTrace, setLatestTrace] = useState<ChatMessage["response"]>();
  const bottomRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e?: FormEvent, preset?: string) {
    e?.preventDefault();
    const text = (preset || input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setLatestTrace(undefined);

    try {
      const response = await sendChat(text);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLatestTrace(response);
      onResponse?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `I couldn't reach the advisor engine. ${message}\n\nMake sure the backend is running and you've added a free API key in \`backend/.env\`.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <div className="xl:col-span-7">
        <div className="panel flex min-h-[680px] flex-col overflow-hidden shadow-glow">
          <div className="border-b border-white/[0.06] bg-gradient-to-r from-brass/5 to-transparent px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-brass/10 p-2 ring-1 ring-brass/20">
                <Sparkles className="h-5 w-5 text-brass-light" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold">AI Investment Advisor</h2>
                <p className="text-sm text-parchment-dim">
                  Multi-agent analysis with RAG, sentiment, portfolio context, and risk scoring
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            {messages.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6">
                <p className="font-display text-lg text-parchment">Try a live demo question</p>
                <p className="mt-2 text-sm text-parchment-dim">
                  The pipeline pulls RBI documents from Chroma, scans today's headlines, checks your
                  portfolio via MCP tools, and synthesizes a cited recommendation.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSubmit(undefined, prompt)}
                      className="btn-ghost max-w-full text-left text-xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-5 py-4 ${
                    msg.role === "user"
                      ? "bg-brass/15 text-parchment ring-1 ring-brass/20"
                      : "panel-inset markdown-body"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="space-y-4">

                        <ReactMarkdown>
                        {msg.content}
                        </ReactMarkdown>

                        <div className="flex gap-2">

                        <button
                        className="btn-ghost text-xs"
                        onClick={()=>{
                        navigator.clipboard.writeText(msg.content)
                        toast.success("Copied")
                        }}
                        >

                        <Copy className="h-4 w-4"/>

                        Copy

                        </button>

                        </div>

                        </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {loading && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-3 rounded-xl bg-white/5 p-4"
  >
    <Loader2 className="h-5 w-5 animate-spin text-brass" />

    <div>
      <p className="font-semibold">
        FinSight AI is thinking...
      </p>

      <p className="text-sm text-parchment-dim">
        Reading regulations • Checking news • Analyzing portfolio
      </p>
    </div>
  </motion.div>
)}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-white/[0.06] bg-ink-900/50 p-4 md:p-5"
          >
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a stock, RBI policy, or your portfolio…"
                className="flex-1 rounded-xl border border-white/10 bg-ink-950/80 px-4 py-3 text-sm text-parchment outline-none transition placeholder:text-parchment-dim focus:border-brass/40 focus:ring-2 focus:ring-brass/10"
              />
              <button type="submit" disabled={loading || !input.trim()} className="btn-primary">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
                Ask
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-4 xl:col-span-5">
        <AgentPipeline trace={latestTrace?.agent_trace || []} active={loading} />
        <InsightPanel response={latestTrace || null} />
      </div>
    </div>
  );
}
