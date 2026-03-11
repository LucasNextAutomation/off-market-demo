"use client"

import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import Link from "next/link"
import type { Lead, Priority } from "@/lib/types"

interface MapInnerProps {
  leads: Lead[]
  onLeadClick?: (id: string) => void
}

const PRIORITY_COLORS: Record<Priority, string> = {
  hot: "#ef4444",
  strong: "#f59e0b",
  watch: "#6366f1",
  archive: "#475569",
}

const PRIORITY_RADIUS: Record<Priority, number> = {
  hot: 6,
  strong: 5,
  watch: 4,
  archive: 4,
}

function formatValue(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return `$${value}`
}

function getScoreBadgeColor(score: number): string {
  if (score >= 85) return "#ef4444"
  if (score >= 70) return "#f59e0b"
  if (score >= 50) return "#6366f1"
  return "#475569"
}

export default function MapInner({ leads, onLeadClick }: MapInnerProps) {
  return (
    <MapContainer
      center={[37.5, -96]}
      zoom={4}
      style={{ height: "100%", width: "100%", background: "#020617" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {leads.map((lead) => (
        <CircleMarker
          key={lead.id}
          center={[lead.latitude, lead.longitude]}
          radius={PRIORITY_RADIUS[lead.priority]}
          pathOptions={{
            color: "#ffffff",
            weight: 1,
            fillColor: PRIORITY_COLORS[lead.priority],
            fillOpacity: 0.8,
          }}
          eventHandlers={{
            click: () => onLeadClick?.(lead.id),
          }}
        >
          <Popup>
            <div style={{
              fontFamily: "system-ui, sans-serif",
              color: "#e2e8f0",
              background: "#0f172a",
              borderRadius: "8px",
              padding: "12px 14px",
              minWidth: "220px",
              margin: "-14px -20px",
              border: "1px solid #1e293b",
            }}>
              <div style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#f1f5f9",
                marginBottom: "8px",
                lineHeight: 1.3,
              }}>
                {lead.address}
              </div>
              <div style={{
                fontSize: "11px",
                color: "#94a3b8",
                marginBottom: "10px",
              }}>
                {lead.city}, {lead.state} {lead.zip}
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#ffffff",
                  backgroundColor: getScoreBadgeColor(lead.distress_score),
                }}>
                  Score: {lead.distress_score}
                </span>
                <span style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                }}>
                  {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                </span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4px 12px",
                fontSize: "11px",
                marginBottom: "10px",
              }}>
                <div>
                  <span style={{ color: "#64748b" }}>Type</span>
                  <div style={{ color: "#cbd5e1", fontWeight: 500 }}>
                    {lead.property_type_label}
                  </div>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Est. Value</span>
                  <div style={{ color: "#cbd5e1", fontWeight: 500 }}>
                    {formatValue(lead.estimated_value)}
                  </div>
                </div>
                <div style={{ gridColumn: "span 2", marginTop: "2px" }}>
                  <span style={{ color: "#64748b" }}>Signals</span>
                  <span style={{ color: "#cbd5e1", fontWeight: 500, marginLeft: "6px" }}>
                    {lead.signals.length} detected
                  </span>
                </div>
              </div>

              <Link
                href={`/leads/${lead.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#818cf8",
                  textDecoration: "none",
                }}
              >
                View Details &rarr;
              </Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
