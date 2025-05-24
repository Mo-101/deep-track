"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp, Cloud, Droplets, Thermometer, Wind } from "lucide-react"
import type { WeatherUpdate } from "@/lib/real-time-service"

interface RealTimeWeatherMonitorProps {
  onWeatherUpdate?: (weather: WeatherUpdate) => void
}

export function RealTimeWeatherMonitor({ onWeatherUpdate }: RealTimeWeatherMonitorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Mock weather data - in a real implementation, this would come from the real-time service
  const weatherData = {
    temperature: 28.5,
    humidity: 78,
    rainfall: 0,
    windSpeed: 8,
    lastUpdated: new Date().toLocaleTimeString(),
    location: "Lagos, Nigeria",
    favorableForRodents: true,
  }

  return (
    <Card className="w-72 bg-black/80 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/20">
      <CardHeader className="pb-1 pt-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
            <span className="animate-pulse">☁️</span> REAL-TIME WEATHER
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
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{weatherData.location}</span>
              <span className="text-cyan-400">{weatherData.lastUpdated}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Thermometer className="h-3.5 w-3.5 text-red-400" />
                  <span className="text-xs text-gray-300">Temperature</span>
                </div>
                <div className="text-lg font-medium text-cyan-400">{weatherData.temperature}°C</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-gray-300">Humidity</span>
                </div>
                <div className="text-lg font-medium text-cyan-400">{weatherData.humidity}%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Cloud className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs text-gray-300">Rainfall</span>
                </div>
                <div className="text-lg font-medium text-cyan-400">{weatherData.rainfall} mm</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Wind className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-xs text-gray-300">Wind</span>
                </div>
                <div className="text-lg font-medium text-cyan-400">{weatherData.windSpeed} km/h</div>
              </div>
            </div>

            <div className="pt-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Rodent Activity Risk</span>
                <span className={weatherData.favorableForRodents ? "text-red-400" : "text-green-400"}>
                  {weatherData.favorableForRodents ? "Favorable" : "Unfavorable"}
                </span>
              </div>
              <Progress
                value={weatherData.favorableForRodents ? 75 : 25}
                className="h-1.5"
                indicatorClassName={weatherData.favorableForRodents ? "bg-red-500" : "bg-green-500"}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
