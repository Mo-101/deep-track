"use client"

import type React from "react"

import { useEffect } from "react"
import { initializeRealTimeService } from "@/lib/real-time-service"

interface RealTimeProviderProps {
  children: React.ReactNode
}

export function RealTimeProvider({ children }: RealTimeProviderProps) {
  useEffect(() => {
    // Initialize real-time service with Supabase
    const cleanup = initializeRealTimeService()

    return () => {
      if (typeof cleanup === "function") {
        cleanup()
      }
    }
  }, [])

  return <>{children}</>
}
