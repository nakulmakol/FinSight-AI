import { useState } from "react";
import {
  Newspaper,
  RefreshCw,
  TrendingUp,
  BarChart3,
  NewspaperIcon,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

import { fetchNews } from "../api/client";

import {
  MetricCard,
  SearchBar,
  SectionCard,
  StatusBadge,
  Skeleton,
} from "../components/ui";

interface NewsHeadline {
  title: string;
  summary: string;
}

interface NewsResponse {
  headlines: NewsHeadline[];
  sentiment: {
    overall_label: string;
    overall_score: number;
    headline_count: number;
    sample_headlines: string[];
  };
}

export default function News() {
  const [ticker, setTicker] = useState("");

  const [loading, setLoading] = useState(false);

  const [news, setNews] =
    useState<NewsResponse | null>(null);

  const [error, setError] = useState("");

  async function loadNews() {
    setLoading(true);
    setError("");

    try {
      const response = await fetchNews(
        ticker.trim() || undefined
      );

      setNews(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load news."
      );
    }

    setLoading(false);
  }

  return (
    <div className="space-y-10">

      {/* Header */}

      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >

        <h1 className="font-display text-5xl font-bold text-zinc-100">
          Market Intelligence
        </h1>

        <p className="mt-3 text-lg text-zinc-400">
          AI-powered financial news and market sentiment.
        </p>

      </motion.div>

      {/* Search */}

      <div className="flex gap-4">

        <div className="flex-1">

          <SearchBar
            value={ticker}
            onChange={setTicker}
            placeholder="Search company (TCS, Reliance, Infosys...)"
          />

        </div>

        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={loadNews}
          disabled={loading}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 px-6 font-semibold text-white transition disabled:opacity-50"
        >

          <RefreshCw
            size={18}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Analyze

        </motion.button>

      </div>

      {error && (

        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">

          {error}

        </div>

      )}

      {!news && !loading && (

        <SectionCard
          title="Financial News"
          subtitle="Search any company or leave empty for overall market analysis."
          icon={<Newspaper size={26} />}
        >

          <div className="py-12 text-center">

            <Newspaper
              size={58}
              className="mx-auto text-zinc-500"
            />

            <h3 className="mt-6 text-2xl font-semibold text-zinc-100">
              Search Financial News
            </h3>

            <p className="mt-3 text-zinc-500">
              Enter a stock name to generate AI-powered market intelligence.
            </p>

          </div>

        </SectionCard>

      )}

      {loading && (

        <div className="space-y-8">

          <div className="grid gap-6 md:grid-cols-3">

            <Skeleton className="h-40 rounded-3xl" />

            <Skeleton className="h-40 rounded-3xl" />

            <Skeleton className="h-40 rounded-3xl" />

          </div>

          <Skeleton className="h-[450px] rounded-3xl" />

        </div>

      )}

      {news && (

        <>

          {/* Metrics */}

          <div className="grid gap-6 md:grid-cols-3">

            <MetricCard
              title="Market Sentiment"
              value={news.sentiment.overall_label}
              subtitle="AI Analysis"
              icon={<Activity size={24} />}
              accent={
                news.sentiment.overall_score >= 0
                  ? "emerald"
                  : "red"
              }
              positive={
                news.sentiment.overall_score >= 0
              }
            />

            <MetricCard
              title="Sentiment Score"
              value={news.sentiment.overall_score.toFixed(
                2
              )}
              subtitle="Confidence"
              icon={<BarChart3 size={24} />}
              accent="blue"
              positive
            />

            <MetricCard
              title="Articles"
              value={
                news.sentiment.headline_count
              }
              subtitle="Analyzed"
              icon={<NewspaperIcon size={24} />}
              accent="purple"
              positive
            />

          </div>

                {/* Headlines */}

          <SectionCard
            title="Latest Headlines"
            subtitle={`${news.headlines.length} Articles`}
            icon={<TrendingUp size={24} />}
          >

            <div className="space-y-5">

              {news.headlines.map(
                (headline, index) => (

                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-emerald-500/40"
                  >

                    <div className="mb-4 flex items-center justify-between">

                      <StatusBadge
                        positive={
                          news.sentiment.overall_score >= 0
                        }
                      >
                        {news.sentiment.overall_label}
                      </StatusBadge>

                      <span className="text-xs text-zinc-500">
                        AI Summary
                      </span>

                    </div>

                    <h3 className="text-xl font-semibold leading-8 text-zinc-100">

                      {headline.title}

                    </h3>

                    <p className="mt-4 leading-7 text-zinc-400">

                      {headline.summary}

                    </p>

                  </motion.div>

                )
              )}

            </div>

          </SectionCard>

          {/* AI Sentiment */}

          <SectionCard
            title="AI Sentiment Summary"
            subtitle="Generated from financial headlines"
            icon={<Activity size={24} />}
          >

            <div className="grid gap-6 md:grid-cols-3">

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Overall
                </p>

                <div className="mt-4">

                  <StatusBadge
                    positive={
                      news.sentiment.overall_score >= 0
                    }
                  >
                    {news.sentiment.overall_label}
                  </StatusBadge>

                </div>

              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Score
                </p>

                <p className="mt-3 text-4xl font-bold text-cyan-400">

                  {news.sentiment.overall_score.toFixed(
                    2
                  )}

                </p>

              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Headlines
                </p>

                <p className="mt-3 text-4xl font-bold text-zinc-100">

                  {news.sentiment.headline_count}

                </p>

              </div>

            </div>

            {news.sentiment.sample_headlines.length >
              0 && (

              <div className="mt-10">

                <h3 className="mb-5 text-lg font-semibold text-zinc-100">

                  Sample Headlines

                </h3>

                <div className="space-y-4">

                  {news.sentiment.sample_headlines
                    .slice(0, 5)
                    .map((headline, index) => (

                      <motion.div
                        key={index}
                        initial={{
                          opacity: 0,
                          x: -10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay:
                            index * 0.05,
                        }}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
                      >

                        <p className="text-zinc-300">

                          • {headline}

                        </p>

                      </motion.div>

                    ))}

                </div>

              </div>

            )}

          </SectionCard>

        </>

      )}

    </div>

  );

}