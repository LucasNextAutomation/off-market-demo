"use client"

import { useState, useMemo, useCallback } from "react"
import { MapView } from "@/components/map-view"
import { MapFilters, type MapFilterValues } from "@/components/map-filters"
import { ALL_LEADS, MARKET_CONFIGS } from "@/lib/mock-data"

const SCORE_MINIMUMS: Record<string, number> = {
  all: 0,
  hot: 85,
  strong: 70,
  watch: 50,
}

function getMarketCities(marketName: string): string[] {
  const config = MARKET_CONFIGS.find((m) => m.name === marketName)
  return config ? config.cities : []
}

export default function MapPage() {
  const [filters, setFilters] = useState<MapFilterValues>({
    market: "All Markets",
    assetType: "all",
    scorePreset: "all",
    search: "",
  })

  const filteredLeads = useMemo(() => {
    const searchLower = filters.search.toLowerCase().trim()
    const minScore = SCORE_MINIMUMS[filters.scorePreset] ?? 0
    const marketCities =
      filters.market !== "All Markets" ? getMarketCities(filters.market) : null

    return ALL_LEADS.filter((lead) => {
      // Market filter
      if (marketCities && !marketCities.includes(lead.city)) {
        return false
      }

      // Asset type filter
      if (filters.assetType !== "all" && lead.asset_type !== filters.assetType) {
        return false
      }

      // Score filter
      if (lead.distress_score < minScore) {
        return false
      }

      // Search filter
      if (searchLower) {
        const haystack = `${lead.address} ${lead.city} ${lead.state} ${lead.zip} ${lead.county}`.toLowerCase()
        if (!haystack.includes(searchLower)) {
          return false
        }
      }

      return true
    })
  }, [filters])

  const handleFilterChange = useCallback((next: MapFilterValues) => {
    setFilters(next)
  }, [])

  const handleLeadClick = useCallback((id: string) => {
    // Could navigate or open a detail panel in the future
    console.log("Lead clicked:", id)
  }, [])

  return (
    <div className="flex h-screen flex-col" style={{ background: "var(--background)" }}>
      <MapFilters
        onChange={handleFilterChange}
        leadCount={filteredLeads.length}
      />
      <div className="relative flex-1">
        <MapView leads={filteredLeads} onLeadClick={handleLeadClick} />
      </div>
    </div>
  )
}
