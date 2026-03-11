import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Sidebar } from "@/components/sidebar"
import "./globals.css"

export const metadata: Metadata = {
  title: "Off-Market Deal Sourcing | NextAutomation",
  description:
    "AI-powered off-market commercial deal sourcing system by NextAutomation. Monitor distress signals, enrich properties, score opportunities 0-100, and close deals faster across 7+ US markets.",
  icons: { icon: "/favicon.png", apple: "/logo.png" },
  openGraph: {
    title: "Off-Market Deal Sourcing | NextAutomation",
    description: "AI-powered commercial deal sourcing — monitor distress signals across 7 US markets, score opportunities 0-100, and close deals faster.",
    type: "website",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "NextAutomation Logo" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-gray-50 text-gray-900 min-h-screen flex`}
      >
        <Sidebar />
        <main className="flex-1 ml-[264px] min-h-screen">{children}</main>
      </body>
    </html>
  )
}
