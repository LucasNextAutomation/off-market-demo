"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  Database,
  Sparkles,
  Brain,
  Download,
  FileSearch,
  AlertTriangle,
  Users,
  Building2,
  BarChart3,
  ShieldAlert,
  Play,
  Clock,
  CheckCircle2,
  Loader2,
  XCircle,
  Pause,
  Calendar,
  Zap,
  Mail,
} from "lucide-react"
import { OPERATIONS } from "@/lib/mock-data"
import type { Operation } from "@/lib/types"
import type { LucideIcon } from "lucide-react"

// ── Icon map ──────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Database,
  FileSearch,
  AlertTriangle,
  Users,
  Building2,
  Brain,
  BarChart3,
  ShieldAlert,
}

// ── Category config ───────────────────────────────────────
interface CategoryConfig {
  key: Operation["category"]
  label: string
  icon: LucideIcon
  color: string
  colorDim: string
}

const CATEGORIES: CategoryConfig[] = [
  { key: "scraping", label: "Scraping", icon: Database, color: "#3b82f6", colorDim: "rgba(59,130,246,0.15)" },
  { key: "enrichment", label: "Enrichment", icon: Sparkles, color: "#a855f7", colorDim: "rgba(168,85,247,0.15)" },
  { key: "scoring", label: "Scoring", icon: Brain, color: "#10b981", colorDim: "rgba(16,185,129,0.15)" },
  { key: "export", label: "Export", icon: Download, color: "#f59e0b", colorDim: "rgba(245,158,11,0.15)" },
]

// ── Time formatting ───────────────────────────────────────
function timeAgo(iso: string | null): string {
  if (!iso) return "Never"
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "--"
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

// ── Status badge ──────────────────────────────────────────
function StatusBadge({ status }: { status: Operation["status"] }) {
  const config: Record<Operation["status"], { icon: LucideIcon; label: string; classes: string }> = {
    completed: { icon: CheckCircle2, label: "Completed", classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    running: { icon: Loader2, label: "Running", classes: "bg-blue-50 text-blue-700 border border-blue-200" },
    idle: { icon: Pause, label: "Idle", classes: "bg-gray-100 text-gray-500" },
    failed: { icon: XCircle, label: "Failed", classes: "bg-red-50 text-red-600 border border-red-200" },
  }

  const c = config[status]
  const Icon = c.icon

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.classes}`}>
      <Icon className={`h-3 w-3 ${status === "running" ? "animate-spin" : ""}`} />
      {c.label}
    </span>
  )
}

// ── Tier badge ────────────────────────────────────────────
function TierBadge({ tier }: { tier: "free" | "paid" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
        tier === "free"
          ? "border-emerald-200 text-emerald-700 bg-emerald-50"
          : "border-amber-200 text-amber-700 bg-amber-50"
      }`}
    >
      {tier}
    </span>
  )
}

// ── Operations page ───────────────────────────────────────
export default function OperationsPage() {
  // Group operations by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, { count: number; lastRun: string | null }> = {}
    for (const cat of CATEGORIES) {
      const ops = OPERATIONS.filter((o) => o.category === cat.key)
      const latestRun = ops
        .map((o) => o.last_run)
        .filter(Boolean)
        .sort()
        .reverse()[0]
      counts[cat.key] = { count: ops.length, lastRun: latestRun ?? null }
    }
    // Add manual export count (not in OPERATIONS)
    if (!counts["export"]) {
      counts["export"] = { count: 0, lastRun: null }
    }
    counts["export"] = { count: 1, lastRun: null }
    return counts
  }, [])

  const handleRunNow = () => {
    alert("Demo mode -- operations run automatically in production")
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Operations
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Automated data pipeline
        </p>
      </motion.div>

      {/* Pipeline Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon
          const data = categoryCounts[cat.key]
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
              className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-lg hover:border-[#0049B8]/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: cat.colorDim, color: cat.color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-gray-900">
                    {cat.label}
                  </span>
                  <span className="block text-xs text-gray-400">
                    {data?.count ?? 0}{" "}
                    {cat.key === "export" ? "manual" : data?.count === 1 ? "operation" : "operations"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>
                  {cat.key === "export"
                    ? "On demand"
                    : data?.lastRun
                      ? timeAgo(data.lastRun)
                      : "Never"}
                </span>
              </div>
              {/* Connecting arrow indicator */}
              {idx < CATEGORIES.length - 1 && (
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 hidden lg:block">
                  <div className="h-0.5 w-4 bg-gray-200" />
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Operations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
          All Operations
        </h2>
        <div className="grid gap-3">
          {OPERATIONS.map((op, idx) => {
            const Icon = ICON_MAP[op.icon] ?? Database
            const catConfig = CATEGORIES.find((c) => c.key === op.category)

            return (
              <motion.div
                key={op.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.35 + idx * 0.05 }}
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-lg hover:border-[#0049B8]/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg mt-0.5"
                    style={{
                      backgroundColor: catConfig?.colorDim ?? "#f9fafb",
                      color: catConfig?.color ?? "#4b5563",
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {op.name}
                      </span>
                      <TierBadge tier={op.tier} />
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                      {op.description}
                    </p>

                    {/* Stats row */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                      <StatusBadge status={op.status} />
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        {timeAgo(op.last_run)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Database className="h-3 w-3 text-gray-400" />
                        {op.records_processed.toLocaleString()} records
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-gray-400" />
                        {formatDuration(op.duration_seconds)}
                      </span>
                    </div>
                  </div>

                  {/* Run button */}
                  <button
                    onClick={handleRunNow}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400"
                  >
                    <Play className="h-3 w-3" />
                    Run Now
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-[#0049B8]/20 transition-all"
      >
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          Schedule
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Daily */}
          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-900">
                Daily at 2:00 AM ET
              </span>
              <span className="block text-xs text-gray-400 mt-1 leading-relaxed">
                Full pipeline: scrape, enrich, score, alert
              </span>
            </div>
          </div>

          {/* Real-time */}
          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-900">
                Real-time
              </span>
              <span className="block text-xs text-gray-400 mt-1 leading-relaxed">
                Hot lead alerts (score 85+) sent immediately
              </span>
            </div>
          </div>

          {/* Weekly */}
          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-900">
                Weekly Digest
              </span>
              <span className="block text-xs text-gray-400 mt-1 leading-relaxed">
                Digest email with all qualified leads (50+)
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
