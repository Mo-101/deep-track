"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md px-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          DeepTrack
        </h1>
        <p className="text-gray-400 mb-8 text-sm">Weather Monitoring & Risk Assessment System</p>

        <div className="relative w-full h-1 mb-4">
          <Progress
            value={progress}
            className="h-1"
            indicatorClassName="bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          <p className="text-xs text-gray-400">
            {progress < 30 && "Initializing system..."}
            {progress >= 30 && progress < 60 && "Loading map data..."}
            {progress >= 60 && progress < 90 && "Preparing weather information..."}
            {progress >= 90 && "Finalizing..."}
          </p>
        </div>
      </div>
    </div>
  )
}
