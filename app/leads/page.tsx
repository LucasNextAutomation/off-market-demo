"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ALL_LEADS } from "@/lib/mock-data"
import { ScoreBadge } from "@/components/score-badge"
import { SignalTag } from "@/components/signal-tag"
import { formatCurrency } from "@/lib/format"
import type { AssetType, PipelineStatus, Lead } from "@/lib/types"
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react"

// ── Constants ────────────────────────────────────────────────
const PAGE_SIZE = 25

const MARKET_OPTIONS = [
  "All Markets",
  "Tampa Bay",
  "Houston",
  "Atlanta",
  "Chicago",
  "Nashville",
  "Phoenix",
  "Charlotte",
] as const

const ASSET_TYPE_OPTIONS: { label: string; value: AssetType | "all" }[] = [
  { label: "All Types", value: "all" },
  { label: "Distressed Office", value: "distressed-office" },
  { label: "Mixed-Use Dev", value: "mixed-use-dev" },
  { label: "Value-Add Multifamily", value: "value-add-multifamily" },
]

const SORT_OPTIONS = [
  { label: "Score (High \u2192 Low)", key: "score" },
  { label: "Value (High \u2192 Low)", key: "value" },
  { label: "Newest First", key: "newest" },
] as const

type SortKey = (typeof SORT_OPTIONS)[number]["key"]

const SCORE_RANGES = [
  { label: "All Scores", min: 0, max: 100 },
  { label: "85-100 (Hot)", min: 85, max: 100 },
  { label: "70-84 (Strong)", min: 70, max: 84 },
  { label: "50-69 (Watch)", min: 50, max: 69 },
  { label: "0-49 (Archive)", min: 0, max: 49 },
] as const

// ── Small components ─────────────────────────────────────────

function StatusBadge({ status }: { status: PipelineStatus }) {
  const config: Record<PipelineStatus, { cls: string; label: string }> = {
    new: {
      cls: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
      label: "New",
    },
    reviewed: {
      cls: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
      label: "Reviewed",
    },
    under_loi: {
      cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
      label: "Under LOI",
    },
    passed: {
      cls: "bg-red-500/15 text-red-400 border border-red-500/30",
      label: "Passed",
    },
    closed: {
      cls: "bg-slate-500/15 text-slate-500 border border-slate-500/20",
      label: "Closed",
    },
  }
  const c = config[status]
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${c.cls}`}
    >
      {c.label}
    </span>
  )
}

function TimeSensitivityDot({ level }: { level: "urgent" | "moderate" | "watch" }) {
  const dotColor =
    level === "urgent"
      ? "bg-red-500"
      : level === "moderate"
        ? "bg-amber-400"
        : "bg-slate-500"
  const label =
    level === "urgent" ? "Urgent" : level === "moderate" ? "Moderate" : "Watch"
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
      <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      {label}
    </span>
  )
}

// ── Helpers ──────────────────────────────────────────────────

function matchesMarket(lead: Lead, market: string): boolean {
  if (market === "All Markets") return true
  const marketCities: Record<string, string[]> = {
    "Tampa Bay": ["Tampa", "St. Petersburg", "Clearwater", "Sarasota", "Brandon"],
    Houston: ["Houston", "Sugar Land", "The Woodlands", "Katy", "Pearland"],
    Atlanta: ["Atlanta", "Decatur", "Marietta", "Sandy Springs", "Buckhead"],
    Chicago: ["Chicago", "Evanston", "Oak Brook", "Schaumburg", "Naperville"],
    Nashville: ["Nashville", "Franklin", "Murfreesboro", "Brentwood", "Hendersonville"],
    Phoenix: ["Phoenix", "Scottsdale", "Tempe", "Mesa", "Chandler"],
    Charlotte: ["Charlotte", "Concord", "Huntersville", "Matthews", "Gastonia"],
  }
  return marketCities[market]?.includes(lead.city) ?? false
}

function sortLeads(leads: Lead[], sortKey: SortKey): Lead[] {
  const sorted = [...leads]
  switch (sortKey) {
    case "score":
      return sorted.sort((a, b) => b.distress_score - a.distress_score)
    case "value":
      return sorted.sort((a, b) => b.estimated_value - a.estimated_value)
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    default:
      return sorted
  }
}

// ── Select wrapper ───────────────────────────────────────────

const selectClasses =
  "appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg-card)] py-2 pl-3 pr-8 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--brand)]"

// ── Main component ───────────────────────────────────────────

export default function LeadsPage() {
  const router = useRouter()

  // Filter state
  const [market, setMarket] = useState("All Markets")
  const [assetType, setAssetType] = useState<AssetType | "all">("all")
  const [scoreRange, setScoreRange] = useState(0)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("score")
  const [page, setPage] = useState(1)

  // Filtered + sorted leads
  const filteredLeads = useMemo(() => {
    const range = SCORE_RANGES[scoreRange]
    const q = search.toLowerCase().trim()

    const filtered = ALL_LEADS.filter((lead) => {
      if (!matchesMarket(lead, market)) return false
      if (assetType !== "all" && lead.asset_type !== assetType) return false
      if (lead.distress_score < range.min || lead.distress_score > range.max) return false
      if (
        q &&
        !lead.address.toLowerCase().includes(q) &&
        !lead.city.toLowerCase().includes(q) &&
        !lead.owner_entity.toLowerCase().includes(q) &&
        !lead.county.toLowerCase().includes(q)
      )
        return false
      return true
    })

    return sortLeads(filtered, sortKey)
  }, [market, assetType, scoreRange, search, sortKey])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE))
  const safePageNum = Math.min(page, totalPages)
  const pagedLeads = filteredLeads.slice(
    (safePageNum - 1) * PAGE_SIZE,
    safePageNum * PAGE_SIZE
  )

  // Reset page when filters change
  const updateFilter = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-void)] px-6 py-8">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Leads</h1>
          <span className="inline-flex items-center rounded-full bg-[var(--brand-light)] px-3 py-0.5 text-sm font-semibold text-[var(--brand)]">
            {filteredLeads.length}
          </span>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Market */}
        <div className="relative">
          <select
            value={market}
            onChange={(e) => updateFilter(setMarket)(e.target.value)}
            className={selectClasses}
          >
            {MARKET_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
        </div>

        {/* Asset Type */}
        <div className="relative">
          <select
            value={assetType}
            onChange={(e) =>
              updateFilter(setAssetType)(e.target.value as AssetType | "all")
            }
            className={selectClasses}
          >
            {ASSET_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
        </div>

        {/* Score Range */}
        <div className="relative">
          <select
            value={scoreRange}
            onChange={(e) => updateFilter(setScoreRange)(Number(e.target.value))}
            className={selectClasses}
          >
            {SCORE_RANGES.map((r, i) => (
              <option key={i} value={i}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search address, city, owner..."
            value={search}
            onChange={(e) => updateFilter(setSearch)(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] py-2 pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none transition-colors focus:border-[var(--brand)]"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg-card)] py-2 pl-9 pr-8 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--brand)]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-card)]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Asset Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Est. Value
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Signals
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Owner Entity
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Urgency
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedLeads.map((lead, idx) => (
              <tr
                key={lead.id}
                onClick={() => router.push(`/leads/${lead.id}`)}
                className={`cursor-pointer border-b border-[var(--border)] transition-colors duration-150 hover:bg-white/[0.03] ${
                  idx % 2 === 0 ? "bg-[var(--bg-card)]" : "bg-[var(--bg-void)]"
                }`}
              >
                {/* Score */}
                <td className="px-4 py-3">
                  <ScoreBadge score={lead.distress_score} />
                </td>

                {/* Address */}
                <td className="px-4 py-3">
                  <div className="font-medium text-[var(--text-primary)]">
                    {lead.address}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {lead.city}, {lead.state}
                  </div>
                </td>

                {/* Asset Type */}
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {lead.property_type_label}
                </td>

                {/* Est. Value */}
                <td className="px-4 py-3 text-right font-mono font-medium tabular-nums text-[var(--text-primary)]">
                  {formatCurrency(lead.estimated_value)}
                </td>

                {/* Signals */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      {lead.signals.length}
                    </span>
                    {lead.signals.length > 0 && (
                      <SignalTag
                        type={lead.signals[0].type}
                        label={lead.signals[0].label}
                      />
                    )}
                  </div>
                </td>

                {/* Owner */}
                <td className="max-w-[180px] truncate px-4 py-3 text-[var(--text-secondary)]">
                  {lead.owner_entity}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={lead.pipeline_status} />
                </td>

                {/* Time Sensitivity */}
                <td className="px-4 py-3 text-center">
                  <TimeSensitivityDot level={lead.time_sensitivity} />
                </td>
              </tr>
            ))}

            {pagedLeads.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-16 text-center text-[var(--text-secondary)]"
                >
                  No leads match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ──────────────────────────────────────── */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          Showing{" "}
          <span className="font-medium tabular-nums text-[var(--text-primary)]">
            {filteredLeads.length > 0 ? (safePageNum - 1) * PAGE_SIZE + 1 : 0}
            &ndash;
            {Math.min(safePageNum * PAGE_SIZE, filteredLeads.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium tabular-nums text-[var(--text-primary)]">
            {filteredLeads.length}
          </span>{" "}
          leads
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={safePageNum <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:border-[#334155] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          <span className="px-2 text-sm tabular-nums text-[var(--text-secondary)]">
            {safePageNum} / {totalPages}
          </span>

          <button
            disabled={safePageNum >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:border-[#334155] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
