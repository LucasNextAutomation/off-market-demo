"use client"

import { useState, useCallback } from "react"
import { Search, MapPin, Building2, Target, X } from "lucide-react"

export interface MapFilterValues {
  market: string
  assetType: string
  scorePreset: string
  search: string
}

interface MapFiltersProps {
  onChange: (filters: MapFilterValues) => void
  leadCount: number
}

const MARKETS = [
  "All Markets",
  "Tampa Bay",
  "Houston",
  "Atlanta",
  "Chicago",
  "Nashville",
  "Phoenix",
  "Charlotte",
]

const ASSET_TYPES = [
  { value: "all", label: "All Types" },
  { value: "distressed-office", label: "Distressed Office" },
  { value: "mixed-use-dev", label: "Mixed-Use Dev" },
  { value: "value-add-multifamily", label: "Value-Add Multifamily" },
]

const SCORE_PRESETS = [
  { value: "all", label: "All", min: 0 },
  { value: "hot", label: "Hot 85+", min: 85 },
  { value: "strong", label: "Strong 70+", min: 70 },
  { value: "watch", label: "Watch 50+", min: 50 },
]

const selectStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  borderColor: "var(--border)",
  color: "var(--text-primary)",
}

export function MapFilters({ onChange, leadCount }: MapFiltersProps) {
  const [market, setMarket] = useState("All Markets")
  const [assetType, setAssetType] = useState("all")
  const [scorePreset, setScorePreset] = useState("all")
  const [search, setSearch] = useState("")

  const emitChange = useCallback(
    (updates: Partial<MapFilterValues>) => {
      const next: MapFilterValues = {
        market: updates.market ?? market,
        assetType: updates.assetType ?? assetType,
        scorePreset: updates.scorePreset ?? scorePreset,
        search: updates.search ?? search,
      }
      onChange(next)
    },
    [market, assetType, scorePreset, search, onChange]
  )

  const handleMarket = (val: string) => {
    setMarket(val)
    emitChange({ market: val })
  }

  const handleAssetType = (val: string) => {
    setAssetType(val)
    emitChange({ assetType: val })
  }

  const handleScorePreset = (val: string) => {
    setScorePreset(val)
    emitChange({ scorePreset: val })
  }

  const handleSearch = (val: string) => {
    setSearch(val)
    emitChange({ search: val })
  }

  const clearSearch = () => {
    setSearch("")
    emitChange({ search: "" })
  }

  const hasActiveFilters =
    market !== "All Markets" ||
    assetType !== "all" ||
    scorePreset !== "all" ||
    search !== ""

  const resetAll = () => {
    setMarket("All Markets")
    setAssetType("all")
    setScorePreset("all")
    setSearch("")
    onChange({ market: "All Markets", assetType: "all", scorePreset: "all", search: "" })
  }

  return (
    <div
      className="flex flex-wrap items-center gap-3 border-b px-4 py-3"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Market selector */}
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        <select
          value={market}
          onChange={(e) => handleMarket(e.target.value)}
          className="rounded-lg border px-3 py-1.5 text-sm outline-none"
          style={selectStyle}
        >
          {MARKETS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Asset type selector */}
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        <select
          value={assetType}
          onChange={(e) => handleAssetType(e.target.value)}
          className="rounded-lg border px-3 py-1.5 text-sm outline-none"
          style={selectStyle}
        >
          {ASSET_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Score presets */}
      <div className="flex items-center gap-1.5">
        <Target className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
        {SCORE_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handleScorePreset(preset.value)}
            className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
            style={{
              background:
                scorePreset === preset.value
                  ? "var(--brand-dim)"
                  : "transparent",
              color:
                scorePreset === preset.value
                  ? "var(--brand)"
                  : "var(--text-secondary)",
              border:
                scorePreset === preset.value
                  ? "1px solid var(--brand)"
                  : "1px solid var(--border)",
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-2.5 h-3.5 w-3.5"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search address or city..."
          className="rounded-lg border py-1.5 pl-8 pr-8 text-sm outline-none placeholder:text-[var(--text-muted)]"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
            width: "200px",
          }}
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-2 flex h-4 w-4 items-center justify-center rounded-full"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Reset + count */}
      <div className="flex items-center gap-3">
        {hasActiveFilters && (
          <button
            onClick={resetAll}
            className="text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--brand)" }}
          >
            Reset filters
          </button>
        )}
        <span
          className="whitespace-nowrap text-sm font-medium tabular-nums"
          style={{ color: "var(--text-secondary)" }}
        >
          {leadCount.toLocaleString()} lead{leadCount !== 1 ? "s" : ""} shown
        </span>
      </div>
    </div>
  )
}
