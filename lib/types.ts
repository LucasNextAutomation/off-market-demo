export type AssetType = "distressed-office" | "mixed-use-dev" | "value-add-multifamily"

export type SignalType =
  | "cmbs_default"
  | "maturity_default"
  | "lis_pendens"
  | "tax_delinquent"
  | "code_violations"
  | "high_vacancy"
  | "bankruptcy"
  | "estate_transfer"
  | "extended_ownership"
  | "environmental"
  | "rezoning"
  | "expired_entitlements"
  | "opportunity_zone"

export type Priority = "hot" | "strong" | "watch" | "archive"

export type PipelineStatus = "new" | "reviewed" | "under_loi" | "passed" | "closed"

export interface Signal {
  type: SignalType
  label: string
  detected_at: string
  weight: number
  source: string
}

export interface Lead {
  id: string
  address: string
  city: string
  state: string
  county: string
  zip: string
  latitude: number
  longitude: number

  // Property
  asset_type: AssetType
  property_type_label: string
  total_sf: number
  units_or_floors: number
  year_built: number
  lot_acres: number
  zoning: string
  entitlement_status: "entitled" | "pending" | "none"

  // Financial
  assessed_value: number
  estimated_value: number
  last_sale_date: string
  last_sale_price: number
  noi: number | null
  cap_rate: number | null
  cmbs_balance: number | null
  cmbs_maturity: string | null
  tax_delinquency: number | null

  // Distress
  signals: Signal[]
  distress_score: number
  priority: Priority
  time_sensitivity: "urgent" | "moderate" | "watch"

  // Owner
  owner_entity: string
  owner_ubo: string
  owner_portfolio_size: number
  owner_portfolio_health: "healthy" | "mixed" | "distressed"
  decision_maker: string
  phone: string
  email: string
  mailing_address: string

  // Market
  submarket_vacancy: number
  rent_trend_12m: number
  recent_comps: number

  // Meta
  pipeline_status: PipelineStatus
  completeness: number
  created_at: string
  updated_at: string
  source: string
}

export interface MarketSummary {
  name: string
  state: string
  lead_count: number
  avg_score: number
  hot_count: number
}

export interface Operation {
  id: string
  name: string
  category: "scraping" | "enrichment" | "scoring" | "export"
  status: "idle" | "running" | "completed" | "failed"
  icon: string
  description: string
  last_run: string | null
  records_processed: number
  duration_seconds: number | null
  tier: "free" | "paid"
}

export interface DashboardStats {
  total_leads: number
  hot_leads: number
  strong_leads: number
  watch_leads: number
  avg_score: number
  markets_active: number
  signals_detected: number
  avg_completeness: number
}
