"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CloudOff, Info, RefreshCw } from "lucide-react"
import { useRealTimeStore, toggleOfflineMode, generateMockUpdate } from "@/lib/real-time-service"
import { toast } from "sonner"

export function OfflineModeToggle() {
  const isOfflineMode = useRealTimeStore((state) => state.isOfflineMode)
  const isConnected = useRealTimeStore((state) => state.isConnected)
  const lastConnectionAttempt = useRealTimeStore((state) => state.lastConnectionAttempt)
  const [isToggling, setIsToggling] = useState(false)
  const [showPopover, setShowPopover] = useState(false)

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

  const handleToggle = async (checked: boolean) => {
    setIsToggling(true)

    try {
      await toggleOfflineMode(checked)
      toast.success(checked ? "Switched to offline mode" : "Switched to online mode")
    } catch (error) {
      console.error("Error toggling offline mode:", error)
      toast.error("Failed to toggle offline mode")
    } finally {
      setIsToggling(false)
    }
  }

  const generateMockData = (type: "rodent" | "lassa" | "weather" | "outbreak") => {
    if (!isOfflineMode) {
      toast.error("Mock data generation is only available in offline mode")
      return
    }

    const mockEntity = generateMockUpdate(type)
    const store = useRealTimeStore.getState()

    switch (type) {
      case "rodent":
        if (mockEntity) {
          store.addRodentSighting(mockEntity)
          toast.success("Generated mock rodent sighting")
        }
        break
      case "lassa":
        if (mockEntity) {
          store.addLassaCase(mockEntity)
          toast.success("Generated mock Lassa case")
        }
        break
      case "weather":
        if (mockEntity) {
          store.addWeatherUpdate(mockEntity)
          toast.success("Generated mock weather update")
        }
        break
      case "outbreak":
        if (mockEntity) {
          store.addOutbreak(mockEntity)
          toast.success("Generated mock outbreak")
        }
        break
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <CloudOff className={`h-4 w-4 ${isOfflineMode ? "text-amber-400" : "text-gray-400"}`} />
          <Label htmlFor="offline-mode" className="text-sm text-gray-300">
            Offline Mode
          </Label>
          <Popover open={showPopover} onOpenChange={setShowPopover}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                <Info className="h-3 w-3 text-gray-400" />
                <span className="sr-only">About offline mode</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-black/90 border-cyan-500/30 text-gray-300 text-xs">
              <div className="space-y-2">
                <h4 className="font-medium text-cyan-400">About Offline Mode</h4>
                <p>
                  When enabled, the system will use simulated data instead of connecting to the database. This is useful
                  for testing or when you don't have an internet connection.
                </p>
                <p>
                  Last connection attempt: <span className="text-cyan-300">{getTimeSinceLastAttempt()}</span>
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Switch
          id="offline-mode"
          checked={isOfflineMode}
          onCheckedChange={handleToggle}
          disabled={isToggling}
          className={isOfflineMode ? "data-[state=checked]:bg-amber-500" : ""}
        />
      </div>

      {isOfflineMode && (
        <div className="pt-2 border-t border-gray-800">
          <div className="text-xs text-gray-400 mb-2">Generate Mock Data</div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs bg-black/50 border-cyan-500/30 hover:bg-cyan-950/30"
              onClick={() => generateMockData("rodent")}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Rodent
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs bg-black/50 border-red-500/30 hover:bg-red-950/30"
              onClick={() => generateMockData("lassa")}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Lassa Case
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs bg-black/50 border-amber-500/30 hover:bg-amber-950/30"
              onClick={() => generateMockData("outbreak")}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Outbreak
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
