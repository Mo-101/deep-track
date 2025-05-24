"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Maximize2,
  Minimize2,
  Send,
  AlertTriangle,
  Terminal,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Layers,
  Map,
  MousePointer,
  Activity,
  Radio,
  Thermometer,
  Droplets,
  Wind,
  Cloud,
} from "lucide-react"
import { MNTRKLoadingScreen } from "./mntrk-loading-screen"

type MonitoringStation = {
  id: string
  name: string
  location: string
  status: "online" | "offline" | "maintenance"
  lastUpdate: string
  batteryLevel: number
  signalStrength: number
  temperature: number
  humidity: number
}

type RodentActivity = {
  id: string
  timestamp: number
  location: string
  activityLevel: "low" | "moderate" | "high" | "critical"
  detectionCount: number
  confidence: number
  trend: "increasing" | "decreasing" | "stable"
}

type EnvironmentalData = {
  id: string
  timestamp: number
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  soilMoisture: number
}

type AlertMessage = {
  id: string
  severity: "info" | "warning" | "critical"
  message: string
  timestamp: number
  acknowledged: boolean
  location: string
}

// Change from named export to default export
export default function MNTRKHub() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [commandInput, setCommandInput] = useState("")
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "MNTRK System v3.2.1 initialized",
    "Connecting to monitoring network...",
    "Connection established",
    "Loading sensor data...",
    "System ready",
  ])

  const [monitoringStations, setMonitoringStations] = useState<MonitoringStation[]>([
    {
      id: "MS001",
      name: "Lagos Central",
      location: "Lagos",
      status: "online",
      lastUpdate: "2 minutes ago",
      batteryLevel: 87,
      signalStrength: 92,
      temperature: 28.5,
      humidity: 78,
    },
    {
      id: "MS002",
      name: "Ibadan North",
      location: "Ibadan",
      status: "online",
      lastUpdate: "5 minutes ago",
      batteryLevel: 72,
      signalStrength: 85,
      temperature: 29.2,
      humidity: 75,
    },
    {
      id: "MS003",
      name: "Abuja Central",
      location: "Abuja",
      status: "maintenance",
      lastUpdate: "1 hour ago",
      batteryLevel: 45,
      signalStrength: 60,
      temperature: 27.8,
      humidity: 65,
    },
    {
      id: "MS004",
      name: "Kano East",
      location: "Kano",
      status: "online",
      lastUpdate: "8 minutes ago",
      batteryLevel: 92,
      signalStrength: 88,
      temperature: 32.1,
      humidity: 45,
    },
    {
      id: "MS005",
      name: "Port Harcourt South",
      location: "Port Harcourt",
      status: "offline",
      lastUpdate: "3 hours ago",
      batteryLevel: 12,
      signalStrength: 0,
      temperature: 0,
      humidity: 0,
    },
  ])

  const [rodentActivity, setRodentActivity] = useState<RodentActivity[]>([
    {
      id: "RA001",
      timestamp: Date.now() - 1000 * 60 * 30,
      location: "Lagos",
      activityLevel: "high",
      detectionCount: 42,
      confidence: 89,
      trend: "increasing",
    },
    {
      id: "RA002",
      timestamp: Date.now() - 1000 * 60 * 120,
      location: "Ibadan",
      activityLevel: "moderate",
      detectionCount: 28,
      confidence: 76,
      trend: "stable",
    },
    {
      id: "RA003",
      timestamp: Date.now() - 1000 * 60 * 45,
      location: "Abuja",
      activityLevel: "low",
      detectionCount: 12,
      confidence: 92,
      trend: "decreasing",
    },
    {
      id: "RA004",
      timestamp: Date.now() - 1000 * 60 * 180,
      location: "Kano",
      activityLevel: "critical",
      detectionCount: 67,
      confidence: 95,
      trend: "increasing",
    },
  ])

  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData[]>([
    {
      id: "ED001",
      timestamp: Date.now() - 1000 * 60 * 15,
      temperature: 28.5,
      humidity: 78,
      rainfall: 0,
      windSpeed: 8,
      soilMoisture: 42,
    },
    {
      id: "ED002",
      timestamp: Date.now() - 1000 * 60 * 30,
      temperature: 28.7,
      humidity: 77,
      rainfall: 0,
      windSpeed: 7,
      soilMoisture: 41,
    },
    {
      id: "ED003",
      timestamp: Date.now() - 1000 * 60 * 45,
      temperature: 29.1,
      humidity: 76,
      rainfall: 0,
      windSpeed: 9,
      soilMoisture: 40,
    },
    {
      id: "ED004",
      timestamp: Date.now() - 1000 * 60 * 60,
      temperature: 29.3,
      humidity: 75,
      rainfall: 0,
      windSpeed: 10,
      soilMoisture: 39,
    },
  ])

  const [alerts, setAlerts] = useState<AlertMessage[]>([
    {
      id: "AL001",
      severity: "critical",
      message: "Critical rodent activity detected in Kano region",
      timestamp: Date.now() - 1000 * 60 * 30,
      acknowledged: false,
      location: "Kano",
    },
    {
      id: "AL002",
      severity: "warning",
      message: "Battery level low on Port Harcourt South station",
      timestamp: Date.now() - 1000 * 60 * 180,
      acknowledged: true,
      location: "Port Harcourt",
    },
    {
      id: "AL003",
      severity: "info",
      message: "Scheduled maintenance completed for Abuja Central station",
      timestamp: Date.now() - 1000 * 60 * 240,
      acknowledged: true,
      location: "Abuja",
    },
    {
      id: "AL004",
      severity: "warning",
      message: "Increasing rodent activity trend in Lagos region",
      timestamp: Date.now() - 1000 * 60 * 45,
      acknowledged: false,
      location: "Lagos",
    },
  ])

  const [systemStatus, setSystemStatus] = useState({
    activeStations: 3,
    totalStations: 5,
    dataPoints: 24567,
    lastSync: "3 minutes ago",
    batteryAverage: 62,
    signalAverage: 65,
    alertsToday: 7,
  })

  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false)
  const [diagnosticsProgress, setDiagnosticsProgress] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput])

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      // Update environmental data
      setEnvironmentalData((prev) => {
        const newData: EnvironmentalData = {
          id: `ED${Date.now()}`,
          timestamp: Date.now(),
          temperature: 28 + Math.random() * 2,
          humidity: 75 + Math.random() * 5,
          rainfall: Math.random() < 0.2 ? Math.random() * 2 : 0,
          windSpeed: 5 + Math.random() * 7,
          soilMoisture: 38 + Math.random() * 7,
        }
        return [newData, ...prev.slice(0, 3)]
      })

      // Update station last update times
      setMonitoringStations((prev) =>
        prev.map((station) => {
          if (station.status === "online") {
            return {
              ...station,
              lastUpdate: "Just now",
              batteryLevel: Math.max(1, station.batteryLevel - Math.random()),
              signalStrength: Math.min(100, Math.max(50, station.signalStrength + (Math.random() * 6 - 3))),
              temperature: Math.round((station.temperature + (Math.random() * 0.6 - 0.3)) * 10) / 10,
              humidity: Math.round(Math.min(100, Math.max(30, station.humidity + (Math.random() * 4 - 2)))),
            }
          }
          return station
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isRunningDiagnostics) {
      const interval = setInterval(() => {
        setDiagnosticsProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsRunningDiagnostics(false)
            setTerminalOutput((prev) => [
              ...prev,
              "Diagnostics complete",
              "All systems operational",
              "No issues detected",
            ])
            return 100
          }

          // Add diagnostic messages at certain points
          if (prev === 25) {
            setTerminalOutput((prev) => [...prev, "Checking sensor connectivity..."])
          } else if (prev === 50) {
            setTerminalOutput((prev) => [...prev, "Verifying data integrity..."])
          } else if (prev === 75) {
            setTerminalOutput((prev) => [...prev, "Testing alert system..."])
          }

          return prev + 5
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [isRunningDiagnostics])

  const handleCommandSubmit = () => {
    if (!commandInput.trim()) return

    const command = commandInput.trim().toLowerCase()
    setCommandInput("")

    // Add command to terminal
    setTerminalOutput((prev) => [...prev, `> ${command}`])

    // Process command
    setTimeout(() => {
      if (command === "help") {
        setTerminalOutput((prev) => [
          ...prev,
          "Available commands:",
          "  status - Display system status",
          "  stations - List all monitoring stations",
          "  alerts - Show recent alerts",
          "  clear - Clear terminal",
          "  diagnostics - Run system diagnostics",
        ])
      } else if (command === "status") {
        setTerminalOutput((prev) => [
          ...prev,
          `System Status: OPERATIONAL`,
          `Active Stations: ${systemStatus.activeStations}/${systemStatus.totalStations}`,
          `Data Points: ${systemStatus.dataPoints}`,
          `Last Sync: ${systemStatus.lastSync}`,
          `Alerts Today: ${systemStatus.alertsToday}`,
        ])
      } else if (command === "stations") {
        setTerminalOutput((prev) => [
          ...prev,
          "Monitoring Stations:",
          ...monitoringStations.map((station) => `  ${station.id} - ${station.name} - ${station.status.toUpperCase()}`),
        ])
      } else if (command === "alerts") {
        setTerminalOutput((prev) => [
          ...prev,
          "Recent Alerts:",
          ...alerts.slice(0, 3).map((alert) => `  [${alert.severity.toUpperCase()}] ${alert.message}`),
        ])
      } else if (command === "clear") {
        setTerminalOutput([])
      } else if (command === "diagnostics") {
        setTerminalOutput((prev) => [...prev, "Initiating system diagnostics...", "This may take a moment..."])
        setIsRunningDiagnostics(true)
        setDiagnosticsProgress(0)
      } else {
        setTerminalOutput((prev) => [
          ...prev,
          `Command not recognized: ${command}`,
          "Type 'help' for available commands",
        ])
      }
    }, 300)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400"
      case "maintenance":
        return "text-blue-400"
      case "offline":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "online":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>
      case "maintenance":
        return (
          <div className="h-2 w-2 rounded-full bg-blue-500 relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          </div>
        )
      case "offline":
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>
    }
  }

  const getActivityColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-500 text-green-50"
      case "moderate":
        return "bg-yellow-500 text-yellow-50"
      case "high":
        return "bg-orange-500 text-orange-50"
      case "critical":
        return "bg-red-500 text-red-50"
      default:
        return "bg-gray-500 text-gray-50"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <ChevronUp className="h-3 w-3 text-red-400" />
      case "decreasing":
        return <ChevronDown className="h-3 w-3 text-green-400" />
      case "stable":
        return <div className="h-3 w-3 border-t border-gray-400"></div>
      default:
        return null
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "info":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) {
      return "just now"
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h ago`
    } else {
      return `${Math.floor(diff / 86400000)}d ago`
    }
  }

  if (isLoading) {
    return <MNTRKLoadingScreen />
  }

  return (
    <Card
      className={`bg-black/90 backdrop-blur-md border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)] overflow-hidden transition-all duration-300 ${
        isExpanded ? "fixed inset-4 z-50" : isCollapsed ? "w-72" : "w-full max-w-5xl"
      }`}
    >
      <CardHeader className="pb-2 pt-3 border-b border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <MousePointer className="h-5 w-5 text-purple-400" />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(168, 85, 247, 0)",
                    "0 0 0 4px rgba(168, 85, 247, 0.3)",
                    "0 0 0 0 rgba(168, 85, 247, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              MNTRK Hub
            </CardTitle>
            <Badge variant="outline" className="text-[10px] h-4 border-purple-500/30 text-purple-400 px-1">
              v3.2.1
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-purple-300"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-purple-300"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-red-400"
              onClick={() => setActiveTab("dashboard")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="p-0 flex flex-col h-[600px]">
          <Tabs
            defaultValue="dashboard"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="h-10 bg-gray-900/50 border-b border-purple-500/20 rounded-none px-2 justify-start gap-1">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400 h-8 px-3"
              >
                <Activity className="h-4 w-4 mr-1" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="stations"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400 h-8 px-3"
              >
                <Radio className="h-4 w-4 mr-1" />
                Stations
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400 h-8 px-3"
              >
                <MousePointer className="h-4 w-4 mr-1" />
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="environmental"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400 h-8 px-3"
              >
                <Thermometer className="h-4 w-4 mr-1" />
                Environmental
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400 h-8 px-3"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Alerts
              </TabsTrigger>
              <TabsTrigger
                value="terminal"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400 h-8 px-3"
              >
                <Terminal className="h-4 w-4 mr-1" />
                Terminal
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400 h-8 px-3"
              >
                <Map className="h-4 w-4 mr-1" />
                Map
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="space-y-4">
                {/* System Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-black/80 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-mono flex items-center gap-2">
                        <Radio className="h-4 w-4 text-purple-400" />
                        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                          MONITORING STATIONS
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center py-4">
                        <div className="relative">
                          <div className="text-5xl font-mono font-bold text-center text-purple-400">
                            {systemStatus.activeStations}
                          </div>
                          <div className="text-sm font-mono text-gray-500 text-center">
                            /{systemStatus.totalStations}
                          </div>
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{
                              boxShadow: [
                                "0 0 0 0 rgba(168, 85, 247, 0)",
                                "0 0 0 10px rgba(168, 85, 247, 0.2)",
                                "0 0 0 0 rgba(168, 85, 247, 0)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-1 mt-2">
                        {monitoringStations.map((station, i) => (
                          <div
                            key={i}
                            className={`h-2 w-full rounded-full ${
                              station.status === "online"
                                ? "bg-green-500"
                                : station.status === "maintenance"
                                  ? "bg-blue-500"
                                  : "bg-red-500"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="mt-3 text-xs text-gray-400 font-mono">
                        <div className="flex justify-between">
                          <span>BATTERY AVG:</span>
                          <span className="text-purple-400">{systemStatus.batteryAverage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SIGNAL AVG:</span>
                          <span className="text-purple-400">{systemStatus.signalAverage}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/80 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-mono flex items-center gap-2">
                        <MousePointer className="h-4 w-4 text-pink-400" />
                        <span className="bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                          RODENT ACTIVITY
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 py-2">
                        {rodentActivity.slice(0, 3).map((activity, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={`${getActivityColor(activity.activityLevel)} text-[10px] uppercase`}>
                                {activity.activityLevel}
                              </Badge>
                              <span className="text-xs text-gray-300">{activity.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-pink-400">{activity.detectionCount}</span>
                              {getTrendIcon(activity.trend)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">DETECTION CONFIDENCE</span>
                          <span className="text-pink-400">89%</span>
                        </div>
                        <Progress value={89} className="h-1.5" indicatorClassName="bg-pink-500" />
                      </div>

                      <div className="mt-3 text-xs text-gray-400 font-mono">
                        <div className="flex justify-between">
                          <span>TOTAL DETECTIONS:</span>
                          <span className="text-pink-400">149</span>
                        </div>
                        <div className="flex justify-between">
                          <span>24H CHANGE:</span>
                          <span className="text-red-400">+12%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/80 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-mono flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-400" />
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                          SYSTEM ALERTS
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 py-2">
                        {alerts
                          .filter((a) => !a.acknowledged)
                          .slice(0, 3)
                          .map((alert, i) => (
                            <div key={i} className="text-xs">
                              <Badge className={`${getAlertColor(alert.severity)} text-[10px] uppercase mb-1`}>
                                {alert.severity}
                              </Badge>
                              <p className="text-gray-300 truncate">{alert.message}</p>
                              <p className="text-gray-500 text-[10px]">
                                {formatTimestamp(alert.timestamp)} • {alert.location}
                              </p>
                            </div>
                          ))}
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">UNACKNOWLEDGED</span>
                          <span className="text-blue-400">
                            {alerts.filter((a) => !a.acknowledged).length}/{alerts.length}
                          </span>
                        </div>
                        <Progress
                          value={(alerts.filter((a) => !a.acknowledged).length / alerts.length) * 100}
                          className="h-1.5"
                          indicatorClassName="bg-blue-500"
                        />
                      </div>

                      <div className="mt-3 text-xs text-gray-400 font-mono">
                        <div className="flex justify-between">
                          <span>ALERTS TODAY:</span>
                          <span className="text-blue-400">{systemStatus.alertsToday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CRITICAL:</span>
                          <span className="text-red-400">{alerts.filter((a) => a.severity === "critical").length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Environmental Data */}
                <Card className="bg-black/80 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-mono flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-cyan-400" />
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                          ENVIRONMENTAL DATA
                        </span>
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-400">
                        LIVE
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Thermometer className="h-3.5 w-3.5 text-red-400" />
                          <span className="text-xs text-gray-300">TEMPERATURE</span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-cyan-400">
                          {environmentalData[0].temperature.toFixed(1)}°C
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {environmentalData[1].temperature > environmentalData[0].temperature ? (
                            <span className="text-blue-400">
                              ▼ {(environmentalData[1].temperature - environmentalData[0].temperature).toFixed(1)}°
                            </span>
                          ) : (
                            <span className="text-red-400">
                              ▲ {(environmentalData[0].temperature - environmentalData[1].temperature).toFixed(1)}°
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Droplets className="h-3.5 w-3.5 text-blue-400" />
                          <span className="text-xs text-gray-300">HUMIDITY</span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-cyan-400">
                          {environmentalData[0].humidity}%
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {environmentalData[1].humidity > environmentalData[0].humidity ? (
                            <span className="text-blue-400">
                              ▼ {environmentalData[1].humidity - environmentalData[0].humidity}%
                            </span>
                          ) : (
                            <span className="text-red-400">
                              ▲ {environmentalData[0].humidity - environmentalData[1].humidity}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Cloud className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-xs text-gray-300">RAINFALL</span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-cyan-400">
                          {environmentalData[0].rainfall.toFixed(1)}mm
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {environmentalData[0].rainfall > 0 ? (
                            <span className="text-blue-400">Active</span>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Wind className="h-3.5 w-3.5 text-cyan-400" />
                          <span className="text-xs text-gray-300">WIND SPEED</span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-cyan-400">
                          {environmentalData[0].windSpeed.toFixed(1)}km/h
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {environmentalData[1].windSpeed > environmentalData[0].windSpeed ? (
                            <span className="text-blue-400">
                              ▼ {(environmentalData[1].windSpeed - environmentalData[0].windSpeed).toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-red-400">
                              ▲ {(environmentalData[0].windSpeed - environmentalData[1].windSpeed).toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Droplets className="h-3.5 w-3.5 text-green-400" />
                          <span className="text-xs text-gray-300">SOIL MOISTURE</span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-cyan-400">
                          {environmentalData[0].soilMoisture}%
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {environmentalData[1].soilMoisture > environmentalData[0].soilMoisture ? (
                            <span className="text-blue-400">
                              ▼ {environmentalData[1].soilMoisture - environmentalData[0].soilMoisture}%
                            </span>
                          ) : (
                            <span className="text-red-400">
                              ▲ {environmentalData[0].soilMoisture - environmentalData[1].soilMoisture}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-400 font-mono">
                      <div className="flex justify-between">
                        <span>LAST UPDATE:</span>
                        <span className="text-cyan-400">{formatTimestamp(environmentalData[0].timestamp)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DATA POINTS:</span>
                        <span className="text-cyan-400">{systemStatus.dataPoints.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-2 border-purple-500/30 hover:bg-purple-950/30 hover:text-purple-400"
                  >
                    <Radio className="h-5 w-5" />
                    <span className="text-xs">Station Status</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-2 border-pink-500/30 hover:bg-pink-950/30 hover:text-pink-400"
                  >
                    <MousePointer className="h-5 w-5" />
                    <span className="text-xs">Activity Report</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-2 border-blue-500/30 hover:bg-blue-950/30 hover:text-blue-400"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-xs">Manage Alerts</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-2 border-cyan-500/30 hover:bg-cyan-950/30 hover:text-cyan-400"
                  >
                    <Map className="h-5 w-5" />
                    <span className="text-xs">View Map</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stations" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-purple-400">Monitoring Stations</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-purple-500/30 text-purple-400">
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monitoringStations.map((station) => (
                    <div key={station.id} className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm font-medium text-purple-300">{station.name}</h4>
                          <p className="text-xs text-gray-400">
                            {station.location} • {station.id}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusIndicator(station.status)}
                          <span className={`text-xs ${getStatusColor(station.status)}`}>
                            {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Battery</span>
                            <span
                              className={`${
                                station.batteryLevel > 70
                                  ? "text-green-400"
                                  : station.batteryLevel > 30
                                    ? "text-yellow-400"
                                    : "text-red-400"
                              }`}
                            >
                              {station.batteryLevel}%
                            </span>
                          </div>
                          <Progress
                            value={station.batteryLevel}
                            className="h-1"
                            indicatorClassName={`${
                              station.batteryLevel > 70
                                ? "bg-green-500"
                                : station.batteryLevel > 30
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Signal</span>
                            <span
                              className={`${
                                station.signalStrength > 70
                                  ? "text-green-400"
                                  : station.signalStrength > 30
                                    ? "text-yellow-400"
                                    : "text-red-400"
                              }`}
                            >
                              {station.signalStrength}%
                            </span>
                          </div>
                          <Progress
                            value={station.signalStrength}
                            className="h-1"
                            indicatorClassName={`${
                              station.signalStrength > 70
                                ? "bg-green-500"
                                : station.signalStrength > 30
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-gray-400">
                        <div className="flex justify-between">
                          <span>Temperature:</span>
                          <span className="text-purple-300">
                            {station.status === "online" ? `${station.temperature}°C` : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Humidity:</span>
                          <span className="text-purple-300">
                            {station.status === "online" ? `${station.humidity}%` : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Update:</span>
                          <span className="text-purple-300">{station.lastUpdate}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 border-purple-500/30 text-purple-400 flex-1"
                        >
                          Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 border-purple-500/30 text-purple-400 flex-1"
                        >
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs">Add New Station</Button>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-pink-400">Rodent Activity</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-pink-500/30 text-pink-400">
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    Refresh
                  </Button>
                </div>

                {rodentActivity.map((activity) => (
                  <div key={activity.id} className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-pink-300">{activity.location} Region</h4>
                        <p className="text-xs text-gray-400">{formatTimestamp(activity.timestamp)}</p>
                      </div>
                      <Badge className={`${getActivityColor(activity.activityLevel)} uppercase text-[10px]`}>
                        {activity.activityLevel}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Detection Confidence</span>
                          <span className="text-pink-300">{activity.confidence}%</span>
                        </div>
                        <Progress value={activity.confidence} className="h-1" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Detections</span>
                          <span className="text-gray-300">{activity.detectionCount}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Trend</span>
                          <span
                            className={`${
                              activity.trend === "increasing"
                                ? "text-red-400"
                                : activity.trend === "decreasing"
                                  ? "text-green-400"
                                  : "text-gray-300"
                            }`}
                          >
                            {activity.trend.charAt(0).toUpperCase() + activity.trend.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 border-pink-500/30 text-pink-400 flex-1"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 border-pink-500/30 text-pink-400 flex-1"
                      >
                        Historical Data
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-pink-300 mb-2">Activity Summary</h4>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Total Detections (24h)</span>
                      <span className="text-pink-300">149</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">High/Critical Zones</span>
                      <span className="text-pink-300">2</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Average Confidence</span>
                      <span className="text-pink-300">88%</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Trend (7 days)</span>
                      <span className="text-red-400">+15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="environmental" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyan-400">Environmental Data</h3>
                  <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-400">
                    LIVE
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-cyan-300 mb-2">Temperature & Humidity</h4>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <div className="flex items-center gap-1.5">
                            <Thermometer className="h-3.5 w-3.5 text-red-400" />
                            <span className="text-gray-400">Temperature</span>
                          </div>
                          <span className="text-cyan-300">{environmentalData[0].temperature.toFixed(1)}°C</span>
                        </div>
                        <Progress
                          value={(environmentalData[0].temperature / 40) * 100}
                          className="h-1"
                          indicatorClassName="bg-gradient-to-r from-blue-500 to-red-500"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                          <span>0°C</span>
                          <span>40°C</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <div className="flex items-center gap-1.5">
                            <Droplets className="h-3.5 w-3.5 text-blue-400" />
                            <span className="text-gray-400">Humidity</span>
                          </div>
                          <span className="text-cyan-300">{environmentalData[0].humidity}%</span>
                        </div>
                        <Progress
                          value={environmentalData[0].humidity}
                          className="h-1"
                          indicatorClassName="bg-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>24h High:</span>
                        <span className="text-cyan-300">31.2°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>24h Low:</span>
                        <span className="text-cyan-300">26.8°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Humidity Range:</span>
                        <span className="text-cyan-300">65% - 82%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-cyan-300 mb-2">Rainfall & Wind</h4>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <div className="flex items-center gap-1.5">
                            <Cloud className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-gray-400">Rainfall</span>
                          </div>
                          <span className="text-cyan-300">{environmentalData[0].rainfall.toFixed(1)}mm</span>
                        </div>
                        <Progress
                          value={(environmentalData[0].rainfall / 10) * 100}
                          className="h-1"
                          indicatorClassName="bg-blue-500"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                          <span>0mm</span>
                          <span>10mm</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <div className="flex items-center gap-1.5">
                            <Wind className="h-3.5 w-3.5 text-cyan-400" />
                            <span className="text-gray-400">Wind Speed</span>
                          </div>
                          <span className="text-cyan-300">{environmentalData[0].windSpeed.toFixed(1)}km/h</span>
                        </div>
                        <Progress
                          value={(environmentalData[0].windSpeed / 30) * 100}
                          className="h-1"
                          indicatorClassName="bg-cyan-500"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                          <span>0km/h</span>
                          <span>30km/h</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>7-Day Rainfall:</span>
                        <span className="text-cyan-300">12.5mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wind Direction:</span>
                        <span className="text-cyan-300">SW</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pressure:</span>
                        <span className="text-cyan-300">1013 hPa</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-cyan-300 mb-2">Soil Conditions</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Soil Moisture</span>
                        <span className="text-cyan-300">{environmentalData[0].soilMoisture}%</span>
                      </div>
                      <Progress value={environmentalData[0].soilMoisture} className="h-1" />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Soil Temperature</span>
                        <span className="text-cyan-300">26.2°C</span>
                      </div>
                      <Progress value={(26.2 / 40) * 100} className="h-1" />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">pH Level</span>
                        <span className="text-cyan-300">6.8</span>
                      </div>
                      <Progress value={(6.8 / 14) * 100} className="h-1" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs border-cyan-500/30 text-cyan-400 flex-1">
                    Historical Data
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs border-cyan-500/30 text-cyan-400 flex-1">
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs border-cyan-500/30 text-cyan-400 flex-1">
                    Weather Forecast
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-blue-400">System Alerts</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-blue-500/30 text-blue-400">
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    Refresh
                  </Button>
                </div>

                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`bg-gray-900/50 border border-gray-800/50 rounded-lg p-3 ${
                      !alert.acknowledged ? "ring-1 ring-blue-500/30" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={`${getAlertColor(alert.severity)} text-[10px] uppercase`}>
                        {alert.severity}
                      </Badge>
                      <div className="text-xs text-gray-400">{formatTimestamp(alert.timestamp)}</div>
                    </div>

                    <p className="text-sm text-gray-300 mb-1">{alert.message}</p>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">{alert.location}</span>
                      <div className="flex items-center gap-1">
                        {!alert.acknowledged && (
                          <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400 px-1.5">
                            New
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-[10px] border-gray-500/30 text-gray-400 px-1.5">
                          {alert.id}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      {!alert.acknowledged ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 border-blue-500/30 text-blue-400 flex-1"
                        >
                          Acknowledge
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 border-gray-500/30 text-gray-400 flex-1"
                        >
                          Acknowledged
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 border-blue-500/30 text-blue-400 flex-1"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-blue-300 mb-2">Alert Settings</h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Unacknowledged Alerts:</span>
                      <span className="text-blue-300">{alerts.filter((a) => !a.acknowledged).length}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Critical Alerts:</span>
                      <span className="text-red-400">{alerts.filter((a) => a.severity === "critical").length}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Warning Alerts:</span>
                      <span className="text-yellow-400">{alerts.filter((a) => a.severity === "warning").length}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Info Alerts:</span>
                      <span className="text-blue-400">{alerts.filter((a) => a.severity === "info").length}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs border-blue-500/30 text-blue-400 flex-1">
                      Acknowledge All
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs border-blue-500/30 text-blue-400 flex-1">
                      Alert History
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="terminal" className="flex-1 overflow-y-auto p-0 data-[state=inactive]:hidden">
              <div className="h-full flex flex-col">
                <div
                  ref={terminalRef}
                  className="flex-1 bg-black/80 font-mono text-xs text-green-400 p-3 overflow-y-auto"
                >
                  {terminalOutput.map((line, i) => (
                    <div key={i} className="mb-1">
                      {line.startsWith(">") ? <span className="text-purple-400">{line}</span> : line}
                    </div>
                  ))}

                  {isRunningDiagnostics && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Diagnostics Progress</span>
                        <span>{diagnosticsProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${diagnosticsProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-gray-800">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleCommandSubmit()
                    }}
                    className="flex gap-2"
                  >
                    <div className="text-purple-400 font-mono text-xs">{">"}</div>
                    <Input
                      value={commandInput}
                      onChange={(e) => setCommandInput(e.target.value)}
                      placeholder="Enter command (type 'help' for available commands)"
                      className="bg-black/50 border-gray-800 focus-visible:ring-purple-500/50 font-mono text-xs"
                    />
                    <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700 text-white h-8 w-8">
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="map" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyan-400">Monitoring Map</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-cyan-500/30 text-cyan-400">
                    <Layers className="h-3 w-3 mr-1.5" />
                    Toggle Layers
                  </Button>
                </div>

                <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                  <div className="relative h-64 bg-black/30 rounded-lg overflow-hidden border border-gray-800/50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Map className="h-8 w-8 text-gray-700" />
                      <span className="absolute text-xs text-gray-500">Map Visualization</span>
                    </div>

                    {/* Simulated map overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-radial from-red-500/20 via-yellow-500/10 to-transparent"
                      style={{ left: "30%", top: "40%", width: "40%", height: "40%" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-radial from-orange-500/20 via-yellow-500/10 to-transparent"
                      style={{ left: "60%", top: "20%", width: "30%", height: "30%" }}
                    ></div>

                    {/* Station markers */}
                    <div
                      className="absolute h-2 w-2 rounded-full bg-green-500 animate-pulse"
                      style={{ left: "35%", top: "45%" }}
                    ></div>
                    <div
                      className="absolute h-2 w-2 rounded-full bg-green-500"
                      style={{ left: "65%", top: "25%" }}
                    ></div>
                    <div
                      className="absolute h-2 w-2 rounded-full bg-blue-500"
                      style={{ left: "50%", top: "65%" }}
                    ></div>
                    <div className="absolute h-2 w-2 rounded-full bg-red-500" style={{ left: "80%", top: "55%" }}></div>

                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                  </div>

                  <div className="mt-2 flex justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-300">Online</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-gray-300">Maintenance</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="text-gray-300">Offline</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-cyan-300 mb-2">Activity Heatmap</h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">High Activity Zones:</span>
                        <span className="text-red-400">2</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Moderate Activity Zones:</span>
                        <span className="text-yellow-400">3</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Low Activity Zones:</span>
                        <span className="text-green-400">5</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-cyan-300 mb-2">Station Coverage</h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Coverage:</span>
                        <span className="text-cyan-300">78%</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Coverage Gaps:</span>
                        <span className="text-yellow-400">2 regions</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Optimal Placement:</span>
                        <span className="text-cyan-300">85%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs">Open Full Map View</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}
