import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Historical Data | DeepTrack",
  description: "Historical visualization of Mastomys natalensis colonies and Lassa fever cases in Nigeria",
}

export default function HistoricalDataLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-screen w-full overflow-hidden">{children}</div>
}
