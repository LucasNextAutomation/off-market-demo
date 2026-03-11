"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Map,
  Building2,
  Download,
  Cog,
  Upload,
  ExternalLink,
  FileText,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Map View", icon: Map, href: "/map" },
  { label: "Leads", icon: Building2, href: "/leads" },
  { label: "Deal Analyzer", icon: FileText, href: "/analyzer" },
  { label: "Export Center", icon: Download, href: "/export" },
  { label: "Operations", icon: Cog, href: "/operations" },
  { label: "Import CSV", icon: Upload, href: "/import" },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[264px] flex-col border-r border-gray-200 bg-white">
      {/* NextAutomation Logo */}
      <div className="px-5 py-5">
        <Link
          href="https://nextautomation.us"
          target="_blank"
          className="group flex items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-gray-50"
        >
          <div className="relative h-8 w-8 shrink-0">
            <Image
              src="/logo.png"
              alt="NextAutomation Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-900 leading-tight">
              NextAutomation
            </span>
            <span className="text-[10px] font-medium text-gray-400 leading-tight tracking-wide uppercase">
              Off-Market Intelligence
            </span>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-gray-100" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Navigation
        </p>
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

      {/* Bottom section */}
      <div className="px-4 pb-4 space-y-3">
        {/* Demo badge */}
        <div className="rounded-xl border border-[#0049B8]/12 bg-[#0049B8]/[0.03] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#0049B8] animate-pulse" />
            <span className="text-[10px] font-semibold text-[#0049B8] uppercase tracking-wider">
              Interactive Demo
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-gray-400">
            320 properties across 7 US markets
          </p>
        </div>

        {/* CTA link */}
        <a
          href="https://nextautomation.us"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition-all hover:border-[#0049B8]/30 hover:bg-[#0049B8]/[0.03] hover:text-[#0049B8]"
        >
          <span>nextautomation.us</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </aside>
  )
}
