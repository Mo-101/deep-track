"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Cloud,
  CloudRain,
  Droplets,
  Wind,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sun,
  CloudLightning,
  CloudSnow,
} from "lucide-react"
import { getWeatherByCity, getWeatherIconUrl, formatDate, type WeatherData } from "@/lib/weather-service"
import Image from "next/image"

export function WeatherPanel() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWeatherData()
  }, [])

  const fetchWeatherData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Default to New York if geolocation is not available
      const data = await getWeatherByCity("New York", "imperial")
      setWeatherData(data)
    } catch (err) {
      console.error("Failed to fetch weather data:", err)
      setError("Failed to load weather data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="h-8 w-8 text-yellow-400" />
      case "clouds":
        return <Cloud className="h-8 w-8 text-gray-400" />
      case "rain":
      case "drizzle":
        return <CloudRain className="h-8 w-8 text-blue-400" />
      case "thunderstorm":
        return <CloudLightning className="h-8 w-8 text-purple-400" />
      case "snow":
        return <CloudSnow className="h-8 w-8 text-blue-200" />
      default:
        return <Cloud className="h-8 w-8 text-primary" />
    }
  }

  return (
    <Card className="w-72 bg-black/80 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/20">
      <CardHeader className="pb-1 pt-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            <span className="animate-pulse">⚡</span> WEATHER MONITOR
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={fetchWeatherData} disabled={isLoading}>
              <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin text-cyan-400" : "text-gray-400"}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleCollapse}>
              {isCollapsed ? (
                <ChevronDown className="h-3 w-3 text-gray-400" />
              ) : (
                <ChevronUp className="h-3 w-3 text-gray-400" />
              )}
            </Button>
          </div>
        </div>
        {!isCollapsed && weatherData && (
          <CardDescription className="text-xs text-cyan-300">
            {weatherData.location.name}, {weatherData.location.country}
          </CardDescription>
        )}
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="pt-0 pb-3">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <RefreshCw className="h-6 w-6 animate-spin text-cyan-400" />
            </div>
          ) : error ? (
            <div className="py-3 text-center text-xs text-red-400">{error}</div>
          ) : weatherData ? (
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-7">
                <TabsTrigger value="current" className="text-xs">
                  Current
                </TabsTrigger>
                <TabsTrigger value="forecast" className="text-xs">
                  Forecast
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {weatherData.current.weather.icon ? (
                      <div className="relative h-10 w-10">
                        <Image
                          src={getWeatherIconUrl(weatherData.current.weather.icon) || "/placeholder.svg"}
                          alt={weatherData.current.weather.description}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      getWeatherIcon(weatherData.current.weather.main)
                    )}
                    <div>
                      <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        {weatherData.current.temp}°F
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{weatherData.current.weather.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    <div className="flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-gray-300">{weatherData.current.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-gray-300">{weatherData.current.wind_speed} mph</span>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Cloud Cover</span>
                    <span className="text-cyan-300">{weatherData.current.clouds}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${weatherData.current.clouds}%` }}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="forecast">
                <div className="py-3 space-y-2">
                  <p className="text-xs text-gray-400">5-Day Forecast</p>
                  <div className="grid grid-cols-5 gap-1 pt-1">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <span className="text-[10px] text-cyan-300">{formatDate(day.dt)}</span>
                        {day.weather.icon ? (
                          <div className="relative h-6 w-6 my-1">
                            <Image
                              src={getWeatherIconUrl(day.weather.icon) || "/placeholder.svg"}
                              alt={day.weather.description}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          getWeatherIcon(day.weather.main)
                        )}
                        <span className="text-[10px] font-medium text-gray-300">{day.temp.day}°</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="py-3 text-center text-xs text-gray-400">Unable to load weather data</div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
