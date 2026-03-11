import type { Signal, Priority, SignalType } from "./types"

const SIGNAL_WEIGHTS: Record<SignalType, number> = {
  cmbs_default: 18,
  maturity_default: 15,
  lis_pendens: 14,
  tax_delinquent: 12,
  code_violations: 10,
  high_vacancy: 13,
  bankruptcy: 11,
  estate_transfer: 8,
  extended_ownership: 6,
  environmental: 5,
  rezoning: 7,
  expired_entitlements: 9,
  opportunity_zone: 4,
}

export function computeDistressScore(signals: Signal[]): number {
  if (signals.length === 0) return 0

  // Signal scoring (60% weight)
  const signalSum = signals.reduce((sum, s) => sum + SIGNAL_WEIGHTS[s.type], 0)
  const signalScore = Math.min(signalSum, 60)

  // Stacking bonus: multiple signals = exponentially more likely motivated seller
  const stackBonus = Math.min((signals.length - 1) * 6, 20)

  // Combined
  const raw = signalScore + stackBonus
  return Math.min(Math.round(raw), 100)
}

export function getPriority(score: number): Priority {
  if (score >= 85) return "hot"
  if (score >= 70) return "strong"
  if (score >= 50) return "watch"
  return "archive"
}

export function getTimeSensitivity(score: number): "urgent" | "moderate" | "watch" {
  if (score >= 85) return "urgent"
  if (score >= 70) return "moderate"
  return "watch"
}

export const SIGNAL_LABELS: Record<SignalType, string> = {
  cmbs_default: "CMBS Default",
  maturity_default: "Maturity Default",
  lis_pendens: "Lis Pendens",
  tax_delinquent: "Tax Delinquent",
  code_violations: "Code Violations",
  high_vacancy: "High Vacancy",
  bankruptcy: "Bankruptcy Filing",
  estate_transfer: "Estate Transfer",
  extended_ownership: "Extended Ownership (15+ yr)",
  environmental: "Environmental Flag",
  rezoning: "Rezoning Petition",
  expired_entitlements: "Expired Entitlements",
  opportunity_zone: "Opportunity Zone",
}

export const SIGNAL_COLORS: Record<SignalType, string> = {
  cmbs_default: "#ef4444",
  maturity_default: "#f97316",
  lis_pendens: "#ef4444",
  tax_delinquent: "#f59e0b",
  code_violations: "#f97316",
  high_vacancy: "#8b5cf6",
  bankruptcy: "#ef4444",
  estate_transfer: "#06b6d4",
  extended_ownership: "#6366f1",
  environmental: "#84cc16",
  rezoning: "#10b981",
  expired_entitlements: "#f59e0b",
  opportunity_zone: "#06b6d4",
}
