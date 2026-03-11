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

const COLOR_MAP: Record<CardColor, { iconBg: string; iconText: string }> = {
  brand: {
    iconBg: "var(--brand-dim)",
    iconText: "var(--brand)",
  },
  hot: {
    iconBg: "var(--hot-dim)",
    iconText: "var(--hot)",
  },
  strong: {
    iconBg: "var(--strong-dim)",
    iconText: "var(--strong)",
  },
  watch: {
    iconBg: "var(--watch-dim)",
    iconText: "var(--watch)",
  },
  success: {
    iconBg: "var(--success-dim)",
    iconText: "var(--success)",
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
      className="relative overflow-hidden rounded-xl border border-[var(--border)] p-6"
      style={{
        background: "color-mix(in srgb, var(--bg-card) 80%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {title}
          </span>
          <span
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {value}
          </span>
          {subtitle && (
            <span
              className="mt-0.5 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {subtitle}
            </span>
          )}
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
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
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span
            className="text-xs font-medium"
            style={{
              color: trend.value >= 0 ? "var(--success)" : "var(--hot)",
            }}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}%
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {trend.label}
          </span>
        </div>
      )}
    </motion.div>
  )
}
