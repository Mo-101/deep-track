"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapIcon,
  MousePointer,
  AlertTriangle,
  Thermometer,
  Droplets,
  Wind,
  ZoomIn,
  ZoomOut,
  RefreshCw,
} from "lucide-react"

// Simulated data for Nigerian states
const stateData = [
  {
    id: "edo",
    name: "Edo",
    coordinates: { x: 48, y: 58 }, // Percentage coordinates on the map
    riskLevel: "high",
    rodentActivity: 42,
    temperature: 29.5,
    humidity: 78,
    rainfall: 2.3,
    lastUpdate: "15 minutes ago",
    trend: "increasing",
  },
  {
    id: "ondo",
    name: "Ondo",
    coordinates: { x: 40, y: 52 },
    riskLevel: "moderate",
    rodentActivity: 28,
    temperature: 28.2,
    humidity: 75,
    rainfall: 1.8,
    lastUpdate: "30 minutes ago",
    trend: "stable",
  },
  {
    id: "ebonyi",
    name: "Ebonyi",
    coordinates: { x: 58, y: 48 },
    riskLevel: "critical",
    rodentActivity: 67,
    temperature: 30.1,
    humidity: 82,
    rainfall: 3.5,
    lastUpdate: "10 minutes ago",
    trend: "increasing",
  },
  {
    id: "bauchi",
    name: "Bauchi",
    coordinates: { x: 55, y: 28 },
    riskLevel: "low",
    rodentActivity: 12,
    temperature: 32.5,
    humidity: 45,
    rainfall: 0,
    lastUpdate: "25 minutes ago",
    trend: "decreasing",
  },
  {
    id: "plateau",
    name: "Plateau",
    coordinates: { x: 50, y: 35 },
    riskLevel: "moderate",
    rodentActivity: 31,
    temperature: 27.8,
    humidity: 62,
    rainfall: 0.5,
    lastUpdate: "20 minutes ago",
    trend: "stable",
  },
]

export function NigeriaMap() {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [mapZoom, setMapZoom] = useState(1)
  const [mapLayer, setMapLayer] = useState("risk")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleStateClick = (stateId: string) => {
    setSelectedState(selectedState === stateId ? null : stateId)
  }

  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 0.2, 0.8))
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500"
      case "moderate":
        return "bg-yellow-500"
      case "high":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getLayerColor = (state: (typeof stateData)[0]) => {
    switch (mapLayer) {
      case "risk":
        return getRiskColor(state.riskLevel)
      case "temperature":
        return state.temperature > 30 ? "bg-red-500" : state.temperature > 28 ? "bg-orange-500" : "bg-yellow-500"
      case "humidity":
        return state.humidity > 75 ? "bg-blue-500" : state.humidity > 60 ? "bg-cyan-500" : "bg-teal-500"
      case "rainfall":
        return state.rainfall > 2 ? "bg-blue-600" : state.rainfall > 0.5 ? "bg-blue-400" : "bg-blue-200"
      default:
        return "bg-gray-500"
    }
  }

  const getSelectedState = () => {
    return stateData.find((state) => state.id === selectedState)
  }

  return (
    <Card className="bg-black/90 backdrop-blur-md border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-mono flex items-center gap-2">
            <MapIcon className="h-4 w-4 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              NIGERIA MONITORING MAP
            </span>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 border-cyan-500/30 text-cyan-400"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 border-cyan-500/30 text-cyan-400"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 border-cyan-500/30 text-cyan-400"
              onClick={handleRefresh}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-full">
          {/* Map Area */}
          <div className="relative flex-1 min-h-[400px] border-r border-cyan-500/20">
            {/* Map Layers Control */}
            <div className="absolute top-2 left-2 z-10">
              <Tabs defaultValue="risk" value={mapLayer} onValueChange={setMapLayer}>
                <TabsList className="bg-black/70 border border-cyan-500/30 p-1 h-auto grid grid-cols-2 gap-1">
                  <TabsTrigger
                    value="risk"
                    className="px-2 py-1 h-7 text-xs data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-400"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Risk
                  </TabsTrigger>
                  <TabsTrigger
                    value="temperature"
                    className="px-2 py-1 h-7 text-xs data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-400"
                  >
                    <Thermometer className="h-3 w-3 mr-1" />
                    Temp
                  </TabsTrigger>
                  <TabsTrigger
                    value="humidity"
                    className="px-2 py-1 h-7 text-xs data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-400"
                  >
                    <Droplets className="h-3 w-3 mr-1" />
                    Humidity
                  </TabsTrigger>
                  <TabsTrigger
                    value="rainfall"
                    className="px-2 py-1 h-7 text-xs data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-400"
                  >
                    <Wind className="h-3 w-3 mr-1" />
                    Rainfall
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-2 left-2 z-10 bg-black/70 border border-cyan-500/30 p-2 rounded-md">
              <div className="text-xs text-cyan-400 mb-1">Legend</div>
              {mapLayer === "risk" && (
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-300">Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-300">Moderate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    <span className="text-gray-300">High</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="text-gray-300">Critical</span>
                  </div>
                </div>
              )}
              {mapLayer === "temperature" && (
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-300">&lt; 28°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    <span className="text-gray-300">28-30°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="text-gray-300">&gt; 30°C</span>
                  </div>
                </div>
              )}
              {mapLayer === "humidity" && (
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                    <span className="text-gray-300">&lt; 60%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                    <span className="text-gray-300">60-75%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-gray-300">&gt; 75%</span>
                  </div>
                </div>
              )}
              {mapLayer === "rainfall" && (
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-200"></div>
                    <span className="text-gray-300">&lt; 0.5mm</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                    <span className="text-gray-300">0.5-2mm</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span className="text-gray-300">&gt; 2mm</span>
                  </div>
                </div>
              )}
            </div>

            {/* Nigeria Map */}
            <div
              className="relative w-full h-full bg-[url('/placeholder.svg?height=600&width=600')] bg-no-repeat bg-contain bg-center"
              style={{
                backgroundImage: "url('/nigeria-map-outline.svg')",
                transform: `scale(${mapZoom})`,
                transition: "transform 0.3s ease",
              }}
            >
              {/* State Markers */}
              {stateData.map((state) => (
                <motion.div
                  key={state.id}
                  className={`absolute cursor-pointer ${selectedState === state.id ? "z-20" : "z-10"}`}
                  style={{
                    left: `${state.coordinates.x}%`,
                    top: `${state.coordinates.y}%`,
                  }}
                  onClick={() => handleStateClick(state.id)}
                  whileHover={{ scale: 1.2 }}
                  animate={
                    selectedState === state.id
                      ? { scale: [1, 1.2, 1], repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }
                      : {}
                  }
                >
                  <div className={`h-4 w-4 rounded-full ${getLayerColor(state)} relative`}>
                    <div
                      className={`absolute inset-0 rounded-full ${getLayerColor(state)} opacity-50`}
                      style={{ animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }}
                    ></div>
                  </div>
                  {(selectedState === state.id || mapZoom > 1.2) && (
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-xs text-white px-1.5 py-0.5 rounded border border-cyan-500/30">
                      {state.name}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* State Details Panel */}
          <div className="w-full md:w-72 p-3 border-t md:border-t-0 border-cyan-500/20">
            {selectedState ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyan-400">{getSelectedState()?.name} State</h3>
                  <Badge className={`${getRiskColor(getSelectedState()?.riskLevel || "")} text-[10px]`}>
                    {getSelectedState()?.riskLevel.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="bg-cyan-950/20 rounded-md p-2">
                    <div className="text-xs text-gray-400 mb-1">Rodent Activity</div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-medium text-cyan-300">{getSelectedState()?.rodentActivity}</div>
                      <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-400">
                        {getSelectedState()?.trend.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-cyan-950/20 rounded-md p-2">
                      <div className="text-xs text-gray-400 mb-1">Temperature</div>
                      <div className="text-sm font-medium text-cyan-300">{getSelectedState()?.temperature}°C</div>
                    </div>
                    <div className="bg-cyan-950/20 rounded-md p-2">
                      <div className="text-xs text-gray-400 mb-1">Humidity</div>
                      <div className="text-sm font-medium text-cyan-300">{getSelectedState()?.humidity}%</div>
                    </div>
                  </div>

                  <div className="bg-cyan-950/20 rounded-md p-2">
                    <div className="text-xs text-gray-400 mb-1">Rainfall</div>
                    <div className="text-sm font-medium text-cyan-300">{getSelectedState()?.rainfall} mm</div>
                  </div>

                  <div className="text-xs text-gray-400">Last updated: {getSelectedState()?.lastUpdate}</div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/30"
                    >
                      View Detailed Report
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <MousePointer className="h-8 w-8 text-cyan-400/50 mb-2" />
                <p className="text-sm text-gray-400">Select a state on the map to view detailed information</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
