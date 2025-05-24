import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { RealTimeProvider } from "@/components/real-time-provider"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DeepTrack - Weather Monitoring & Risk Assessment",
  description: "Advanced weather monitoring and risk assessment system",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark-blue" enableSystem disableTransitionOnChange>
          <RealTimeProvider>{children}</RealTimeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
