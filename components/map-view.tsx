"use client"

import dynamic from "next/dynamic"
import type { Lead } from "@/lib/types"

const MapInner = dynamic(() => import("./map-inner"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-full w-full items-center justify-center bg-gray-50"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-[#0049B8] border-t-transparent"
        />
        <span
          className="text-sm font-medium text-gray-400"
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
