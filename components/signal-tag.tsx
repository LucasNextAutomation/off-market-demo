import { SIGNAL_COLORS } from "@/lib/scoring"
import type { SignalType } from "@/lib/types"

interface SignalTagProps {
  type: SignalType
  label: string
}

export function SignalTag({ type, label }: SignalTagProps) {
  const color = SIGNAL_COLORS[type]

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `${color}26`,
        color: color,
      }}
    >
      {label}
    </span>
  )
}
