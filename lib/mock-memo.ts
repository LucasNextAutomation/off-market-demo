/* ─── Execution History ─── */
export const EXECUTION_HISTORY = [
  { id: 42, name: "245 W Tampa St — Office Tower", type: "Distressed Office", date: "Mar 10, 2026", status: "complete" as const, agents: 3 },
  { id: 41, name: "Riverwalk Mixed-Use Parcel", type: "Ground-Up Dev", date: "Mar 9, 2026", status: "complete" as const, agents: 3 },
  { id: 40, name: "Harbour Island 120-Unit", type: "Value-Add MF", date: "Mar 8, 2026", status: "complete" as const, agents: 3 },
  { id: 39, name: "Westshore Plaza Office Park", type: "Distressed Office", date: "Mar 7, 2026", status: "complete" as const, agents: 3 },
]

/* ─── Deal Summary Sections (from execution #42 — 245 W Tampa St) ─── */
export const MOCK_MEMO_SECTIONS = [
  {
    id: "opportunity",
    title: "Opportunity Overview",
    customizable: true,
    html: `
      <p>Acquire a <strong>185,000 SF Class B office tower</strong> in Downtown Tampa's CBD at a significant discount to replacement cost. The 12-story building sits on a prime 0.78-acre corner lot with structured parking for 420 vehicles and direct Riverwalk access. CMBS loan in special servicing since Q3 2025 — current owner (entity controlled by a Miami-based family office) has signaled willingness to negotiate a discounted payoff. <span class="cite-im">[IM p.2]</span> <span class="cite-im">[IM p.4]</span></p>

      <table>
        <tr><th>Parameter</th><th>Detail</th></tr>
        <tr><td>Asset</td><td>245 W Tampa Street — 12-story Class B Office Tower</td></tr>
        <tr><td>Location</td><td>245 W Tampa St, Tampa, FL 33602 (CBD)</td></tr>
        <tr><td>Site</td><td>0.78 acres, corner lot with Riverwalk frontage</td></tr>
        <tr><td>Year Built / Renovated</td><td>1986 / Lobby refresh 2018</td></tr>
        <tr><td>Total SF</td><td>185,000 SF (rentable), 12 floors</td></tr>
        <tr><td>Parking</td><td>420 spaces (structured garage, 2.3:1,000 ratio)</td></tr>
        <tr><td>Zoning</td><td>CBD-2 — allows office, residential, mixed-use (FAR 12.0)</td></tr>
        <tr><td>CMBS Loan</td><td>$28.4M outstanding (originated 2019, 10yr I/O, 4.15%)</td></tr>
        <tr><td>Asking Price</td><td>$14.5M ($78/SF) <span class="cite-im">[IM p.3]</span></td></tr>
      </table>

      <blockquote>Tampa CBD office vacancy stands at 22.4% — but well-located, converted or repositioned assets are leasing at $38–42/SF full-service. At $78/SF acquisition cost, the basis provides a compelling entry for either office repositioning or residential conversion under the CBD-2 zoning overlay.</blockquote>
    `,
  },
  {
    id: "market-analysis",
    title: "Market & Location Analysis",
    customizable: true,
    html: `
      <h3>Tampa CBD Office Market</h3>
      <p>Tampa's CBD office market continues to experience elevated vacancy driven by remote work normalization, but <strong>absorption turned positive in Q4 2025</strong> for the first time in 8 quarters. Class A rents are holding at $42–48/SF, while Class B repositioned product is achieving $34–38/SF. <span class="cite-web">[CoStar Q4 2025]</span></p>
      <ul>
        <li><strong>Vacancy Rate:</strong> 22.4% overall, 18.1% Class A, 28.7% Class B <span class="cite-web">[CoStar]</span></li>
        <li><strong>Net Absorption:</strong> +62,000 SF in Q4 2025 (first positive quarter since Q4 2023) <span class="cite-web">[CoStar]</span></li>
        <li><strong>Asking Rent:</strong> $36.80/SF avg full-service (Class B), $44.20/SF (Class A) <span class="cite-web">[CBRE MarketView]</span></li>
        <li><strong>CMBS Delinquency:</strong> Tampa CBD office CMBS delinquency at 14.2% — up from 6.8% in 2024 <span class="cite-web">[Trepp Q1 2026]</span></li>
      </ul>

      <h3>Conversion Opportunity</h3>
      <p>Tampa has approved 2,400+ residential conversion units since 2023. The CBD-2 zoning overlay at 245 W Tampa allows residential by-right with FAR 12.0 — no rezoning required. The city's Live Local Act compliance further incentivizes conversions with property tax exemptions for affordable set-asides. <span class="cite-web">[Tampa Planning Commission]</span></p>

      <h3>Comparable Transactions (Last 12 Months)</h3>
      <table>
        <tr><th>Property</th><th>SF</th><th>Price/SF</th><th>Notes</th></tr>
        <tr><td>400 N Tampa (Class B)</td><td>165,000</td><td>$85/SF</td><td>Distressed sale, 42% vacant</td></tr>
        <tr><td>501 E Kennedy (Class B)</td><td>142,000</td><td>$92/SF</td><td>CMBS special servicing</td></tr>
        <tr><td>100 S Ashley (Class A)</td><td>310,000</td><td>$195/SF</td><td>Trophy asset, 88% leased</td></tr>
        <tr><td>201 N Franklin (Class B)</td><td>98,000</td><td>$72/SF</td><td>Conversion candidate, sold to developer</td></tr>
      </table>
      <p><span class="cite-web">[CoStar / Real Capital Analytics]</span></p>

      <h3>Demographics & Demand Drivers</h3>
      <table>
        <tr><th>Metric</th><th>Value</th></tr>
        <tr><td>Tampa MSA Population</td><td>3.35M (+1.8% YoY)</td></tr>
        <tr><td>Median Household Income</td><td>$68,400</td></tr>
        <tr><td>Unemployment</td><td>3.1%</td></tr>
        <tr><td>Major Employers</td><td>BayCare, USF, Raymond James, USAA, Citigroup, JPMorgan</td></tr>
        <tr><td>CBD Residential Units (Pipeline)</td><td>4,200+ (2024–2027)</td></tr>
      </table>
      <p><span class="cite-web">[Census / BLS 2025]</span></p>
    `,
  },
  {
    id: "asset-assessment",
    title: "Asset Assessment",
    customizable: true,
    html: `
      <h3>Building Configuration</h3>
      <p>The 12-story tower features a typical 15,400 SF floor plate with concrete frame construction, curtain wall facade (double-pane), and central core design. The 2018 lobby renovation modernized common areas, but floors 4–12 remain in original 2002-refresh condition with outdated MEP systems. <span class="cite-im">[IM p.6]</span></p>

      <h3>Current Occupancy</h3>
      <table>
        <tr><th>Floor</th><th>Tenant</th><th>SF</th><th>Lease Exp.</th><th>Rent/SF</th></tr>
        <tr><td>1–2</td><td>Lobby / Retail (vacant)</td><td>22,000</td><td>—</td><td>—</td></tr>
        <tr><td>3</td><td>Hillsborough County (gov)</td><td>15,400</td><td>Dec 2027</td><td>$24.50</td></tr>
        <tr><td>4–5</td><td>VACANT</td><td>30,800</td><td>—</td><td>—</td></tr>
        <tr><td>6</td><td>Regional law firm</td><td>15,400</td><td>Jun 2026</td><td>$28.00</td></tr>
        <tr><td>7–8</td><td>VACANT</td><td>30,800</td><td>—</td><td>—</td></tr>
        <tr><td>9</td><td>Tech startup (sublease)</td><td>8,200</td><td>Mar 2026</td><td>$22.00</td></tr>
        <tr><td>10–12</td><td>VACANT</td><td>46,200</td><td>—</td><td>—</td></tr>
        <tr><td colspan="2"><strong>Total Occupied</strong></td><td><strong>39,000 SF (21%)</strong></td><td></td><td></td></tr>
      </table>
      <p><span class="cite-im">[IM p.8–10]</span></p>

      <h3>Condition Assessment</h3>
      <ul>
        <li><strong>Structure:</strong> Concrete frame in good condition — no signs of structural distress <span class="cite-im">[IM p.12]</span></li>
        <li><strong>Envelope:</strong> Curtain wall needs resealing (2–3 leaks reported on upper floors) <span class="cite-im">[IM p.12]</span></li>
        <li><strong>HVAC:</strong> Original 1986 chillers — at end of useful life, replacement required <span class="cite-im">[IM p.13]</span></li>
        <li><strong>Elevators:</strong> 4 passenger + 1 freight — modernized 2015, serviceable <span class="cite-im">[IM p.13]</span></li>
        <li><strong>Electrical:</strong> 2,400A service, adequate for office; residential conversion would require panel upgrades <span class="cite-model">[ESTIMATED]</span></li>
        <li><strong>Code Violations:</strong> 2 active — fire suppression inspection overdue, exterior lighting <span class="cite-im">[IM p.14]</span></li>
      </ul>
    `,
  },
  {
    id: "financial-analysis",
    title: "Financial Analysis",
    customizable: true,
    html: `
      <h3>Scenario A: Office Repositioning</h3>
      <table>
        <tr><th>Line Item</th><th>Amount</th><th>Source</th></tr>
        <tr><td>Acquisition</td><td>$14.5M ($78/SF)</td><td><span class="cite-im">[IM p.3]</span></td></tr>
        <tr><td>Renovation (TI + base building)</td><td>$4.8M ($26/SF)</td><td><span class="cite-model">[ESTIMATED]</span></td></tr>
        <tr><td>Leasing Commissions</td><td>$1.2M</td><td><span class="cite-model">[ESTIMATED]</span></td></tr>
        <tr><td>Carry & Soft Costs</td><td>$1.8M</td><td><span class="cite-model">[ESTIMATED]</span></td></tr>
        <tr><td><strong>Total Basis</strong></td><td><strong>$22.3M ($121/SF)</strong></td><td></td></tr>
        <tr><td>Stabilized NOI (85% occ, $34/SF)</td><td>$3.1M</td><td><span class="cite-model">[MODELED]</span></td></tr>
        <tr><td>Stabilized Yield on Cost</td><td>13.9%</td><td><span class="cite-model">[MODELED]</span></td></tr>
        <tr><td>Exit Value (7.0% cap)</td><td>$44.3M</td><td><span class="cite-model">[MODELED]</span></td></tr>
      </table>

      <h3>Scenario B: Residential Conversion (130 Units)</h3>
      <table>
        <tr><th>Line Item</th><th>Amount</th><th>Source</th></tr>
        <tr><td>Acquisition</td><td>$14.5M</td><td><span class="cite-im">[IM p.3]</span></td></tr>
        <tr><td>Hard Costs (conversion)</td><td>$18.2M ($140/SF)</td><td><span class="cite-model">[ESTIMATED]</span></td></tr>
        <tr><td>Soft Costs (arch, permits, legal)</td><td>$2.8M</td><td><span class="cite-model">[ESTIMATED]</span></td></tr>
        <tr><td>Carry & Financing</td><td>$3.2M</td><td><span class="cite-model">[ESTIMATED]</span></td></tr>
        <tr><td><strong>Total Development Cost</strong></td><td><strong>$38.7M ($298K/unit)</strong></td><td></td></tr>
        <tr><td>Stabilized NOI (130 units, $2,450 avg)</td><td>$2.4M</td><td><span class="cite-model">[MODELED]</span></td></tr>
        <tr><td>Exit Value (5.25% cap)</td><td>$45.7M</td><td><span class="cite-model">[MODELED]</span></td></tr>
      </table>

      <h3>Return Comparison</h3>
      <table>
        <tr><th>Metric</th><th>Scenario A (Office)</th><th>Scenario B (Residential)</th></tr>
        <tr><td>Gross IRR (5yr hold)</td><td>22.4%</td><td>18.1%</td></tr>
        <tr><td>Equity Multiple</td><td>2.3x</td><td>1.9x</td></tr>
        <tr><td>Peak Equity Required</td><td>$8.9M</td><td>$15.5M</td></tr>
        <tr><td>Time to Stabilization</td><td>24 months</td><td>30 months</td></tr>
        <tr><td>Yield on Cost</td><td>13.9%</td><td>6.2%</td></tr>
      </table>
      <p><span class="cite-model">[MODELED]</span> — Assumes 65% LTC at 6.5% rate, 36-month I/O period</p>
    `,
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment",
    customizable: true,
    html: `
      <ul>
        <li><strong>CMBS Resolution Risk:</strong> Loan is in special servicing — payoff negotiation may take 3–6 months. Servicer may seek higher recovery than $14.5M asking. Need to verify if borrower has authority to negotiate or if special servicer controls process. <span class="cite-im">[IM p.15]</span></li>
        <li><strong>Leasing Risk (Scenario A):</strong> Tampa CBD Class B vacancy at 28.7%. Achieving 85% occupancy requires 118,000 SF of net new leasing in a soft market — aggressive timeline. <span class="cite-web">[CoStar]</span></li>
        <li><strong>Conversion Risk (Scenario B):</strong> While CBD-2 allows residential by-right, conversion requires full MEP replacement, unit demising walls, kitchen/bath rough-ins. Hard cost estimate of $140/SF assumes no structural surprises — Phase 1 ESA and destructive testing recommended. <span class="cite-model">[ESTIMATED]</span></li>
        <li><strong>Tenant Rollover:</strong> County lease (floor 3) expires Dec 2027 — only creditworthy tenant. Law firm (floor 6) likely to vacate Jun 2026. In-place income drops from ~$930K to ~$378K by mid-2026. <span class="cite-im">[IM p.8]</span></li>
        <li><strong>Capital Markets:</strong> Interest rate environment (6.0–6.75% for transitional loans) compresses leveraged returns. Rate sensitivity: +100bps reduces IRR by ~300bps in both scenarios. <span class="cite-web">[MARKET]</span></li>
        <li><strong>Environmental:</strong> Phase 1 ESA from 2019 — clean, but building age (1986) warrants updated assessment for ACM in fireproofing and floor tile. <span class="cite-im">[IM p.16]</span></li>
      </ul>
    `,
  },
  {
    id: "recommendation",
    title: "Recommendation",
    customizable: true,
    html: `
      <blockquote><strong>Proceed to LOI — Scenario A (Office Repositioning) Preferred.</strong> The $78/SF basis is 59% below replacement cost and represents compelling value in a market showing early recovery signals. Office repositioning offers higher IRR (22.4% vs 18.1%), lower equity requirement ($8.9M vs $15.5M), and faster stabilization (24 vs 30 months). Residential conversion remains a viable alternative if leasing velocity disappoints after 12 months.</blockquote>

      <h3>Recommended Next Steps</h3>
      <ol style="padding-left:20px;margin:12px 0">
        <li style="margin-bottom:8px">Submit <strong>LOI at $13.0M</strong> ($70/SF) with 60-day due diligence period and CMBS resolution contingency</li>
        <li style="margin-bottom:8px">Engage <strong>special servicer</strong> directly to confirm payoff authority and negotiate discounted payoff terms</li>
        <li style="margin-bottom:8px">Commission <strong>updated Phase 1 ESA</strong> and building condition report with destructive testing on floors 4–5</li>
        <li style="margin-bottom:8px">Obtain <strong>3 contractor bids</strong> for base building renovation (HVAC replacement, curtain wall resealing, common area upgrades)</li>
        <li style="margin-bottom:8px">Pre-market floors 4–5 to gauge <strong>leasing velocity</strong> — target 2 LOIs before closing to de-risk underwriting</li>
        <li style="margin-bottom:8px">Model <strong>hybrid scenario</strong>: office floors 3–8 + residential conversion floors 9–12 (higher complexity but diversified income)</li>
      </ol>

      <p>At the recommended $13.0M acquisition price, Scenario A gross IRR improves to 25.8% and equity multiple to 2.5x — institutional-grade returns with a manageable risk profile for a 3-person platform.</p>
      <p><em>Prepared by: AI Investment Committee — synthesizing Market, Asset & Investment analyst inputs.</em> <span class="cite-im">[IM]</span> <span class="cite-web">[MARKET]</span> <span class="cite-model">[MODELED]</span></p>
    `,
  },
]

/* ─── Processing Pipeline Steps ─── */
export const MOCK_PROCESSING_STEPS = [
  { id: "upload", label: "Uploading document" },
  { id: "ocr", label: "Extracting text & tables (Gemini OCR)" },
  { id: "extract", label: "Identifying deal parameters" },
  { id: "segment", label: "Segmenting into analysis categories" },
  { id: "agents", label: "Running parallel analysis agents (Market · Asset · Investment)" },
  { id: "memo", label: "Generating deal summary" },
]

export const STEP_DELAYS = [800, 1400, 1200, 1600, 2200, 1600]

/* ─── Extracted Fields (from execution #42) ─── */
export const MOCK_EXTRACTED_FIELDS = {
  assetName: "245 W Tampa St — Office Tower",
  location: "245 W Tampa St, Tampa, FL 33602",
  assetType: "Class B Office (Distressed)",
  askingPrice: "$14.5M ($78/SF)",
  totalSF: "185,000 SF",
  occupancy: "21% (39,000 SF leased)",
  cmbs: "$28.4M — Special Servicing",
  zoning: "CBD-2 (FAR 12.0)",
  yearBuilt: "1986 / Lobby 2018",
  pages: 48,
}
