"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, ChevronDown, ChevronUp, RefreshCw, Activity, BarChart3 } from "lucide-react"
import { getWeatherByCoordinates, type WeatherData } from "@/lib/weather-service"

interface RiskData {
  overallRisk: number
  populationDensity: number
  environmentalFactors: number
  historicalData: number
  predictionConfidence: number
  lastUpdated: string
  regions: Array<{
    name: string
    risk: number
    trend: "increasing" | "stable" | "decreasing"
  }>
}

export function RiskAssessmentPanel() {
  const [riskData, setRiskData] = useState<RiskData | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    // Fetch weather data first, then calculate risk
    const fetchData = async () => {
      setIsLoading(true)

      try {
        // Get weather data for West Africa (Nigeria - common area for Lassa fever)
        const weather = await getWeatherByCoordinates(9.082, 8.6753, "imperial")
        setWeatherData(weather)

        // Calculate risk based on weather data
        calculateRisk(weather)
      } catch (error) {
        console.error("Error fetching data for risk assessment:", error)
        // Fallback to mock data if API fails
        setRiskData({
          overallRisk: 65,
          populationDensity: 78,
          environmentalFactors: 62,
          historicalData: 55,
          predictionConfidence: 82,
          lastUpdated: new Date().toLocaleTimeString(),
          regions: [
            { name: "Lagos", risk: 72, trend: "increasing" },
            { name: "Abuja", risk: 45, trend: "stable" },
            { name: "Ibadan", risk: 63, trend: "increasing" },
            { name: "Kano", risk: 38, trend: "decreasing" },
          ],
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate risk based on weather data
  const calculateRisk = (weather: WeatherData) => {
    // In a real application, this would use complex algorithms
    // For this demo, we'll use a simplified approach

    // Higher humidity and temperature increase risk
    const humidityFactor = weather.current.humidity * 0.8
    const tempFactor = weather.current.temp > 75 ? 70 : 50

    // Calculate environmental factors based on weather
    const environmentalFactors = Math.min(Math.round((humidityFactor + tempFactor) / 2), 100)

    // Simulate population density and historical data
    const populationDensity = Math.round(Math.random() * 20) + 60
    const historicalData = Math.round(Math.random() * 20) + 50

    // Calculate overall risk
    const overallRisk = Math.round(environmentalFactors * 0.4 + populationDensity * 0.4 + historicalData * 0.2)

    // Generate regions with risk levels
    const regions = [
      {
        name: "Lagos",
        risk: Math.min(Math.round(overallRisk * 1.1), 100),
        trend: "increasing" as const,
      },
      {
        name: "Abuja",
        risk: Math.round(overallRisk * 0.7),
        trend: "stable" as const,
      },
      {
        name: "Ibadan",
        risk: Math.round(overallRisk * 0.95),
        trend: "increasing" as const,
      },
      {
        name: "Kano",
        risk: Math.round(overallRisk * 0.6),
        trend: "decreasing" as const,
      },
    ]

    setRiskData({
      overallRisk,
      populationDensity,
      environmentalFactors,
      historicalData,
      predictionConfidence: Math.round(Math.random() * 10) + 75,
      lastUpdated: new Date().toLocaleTimeString(),
      regions,
    })
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const getRiskLevel = (risk: number) => {
    if (risk < 30) return { level: "Low", color: "bg-green-500" }
    if (risk < 60) return { level: "Moderate", color: "bg-yellow-500" }
    if (risk < 80) return { level: "High", color: "bg-orange-500" }
    return { level: "Severe", color: "bg-red-500" }
  }

  const getTrendIcon = (trend: "increasing" | "stable" | "decreasing") => {
    switch (trend) {
      case "increasing":
        return <span className="text-red-500">↑</span>
      case "stable":
        return <span className="text-yellow-500">→</span>
      case "decreasing":
        return <span className="text-green-500">↓</span>
    }
  }

  return (
    <Card className="w-72 bg-black/80 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/20">
      <CardHeader className="pb-1 pt-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-red-400 to-amber-300 bg-clip-text text-transparent">
            <span className="animate-pulse">🔍</span> RISK ASSESSMENT
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
        <CardContent className="pt-0 pb-3">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <RefreshCw className="h-6 w-6 animate-spin text-amber-400" />
            </div>
          ) : riskData ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-7">
                <TabsTrigger value="overview" className="text-xs">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="details" className="text-xs">
                  Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-3 pt-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Overall Risk Level</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] py-0 h-5 ${getRiskLevel(riskData.overallRisk).level === "High" || getRiskLevel(riskData.overallRisk).level === "Severe" ? "border-red-500 text-red-500" : "border-yellow-500 text-yellow-500"}`}
                    >
                      {getRiskLevel(riskData.overallRisk).level}
                    </Badge>
                  </div>

                  <Progress
                    value={riskData.overallRisk}
                    className="h-1.5"
                    indicatorClassName={`${getRiskLevel(riskData.overallRisk).color} animate-pulse`}
                  />
                </div>

                <div className="pt-1.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3 w-3 text-amber-400" />
                      <span className="text-gray-300">Population Density</span>
                    </div>
                    <span className="text-amber-300">{riskData.populationDensity}%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="h-3 w-3 text-amber-400" />
                      <span className="text-gray-300">Prediction Confidence</span>
                    </div>
                    <span className="text-amber-300">{riskData.predictionConfidence}%</span>
                  </div>
                </div>

                <div className="pt-1.5 text-[10px] text-gray-500">Last updated: {riskData.lastUpdated}</div>
              </TabsContent>

              <TabsContent value="details" className="pt-3">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-amber-300">Risk Factors</span>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Population Density</span>
                          <span className="text-gray-300">{riskData.populationDensity}%</span>
                        </div>
                        <Progress value={riskData.populationDensity} className="h-1 mt-1" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Environmental Factors</span>
                          <span className="text-gray-300">{riskData.environmentalFactors}%</span>
                        </div>
                        <Progress value={riskData.environmentalFactors} className="h-1 mt-1" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Historical Data</span>
                          <span className="text-gray-300">{riskData.historicalData}%</span>
                        </div>
                        <Progress value={riskData.historicalData} className="h-1 mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-amber-300">Regional Risk Levels</span>

                    <div className="space-y-1 text-xs">
                      {riskData.regions.map((region, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-300">{region.name}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-300">{region.risk}%</span>
                            {getTrendIcon(region.trend)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-xs border-amber-500/50 hover:bg-amber-950/30"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1.5 text-amber-500" />
                      View Detailed Report
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="py-3 text-center text-xs text-gray-400">Unable to load risk assessment data</div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
