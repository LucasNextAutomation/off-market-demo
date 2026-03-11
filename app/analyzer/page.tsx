"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Upload,
  Copy,
  Download,
  BookOpen,
  Check,
  RotateCcw,
  ScanSearch,
  Building2,
  MapPin,
  DollarSign,
  Ruler,
  TrendingUp,
  BarChart3,
  Play,
  Clock,
  Settings2,
  FileText,
  Shield,
  Landmark,
} from "lucide-react"
import {
  MOCK_MEMO_SECTIONS,
  MOCK_PROCESSING_STEPS,
  STEP_DELAYS,
  MOCK_EXTRACTED_FIELDS,
  EXECUTION_HISTORY,
} from "@/lib/mock-memo"

interface StepState {
  id: string
  label: string
  status: "pending" | "active" | "done"
}

const EXTRACTED_DISPLAY = [
  { key: "assetName", label: "Asset", icon: Building2 },
  { key: "location", label: "Location", icon: MapPin },
  { key: "assetType", label: "Type", icon: ScanSearch },
  { key: "askingPrice", label: "Asking Price", icon: DollarSign },
  { key: "totalSF", label: "Total SF", icon: Ruler },
  { key: "occupancy", label: "Occupancy", icon: TrendingUp },
  { key: "cmbs", label: "CMBS Loan", icon: Landmark },
  { key: "zoning", label: "Zoning", icon: BarChart3 },
] as const

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [context, setContext] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [showExtracted, setShowExtracted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [isExample, setIsExample] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [steps, setSteps] = useState<StepState[]>(
    MOCK_PROCESSING_STEPS.map((s) => ({ ...s, status: "pending" as const }))
  )
  const [elapsed, setElapsed] = useState(0)
  const [copied, setCopied] = useState(false)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const processingRef = useRef<HTMLDivElement>(null)
  const extractedRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      setFile(files[0])
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      handleFileChange(e.dataTransfer.files)
    },
    [handleFileChange]
  )

  const startProcessing = useCallback(() => {
    setSubmitted(true)
    setProcessing(true)
    setShowResults(false)
    setShowExtracted(false)
    setElapsed(0)
    setSteps(
      MOCK_PROCESSING_STEPS.map((s) => ({ ...s, status: "pending" as const }))
    )

    setTimeout(() => {
      processingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)

    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)

    let cumulativeDelay = 0
    STEP_DELAYS.forEach((delay, i) => {
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: "active" } : s
          )
        )
      }, cumulativeDelay)

      cumulativeDelay += delay

      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: "done" } : s
          )
        )
        if (MOCK_PROCESSING_STEPS[i].id === "extract") {
          setShowExtracted(true)
          setTimeout(() => {
            extractedRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
          }, 100)
        }
      }, cumulativeDelay)
    })

    setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current)
      setProcessing(false)
      setShowResults(true)
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }, cumulativeDelay + 400)
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      startProcessing()
    },
    [startProcessing]
  )

  const handleTryExample = useCallback(() => {
    setIsExample(true)
    startProcessing()
  }, [startProcessing])

  const viewPastResult = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsExample(true)
    setSubmitted(true)
    setProcessing(false)
    setShowExtracted(true)
    setShowResults(true)
    setElapsed(47)
    setSteps(
      MOCK_PROCESSING_STEPS.map((s) => ({ ...s, status: "done" as const }))
    )
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 150)
  }, [])

  const resetAnalyzer = useCallback(() => {
    setSubmitted(false)
    setProcessing(false)
    setShowResults(false)
    setShowExtracted(false)
    setFile(null)
    setContext("")
    setIsExample(false)
    setSteps(
      MOCK_PROCESSING_STEPS.map((s) => ({ ...s, status: "pending" as const }))
    )
    setElapsed(0)
    setSourcesOpen(false)
    setCopied(false)
    if (timerRef.current) clearInterval(timerRef.current)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleCopy = useCallback(() => {
    const memoText = MOCK_MEMO_SECTIONS.map(
      (s) => `## ${s.title}\n${s.html.replace(/<[^>]+>/g, "")}`
    ).join("\n\n")
    navigator.clipboard.writeText(memoText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="mx-auto max-w-[780px]">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#0049B8]/20 bg-[#0049B8]/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[2px] text-[#0049B8]">
            Development Deal Analyzer
          </span>
          <h1 className="mb-2 text-[28px] font-semibold tracking-tight text-gray-900">
            Deal Analyzer
          </h1>
          <p className="text-sm text-gray-500">
            Upload an offering memo or proforma — AI agents extract deal parameters, run parallel underwriting, and generate a full IC-ready summary
          </p>
        </motion.header>

        {/* ─── EXECUTION HISTORY ─── */}
        <div className="mb-4">
          <button
            onClick={() => setHistoryOpen((prev) => !prev)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
              historyOpen
                ? "border-[#0049B8]/30 bg-[#0049B8]/[0.03]"
                : "border-gray-200 bg-white hover:border-[#0049B8]/20"
            }`}
          >
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-[#0049B8]" />
              <span className="font-medium text-gray-900">Recent Analyses</span>
              <span className="rounded-full bg-[#0049B8]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0049B8]">
                {EXECUTION_HISTORY.length}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {historyOpen ? "Hide" : "Show"} history
            </span>
          </button>
          {historyOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="divide-y divide-gray-100">
                {EXECUTION_HISTORY.map((exec) => (
                  <button
                    key={exec.id}
                    type="button"
                    onClick={() => {
                      if (exec.id === 42) {
                        setHistoryOpen(false)
                        viewPastResult()
                      }
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                      exec.id === 42
                        ? "bg-[#0049B8]/[0.04] cursor-pointer hover:bg-[#0049B8]/[0.08]"
                        : "opacity-60 cursor-default"
                    }`}
                  >
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 text-[10px] font-bold text-gray-400">
                      #{exec.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {exec.name}
                        </span>
                        <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                          {exec.type}
                        </span>
                        {exec.id === 42 && (
                          <span className="flex-shrink-0 rounded-full bg-[#0049B8]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0049B8]">
                            View Results
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[11px] text-gray-400">
                        {exec.date} · {exec.agents} agents · {exec.status}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Check className="h-4 w-4 text-emerald-500" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ─── UPLOAD FORM ─── */}
        <div className={`card-glass p-8 ${submitted ? "opacity-50 pointer-events-none" : ""} transition-opacity`}>
          <form onSubmit={handleSubmit}>
            {/* Upload Zone */}
            <div
              onDragEnter={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !isExample && fileInputRef.current?.click()}
              className={`relative mb-5 cursor-pointer rounded-xl border-[1.5px] border-dashed p-10 text-center transition-all ${
                dragOver
                  ? "border-[#0049B8] bg-[#0049B8]/[0.03]"
                  : file || isExample
                    ? "border-[#0049B8]/40 bg-[#0049B8]/[0.02]"
                    : "border-gray-300 hover:border-[#0049B8]/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
              />
              {isExample ? (
                <>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0049B8]/10">
                    <Building2 className="h-6 w-6 text-[#0049B8]" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Example: 245 W Tampa St — Distressed Office Tower
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    48 pages — Class B Office, Tampa CBD (CMBS Special Servicing)
                  </p>
                </>
              ) : file ? (
                <>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0049B8]/10">
                    <ScanSearch className="h-6 w-6 text-[#0049B8]" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {(file.size / 1048576).toFixed(1)} MB — Ready to analyze
                  </p>
                </>
              ) : (
                <>
                  <Upload className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                  <p className="mb-1 text-sm font-medium text-gray-900">
                    Drop your offering memo here or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, PNG, JPG — up to 20 MB
                  </p>
                  <p className="mt-3 text-[11px] text-gray-400/70">
                    AI extracts deal parameters, runs market/asset/investment analysis in parallel, and generates a full IC-ready summary
                  </p>
                </>
              )}
            </div>

            {/* Optional context */}
            <div className="mb-5">
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Additional Context <span className="normal-case tracking-normal font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Target return hurdles, conversion vs. reposition preference, risk areas to focus on..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400/50 focus:border-[#0049B8]/40"
              />
            </div>

            <button
              type="submit"
              disabled={!file}
              className="w-full rounded-xl bg-gradient-to-r from-[#0049B8] to-[#003a93] py-3.5 text-[15px] font-semibold tracking-wide text-white shadow-lg shadow-[#0049B8]/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0049B8]/30 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
            >
              Analyze Deal
            </button>
          </form>

          {/* Try Example — outside the form */}
          {!submitted && (
            <>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  or
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <button
                type="button"
                onClick={handleTryExample}
                className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl border-[1.5px] border-[#0049B8]/30 py-3.5 text-[15px] font-semibold text-[#0049B8] transition-all hover:-translate-y-0.5 hover:border-[#0049B8]/60 hover:bg-[#0049B8]/[0.04] hover:shadow-lg hover:shadow-[#0049B8]/10"
              >
                <Play className="h-4 w-4" />
                Try with Example Deal
              </button>
              <p className="mt-2.5 text-center text-[11px] text-gray-400/60">
                See how it works with a real Tampa CBD distressed office tower — no upload needed
              </p>
            </>
          )}
        </div>

        {/* ─── PROCESSING PIPELINE ─── */}
        {submitted && (
          <motion.div
            ref={processingRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 scroll-mt-24"
          >
            <div className="card-glass p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">
                  Processing Pipeline
                </h2>
                <span className="rounded-full bg-gray-50 px-3 py-1 text-xs tabular-nums text-gray-400">
                  {formatTime(elapsed)}
                </span>
              </div>
              <ul className="space-y-0">
                {steps.map((step) => (
                  <li
                    key={step.id}
                    className={`flex items-center gap-3 border-b border-gray-100 py-2.5 text-sm last:border-b-0 transition-colors ${
                      step.status === "active"
                        ? "text-gray-900"
                        : step.status === "done"
                          ? "text-emerald-600"
                          : "text-gray-400"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 flex-shrink-0 rounded-full transition-colors ${
                        step.status === "active"
                          ? "animate-pulse bg-[#0049B8]"
                          : step.status === "done"
                            ? "bg-emerald-500"
                            : "bg-gray-200"
                      }`}
                    />
                    {step.label}
                    {step.status === "done" && (
                      <Check className="ml-auto h-4 w-4 text-emerald-500" />
                    )}
                  </li>
                ))}
              </ul>

              {/* Extracted Deal Info */}
              {showExtracted && (
                <motion.div
                  ref={extractedRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 overflow-hidden border-t border-gray-100 pt-4"
                >
                  <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-[#0049B8]">
                    <ScanSearch className="h-3.5 w-3.5" />
                    Extracted from OM ({MOCK_EXTRACTED_FIELDS.pages} pages)
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {EXTRACTED_DISPLAY.map(({ key, label, icon: Icon }) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: EXTRACTED_DISPLAY.findIndex(d => d.key === key) * 0.06 }}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-2.5"
                      >
                        <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-400">
                          <Icon className="h-3 w-3" />
                          {label}
                        </div>
                        <div className="text-xs font-semibold text-gray-900 leading-tight">
                          {MOCK_EXTRACTED_FIELDS[key as keyof typeof MOCK_EXTRACTED_FIELDS]}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {!showResults && processing && (
                <div className="mt-3 text-center text-xs text-gray-400">
                  Generating your deal summary...
                </div>
              )}
              {showResults && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                  Analysis complete — {formatTime(elapsed)}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── RESULTS ─── */}
        {showResults && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 scroll-mt-24"
          >
            <div className="card-glass p-8">
              {/* Results Header */}
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Deal Summary
                  </h2>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {MOCK_EXTRACTED_FIELDS.assetName} &mdash;{" "}
                    {MOCK_EXTRACTED_FIELDS.location} &mdash;{" "}
                    Generated in {formatTime(elapsed)} &mdash; 3 parallel agents
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSourcesOpen((prev) => !prev)}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-all ${
                      sourcesOpen
                        ? "border-[#0049B8] bg-[#0049B8]/[0.08] text-[#0049B8]"
                        : "border-gray-200 bg-gray-50 text-gray-400 hover:border-[#0049B8] hover:text-gray-900"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Sources
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-400 transition-all hover:border-[#0049B8] hover:text-gray-900"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-400 transition-all hover:border-[#0049B8] hover:text-gray-900">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </div>
              </div>

              {/* Source Legend */}
              <div className="mb-5 flex flex-wrap gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span className="h-2 w-2 rounded-sm bg-[#a78bfa]" />
                  IM Page Ref
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span className="h-2 w-2 rounded-sm bg-[#0049B8]" />
                  Web / Market Source
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span className="h-2 w-2 rounded-sm bg-[#f472b6]" />
                  Modeled / Estimated
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span className="h-2 w-2 rounded-sm bg-[#f59e0b]" />
                  Data Gap
                </div>
              </div>

              {/* Customization Banner */}
              <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-[#0049B8]/15 bg-[#0049B8]/[0.03] px-4 py-2.5">
                <Settings2 className="h-4 w-4 flex-shrink-0 text-[#0049B8]" />
                <p className="text-[11px] text-gray-500">
                  Each section below is <strong className="text-[#0049B8]">fully customizable</strong> — adjust analysis depth, risk framework, scenario modeling, or output format to match your IC process.
                </p>
              </div>

              {/* Sources Panel */}
              {sourcesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="rounded-xl border border-[#0049B8]/10 bg-[#0049B8]/[0.02] p-4">
                    <h3 className="mb-3 flex items-center gap-1.5 text-[13px] font-semibold text-[#0049B8]">
                      <BookOpen className="h-4 w-4" />
                      All Sources Referenced
                    </h3>
                    <ul className="space-y-2">
                      {[
                        { type: "IM", color: "#a78bfa", label: "Offering Memo Pages 2-48", detail: "245 W Tampa St — Office Tower Offering Memorandum" },
                        { type: "WEB", color: "#0049B8", label: "CoStar Q4 2025 — Tampa CBD", detail: "costar.com — vacancy, absorption, rent trends" },
                        { type: "WEB", color: "#0049B8", label: "Trepp CMBS Research Q1 2026", detail: "trepp.com — office CMBS delinquency data" },
                        { type: "WEB", color: "#0049B8", label: "CBRE MarketView Tampa", detail: "cbre.com — asking rents, leasing activity" },
                        { type: "WEB", color: "#0049B8", label: "Real Capital Analytics", detail: "rcanalytics.com — comparable office transactions" },
                        { type: "WEB", color: "#0049B8", label: "Census / BLS Demographics", detail: "Population, income, employment data" },
                        { type: "MODEL", color: "#f472b6", label: "Office Repositioning Proforma", detail: "$22.3M total basis, 13.9% yield on cost" },
                        { type: "MODEL", color: "#f472b6", label: "Residential Conversion Proforma", detail: "130 units, $38.7M TDC, 5.25% exit cap" },
                      ].map((source, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[13px]"
                        >
                          <span
                            className="flex-shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                            style={{
                              backgroundColor: `color-mix(in srgb, ${source.color} 15%, transparent)`,
                              color: source.color,
                            }}
                          >
                            {source.type}
                          </span>
                          <span className="text-gray-900">
                            {source.label}
                          </span>
                          <span className="ml-auto hidden text-xs text-gray-400 sm:block">
                            {source.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Memo Content */}
              <div className="memo-paper">
                <h1>
                  Deal Summary — {MOCK_EXTRACTED_FIELDS.assetName}
                </h1>
                <div
                  style={{
                    marginBottom: 28,
                    padding: "16px 20px",
                    border: "1px solid #d0d5dd",
                    borderLeft: "3px solid #002060",
                    background: "#f8f9fc",
                    borderRadius: "0 4px 4px 0",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: "#002060",
                      marginBottom: 10,
                    }}
                  >
                    Contents
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px 16px",
                    }}
                  >
                    {MOCK_MEMO_SECTIONS.map((section) => (
                      <a
                        key={section.id}
                        href={`#memo-${section.id}`}
                        style={{
                          fontSize: 12,
                          color: "#4472C4",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {section.title}
                      </a>
                    ))}
                  </div>
                </div>

                {MOCK_MEMO_SECTIONS.map((section) => (
                  <div key={section.id} id={`memo-${section.id}`}>
                    <h2>
                      {section.title}
                      {section.customizable && (
                        <span className="customize-badge">
                          <Settings2 style={{ width: 10, height: 10 }} />
                          Customizable
                        </span>
                      )}
                    </h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: section.html }}
                    />
                  </div>
                ))}
              </div>

              {/* New Deal Button */}
              <button
                onClick={resetAnalyzer}
                className="mt-6 flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-[13px] text-gray-400 transition-all hover:border-[#0049B8] hover:text-gray-900"
              >
                <RotateCcw className="h-4 w-4" />
                Analyze another deal
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
