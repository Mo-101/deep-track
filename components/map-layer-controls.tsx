"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, Layers, Mountain, Cloud } from "lucide-react"

interface MapLayerControlsProps {
  onToggleNightMode: () => void
  isNightMode: boolean
  onToggleTerrain: (enabled: boolean) => void
  terrainEnabled: boolean
  onSetTerrainExaggeration: (value: number) => void
  terrainExaggeration: number
  onSetImageryAlpha: (value: number) => void
  imageryAlpha: number
}

export function MapLayerControls({
  onToggleNightMode,
  isNightMode,
  onToggleTerrain,
  terrainEnabled,
  onSetTerrainExaggeration,
  terrainExaggeration,
  onSetImageryAlpha,
  imageryAlpha,
}: MapLayerControlsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedMapStyle, setSelectedMapStyle] = useState("aerial")

  const handleMapStyleChange = (value: string) => {
    setSelectedMapStyle(value)
    // In a real implementation, this would change the map style
  }

  return (
    <Card className="w-72 bg-black/80 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/20">
      <CardHeader className="pb-1 pt-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
            <span className="animate-pulse">🌎</span> MAP LAYERS
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Map Style</Label>
              <Select value={selectedMapStyle} onValueChange={handleMapStyleChange}>
                <SelectTrigger className="h-8 text-xs bg-gray-900/50 border-gray-700">
                  <SelectValue placeholder="Select map style" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="aerial" className="text-xs">
                    Aerial with Labels
                  </SelectItem>
                  <SelectItem value="street" className="text-xs">
                    Street Map
                  </SelectItem>
                  <SelectItem value="dark" className="text-xs">
                    Dark Mode
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-cyan-400" />
                <Label htmlFor="night-mode" className="text-xs text-gray-300">
                  Night Mode
                </Label>
              </div>
              <Switch
                id="night-mode"
                checked={isNightMode}
                onCheckedChange={onToggleNightMode}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mountain className="h-4 w-4 text-cyan-400" />
                <Label htmlFor="terrain" className="text-xs text-gray-300">
                  3D Terrain
                </Label>
              </div>
              <Switch
                id="terrain"
                checked={terrainEnabled}
                onCheckedChange={onToggleTerrain}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>

            {terrainEnabled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="terrain-exaggeration" className="text-xs text-gray-400">
                    Terrain Exaggeration
                  </Label>
                  <span className="text-xs text-cyan-400">{terrainExaggeration.toFixed(1)}x</span>
                </div>
                <Slider
                  id="terrain-exaggeration"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={[terrainExaggeration]}
                  onValueChange={(value) => onSetTerrainExaggeration(value[0])}
                  className="h-1.5"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="imagery-alpha" className="text-xs text-gray-400">
                  Imagery Opacity
                </Label>
                <span className="text-xs text-cyan-400">{Math.round(imageryAlpha * 100)}%</span>
              </div>
              <Slider
                id="imagery-alpha"
                min={0.1}
                max={1}
                step={0.05}
                value={[imageryAlpha]}
                onValueChange={(value) => onSetImageryAlpha(value[0])}
                className="h-1.5"
              />
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/30"
              >
                <Layers className="h-3.5 w-3.5 mr-1.5" />
                Advanced Options
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
