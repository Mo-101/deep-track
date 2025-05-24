"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layers, Settings, ChevronDown, ChevronUp } from "lucide-react"

export function ControlPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [layerOpacity, setLayerOpacity] = useState(70)
  const [showRiskLayer, setShowRiskLayer] = useState(true)
  const [mapStyle, setMapStyle] = useState("satellite")

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <Card className="w-72 bg-black/80 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/20">
      <CardHeader className="pb-1 pt-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            <span className="animate-pulse">⚙️</span> MAP CONTROLS
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleCollapse}>
            {isCollapsed ? (
              <ChevronDown className="h-3 w-3 text-gray-400" />
            ) : (
              <ChevronUp className="h-3 w-3 text-gray-400" />
            )}
          </Button>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-3 pt-0 pb-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="map-style" className="text-xs text-gray-400">
                Map Style
              </Label>
              <Select value={mapStyle} onValueChange={setMapStyle}>
                <SelectTrigger className="w-28 h-7 text-xs">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satellite" className="text-xs">
                    Satellite
                  </SelectItem>
                  <SelectItem value="terrain" className="text-xs">
                    Terrain
                  </SelectItem>
                  <SelectItem value="street" className="text-xs">
                    Street
                  </SelectItem>
                  <SelectItem value="dark" className="text-xs">
                    Dark
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <Label className="text-xs font-medium text-purple-300">Layers</Label>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-3 w-3 text-pink-400" />
                  <Label htmlFor="risk-layer" className="text-xs text-gray-300">
                    Risk Assessment Layer
                  </Label>
                </div>
                <Switch
                  id="risk-layer"
                  checked={showRiskLayer}
                  onCheckedChange={setShowRiskLayer}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="layer-opacity" className="text-xs text-gray-400">
                    Layer Opacity
                  </Label>
                  <span className="text-[10px] text-purple-300">{layerOpacity}%</span>
                </div>
                <Slider
                  id="layer-opacity"
                  min={0}
                  max={100}
                  step={1}
                  value={[layerOpacity]}
                  onValueChange={(value) => setLayerOpacity(value[0])}
                  className="h-1.5"
                />
              </div>
            </div>
          </div>

          <div className="pt-1.5 flex justify-end gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Settings className="h-3 w-3 mr-1.5 text-purple-400" />
              Advanced
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Apply
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
