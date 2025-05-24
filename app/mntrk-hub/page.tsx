"use client"

import { useState, useEffect } from "react"
import { MNTRKDeepTrackLoadingScreen } from "@/components/mntrk-deeptrack-loading-screen"
import MNTRKDeepTrackHub from "@/components/mntrk-deeptrack-hub"

export default function MNTRKHubPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {isLoading ? <MNTRKDeepTrackLoadingScreen /> : <MNTRKDeepTrackHub />}
    </div>
  )
}
