interface ScoreBadgeProps {
  score: number
}

function getScoreStyle(score: number): { bg: string; text: string; border: string } {
  if (score >= 85) {
    return { bg: "rgba(239, 68, 68, 0.1)", text: "#dc2626", border: "rgba(239, 68, 68, 0.2)" }
  }
  if (score >= 70) {
    return { bg: "rgba(245, 158, 11, 0.1)", text: "#d97706", border: "rgba(245, 158, 11, 0.2)" }
  }
  if (score >= 50) {
    return { bg: "rgba(99, 102, 241, 0.1)", text: "#4f46e5", border: "rgba(99, 102, 241, 0.2)" }
  }
  return { bg: "rgba(107, 114, 128, 0.1)", text: "#6b7280", border: "rgba(107, 114, 128, 0.2)" }
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const style = getScoreStyle(score)

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold border"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {score}
    </span>
  )
}
