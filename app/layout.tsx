import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Sidebar } from "@/components/sidebar"
import "./globals.css"

export const metadata: Metadata = {
  title: "Off-Market Deal Sourcing | NextAutomation Demo",
  description:
    "AI-powered off-market commercial deal sourcing system. Monitor distress signals, enrich properties, score opportunities, and close deals faster.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-[var(--bg-void)] text-[var(--text-primary)] min-h-screen flex`}
      >
        <Sidebar />
        <main className="flex-1 ml-[264px] min-h-screen">{children}</main>
      </body>
    </html>
  )
}
