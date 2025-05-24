"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Wind, Droplets, Gauge, Palette } from "lucide-react"

interface WindControlsProps {
  settings: {
    speed: number
    particleCount: number
    particleSize: number
    colorMode: string
    showStreamlines: boolean
    altitude: number
  }
  onSettingsChange: (settings: Partial<typeof settings>) => void
  isLoading: boolean
  windData: any
  fetchWindData: () => Promise<any>
  setWindData: (data: any) => void
}

export function WindControls({
  settings,
  onSettingsChange,
  isLoading,
  windData,
  fetchWindData,
  setWindData,
}: WindControlsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={`absolute right-0 top-0 z-10 h-full transition-all duration-300 ${
        isCollapsed ? "translate-x-[calc(100%-40px)]" : "translate-x-0"
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-10 top-1/2 z-20 h-20 w-10 -translate-y-1/2 rounded-l-md rounded-r-none bg-gray-900/80 text-white hover:bg-gray-800/90"
        onClick={toggleCollapse}
      >
        {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
      </Button>

      <Card className="h-full w-80 rounded-l-lg rounded-r-none border-0 bg-gray-900/80 text-white backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center text-cyan-400">
            <Wind className="mr-2 h-5 w-5" />
            Wind Visualization Controls
          </CardTitle>
          <CardDescription className="text-gray-400">Customize the wind particle simulation</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                <div className="animate-pulse-x h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"></div>
              </div>
              <p className="mt-4 text-sm text-gray-400">Loading wind data...</p>
            </div>
          ) : (
            <Tabs defaultValue="simulation">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="simulation">Simulation</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>

              <TabsContent value="simulation" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Wind Speed Multiplier</label>
                    <span className="text-xs text-gray-400">{settings.speed.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[settings.speed]}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onValueChange={([value]) => onSettingsChange({ speed: value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Particle Count</label>
                    <span className="text-xs text-gray-400">{settings.particleCount.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[settings.particleCount]}
                    min={1000}
                    max={20000}
                    step={500}
                    onValueChange={([value]) => onSettingsChange({ particleCount: value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Altitude (meters)</label>
                    <span className="text-xs text-gray-400">{settings.altitude.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[settings.altitude]}
                    min={1000}
                    max={50000}
                    step={1000}
                    onValueChange={([value]) => onSettingsChange({ altitude: value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show Streamlines</label>
                  <Switch
                    checked={settings.showStreamlines}
                    onCheckedChange={(checked) => onSettingsChange({ showStreamlines: checked })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Particle Size</label>
                    <span className="text-xs text-gray-400">{settings.particleSize.toFixed(1)}px</span>
                  </div>
                  <Slider
                    value={[settings.particleSize]}
                    min={0.5}
                    max={5}
                    step={0.1}
                    onValueChange={([value]) => onSettingsChange({ particleSize: value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Color Mode</label>
                  <Select value={settings.colorMode} onValueChange={(value) => onSettingsChange({ colorMode: value })}>
                    <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                      <SelectValue placeholder="Select color mode" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800 text-white">
                      <SelectItem value="speed">Wind Speed</SelectItem>
                      <SelectItem value="direction">Wind Direction</SelectItem>
                      <SelectItem value="altitude">Altitude</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="data" className="mt-4">
                {windData ? (
                  <div className="space-y-4">
                    <div className="rounded-md bg-gray-800 p-3">
                      <h3 className="mb-2 text-sm font-medium text-cyan-400">Current Wind Conditions</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <Wind className="mr-1 h-4 w-4 text-cyan-400" />
                          <span>Avg Speed: {windData.avgSpeed} m/s</span>
                        </div>
                        <div className="flex items-center">
                          <Gauge className="mr-1 h-4 w-4 text-cyan-400" />
                          <span>Max Speed: {windData.maxSpeed} m/s</span>
                        </div>
                        <div className="flex items-center">
                          <Droplets className="mr-1 h-4 w-4 text-cyan-400" />
                          <span>Humidity: {windData.humidity}%</span>
                        </div>
                        <div className="flex items-center">
                          <Palette className="mr-1 h-4 w-4 text-cyan-400" />
                          <span>Data Points: {windData.dataPoints}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400">
                      <p>Data source: OpenWeather API</p>
                      <p>Last updated: {new Date(windData.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                    <p>No wind data available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 bg-transparent text-white hover:bg-gray-800"
            onClick={() => {
              // Reset to defaults
              onSettingsChange({
                speed: 1.0,
                particleCount: 5000,
                particleSize: 1.5,
                colorMode: "speed",
                showStreamlines: true,
                altitude: 10000,
              })
            }}
          >
            Reset
          </Button>

          <Button
            size="sm"
            className="bg-cyan-600 text-white hover:bg-cyan-700"
            onClick={async () => {
              try {
                const data = await fetchWindData()
                setWindData(data)
              } catch (error) {
                console.error("Failed to refresh wind data:", error)
              }
            }}
          >
            Refresh Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
