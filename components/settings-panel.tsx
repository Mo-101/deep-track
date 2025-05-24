"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Settings, Save, RotateCcw } from "lucide-react"
import { OfflineModeToggle } from "@/components/offline-mode-toggle"

export function SettingsPanel() {
  const [showTerrain, setShowTerrain] = useState(true)
  const [showAtmosphere, setShowAtmosphere] = useState(true)
  const [enableNightVision, setEnableNightVision] = useState(false)
  const [dataRefreshRate, setDataRefreshRate] = useState(30)
  const [mapQuality, setMapQuality] = useState(75)
  const [showNotifications, setShowNotifications] = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)

  const handleSave = () => {
    // Save settings logic would go here
    console.log("Settings saved")
  }

  const handleReset = () => {
    setShowTerrain(true)
    setShowAtmosphere(true)
    setEnableNightVision(false)
    setDataRefreshRate(30)
    setMapQuality(75)
    setShowNotifications(true)
    setAutoRotate(false)
  }

  return (
    <Card className="w-80 bg-black/80 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Settings className="w-4 h-4 mr-2 text-primary" />
            Settings
          </CardTitle>
        </div>
        <CardDescription className="text-gray-400 text-xs">Configure system preferences</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-300 mb-1">Map Settings</div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-terrain" className="text-xs text-gray-400">
              Show Terrain
            </Label>
            <Switch id="show-terrain" checked={showTerrain} onCheckedChange={setShowTerrain} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-atmosphere" className="text-xs text-gray-400">
              Show Atmosphere
            </Label>
            <Switch id="show-atmosphere" checked={showAtmosphere} onCheckedChange={setShowAtmosphere} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="night-vision" className="text-xs text-gray-400">
              Night Vision Mode
            </Label>
            <Switch id="night-vision" checked={enableNightVision} onCheckedChange={setEnableNightVision} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-rotate" className="text-xs text-gray-400">
              Auto-Rotate Camera
            </Label>
            <Switch id="auto-rotate" checked={autoRotate} onCheckedChange={setAutoRotate} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="map-quality" className="text-xs text-gray-400">
                Map Quality
              </Label>
              <span className="text-xs text-cyan-400">{mapQuality}%</span>
            </div>
            <Slider
              id="map-quality"
              min={25}
              max={100}
              step={5}
              value={[mapQuality]}
              onValueChange={(value) => setMapQuality(value[0])}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-300 mb-1">Data Settings</div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-notifications" className="text-xs text-gray-400">
              Show Notifications
            </Label>
            <Switch id="show-notifications" checked={showNotifications} onCheckedChange={setShowNotifications} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="refresh-rate" className="text-xs text-gray-400">
                Data Refresh Rate
              </Label>
              <span className="text-xs text-cyan-400">{dataRefreshRate}s</span>
            </div>
            <Slider
              id="refresh-rate"
              min={5}
              max={60}
              step={5}
              value={[dataRefreshRate]}
              onValueChange={(value) => setDataRefreshRate(value[0])}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-gray-800">
          <div className="text-sm font-medium text-gray-300 mb-1">Connection Settings</div>
          <OfflineModeToggle />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 border-t border-gray-800">
        <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
        <Button size="sm" onClick={handleSave} className="text-xs">
          <Save className="h-3 w-3 mr-1" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}
