"use client"

import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Upload,
  CloudUpload,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Trash2,
  Clock,
} from "lucide-react"

// ── Mock pre-populated data ──────────────────────────────
const MOCK_FILENAME = "tampa_bay_leads_march_2026.csv"
const MOCK_COLUMNS = [
  { detected: "property_address", mapped: "Address", sample: ["4201 Kennedy Blvd", "1890 Commerce Dr", "7733 Bayshore Blvd"] },
  { detected: "city", mapped: "City", sample: ["Tampa", "Clearwater", "St. Petersburg"] },
  { detected: "state", mapped: "State", sample: ["FL", "FL", "FL"] },
  { detected: "est_value", mapped: "Estimated Value", sample: ["$18,200,000", "$7,450,000", "$24,800,000"] },
  { detected: "property_type", mapped: "Asset Type", sample: ["Office", "Mixed-Use", "Multifamily"] },
  { detected: "owner_name", mapped: "Owner Entity", sample: ["Pinnacle Capital LLC", "Meridian Holdings LP", "Atlas Trust"] },
  { detected: "phone", mapped: "Phone", sample: ["(813) 555-0142", "(727) 555-0389", "(727) 555-0217"] },
  { detected: "distress_flag", mapped: "Distress Signal", sample: ["tax_delinquent", "code_violations", "cmbs_default"] },
]

const MOCK_STATS = { total: 45, valid: 42, invalid: 3 }

const MOCK_IMPORT_HISTORY = [
  {
    id: "imp-1",
    filename: "houston_distressed_feb_2026.csv",
    date: "2026-02-28",
    rows: 38,
    status: "completed" as const,
  },
  {
    id: "imp-2",
    filename: "atlanta_mixed_use_jan_2026.csv",
    date: "2026-01-15",
    rows: 52,
    status: "completed" as const,
  },
  {
    id: "imp-3",
    filename: "nashville_portfolio_dec_2025.csv",
    date: "2025-12-20",
    rows: 27,
    status: "partial" as const,
  },
]

// ── Import page ──────────────────────────────────────────
export default function ImportPage() {
  const [showPreview, setShowPreview] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    // In demo mode, just show the preview
    setShowPreview(true)
  }, [])

  const handleFileSelect = useCallback(() => {
    // In demo mode, just show the preview
    setShowPreview(true)
  }, [])

  const handleImport = useCallback(() => {
    alert("Demo mode -- in production, this imports your CSV data into the pipeline for enrichment and scoring")
  }, [])

  const handleCancel = useCallback(() => {
    setShowPreview(false)
  }, [])

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Import CSV
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Upload your own leads for enrichment and scoring
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6"
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-[var(--brand)] bg-[var(--brand-dim)]"
              : "border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--text-muted)] hover:bg-white/[0.02]"
          }`}
        >
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
              isDragOver
                ? "bg-[var(--brand-dim)] text-[var(--brand)]"
                : "bg-[var(--bg-surface)] text-[var(--text-muted)]"
            }`}
          >
            <CloudUpload className="h-7 w-7" />
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Drag and drop your CSV file here
          </span>
          <span className="mt-1 text-xs text-[var(--text-muted)]">
            or click to browse
          </span>
          <span className="mt-3 rounded-full bg-[var(--bg-surface)] px-3 py-1 text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
            Accepts .csv files
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </motion.div>

      {/* Column Mapping Preview */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          {/* File info bar */}
          <div className="flex items-center gap-3 rounded-t-xl border border-b-0 border-[var(--border)] bg-[var(--bg-card)] px-5 py-3">
            <FileText className="h-4 w-4 text-[var(--brand)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {MOCK_FILENAME}
            </span>
            <div className="ml-auto flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <span className="font-mono font-semibold text-[var(--text-primary)]">
                  {MOCK_STATS.total}
                </span>{" "}
                rows detected
              </span>
              <span className="text-[var(--border)]">|</span>
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                {MOCK_STATS.valid} valid
              </span>
              <span className="flex items-center gap-1 text-xs text-red-400">
                <XCircle className="h-3 w-3" />
                {MOCK_STATS.invalid} invalid
              </span>
            </div>
          </div>

          {/* Column mapping table */}
          <div className="overflow-hidden rounded-b-xl border border-[var(--border)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg-surface)]">
                    <th className="px-4 py-2.5 text-xs font-medium text-[var(--text-muted)] whitespace-nowrap">
                      Detected Column
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-[var(--text-muted)] whitespace-nowrap">
                      &nbsp;
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-[var(--text-muted)] whitespace-nowrap">
                      Maps To
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-[var(--text-muted)] whitespace-nowrap">
                      Row 1
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-[var(--text-muted)] whitespace-nowrap">
                      Row 2
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-[var(--text-muted)] whitespace-nowrap">
                      Row 3
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[var(--bg-card)]">
                  {MOCK_COLUMNS.map((col) => (
                    <tr
                      key={col.detected}
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-[var(--text-secondary)]">
                          {col.detected}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <ArrowRight className="inline h-3 w-3 text-[var(--text-muted)]" />
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-[var(--brand-dim)] px-2.5 py-0.5 text-xs font-medium text-[var(--brand)]">
                          {col.mapped}
                        </span>
                      </td>
                      {col.sample.map((val, i) => (
                        <td
                          key={i}
                          className="px-4 py-3 text-xs text-[var(--text-secondary)] whitespace-nowrap"
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleImport}
              className="flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              <Upload className="h-4 w-4" />
              Import All Valid ({MOCK_STATS.valid} rows)
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/[0.04] hover:text-[var(--text-primary)]"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Import History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: showPreview ? 0.2 : 0.15 }}
      >
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
          Import History
        </h2>
        <div className="overflow-hidden rounded-xl border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-surface)]">
                <th className="px-5 py-3 text-xs font-medium text-[var(--text-muted)]">
                  Filename
                </th>
                <th className="px-5 py-3 text-xs font-medium text-[var(--text-muted)]">
                  Date
                </th>
                <th className="px-5 py-3 text-xs font-medium text-[var(--text-muted)]">
                  Rows Imported
                </th>
                <th className="px-5 py-3 text-xs font-medium text-[var(--text-muted)]">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-medium text-[var(--text-muted)]">
                  &nbsp;
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--bg-card)]">
              {MOCK_IMPORT_HISTORY.map((imp) => (
                <tr
                  key={imp.id}
                  className="border-b border-[var(--border)] last:border-b-0"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[var(--text-muted)]" />
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {imp.filename}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <Clock className="h-3 w-3 text-[var(--text-muted)]" />
                      {imp.date}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono text-[var(--text-primary)]">
                    {imp.rows}
                  </td>
                  <td className="px-5 py-3.5">
                    {imp.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                        <AlertTriangle className="h-3 w-3" />
                        Partial
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-white/[0.04] hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
