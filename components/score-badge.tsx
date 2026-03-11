interface ScoreBadgeProps {
  score: number
}

function getScoreStyle(score: number): { bg: string; text: string; label: string } {
  if (score >= 85) {
    return { bg: "#ef4444", text: "#ffffff", label: "HOT" }
  }
  if (score >= 70) {
    return { bg: "#f59e0b", text: "#000000", label: "STRONG" }
  }
  if (score >= 50) {
    return { bg: "#6366f1", text: "#ffffff", label: "WATCH" }
  }
  return { bg: "#6b7280", text: "#ffffff", label: "ARCHIVE" }
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const style = getScoreStyle(score)

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-sm font-semibold"
      style={{
        backgroundColor: style.bg,
        color: style.text,
      }}
    >
      {score}
    </span>
  )
}
