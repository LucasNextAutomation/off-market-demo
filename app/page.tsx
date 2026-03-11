"use client"

import { motion } from "framer-motion"
import {
  Database,
  Flame,
  Target,
  Globe,
  Building2,
} from "lucide-react"
import { StatsCard } from "@/components/stats-card"
import { ScoreBadge } from "@/components/score-badge"
import { ScoreDistributionChart, LeadsTrendChart } from "@/components/charts"
import {
  getDashboardStats,
  getMarketSummaries,
  getAssetTypeCounts,
} from "@/lib/mock-data"

const ASSET_ICONS: Record<string, string> = {
  "Distressed Office": "office",
  "Mixed-Use Development Site": "mixed",
  "Value-Add Multifamily": "multi",
}

const ASSET_COLORS: Record<string, string> = {
  "Distressed Office": "var(--hot)",
  "Mixed-Use Development Site": "var(--brand)",
  "Value-Add Multifamily": "var(--success)",
}

export default function DashboardPage() {
  const stats = getDashboardStats()
  const markets = getMarketSummaries()
  const assetTypes = getAssetTypeCounts()

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Dashboard
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Last updated: 2 minutes ago
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Leads"
            value={stats.total_leads.toLocaleString()}
            subtitle={`${stats.signals_detected} signals detected`}
            icon={<Database className="h-5 w-5" />}
            trend={{ value: 12, label: "from last week" }}
            color="brand"
            index={0}
          />
          <StatsCard
            title="Hot Leads (85+)"
            value={stats.hot_leads}
            subtitle="Urgent action required"
            icon={<Flame className="h-5 w-5" />}
            trend={{ value: 8, label: "from last week" }}
            color="hot"
            index={1}
          />
          <StatsCard
            title="Strong Opportunities"
            value={stats.strong_leads}
            subtitle="Score 70-84"
            icon={<Target className="h-5 w-5" />}
            trend={{ value: 15, label: "from last week" }}
            color="strong"
            index={2}
          />
          <StatsCard
            title="Markets Active"
            value={stats.markets_active}
            subtitle={`Avg score: ${stats.avg_score}`}
            icon={<Globe className="h-5 w-5" />}
            trend={{ value: 3, label: "new this month" }}
            color="success"
            index={3}
          />
        </div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <ScoreDistributionChart />
          <LeadsTrendChart />
        </motion.div>

        {/* Market Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <div
            className="overflow-hidden rounded-xl border border-[var(--border)]"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <div className="border-b border-[var(--border)] px-6 py-4">
              <h3
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Market Overview
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="border-b border-[var(--border)]"
                    style={{ backgroundColor: "var(--bg-surface)" }}
                  >
                    <th
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Market
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      State
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Leads
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Avg Score
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Hot Leads
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((market) => (
                    <tr
                      key={market.name}
                      className="border-b border-[var(--border)] transition-colors last:border-b-0 hover:bg-[var(--bg-surface)]"
                    >
                      <td className="px-6 py-4">
                        <span
                          className="font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {market.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {market.state}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className="font-mono text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {market.lead_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ScoreBadge score={market.avg_score} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className="font-mono text-sm font-semibold"
                          style={{
                            color:
                              market.hot_count > 0
                                ? "var(--hot)"
                                : "var(--text-muted)",
                          }}
                        >
                          {market.hot_count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Asset Type Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3
            className="mb-4 text-sm font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            Asset Type Breakdown
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {assetTypes.map((asset, i) => {
              const accentColor =
                ASSET_COLORS[asset.type] ?? "var(--brand)"

              return (
                <motion.div
                  key={asset.type}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                  className="relative overflow-hidden rounded-xl border border-[var(--border)] p-6"
                  style={{ backgroundColor: "var(--bg-card)" }}
                >
                  <div
                    className="absolute left-0 top-0 h-full w-1"
                    style={{ backgroundColor: accentColor }}
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
                        color: accentColor,
                      }}
                    >
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {asset.type}
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {asset.count}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
