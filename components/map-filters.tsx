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
    <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
      {/* Market selector */}
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
        <select
          value={market}
          onChange={(e) => handleMarket(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none"
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
        <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
        <select
          value={assetType}
          onChange={(e) => handleAssetType(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none"
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
        <Target className="h-4 w-4 shrink-0 text-gray-400" />
        {SCORE_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handleScorePreset(preset.value)}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
              scorePreset === preset.value
                ? "border-[#0049B8] bg-[#0049B8]/8 text-[#0049B8]"
                : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search address or city..."
          className="w-[200px] rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-8 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-2 flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:text-gray-600"
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
            className="text-xs font-medium text-[#0049B8] transition-colors hover:opacity-80"
          >
            Reset filters
          </button>
        )}
        <span className="whitespace-nowrap text-sm font-medium tabular-nums text-gray-600">
          {leadCount.toLocaleString()} lead{leadCount !== 1 ? "s" : ""} shown
        </span>
      </div>
    </div>
  )
}
