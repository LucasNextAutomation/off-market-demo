import type { Lead, Signal, SignalType, AssetType, Operation, MarketSummary, DashboardStats } from "./types"
import { computeDistressScore, getPriority, getTimeSensitivity, SIGNAL_LABELS } from "./scoring"

// ── Seed helpers ──────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rand = seededRandom(42)
const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]
const randBetween = (min: number, max: number) => Math.round(min + rand() * (max - min))
const randFloat = (min: number, max: number) => +(min + rand() * (max - min)).toFixed(2)

// ── Markets ───────────────────────────────────────────────
interface MarketConfig {
  name: string
  state: string
  counties: string[]
  cities: string[]
  center: [number, number]
  spread: number
  leadCount: number
}

const MARKETS: MarketConfig[] = [
  {
    name: "Tampa Bay", state: "FL",
    counties: ["Hillsborough", "Pinellas", "Pasco", "Manatee"],
    cities: ["Tampa", "St. Petersburg", "Clearwater", "Sarasota", "Brandon"],
    center: [27.9506, -82.4572], spread: 0.25, leadCount: 65,
  },
  {
    name: "Houston", state: "TX",
    counties: ["Harris", "Fort Bend", "Montgomery", "Brazoria"],
    cities: ["Houston", "Sugar Land", "The Woodlands", "Katy", "Pearland"],
    center: [29.7604, -95.3698], spread: 0.35, leadCount: 55,
  },
  {
    name: "Atlanta", state: "GA",
    counties: ["Fulton", "DeKalb", "Gwinnett", "Cobb"],
    cities: ["Atlanta", "Decatur", "Marietta", "Sandy Springs", "Buckhead"],
    center: [33.749, -84.388], spread: 0.2, leadCount: 50,
  },
  {
    name: "Chicago", state: "IL",
    counties: ["Cook", "DuPage", "Lake", "Will"],
    cities: ["Chicago", "Evanston", "Oak Brook", "Schaumburg", "Naperville"],
    center: [41.8781, -87.6298], spread: 0.25, leadCount: 45,
  },
  {
    name: "Nashville", state: "TN",
    counties: ["Davidson", "Williamson", "Rutherford", "Wilson"],
    cities: ["Nashville", "Franklin", "Murfreesboro", "Brentwood", "Hendersonville"],
    center: [36.1627, -86.7816], spread: 0.2, leadCount: 40,
  },
  {
    name: "Phoenix", state: "AZ",
    counties: ["Maricopa", "Pinal"],
    cities: ["Phoenix", "Scottsdale", "Tempe", "Mesa", "Chandler"],
    center: [33.4484, -112.074], spread: 0.3, leadCount: 35,
  },
  {
    name: "Charlotte", state: "NC",
    counties: ["Mecklenburg", "Union", "Gaston", "Cabarrus"],
    cities: ["Charlotte", "Concord", "Huntersville", "Matthews", "Gastonia"],
    center: [35.2271, -80.8431], spread: 0.18, leadCount: 30,
  },
]

// ── Street names ──────────────────────────────────────────
const STREETS = [
  "Main St", "Commerce Blvd", "Market St", "Trade Center Dr", "Corporate Park Ave",
  "Financial Plaza", "Harbor View Rd", "Kennedy Blvd", "Westshore Blvd", "Bayshore Dr",
  "Peachtree St", "Magnolia Ave", "Oak Park Ln", "Industrial Pkwy", "Executive Dr",
  "Technology Way", "Innovation Ct", "Capital Blvd", "Meridian Ave", "Gateway Blvd",
  "Convention Center Dr", "Lakeside Dr", "Business Park Dr", "Metropolitan Ave", "Tower Pl",
]

const OWNER_ENTITIES = [
  "Pinnacle Capital Partners LLC", "Meridian Holdings Group LP", "Atlas Property Trust",
  "Vanguard Real Estate LLC", "Blackstone Realty LP", "Cornerstone Development Corp",
  "Summit Investment Partners", "Pacific Rim Holdings LLC", "Sterling Capital Ventures LP",
  "Heritage Property Group", "Apex Real Estate Trust", "Nova Capital Investments LLC",
  "Landmark Holdings Corp", "Empire State Realty LP", "Gateway Property Partners LLC",
  "Patriot Investment Trust", "Sunbelt Capital Group LLC", "Continental Asset Holdings LP",
  "Crown Equity Partners", "Liberty Real Estate Corp", "Zenith Property Ventures LLC",
  "Coastal Capital Holdings LP", "Frontier Investment Group", "Olympus Realty Partners LLC",
  "Cascade Property Trust", "Eagle Rock Holdings LP", "Urban Core Capital LLC",
  "Riverside Asset Management", "Northern Star Realty Corp", "Beacon Hill Investments LLC",
]

const OWNER_NAMES = [
  "Robert Chen", "Michael Torres", "David Kim", "James Wilson", "Richard Park",
  "Christopher Lee", "Thomas Brown", "Daniel Garcia", "Andrew Martinez", "Steven Anderson",
  "Mark Thompson", "Paul Robinson", "Kevin White", "Brian Harris", "Eric Clark",
  "Gregory Lewis", "Jeffrey Walker", "Ronald Hall", "Timothy Allen", "Patrick Young",
]

const ZONING_CODES = ["C-3", "MU-2", "B-4", "PD-MU", "R-4/MF", "TOD-3", "CBD-1", "I-1", "O-2", "MXD"]

// ── Signal generation ─────────────────────────────────────
const SIGNAL_TYPES_BY_ASSET: Record<AssetType, SignalType[]> = {
  "distressed-office": ["cmbs_default", "maturity_default", "high_vacancy", "code_violations", "tax_delinquent", "bankruptcy", "lis_pendens"],
  "mixed-use-dev": ["rezoning", "expired_entitlements", "opportunity_zone", "environmental", "extended_ownership", "tax_delinquent"],
  "value-add-multifamily": ["tax_delinquent", "code_violations", "extended_ownership", "estate_transfer", "high_vacancy", "lis_pendens", "maturity_default"],
}

const SOURCES = ["County Recorder", "SEC EDGAR", "Tax Assessor", "Municipal Code Enforcement", "PACER", "State Court Filing", "EPA ECHO", "Zoning Board"]

function generateSignals(assetType: AssetType, count: number): Signal[] {
  const pool = SIGNAL_TYPES_BY_ASSET[assetType]
  const used = new Set<SignalType>()
  const signals: Signal[] = []

  for (let i = 0; i < count && i < pool.length; i++) {
    let type: SignalType
    do { type = pick(pool) } while (used.has(type) && used.size < pool.length)
    if (used.has(type)) break
    used.add(type)

    const daysAgo = randBetween(1, 180)
    const date = new Date(Date.now() - daysAgo * 86400000)
    signals.push({
      type,
      label: SIGNAL_LABELS[type],
      detected_at: date.toISOString().split("T")[0],
      weight: randBetween(5, 18),
      source: pick(SOURCES),
    })
  }
  return signals
}

// ── Lead generation ───────────────────────────────────────
function generateLead(market: MarketConfig, index: number): Lead {
  const id = `lead-${market.name.toLowerCase().replace(/\s/g, "-")}-${String(index).padStart(3, "0")}`
  const city = pick(market.cities)
  const county = pick(market.counties)
  const lat = market.center[0] + (rand() - 0.5) * 2 * market.spread
  const lng = market.center[1] + (rand() - 0.5) * 2 * market.spread

  const assetType = pick<AssetType>(["distressed-office", "mixed-use-dev", "value-add-multifamily"])
  const assetLabels: Record<AssetType, string> = {
    "distressed-office": "Distressed Office",
    "mixed-use-dev": "Mixed-Use Development Site",
    "value-add-multifamily": "Value-Add Multifamily",
  }

  const signalCount = randBetween(1, 5)
  const signals = generateSignals(assetType, signalCount)
  const distressScore = computeDistressScore(signals)
  const priority = getPriority(distressScore)

  const estimatedValue = assetType === "distressed-office"
    ? randBetween(10_000_000, 55_000_000)
    : assetType === "mixed-use-dev"
      ? randBetween(10_000_000, 35_000_000)
      : randBetween(10_000_000, 30_000_000)

  const totalSf = assetType === "distressed-office"
    ? randBetween(50_000, 500_000)
    : assetType === "mixed-use-dev"
      ? randBetween(20_000, 200_000)
      : randBetween(80_000, 350_000)

  const unitsOrFloors = assetType === "value-add-multifamily"
    ? randBetween(50, 400)
    : randBetween(3, 25)

  const yearBuilt = assetType === "mixed-use-dev" ? 0 : randBetween(1965, 2010)

  const ownerEntity = pick(OWNER_ENTITIES)
  const ubo = pick(OWNER_NAMES)
  const daysAgo = randBetween(1, 120)

  return {
    id,
    address: `${randBetween(100, 9999)} ${pick(STREETS)}`,
    city,
    state: market.state,
    county,
    zip: String(randBetween(10000, 99999)),
    latitude: +lat.toFixed(5),
    longitude: +lng.toFixed(5),

    asset_type: assetType,
    property_type_label: assetLabels[assetType],
    total_sf: totalSf,
    units_or_floors: unitsOrFloors,
    year_built: yearBuilt,
    lot_acres: randFloat(0.5, 15),
    zoning: pick(ZONING_CODES),
    entitlement_status: pick(["entitled", "pending", "none"]),

    assessed_value: Math.round(estimatedValue * randFloat(0.6, 0.85)),
    estimated_value: estimatedValue,
    last_sale_date: `${randBetween(2005, 2021)}-${String(randBetween(1, 12)).padStart(2, "0")}-${String(randBetween(1, 28)).padStart(2, "0")}`,
    last_sale_price: Math.round(estimatedValue * randFloat(0.5, 0.9)),
    noi: rand() > 0.3 ? randBetween(500_000, 4_000_000) : null,
    cap_rate: rand() > 0.3 ? randFloat(4.5, 9.5) : null,
    cmbs_balance: signals.some(s => s.type === "cmbs_default" || s.type === "maturity_default")
      ? randBetween(5_000_000, 40_000_000) : null,
    cmbs_maturity: signals.some(s => s.type === "maturity_default")
      ? `${randBetween(2024, 2027)}-${String(randBetween(1, 12)).padStart(2, "0")}-01` : null,
    tax_delinquency: signals.some(s => s.type === "tax_delinquent")
      ? randBetween(50_000, 800_000) : null,

    signals,
    distress_score: distressScore,
    priority,
    time_sensitivity: getTimeSensitivity(distressScore),

    owner_entity: ownerEntity,
    owner_ubo: ubo,
    owner_portfolio_size: randBetween(2, 45),
    owner_portfolio_health: pick(["healthy", "mixed", "distressed"]),
    decision_maker: ubo,
    phone: `(${randBetween(200, 999)}) ${randBetween(200, 999)}-${String(randBetween(1000, 9999))}`,
    email: `${ubo.toLowerCase().replace(" ", ".")}@${pick(["gmail.com", "outlook.com", ownerEntity.toLowerCase().split(" ")[0] + ".com"])}`,
    mailing_address: `${randBetween(100, 9999)} ${pick(STREETS)}, ${pick(market.cities)}, ${market.state}`,

    submarket_vacancy: assetType === "distressed-office" ? randFloat(12, 38) : randFloat(3, 15),
    rent_trend_12m: randFloat(-8, 12),
    recent_comps: randBetween(2, 8),

    pipeline_status: pick(["new", "new", "new", "reviewed", "under_loi", "passed"]),
    completeness: randFloat(0.45, 1),
    created_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    updated_at: new Date(Date.now() - randBetween(0, daysAgo) * 86400000).toISOString(),
    source: pick(["County Scraper", "SEC EDGAR Parser", "Tax Assessor Scraper", "Manual Import", "CMBS Monitor"]),
  }
}

// ── Generate all leads ────────────────────────────────────
function buildAllLeads(): Lead[] {
  const leads: Lead[] = []
  for (const market of MARKETS) {
    for (let i = 0; i < market.leadCount; i++) {
      leads.push(generateLead(market, i))
    }
  }
  return leads.sort((a, b) => b.distress_score - a.distress_score)
}

export const ALL_LEADS: Lead[] = buildAllLeads()

// ── Derived data ──────────────────────────────────────────
export function getMarketSummaries(): MarketSummary[] {
  return MARKETS.map(m => {
    const marketLeads = ALL_LEADS.filter(l => l.city === m.cities[0] || m.cities.includes(l.city))
    const scores = marketLeads.map(l => l.distress_score)
    return {
      name: m.name,
      state: m.state,
      lead_count: marketLeads.length,
      avg_score: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      hot_count: marketLeads.filter(l => l.priority === "hot").length,
    }
  })
}

export function getDashboardStats(): DashboardStats {
  const scores = ALL_LEADS.map(l => l.distress_score)
  return {
    total_leads: ALL_LEADS.length,
    hot_leads: ALL_LEADS.filter(l => l.priority === "hot").length,
    strong_leads: ALL_LEADS.filter(l => l.priority === "strong").length,
    watch_leads: ALL_LEADS.filter(l => l.priority === "watch").length,
    avg_score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    markets_active: MARKETS.length,
    signals_detected: ALL_LEADS.reduce((sum, l) => sum + l.signals.length, 0),
    avg_completeness: +(ALL_LEADS.reduce((sum, l) => sum + l.completeness, 0) / ALL_LEADS.length).toFixed(2),
  }
}

export function getScoreDistribution(): { label: string; count: number }[] {
  const buckets = Array.from({ length: 10 }, (_, i) => ({
    label: `${i * 10}-${i * 10 + 10}`,
    count: 0,
  }))
  for (const lead of ALL_LEADS) {
    const idx = Math.min(Math.floor(lead.distress_score / 10), 9)
    buckets[idx].count++
  }
  return buckets
}

export function getLeadsTrend(): { date: string; count: number }[] {
  const days: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const dateStr = d.toISOString().split("T")[0]
    const count = ALL_LEADS.filter(l => l.created_at.split("T")[0] === dateStr).length
    // Add some baseline so chart isn't all zeros
    days.push({ date: dateStr, count: count + randBetween(2, 12) })
  }
  return days
}

export function getLeadById(id: string): Lead | undefined {
  return ALL_LEADS.find(l => l.id === id)
}

export function getAssetTypeCounts(): { type: string; count: number }[] {
  const map = new Map<string, number>()
  for (const l of ALL_LEADS) {
    map.set(l.property_type_label, (map.get(l.property_type_label) ?? 0) + 1)
  }
  return Array.from(map, ([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count)
}

// ── Operations ────────────────────────────────────────────
export const OPERATIONS: Operation[] = [
  {
    id: "op-1", name: "County Property Scraper", category: "scraping",
    status: "completed", icon: "Database",
    description: "Scrape county assessor portals for property data, transactions, and tax records",
    last_run: new Date(Date.now() - 3600000).toISOString(), records_processed: 1247, duration_seconds: 342, tier: "free",
  },
  {
    id: "op-2", name: "CMBS Monitor (SEC EDGAR)", category: "scraping",
    status: "completed", icon: "FileSearch",
    description: "Parse SEC EDGAR public filings for CMBS delinquency and maturity default data",
    last_run: new Date(Date.now() - 7200000).toISOString(), records_processed: 89, duration_seconds: 128, tier: "free",
  },
  {
    id: "op-3", name: "Tax Delinquency Scanner", category: "scraping",
    status: "completed", icon: "AlertTriangle",
    description: "Scan county tax collector records for delinquent commercial properties",
    last_run: new Date(Date.now() - 14400000).toISOString(), records_processed: 312, duration_seconds: 195, tier: "free",
  },
  {
    id: "op-4", name: "Owner Entity Research", category: "enrichment",
    status: "idle", icon: "Users",
    description: "Resolve LLC/LP → UBO via Secretary of State registries + skip-tracing",
    last_run: new Date(Date.now() - 86400000).toISOString(), records_processed: 156, duration_seconds: 480, tier: "paid",
  },
  {
    id: "op-5", name: "Property Enrichment", category: "enrichment",
    status: "idle", icon: "Building2",
    description: "Enrich properties with zoning, FAR, entitlements, and environmental data",
    last_run: new Date(Date.now() - 43200000).toISOString(), records_processed: 423, duration_seconds: 267, tier: "free",
  },
  {
    id: "op-6", name: "AI Deal Scoring", category: "scoring",
    status: "completed", icon: "Brain",
    description: "Multi-factor AI scoring: distress signals + buy-box fit + market timing + owner motivation",
    last_run: new Date(Date.now() - 1800000).toISOString(), records_processed: ALL_LEADS.length, duration_seconds: 45, tier: "free",
  },
  {
    id: "op-7", name: "Market Comps Engine", category: "enrichment",
    status: "idle", icon: "BarChart3",
    description: "Pull recent comparable sales and submarket vacancy/rent trends",
    last_run: new Date(Date.now() - 172800000).toISOString(), records_processed: 847, duration_seconds: 390, tier: "paid",
  },
  {
    id: "op-8", name: "Code Enforcement Scanner", category: "scraping",
    status: "idle", icon: "ShieldAlert",
    description: "Scrape municipal code enforcement databases for active violations",
    last_run: new Date(Date.now() - 259200000).toISOString(), records_processed: 78, duration_seconds: 156, tier: "free",
  },
]

export const MARKET_CONFIGS = MARKETS
