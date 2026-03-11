"use client"

import { useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Download,
  CheckSquare,
  Square,
  ChevronDown,
  FileSpreadsheet,
  FileText,
} from "lucide-react"
import { ALL_LEADS, getDashboardStats } from "@/lib/mock-data"
import { MARKET_CONFIGS } from "@/lib/mock-data"
import { ScoreBadge } from "@/components/score-badge"
import type { AssetType } from "@/lib/types"

// ── Column groups ─────────────────────────────────────────
interface ColumnGroup {
  key: string
  label: string
  description: string
  defaultOn: boolean
}

const COLUMN_GROUPS: ColumnGroup[] = [
  { key: "property", label: "Property Data", description: "Address, SF, year built, zoning, lot size", defaultOn: true },
  { key: "financial", label: "Financial Data", description: "Value, NOI, cap rate, CMBS, tax liens", defaultOn: true },
  { key: "owner", label: "Owner Intel", description: "Entity, UBO, phone, email, portfolio", defaultOn: true },
  { key: "distress", label: "Distress Signals", description: "Signal types, score, priority, sensitivity", defaultOn: true },
  { key: "market", label: "Market Context", description: "Vacancy, rent trend, recent comps", defaultOn: false },
]

const ASSET_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Asset Types" },
  { value: "distressed-office", label: "Distressed Office" },
  { value: "mixed-use-dev", label: "Mixed-Use Development" },
  { value: "value-add-multifamily", label: "Value-Add Multifamily" },
]

// ── CSV generation ────────────────────────────────────────
function generateCSV(
  leads: typeof ALL_LEADS,
  groups: Set<string>
): string {
  const headers: string[] = []
  const fieldExtractors: ((l: (typeof ALL_LEADS)[0]) => string)[] = []

  // Always include ID
  headers.push("ID")
  fieldExtractors.push((l) => l.id)

  if (groups.has("property")) {
    headers.push("Address", "City", "State", "County", "ZIP", "Asset Type", "Total SF", "Units/Floors", "Year Built", "Lot Acres", "Zoning")
    fieldExtractors.push(
      (l) => l.address,
      (l) => l.city,
      (l) => l.state,
      (l) => l.county,
      (l) => l.zip,
      (l) => l.property_type_label,
      (l) => String(l.total_sf),
      (l) => String(l.units_or_floors),
      (l) => l.year_built === 0 ? "N/A" : String(l.year_built),
      (l) => String(l.lot_acres),
      (l) => l.zoning,
    )
  }

  if (groups.has("financial")) {
    headers.push("Assessed Value", "Estimated Value", "Last Sale Date", "Last Sale Price", "NOI", "Cap Rate", "CMBS Balance", "CMBS Maturity", "Tax Delinquency")
    fieldExtractors.push(
      (l) => String(l.assessed_value),
      (l) => String(l.estimated_value),
      (l) => l.last_sale_date,
      (l) => String(l.last_sale_price),
      (l) => l.noi != null ? String(l.noi) : "",
      (l) => l.cap_rate != null ? String(l.cap_rate) : "",
      (l) => l.cmbs_balance != null ? String(l.cmbs_balance) : "",
      (l) => l.cmbs_maturity ?? "",
      (l) => l.tax_delinquency != null ? String(l.tax_delinquency) : "",
    )
  }

  if (groups.has("owner")) {
    headers.push("Owner Entity", "UBO", "Phone", "Email", "Portfolio Size", "Portfolio Health", "Mailing Address")
    fieldExtractors.push(
      (l) => l.owner_entity,
      (l) => l.owner_ubo,
      (l) => l.phone,
      (l) => l.email,
      (l) => String(l.owner_portfolio_size),
      (l) => l.owner_portfolio_health,
      (l) => l.mailing_address,
    )
  }

  if (groups.has("distress")) {
    headers.push("Distress Score", "Priority", "Time Sensitivity", "Signal Count", "Signals")
    fieldExtractors.push(
      (l) => String(l.distress_score),
      (l) => l.priority,
      (l) => l.time_sensitivity,
      (l) => String(l.signals.length),
      (l) => l.signals.map((s) => s.label).join("; "),
    )
  }

  if (groups.has("market")) {
    headers.push("Submarket Vacancy %", "Rent Trend 12M %", "Recent Comps")
    fieldExtractors.push(
      (l) => String(l.submarket_vacancy),
      (l) => String(l.rent_trend_12m),
      (l) => String(l.recent_comps),
    )
  }

  const escapeCSV = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`
    }
    return val
  }

  const rows = [headers.map(escapeCSV).join(",")]
  for (const lead of leads) {
    const row = fieldExtractors.map((fn) => escapeCSV(fn(lead)))
    rows.push(row.join(","))
  }

  return rows.join("\n")
}

// ── Format helpers ────────────────────────────────────────
function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

// ── Export page ───────────────────────────────────────────
export default function ExportPage() {
  const stats = getDashboardStats()
  const markets = MARKET_CONFIGS

  // Filters
  const [selectedMarket, setSelectedMarket] = useState("all")
  const [selectedAssetType, setSelectedAssetType] = useState("all")
  const [minScore, setMinScore] = useState(0)
  const [activeGroups, setActiveGroups] = useState<Set<string>>(
    () => new Set(COLUMN_GROUPS.filter((g) => g.defaultOn).map((g) => g.key))
  )
  const [format, setFormat] = useState<"csv" | "excel">("csv")

  const toggleGroup = (key: string) => {
    setActiveGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return ALL_LEADS.filter((lead) => {
      if (selectedMarket !== "all") {
        const market = markets.find((m) => m.name === selectedMarket)
        if (market && !market.cities.includes(lead.city)) return false
      }
      if (selectedAssetType !== "all" && lead.asset_type !== selectedAssetType) return false
      if (lead.distress_score < minScore) return false
      return true
    })
  }, [selectedMarket, selectedAssetType, minScore, markets])

  // Export handler
  const handleExport = useCallback(() => {
    const csv = generateCSV(filteredLeads, activeGroups)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `off-market-leads-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [filteredLeads, activeGroups])

  const previewLeads = filteredLeads.slice(0, 5)

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
          Export Center
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure and download your lead data
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: Export Config */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          {/* Column Groups */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-[#0049B8]/20 transition-all">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Include in Export
            </h2>
            <div className="flex flex-col gap-3">
              {COLUMN_GROUPS.map((group) => {
                const isActive = activeGroups.has(group.key)
                return (
                  <button
                    key={group.key}
                    onClick={() => toggleGroup(group.key)}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
                  >
                    {isActive ? (
                      <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#0049B8]" />
                    ) : (
                      <Square className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    )}
                    <div>
                      <span className="block text-sm font-medium text-gray-900">
                        {group.label}
                      </span>
                      <span className="block text-xs text-gray-400 mt-0.5">
                        {group.description}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-[#0049B8]/20 transition-all">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Filters
            </h2>
            <div className="flex flex-col gap-4">
              {/* Market dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Market
                </label>
                <div className="relative">
                  <select
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-900 outline-none focus:border-[#0049B8] focus:ring-2 focus:ring-[#0049B8]/10 transition-colors cursor-pointer"
                  >
                    <option value="all">All Markets</option>
                    {markets.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}, {m.state}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Asset Type dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Asset Type
                </label>
                <div className="relative">
                  <select
                    value={selectedAssetType}
                    onChange={(e) => setSelectedAssetType(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-sm text-gray-900 outline-none focus:border-[#0049B8] focus:ring-2 focus:ring-[#0049B8]/10 transition-colors cursor-pointer"
                  >
                    {ASSET_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Min Score */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Min Distress Score
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                    className="flex-1 accent-[#0049B8]"
                  />
                  <span className="w-10 text-right text-sm font-mono font-semibold text-gray-900">
                    {minScore}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Format */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-[#0049B8]/20 transition-all">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Format
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setFormat("csv")}
                className={`flex flex-1 items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                  format === "csv"
                    ? "border-[#0049B8] bg-[#0049B8]/10 text-[#0049B8]"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                <FileText className="h-4 w-4" />
                CSV
              </button>
              <button
                disabled
                className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-400 opacity-50 cursor-not-allowed"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
                <span className="ml-auto text-[10px] uppercase tracking-wider">Soon</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right: Preview + Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* Lead count banner */}
          <div className="rounded-2xl border border-[#0049B8]/20 bg-[#0049B8]/5 p-5 flex items-center justify-between">
            <div>
              <span className="block text-2xl font-bold text-[#0049B8]">
                {filteredLeads.length.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600">
                leads ready for export
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>{activeGroups.size} column groups</span>
              <span className="text-gray-200">|</span>
              <span>
                ~{Math.round(filteredLeads.length * activeGroups.size * 0.12)} KB
              </span>
            </div>
          </div>

          {/* Preview table */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:border-[#0049B8]/20 transition-all">
            <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Preview
              </h2>
              <span className="text-xs text-gray-400">
                Showing {previewLeads.length} of {filteredLeads.length.toLocaleString()}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-2.5 text-xs font-medium text-gray-400 whitespace-nowrap">
                      Address
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-gray-400 whitespace-nowrap">
                      Score
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-gray-400 whitespace-nowrap">
                      Value
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-gray-400 whitespace-nowrap">
                      Asset Type
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-gray-400 whitespace-nowrap">
                      Signals
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {previewLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {lead.address}
                        </div>
                        <div className="text-xs text-gray-400">
                          {lead.city}, {lead.state}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <ScoreBadge score={lead.distress_score} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                        {formatCurrency(lead.estimated_value)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {lead.property_type_label}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {lead.signals.slice(0, 2).map((s) => (
                            <span
                              key={s.type}
                              className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600"
                            >
                              {s.label}
                            </span>
                          ))}
                          {lead.signals.length > 2 && (
                            <span className="text-[10px] text-gray-400 self-center">
                              +{lead.signals.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {previewLeads.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-sm text-gray-400"
                      >
                        No leads match the current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export button */}
          <button
            onClick={handleExport}
            disabled={filteredLeads.length === 0 || activeGroups.size === 0}
            className="flex items-center justify-center gap-2.5 rounded-lg bg-[#0049B8] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#0049B8]/25 transition-all hover:bg-[#003a93] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="h-5 w-5" />
            Export {filteredLeads.length.toLocaleString()} Leads as CSV
          </button>
        </motion.div>
      </div>
    </div>
  )
}
