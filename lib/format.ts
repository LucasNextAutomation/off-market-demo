/**
 * Format a numeric dollar value into a compact string.
 * $10,000,000 -> "$10.0M"
 * $1,500,000  -> "$1.5M"
 * $500,000    -> "$500K"
 * $85,000     -> "$85.0K"
 * $1,200      -> "$1,200"
 */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    return `$${millions.toFixed(1)}M`
  }
  if (value >= 1_000) {
    const thousands = value / 1_000
    // Show one decimal for values under 1000K, clean for round numbers
    return thousands >= 100
      ? `$${Math.round(thousands)}K`
      : `$${thousands.toFixed(1)}K`
  }
  return `$${value.toLocaleString("en-US")}`
}

/**
 * Format square footage with commas.
 * 150000 -> "150,000 SF"
 */
export function formatSF(value: number): string {
  return `${value.toLocaleString("en-US")} SF`
}

/**
 * Format a number as a percentage.
 * 12.5 -> "12.5%"
 */
export function formatPercent(value: number): string {
  return `${value}%`
}

/**
 * Format ISO date string to readable format.
 * "2024-03-15" -> "Mar 15, 2024"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Partially mask contact info for demo mode.
 *
 * Phone: "(555) 123-4567" -> "(555) 1**-****"
 * Email: "john.doe@example.com" -> "joh***@***.com"
 */
export function maskContact(value: string, type: "phone" | "email"): string {
  if (type === "phone") {
    // Keep area code and first digit, mask the rest
    const digits = value.replace(/\D/g, "")
    if (digits.length < 7) return value
    const area = digits.slice(0, 3)
    const firstDigit = digits.slice(3, 4)
    return `(${area}) ${firstDigit}**-****`
  }

  if (type === "email") {
    const atIndex = value.indexOf("@")
    if (atIndex < 1) return value
    const localPart = value.slice(0, atIndex)
    const domain = value.slice(atIndex + 1)
    const ext = domain.split(".").pop() ?? ""
    const visibleLocal = localPart.slice(0, 3)
    return `${visibleLocal}***@***.${ext}`
  }

  return value
}
