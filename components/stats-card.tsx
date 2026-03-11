"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { ReactNode } from "react"

type CardColor = "brand" | "hot" | "strong" | "watch" | "success"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  trend?: { value: number; label: string }
  color?: CardColor
  index?: number
}

const COLOR_MAP: Record<CardColor, { iconBg: string; iconText: string; accent: string }> = {
  brand: {
    iconBg: "rgba(0, 73, 184, 0.08)",
    iconText: "#0049B8",
    accent: "#0049B8",
  },
  hot: {
    iconBg: "rgba(239, 68, 68, 0.08)",
    iconText: "#dc2626",
    accent: "#dc2626",
  },
  strong: {
    iconBg: "rgba(245, 158, 11, 0.08)",
    iconText: "#d97706",
    accent: "#d97706",
  },
  watch: {
    iconBg: "rgba(99, 102, 241, 0.08)",
    iconText: "#4f46e5",
    accent: "#4f46e5",
  },
  success: {
    iconBg: "rgba(16, 185, 129, 0.08)",
    iconText: "#059669",
    accent: "#059669",
  },
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "brand",
  index = 0,
}: StatsCardProps) {
  const colors = COLOR_MAP[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg hover:shadow-black/[0.04]"
    >
      {/* Top accent line */}
      <div
        className="absolute left-0 right-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${colors.accent}, transparent)` }}
      />

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {title}
          </span>
          <span className="text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </span>
          {subtitle && (
            <span className="mt-0.5 text-xs text-gray-400">
              {subtitle}
            </span>
          )}
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: colors.iconBg,
            color: colors.iconText,
          }}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend.value >= 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span
            className="text-xs font-semibold"
            style={{
              color: trend.value >= 0 ? "#059669" : "#dc2626",
            }}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}%
          </span>
          <span className="text-xs text-gray-400">
            {trend.label}
          </span>
        </div>
      )}
    </motion.div>
  )
}
