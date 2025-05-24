"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface CesiumMapLayersProps {
  onToggleNightMode: (enabled: boolean) => void
  onToggleTerrain: (enabled: boolean) => void
  onTerrainExaggeration: (value: number) => void
  onImageryOpacity: (value: number) => void
  nightMode: boolean
  terrainEnabled: boolean
  terrainExaggeration: number
  imageryOpacity: number
}

export function CesiumMapLayers({
  onToggleNightMode,
  onToggleTerrain,
  onTerrainExaggeration,
  onImageryOpacity,
  nightMode,
  terrainEnabled,
  terrainExaggeration,
  imageryOpacity,
}: CesiumMapLayersProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Card className="w-72 bg-black/80 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/20">
      <CardHeader className="pb-1 pt-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            <span className="animate-pulse">🌐</span> MAP LAYERS
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

      {!isCollapsed && <div className="p-3">{/* Content removed */}</div>}
    </Card>
  )
}
