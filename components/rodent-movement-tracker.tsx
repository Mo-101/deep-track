"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, MousePointer, Activity } from "lucide-react"
import type { RodentSighting } from "@/lib/real-time-service"

interface RodentMovementTrackerProps {
  onSelectColony: (colonyId: string) => void
  onTrackMovement: (movements: RodentSighting[]) => void
  trackingData?: RodentSighting[]
}

export function RodentMovementTracker({
  onSelectColony,
  onTrackMovement,
  trackingData = [],
}: RodentMovementTrackerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedColony, setSelectedColony] = useState<string>("")

  // Mock colony data - in a real implementation, this would come from the real-time service
  const colonies = [
    { id: "colony-1", name: "Colony Alpha", location: "Lagos" },
    { id: "colony-2", name: "Colony Beta", location: "Ibadan" },
    { id: "colony-3", name: "Colony Gamma", location: "Abuja" },
    { id: "colony-4", name: "Colony Delta", location: "Kano" },
  ]

  const handleColonySelect = (colonyId: string) => {
    setSelectedColony(colonyId)
    onSelectColony(colonyId)
  }

  return (
    <Card className="w-72 bg-black/80 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/20">
      <CardHeader className="pb-1 pt-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
            <span className="animate-pulse">🐀</span> RODENT MOVEMENT
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? (
              <ChevronDown className="h-3 w-3 text-gray-400" />
            ) : (
              <ChevronUp className="h-3 w-3 text-gray-400" />
            )}
          </Button>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="pt-0 pb-3">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Select Colony</label>
              <Select value={selectedColony} onValueChange={handleColonySelect}>
                <SelectTrigger className="h-8 text-xs bg-gray-900/50 border-gray-700">
                  <SelectValue placeholder="Select a colony" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {colonies.map((colony) => (
                    <SelectItem key={colony.id} value={colony.id} className="text-xs">
                      {colony.name} ({colony.location})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedColony && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Movement Activity</span>
                  <span className="text-xs text-pink-400">{trackingData.length} records</span>
                </div>

                <div className="bg-gray-900/50 rounded-md p-2 h-24 overflow-y-auto">
                  {trackingData.length > 0 ? (
                    <div className="space-y-1 text-xs">
                      {trackingData.map((sighting, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-300">{new Date(sighting.timestamp).toLocaleTimeString()}</span>
                          <span className="text-pink-300">
                            {sighting.latitude.toFixed(4)}, {sighting.longitude.toFixed(4)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-500">
                      No movement data yet
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-7 border-pink-500/30 text-pink-400 flex-1">
                    <MousePointer className="h-3 w-3 mr-1.5" />
                    Focus
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7 border-pink-500/30 text-pink-400 flex-1">
                    <Activity className="h-3 w-3 mr-1.5" />
                    Analyze
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
