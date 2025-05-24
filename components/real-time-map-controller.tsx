"use client"

import { useEffect, useState, useRef } from "react"
import {
  useRealTimeStore,
  initializeRealTimeService,
  type RodentSighting,
  type LassaCase,
} from "@/lib/real-time-service"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wifi, WifiOff, Activity, CloudOff, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { OfflineModeToggle } from "@/components/offline-mode-toggle"

interface RealTimeMapControllerProps {
  mapComponent: any // Ideally: Cesium.Viewer or custom viewer type
  onNewSighting?: (sighting: RodentSighting) => void
  onNewCase?: (lassaCase: LassaCase) => void
}

export function RealTimeMapController({ mapComponent, onNewSighting, onNewCase }: RealTimeMapControllerProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const isOfflineMode = useRealTimeStore((state) => state.isOfflineMode)
  const isConnected = useRealTimeStore((state) => state.isConnected)
  const isLoading = useRealTimeStore((state) => state.isLoading)
  const lastUpdated = useRealTimeStore((state) => state.lastUpdated)
  const rodentSightings = useRealTimeStore((state) => state.rodentSightings)
  const lassaCases = useRealTimeStore((state) => state.lassaCases)
  const lastConnectionAttempt = useRealTimeStore((state) => state.lastConnectionAttempt)

  const lastSightingIdRef = useRef<string | null>(null)
  const lastCaseIdRef = useRef<string | null>(null)
  const reconnectingRef = useRef<boolean>(false)

  // Constants for time formatting
  const SECONDS_PER_MINUTE = 60
  const SECONDS_PER_HOUR = 3600

  // Init & teardown logic
  useEffect(() => {
    let cleanup: (() => void) | undefined

    const initialize = async () => {
      try {
        cleanup = await initializeRealTimeService()
        setIsInitialized(true)

        // Check if we're in offline mode
        if (useRealTimeStore.getState().isOfflineMode) {
          toast.warning("Running in offline mode with simulated data", {
            duration: 5000,
          })
        }
      } catch (error) {
        console.error("Failed to initialize real-time service:", error)
        toast.error("Failed to connect to data service, using offline mode", {
          duration: 5000,
        })
      }
    }

    initialize()

    return () => {
      if (typeof cleanup === "function") {
        cleanup()
      }
      setIsInitialized(false)
    }
  }, [])

  // New sighting handler
  useEffect(() => {
    if (rodentSightings.length > 0 && onNewSighting) {
      const latestSighting = rodentSightings[0]

      if (latestSighting.id !== lastSightingIdRef.current) {
        lastSightingIdRef.current = latestSighting.id
        onNewSighting(latestSighting)

        // Only show toast if we're not in initial loading
        if (isInitialized && !isLoading) {
          toast.success(
            `🐭 Rodent sighted at (${latestSighting.location.latitude.toFixed(2)}, ${latestSighting.location.longitude.toFixed(2)})`,
            { duration: 3000 },
          )
        }
      }
    }
  }, [rodentSightings, onNewSighting, isInitialized, isLoading])

  // New Lassa case handler
  useEffect(() => {
    if (lassaCases.length > 0 && onNewCase) {
      const latestCase = lassaCases[0]

      if (latestCase.id !== lastCaseIdRef.current) {
        lastCaseIdRef.current = latestCase.id
        onNewCase(latestCase)

        // Only show toast if we're not in initial loading
        if (isInitialized && !isLoading) {
          toast.warning(
            `🧪 New Lassa case near (${latestCase.location.latitude.toFixed(2)}, ${latestCase.location.longitude.toFixed(2)})`,
            { duration: 4000 },
          )
        }
      }
    }
  }, [lassaCases, onNewCase, isInitialized, isLoading])

  // Human-readable update age
  const getTimeSinceUpdate = () => {
    const lastUpdate = new Date(lastUpdated).getTime()
    const now = Date.now()
    const seconds = Math.floor((now - lastUpdate) / 1000)

    if (isNaN(seconds) || seconds < 0) return "unknown"
    if (seconds < SECONDS_PER_MINUTE) return `${seconds}s ago`
    if (seconds < SECONDS_PER_HOUR) return `${Math.floor(seconds / SECONDS_PER_MINUTE)}m ago`
    return `${Math.floor(seconds / SECONDS_PER_HOUR)}h ago`
  }

  // Calculate time since last connection attempt
  const getTimeSinceLastAttempt = () => {
    const lastAttempt = new Date(lastConnectionAttempt).getTime()
    const now = Date.now()
    const seconds = Math.floor((now - lastAttempt) / 1000)

    if (isNaN(seconds) || seconds < 0) return "unknown"
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  // Manual reconnection
  const handleManualReconnect = async () => {
    if (reconnectingRef.current) return

    reconnectingRef.current = true
    toast.info("Attempting to reconnect...", { duration: 2000 })

    try {
      const cleanup = await initializeRealTimeService()
      if (typeof cleanup === "function") {
        // Store the new cleanup function somewhere if needed
      }

      if (useRealTimeStore.getState().isConnected) {
        toast.success("Reconnection successful")
      } else {
        toast.error("Reconnection failed, still using offline mode")
      }
    } catch (error) {
      console.error("Manual reconnection failed:", error)
      toast.error("Reconnection failed, still using offline mode")
    } finally {
      reconnectingRef.current = false
    }
  }

  return (
    <div
      className={`absolute top-20 left-4 z-10 bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-lg p-2 text-xs transition-all duration-300 ${isExpanded ? "w-64" : "w-auto"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isInitialized || isLoading ? (
            <>
              <Loader2 className="h-3 w-3 text-cyan-400 animate-spin" />
              <span className="text-gray-300">Initializing real-time tracking...</span>
            </>
          ) : isOfflineMode ? (
            <>
              <CloudOff className="h-3 w-3 text-amber-400" />
              <span className="text-gray-300">Offline mode (simulated data)</span>
              <Badge className="bg-amber-500/20 text-amber-300 text-[10px] ml-1">{getTimeSinceUpdate()}</Badge>
            </>
          ) : isConnected ? (
            <>
              <Wifi className="h-3 w-3 text-green-400" />
              <span className="text-gray-300">Live tracking active</span>
              <Badge className="bg-cyan-500/20 text-cyan-300 text-[10px] ml-1">{getTimeSinceUpdate()}</Badge>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-red-400" />
              <span className="text-gray-300">Connection lost</span>
              <Badge className="bg-red-500/20 text-red-300 text-[10px] ml-1">Reconnecting...</Badge>
            </>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-5 w-5 ml-2" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <span className="text-gray-400">−</span> : <span className="text-gray-400">+</span>}
        </Button>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <Activity className="h-3 w-3 text-cyan-400" />
        <span className="text-gray-300">
          Tracking {rodentSightings.length} rodent sightings, {lassaCases.length} Lassa cases
        </span>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          {!isConnected && !isOfflineMode && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">Last connection attempt: {getTimeSinceLastAttempt()}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs bg-black/50 border-cyan-500/30 hover:bg-cyan-950/30"
                  onClick={handleManualReconnect}
                  disabled={reconnectingRef.current}
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${reconnectingRef.current ? "animate-spin" : ""}`} />
                  Reconnect
                </Button>
              </div>
            </div>
          )}

          <OfflineModeToggle />
        </div>
      )}
    </div>
  )
}
