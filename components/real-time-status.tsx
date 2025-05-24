"use client"

import { useEffect, useState } from "react"
import { useRealTimeStore } from "@/lib/real-time-service"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function RealTimeStatus() {
  const isConnected = useRealTimeStore((state) => state.isConnected)
  const lastUpdated = useRealTimeStore((state) => state.lastUpdated)
  const [timeSinceUpdate, setTimeSinceUpdate] = useState("")

  useEffect(() => {
    // Update time since last update every second
    const interval = setInterval(() => {
      const lastUpdate = new Date(lastUpdated).getTime()
      const now = Date.now()
      const seconds = Math.floor((now - lastUpdate) / 1000)

      if (seconds < 60) {
        setTimeSinceUpdate(`${seconds}s ago`)
      } else if (seconds < 3600) {
        setTimeSinceUpdate(`${Math.floor(seconds / 60)}m ago`)
      } else if (seconds < 86400) {
        setTimeSinceUpdate(`${Math.floor(seconds / 3600)}h ago`)
      } else {
        setTimeSinceUpdate(`${Math.floor(seconds / 86400)}d ago`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lastUpdated])

  return (
    <div className="flex items-center gap-2 text-xs">
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3 text-green-400" />
          <span className="text-gray-300">Connected</span>
          <Badge className="bg-cyan-500/20 text-cyan-300 text-[10px]">{timeSinceUpdate}</Badge>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-red-400" />
          <span className="text-gray-300">Disconnected</span>
          <Badge className="bg-red-500/20 text-red-300 text-[10px]">Reconnecting...</Badge>
        </>
      )}
    </div>
  )
}
