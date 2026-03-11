"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts"
import { getScoreDistribution, getLeadsTrend } from "@/lib/mock-data"

function getBarColor(label: string): string {
  const start = parseInt(label.split("-")[0], 10)
  if (start >= 80) return "#dc2626"
  if (start >= 60) return "#f97316"
  if (start >= 40) return "#d97706"
  if (start >= 20) return "#4f46e5"
  return "#0049B8"
}

export function ScoreDistributionChart() {
  const data = getScoreDistribution()

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Score Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                color: "#0f172a",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              cursor={{ fill: "rgba(0,73,184,0.04)" }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.label} fill={getBarColor(entry.label)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function LeadsTrendChart() {
  const data = getLeadsTrend()

  const formattedData = data.map((d) => ({
    ...d,
    shortDate: d.date.slice(5),
  }))

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
        30-Day Leads Trend
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0049B8" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#0049B8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="shortDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                color: "#0f172a",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              cursor={{ stroke: "#e2e8f0" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#0049B8"
              strokeWidth={2}
              fill="url(#leadsFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
