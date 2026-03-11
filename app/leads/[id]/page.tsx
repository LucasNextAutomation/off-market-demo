import { notFound } from "next/navigation"
import Link from "next/link"
import { getLeadById, ALL_LEADS } from "@/lib/mock-data"
import { formatCurrency, formatSF, formatPercent, formatDate, maskContact } from "@/lib/format"
import { SIGNAL_COLORS } from "@/lib/scoring"
import type { PipelineStatus, Priority, Signal } from "@/lib/types"
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  Phone,
  Mail,
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  User,
  Shield,
  FileText,
  Download,
  Plus,
  CheckCircle2,
} from "lucide-react"
import { LeadDetailAnimations } from "./animations"

// ── Static params for SSG ────────────────────────────────────
export function generateStaticParams() {
  return ALL_LEADS.map((lead) => ({ id: lead.id }))
}

// ── Score tier helpers ───────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 85) return "#ef4444"
  if (score >= 70) return "#f59e0b"
  if (score >= 50) return "#6366f1"
  return "#6b7280"
}

function getPriorityBadge(priority: Priority): { label: string; cls: string } {
  switch (priority) {
    case "hot":
      return { label: "HOT", cls: "badge-hot" }
    case "strong":
      return { label: "STRONG", cls: "badge-strong" }
    case "watch":
      return { label: "WATCH", cls: "badge-watch" }
    default:
      return {
        label: "ARCHIVE",
        cls: "bg-gray-100 text-gray-500 border border-gray-200 text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider",
      }
  }
}

function getStatusConfig(status: PipelineStatus): { label: string; cls: string } {
  const map: Record<PipelineStatus, { label: string; cls: string }> = {
    new: { label: "New", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
    reviewed: { label: "Reviewed", cls: "bg-gray-100 text-gray-600 border border-gray-200" },
    under_loi: { label: "Under LOI", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    passed: { label: "Passed", cls: "bg-red-50 text-red-600 border border-red-200" },
    closed: { label: "Closed", cls: "bg-gray-100 text-gray-500 border border-gray-200" },
  }
  return map[status]
}

function getSensitivityConfig(level: "urgent" | "moderate" | "watch") {
  switch (level) {
    case "urgent":
      return { label: "Urgent", dot: "bg-red-500", text: "text-red-600" }
    case "moderate":
      return { label: "Moderate", dot: "bg-amber-500", text: "text-amber-600" }
    default:
      return { label: "Watch", dot: "bg-gray-400", text: "text-gray-500" }
  }
}

function getPortfolioHealthConfig(health: "healthy" | "mixed" | "distressed") {
  switch (health) {
    case "healthy":
      return { label: "Healthy", cls: "text-emerald-600" }
    case "mixed":
      return { label: "Mixed", cls: "text-amber-600" }
    case "distressed":
      return { label: "Distressed", cls: "text-red-600" }
  }
}

// ── Card component ───────────────────────────────────────────

function Card({ title, icon: Icon, children }: {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="card-glass">
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-gray-400" />}
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

function DetailRow({ label, value, mono }: {
  label: string
  value: string | number | null | undefined
  mono?: boolean
}) {
  if (value === null || value === undefined) return null
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium text-gray-900 ${mono ? "font-mono tabular-nums" : ""}`}>
        {value}
      </span>
    </div>
  )
}

function SignalRow({ signal }: { signal: Signal }) {
  const color = SIGNAL_COLORS[signal.type]
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <span
        className="mt-0.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {signal.label}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Detected: {formatDate(signal.detected_at)}</span>
          <span>Source: {signal.source}</span>
          <span className="font-mono">Weight: {signal.weight}</span>
        </div>
      </div>
    </div>
  )
}

// ── Page component ───────────────────────────────────────────

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = getLeadById(id)

  if (!lead) {
    notFound()
  }

  const scoreColor = getScoreColor(lead.distress_score)
  const priorityBadge = getPriorityBadge(lead.priority)
  const statusConfig = getStatusConfig(lead.pipeline_status)
  const sensitivityConfig = getSensitivityConfig(lead.time_sensitivity)
  const portfolioHealth = getPortfolioHealthConfig(lead.owner_portfolio_health)
  const completenessPercent = Math.round(lead.completeness * 100)

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-8">
      {/* ── Back button ────────────────────────────────────── */}
      <Link
        href="/leads"
        className="group mb-6 inline-flex items-center gap-2 text-sm text-[#0049B8] transition-colors hover:text-[#003a93]"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to Leads
      </Link>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {lead.address}
            </h1>
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono text-lg font-bold"
              style={{ backgroundColor: `${scoreColor}26`, color: scoreColor }}
            >
              {lead.distress_score}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>
              {lead.city}, {lead.state} {lead.zip} &middot; {lead.county} County
            </span>
          </div>
        </div>
      </div>

      <LeadDetailAnimations>
        {/* ── Two-column layout ────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── LEFT COLUMN (2/3) ──────────────────────────── */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Property Details */}
            <Card title="Property Details" icon={Building2}>
              <div className="grid grid-cols-2 gap-x-8">
                <DetailRow label="Asset Type" value={lead.property_type_label} />
                <DetailRow label="Total SF" value={formatSF(lead.total_sf)} mono />
                <DetailRow
                  label={lead.asset_type === "value-add-multifamily" ? "Units" : "Floors"}
                  value={lead.units_or_floors}
                  mono
                />
                <DetailRow
                  label="Year Built"
                  value={lead.year_built > 0 ? lead.year_built : "N/A (Dev Site)"}
                  mono
                />
                <DetailRow label="Lot Acres" value={lead.lot_acres.toFixed(2)} mono />
                <DetailRow label="Zoning" value={lead.zoning} />
                <DetailRow
                  label="Entitlement Status"
                  value={lead.entitlement_status.charAt(0).toUpperCase() + lead.entitlement_status.slice(1)}
                />
              </div>
            </Card>

            {/* Financial Details */}
            <Card title="Financial Details" icon={DollarSign}>
              <div className="grid grid-cols-2 gap-x-8">
                <DetailRow label="Assessed Value" value={formatCurrency(lead.assessed_value)} mono />
                <DetailRow label="Estimated Value" value={formatCurrency(lead.estimated_value)} mono />
                <DetailRow label="Last Sale Date" value={formatDate(lead.last_sale_date)} />
                <DetailRow label="Last Sale Price" value={formatCurrency(lead.last_sale_price)} mono />
                <DetailRow
                  label="NOI"
                  value={lead.noi !== null ? formatCurrency(lead.noi) : "N/A"}
                  mono
                />
                <DetailRow
                  label="Cap Rate"
                  value={lead.cap_rate !== null ? formatPercent(lead.cap_rate) : "N/A"}
                  mono
                />
                <DetailRow
                  label="CMBS Balance"
                  value={lead.cmbs_balance !== null ? formatCurrency(lead.cmbs_balance) : "N/A"}
                  mono
                />
                <DetailRow
                  label="CMBS Maturity"
                  value={lead.cmbs_maturity !== null ? formatDate(lead.cmbs_maturity) : "N/A"}
                />
                <DetailRow
                  label="Tax Delinquency"
                  value={lead.tax_delinquency !== null ? formatCurrency(lead.tax_delinquency) : "None"}
                  mono
                />
              </div>
            </Card>

            {/* Market Context */}
            <Card title="Market Context" icon={TrendingUp}>
              <div className="grid grid-cols-2 gap-x-8">
                <DetailRow label="Submarket Vacancy" value={formatPercent(lead.submarket_vacancy)} mono />
                <DetailRow
                  label="Rent Trend (12mo)"
                  value={`${lead.rent_trend_12m > 0 ? "+" : ""}${lead.rent_trend_12m}%`}
                  mono
                />
                <DetailRow label="Recent Comps" value={`${lead.recent_comps} sales`} mono />
              </div>
            </Card>

            {/* Distress Signals */}
            <Card title="Distress Signals" icon={AlertTriangle}>
              {lead.signals.length === 0 ? (
                <p className="text-sm text-gray-500">No signals detected.</p>
              ) : (
                <div>
                  {lead.signals.map((signal, i) => (
                    <SignalRow key={`${signal.type}-${i}`} signal={signal} />
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* ── RIGHT COLUMN (1/3) ─────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Score Breakdown */}
            <Card title="Score Breakdown" icon={Shield}>
              <div className="flex flex-col items-center py-4">
                {/* Large score circle */}
                <div className="relative mb-4">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke={scoreColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(lead.distress_score / 100) * 327} 327`}
                      transform="rotate(-90 60 60)"
                      style={{ filter: `drop-shadow(0 0 6px ${scoreColor}40)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="font-mono text-3xl font-bold"
                      style={{ color: scoreColor }}
                    >
                      {lead.distress_score}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400">
                      Score
                    </span>
                  </div>
                </div>

                {/* Priority + Sensitivity */}
                <div className="flex items-center gap-3">
                  <span className={priorityBadge.cls}>{priorityBadge.label}</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${sensitivityConfig.text}`}>
                    <span className={`h-2 w-2 rounded-full ${sensitivityConfig.dot}`} />
                    {sensitivityConfig.label}
                  </span>
                </div>
              </div>
            </Card>

            {/* Owner Intelligence */}
            <Card title="Owner Intelligence" icon={User}>
              <div className="space-y-0">
                <DetailRow label="Entity" value={lead.owner_entity} />
                <DetailRow label="UBO" value={lead.owner_ubo} />
                <DetailRow label="Portfolio Size" value={`${lead.owner_portfolio_size} properties`} mono />
                <div className="flex items-baseline justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Portfolio Health</span>
                  <span className={`text-sm font-medium ${portfolioHealth.cls}`}>
                    {portfolioHealth.label}
                  </span>
                </div>
                <DetailRow label="Decision Maker" value={lead.decision_maker} />
                <div className="flex items-baseline justify-between py-2 border-b border-gray-100">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                    <Phone className="h-3 w-3" />
                    Phone
                  </span>
                  <span className="text-sm font-mono text-gray-900">
                    {maskContact(lead.phone, "phone")}
                  </span>
                </div>
                <div className="flex items-baseline justify-between py-2 border-b border-gray-100">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                    <Mail className="h-3 w-3" />
                    Email
                  </span>
                  <span className="text-sm font-mono text-gray-900">
                    {maskContact(lead.email, "email")}
                  </span>
                </div>
                <DetailRow label="Mailing Address" value={lead.mailing_address} />
              </div>
            </Card>

            {/* Actions */}
            <Card title="Actions" icon={FileText}>
              <div className="flex flex-col gap-2">
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 opacity-60 cursor-not-allowed"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as Reviewed
                </button>
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 opacity-60 cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  Export to Excel
                </button>
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0049B8] px-4 py-2.5 text-sm font-medium text-white opacity-60 cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  Add to Pipeline
                </button>
              </div>
            </Card>

            {/* Pipeline Status */}
            <div className="card-glass">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Pipeline Status
                </h3>
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${statusConfig.cls}`}>
                  {statusConfig.label}
                </span>
              </div>

              {/* Completeness */}
              <div className="mt-4">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-xs text-gray-500">Data Completeness</span>
                  <span className="font-mono text-xs font-medium text-gray-900">
                    {completenessPercent}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${completenessPercent}%`,
                      backgroundColor: completenessPercent >= 80 ? "#10b981" : completenessPercent >= 50 ? "#f59e0b" : "#ef4444",
                    }}
                  />
                </div>
              </div>

              {/* Links */}
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm text-[#0049B8] transition-colors hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Google Maps
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm text-[#0049B8] transition-colors hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  County Records
                </a>
              </div>
            </div>
          </div>
        </div>
      </LeadDetailAnimations>
    </div>
  )
}
