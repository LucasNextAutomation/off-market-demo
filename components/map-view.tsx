"use client"

import dynamic from "next/dynamic"
import type { Lead } from "@/lib/types"

const MapInner = dynamic(() => import("./map-inner"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ background: "#020617" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "var(--brand)", borderTopColor: "transparent" }}
        />
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Loading map...
        </span>
      </div>
    </div>
  ),
})

interface MapViewProps {
  leads: Lead[]
  onLeadClick?: (id: string) => void
}

export function MapView({ leads, onLeadClick }: MapViewProps) {
  return <MapInner leads={leads} onLeadClick={onLeadClick} />
}
