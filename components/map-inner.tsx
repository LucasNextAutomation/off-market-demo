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
  hot: "#dc2626",
  strong: "#d97706",
  watch: "#4f46e5",
  archive: "#9ca3af",
}

const PRIORITY_RADIUS: Record<Priority, number> = {
  hot: 7,
  strong: 6,
  watch: 5,
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
  if (score >= 85) return "#dc2626"
  if (score >= 70) return "#d97706"
  if (score >= 50) return "#4f46e5"
  return "#9ca3af"
}

export default function MapInner({ leads, onLeadClick }: MapInnerProps) {
  return (
    <MapContainer
      center={[37.5, -96]}
      zoom={4}
      style={{ height: "100%", width: "100%", background: "#f0f4f8" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png"
      />

      {leads.map((lead) => (
        <CircleMarker
          key={lead.id}
          center={[lead.latitude, lead.longitude]}
          radius={PRIORITY_RADIUS[lead.priority]}
          pathOptions={{
            color: "#ffffff",
            weight: 2,
            fillColor: PRIORITY_COLORS[lead.priority],
            fillOpacity: 0.85,
          }}
          eventHandlers={{
            click: () => onLeadClick?.(lead.id),
          }}
        >
          <Popup>
            <div style={{
              fontFamily: "system-ui, sans-serif",
              color: "#0f172a",
              minWidth: "230px",
              padding: "4px 2px",
            }}>
              <div style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#0f172a",
                marginBottom: "4px",
                lineHeight: 1.3,
              }}>
                {lead.address}
              </div>
              <div style={{
                fontSize: "12px",
                color: "#64748b",
                marginBottom: "12px",
              }}>
                {lead.city}, {lead.state} {lead.zip}
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 10px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  color: "#ffffff",
                  backgroundColor: getScoreBadgeColor(lead.distress_score),
                }}>
                  {lead.distress_score}
                </span>
                <span style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: getScoreBadgeColor(lead.distress_score),
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  {lead.priority}
                </span>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px 16px",
                fontSize: "12px",
                marginBottom: "12px",
              }}>
                <div>
                  <span style={{ color: "#94a3b8", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</span>
                  <div style={{ color: "#1e293b", fontWeight: 500, marginTop: "1px" }}>
                    {lead.property_type_label}
                  </div>
                </div>
                <div>
                  <span style={{ color: "#94a3b8", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Est. Value</span>
                  <div style={{ color: "#1e293b", fontWeight: 600, marginTop: "1px" }}>
                    {formatValue(lead.estimated_value)}
                  </div>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <span style={{ color: "#94a3b8", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Signals</span>
                  <span style={{ color: "#1e293b", fontWeight: 500, marginLeft: "8px" }}>
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
                  color: "#0049B8",
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
