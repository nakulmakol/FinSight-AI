import { motion } from "framer-motion";
import {
  User,
  Brain,
  Database,
  Wifi,
  Cpu,
  ShieldCheck,
  Moon,
  Bell,
  Settings2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { fetchHealth } from "../api/client";

import {
  MetricCard,
  SectionCard,
  StatusBadge,
} from "../components/ui";

export default function Settings() {

  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => {});
  }, []);

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

          Settings

        </h1>

        <p className="mt-3 text-lg text-zinc-400">

          Configure your FinSight AI experience.

        </p>

      </motion.div>

      {/* Metrics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Backend"
          value={health?.status ?? "Loading"}
          subtitle="Server Status"
          icon={<Wifi size={24} />}
          accent="emerald"
          positive
        />

        <MetricCard
          title="LLM"
          value={health?.llm_provider ?? "Unknown"}
          subtitle="AI Provider"
          icon={<Brain size={24} />}
          accent="blue"
          positive
        />

        <MetricCard
          title="Vector DB"
          value={
            health?.vector_documents
              ? health.vector_documents
              : "--"
          }
          subtitle="Documents"
          icon={<Database size={24} />}
          accent="purple"
          positive
        />

        <MetricCard
          title="Application"
          value="Healthy"
          subtitle="Runtime"
          icon={<ShieldCheck size={24} />}
          accent="amber"
          positive
        />

      </div>

      {/* User + AI */}

      <div className="grid gap-6 lg:grid-cols-2">

        <SectionCard
          title="Profile"
          subtitle="Account Information"
          icon={<User size={24} />}
        >

          <SettingRow
            label="User"
            value="Nakul"
          />

          <SettingRow
            label="Risk Profile"
            value="Moderate"
          />

          <SettingRow
            label="Default Market"
            value="NSE"
          />

          <SettingRow
            label="Workspace"
            value="FinSight AI v2"
          />

        </SectionCard>

        <SectionCard
          title="AI Preferences"
          subtitle="Intelligence Configuration"
          icon={<Brain size={24} />}
        >

          <Toggle
            title="AI Copilot"
            enabled
          />

          <Toggle
            title="Conversation Memory"
            enabled
          />

          <Toggle
            title="RAG Retrieval"
            enabled
          />

          <Toggle
            title="Risk Analysis"
            enabled
          />

        </SectionCard>

      </div>

      {/* Notifications */}

      <div className="grid gap-6 lg:grid-cols-2">

        <SectionCard
          title="Notifications"
          subtitle="Alerts & Updates"
          icon={<Bell size={24} />}
        >

          <Toggle
            title="Market News"
            enabled
          />

          <Toggle
            title="Portfolio Alerts"
            enabled
          />

          <Toggle
            title="Daily Summary"
            enabled={false}
          />

        </SectionCard>

        <SectionCard
          title="Appearance"
          subtitle="Display Settings"
          icon={<Moon size={24} />}
        >

          <SettingRow
            label="Theme"
            value="Dark"
          />

          <SettingRow
            label="Animations"
            value="Enabled"
          />

          <SettingRow
            label="Version"
            value="FinSight AI v2"
          />

        </SectionCard>

      </div>

            {/* System */}

      <SectionCard
        title="System Status"
        subtitle="Current Health"
        icon={<Settings2 size={24} />}
      >

        <div className="grid gap-6 md:grid-cols-2">

          <StatusCard
            icon={<Wifi size={22} />}
            title="Backend"
            status={health?.status ?? "Unknown"}
            positive={
  health?.status === "healthy" ||
  health?.status === "ok"
}
          />

          <StatusCard
            icon={<Cpu size={22} />}
            title="LLM Provider"
            status={
              health?.llm_provider ??
              "Unknown"
            }
            positive
          />

          <StatusCard
            icon={<Database size={22} />}
            title="Vector Database"
            status={
              health?.vector_documents
                ? `${health.vector_documents} Documents`
                : "Connected"
            }
            positive
          />

          <StatusCard
            icon={<ShieldCheck size={22} />}
            title="Application"
            status="Healthy"
            positive
          />

        </div>

      </SectionCard>

    </div>

  );

}

/* ------------------------------------------------ */
/* Setting Row */
/* ------------------------------------------------ */

interface SettingRowProps {
  label: string;
  value: string;
}

function SettingRow({
  label,
  value,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 py-4 last:border-none">

      <span className="text-zinc-400">
        {label}
      </span>

      <span className="font-semibold text-zinc-100">
        {value}
      </span>

    </div>
  );
}

/* ------------------------------------------------ */
/* Toggle */
/* ------------------------------------------------ */

interface ToggleProps {
  title: string;
  enabled: boolean;
}

function Toggle({
  title,
  enabled,
}: ToggleProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 py-4 last:border-none">

      <span className="text-zinc-300">
        {title}
      </span>

      <div
        className={`relative h-7 w-14 rounded-full transition ${
          enabled
            ? "bg-emerald-500"
            : "bg-zinc-700"
        }`}
      >

        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className={`absolute top-1 h-5 w-5 rounded-full bg-white ${
            enabled
              ? "left-8"
              : "left-1"
          }`}
        />

      </div>

    </div>
  );
}

/* ------------------------------------------------ */
/* Status Card */
/* ------------------------------------------------ */

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  status: string;
  positive?: boolean;
}

function StatusCard({
  icon,
  title,
  status,
  positive = true,
}: StatusCardProps) {

  const isOnline =
    positive &&
    status.toLowerCase() !== "unknown";

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition-all hover:border-emerald-500/40"
    >

      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">

            {icon}

          </div>

          <span className="font-semibold text-zinc-100">

            {title}

          </span>

        </div>

        <StatusBadge positive={isOnline}>

          {isOnline ? "ONLINE" : "OFFLINE"}

        </StatusBadge>

      </div>

      <p className="text-lg font-semibold text-zinc-300 capitalize">

        {status === "ok"
          ? "Online"
          : status}

      </p>

    </motion.div>
  );
}