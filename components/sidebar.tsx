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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[264px] flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0049B8] text-white text-sm font-bold shadow-lg shadow-[#0049B8]/25">
          NA
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 leading-tight">
            Off-Market
          </span>
          <span className="text-[11px] text-gray-500 leading-tight">
            Intelligence
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gray-100" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-0.5">
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
                        ? "bg-[#0049B8]/8 text-[#0049B8] border-l-[3px] border-[#0049B8] pl-[9px]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-transparent pl-[9px]"
                    }
                  `}
                >
                  <Icon
                    className={`h-[18px] w-[18px] flex-shrink-0 transition-colors duration-150 ${
                      isActive
                        ? "text-[#0049B8]"
                        : "text-gray-400 group-hover:text-gray-600"
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
        <div className="rounded-xl border border-[#0049B8]/15 bg-[#0049B8]/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#0049B8] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#0049B8] uppercase tracking-wider">
              Demo Mode
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-gray-400">
            Mock data — 7 US markets
          </p>
        </div>
      </div>
    </aside>
  )
}
