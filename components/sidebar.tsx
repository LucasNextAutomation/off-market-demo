"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Map,
  Building2,
  Download,
  Cog,
  Upload,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Map View", icon: Map, href: "/map" },
  { label: "Leads", icon: Building2, href: "/leads" },
  { label: "Export Center", icon: Download, href: "/export" },
  { label: "Operations", icon: Cog, href: "/operations" },
  { label: "Import CSV", icon: Upload, href: "/import" },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[264px] flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand)] text-white text-sm font-bold">
          NA
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
            Off-Market
          </span>
          <span className="text-[11px] text-[var(--text-secondary)] leading-tight">
            Intelligence
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-[var(--border)]" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    group flex items-center gap-3 rounded-lg px-3 py-2.5
                    text-sm font-medium transition-all duration-150
                    ${
                      isActive
                        ? "bg-[var(--brand-light)] text-[var(--brand)] border-l-2 border-[var(--brand)] pl-[10px]"
                        : "text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)] border-l-2 border-transparent pl-[10px]"
                    }
                  `}
                >
                  <Icon
                    className={`h-[18px] w-[18px] flex-shrink-0 transition-colors duration-150 ${
                      isActive
                        ? "text-[var(--brand)]"
                        : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom — Demo badge */}
      <div className="px-4 pb-5">
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.08] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Demo Mode
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-amber-200/60">
            Mock data — 7 US markets
          </p>
        </div>
      </div>
    </aside>
  )
}
