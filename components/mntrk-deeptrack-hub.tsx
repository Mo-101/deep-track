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
  Map,
  MousePointer,
  Activity,
  Radio,
  Thermometer,
  Brain,
  Database,
  Cpu,
  Server,
  Code,
} from "lucide-react"
import Link from "next/link"

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

type PredictionData = {
  id: string
  timestamp: number
  location: string
  riskLevel: "low" | "moderate" | "high" | "critical"
  confidence: number
  factors: string[]
  trend: "increasing" | "decreasing" | "stable"
}

type SystemComponent = {
  id: string
  name: string
  status: "online" | "offline" | "degraded"
  version: string
  lastUpdate: string
  performance: number
  description: string
}

export default function MNTRKDeepTrackHub() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [commandInput, setCommandInput] = useState("")
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "MNTRK-DeepTrack™ System v4.0.1 initialized",
    "Connecting to monitoring network...",
    "Connection established",
    "Loading neural core modules...",
    "Initializing Deepseek R1 7B model...",
    "Agent-MNTRK online",
    "API-MNTRK connected",
    "Supabase connection established",
    "Postgres fallback ready",
    "AI prediction system online",
    "System ready",
  ])

  const [systemComponents, setSystemComponents] = useState<SystemComponent[]>([
    {
      id: "deepseek",
      name: "Deepseek R1 7B",
      status: "online",
      version: "1.2.0",
      lastUpdate: "1 hour ago",
      performance: 94,
      description: "Large language model powering prediction and analysis",
    },
    {
      id: "agent",
      name: "Agent-MNTRK",
      status: "online",
      version: "3.5.2",
      lastUpdate: "2 hours ago",
      performance: 92,
      description: "Autonomous monitoring and response system",
    },
    {
      id: "api",
      name: "API-MNTRK",
      status: "online",
      version: "2.1.4",
      lastUpdate: "30 minutes ago",
      performance: 98,
      description: "Interface for external data exchange and integration",
    },
    {
      id: "supabase",
      name: "Supabase",
      status: "online",
      version: "2.8.0",
      lastUpdate: "15 minutes ago",
      performance: 96,
      description: "Primary database for all system data",
    },
    {
      id: "postgres",
      name: "Postgres",
      status: "online",
      version: "15.2",
      lastUpdate: "15 minutes ago",
      performance: 95,
      description: "Fallback database system",
    },
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

  const [predictions, setPredictions] = useState<PredictionData[]>([
    {
      id: "PR001",
      timestamp: Date.now(),
      location: "Lagos",
      riskLevel: "high",
      confidence: 87,
      factors: ["Increased rodent activity", "Favorable weather conditions", "Historical patterns"],
      trend: "increasing",
    },
    {
      id: "PR002",
      timestamp: Date.now(),
      location: "Ibadan",
      riskLevel: "moderate",
      confidence: 72,
      factors: ["Moderate rodent activity", "Seasonal patterns"],
      trend: "stable",
    },
    {
      id: "PR003",
      timestamp: Date.now(),
      location: "Abuja",
      riskLevel: "low",
      confidence: 91,
      factors: ["Low rodent activity", "Unfavorable weather conditions"],
      trend: "decreasing",
    },
    {
      id: "PR004",
      timestamp: Date.now(),
      location: "Kano",
      riskLevel: "critical",
      confidence: 94,
      factors: [
        "Critical rodent activity",
        "Favorable weather conditions",
        "Historical outbreak patterns",
        "Population density",
      ],
      trend: "increasing",
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
    aiConfidence: 89,
    predictionAccuracy: 92,
  })

  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false)
  const [diagnosticsProgress, setDiagnosticsProgress] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [brainRotation, setBrainRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput])

  useEffect(() => {
    // Animate brain rotation
    const interval = setInterval(() => {
      setBrainRotation((prev) => ({
        x: prev.x + 0.5,
        y: prev.y + 0.2,
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [])

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

      // Update system components occasionally
      if (Math.random() < 0.2) {
        setSystemComponents((prev) =>
          prev.map((component) => {
            const performanceChange = Math.random() * 2 - 1
            return {
              ...component,
              performance: Math.min(99, Math.max(85, component.performance + performanceChange)),
              lastUpdate: "Just now",
            }
          }),
        )
      }

      // Update predictions occasionally
      if (Math.random() < 0.3) {
        setPredictions((prev) =>
          prev.map((prediction) => {
            const confidenceChange = Math.random() * 4 - 2
            return {
              ...prediction,
              confidence: Math.min(99, Math.max(60, prediction.confidence + confidenceChange)),
              timestamp: Date.now(),
            }
          }),
        )
      }
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
              "Deepseek R1 7B: 100% operational",
              "Agent-MNTRK: 100% operational",
              "API-MNTRK: 100% operational",
              "Supabase: 100% operational",
              "Postgres: 100% operational",
              "Neural core integrity: 100%",
              "No issues detected",
            ])
            return 100
          }

          // Add diagnostic messages at certain points
          if (prev === 20) {
            setTerminalOutput((prev) => [...prev, "Checking Deepseek R1 7B model integrity..."])
          } else if (prev === 35) {
            setTerminalOutput((prev) => [...prev, "Verifying Agent-MNTRK functionality..."])
          } else if (prev === 50) {
            setTerminalOutput((prev) => [...prev, "Testing API-MNTRK endpoints..."])
          } else if (prev === 65) {
            setTerminalOutput((prev) => [...prev, "Validating Supabase connection..."])
          } else if (prev === 80) {
            setTerminalOutput((prev) => [...prev, "Testing Postgres fallback..."])
          } else if (prev === 90) {
            setTerminalOutput((prev) => [...prev, "Finalizing system checks..."])
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
          "  predictions - Show current risk predictions",
          "  components - List system components",
          "  deepseek - Show Deepseek model status",
          "  agent - Show Agent-MNTRK status",
          "  api - Show API-MNTRK status",
          "  database - Show database status",
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
          `AI Confidence: ${systemStatus.aiConfidence}%`,
          `Prediction Accuracy: ${systemStatus.predictionAccuracy}%`,
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
      } else if (command === "predictions") {
        setTerminalOutput((prev) => [
          ...prev,
          "Current Risk Predictions:",
          ...predictions.map(
            (pred) => `  [${pred.riskLevel.toUpperCase()}] ${pred.location} - Confidence: ${pred.confidence}%`,
          ),
        ])
      } else if (command === "components") {
        setTerminalOutput((prev) => [
          ...prev,
          "System Components:",
          ...systemComponents.map((comp) => `  ${comp.name} - ${comp.status.toUpperCase()} - v${comp.version}`),
        ])
      } else if (command === "deepseek") {
        const deepseek = systemComponents.find((c) => c.id === "deepseek")
        if (deepseek) {
          setTerminalOutput((prev) => [
            ...prev,
            `Deepseek R1 7B Status:`,
            `  Status: ${deepseek.status.toUpperCase()}`,
            `  Version: ${deepseek.version}`,
            `  Performance: ${deepseek.performance}%`,
            `  Last Update: ${deepseek.lastUpdate}`,
            `  Description: ${deepseek.description}`,
          ])
        }
      } else if (command === "agent") {
        const agent = systemComponents.find((c) => c.id === "agent")
        if (agent) {
          setTerminalOutput((prev) => [
            ...prev,
            `Agent-MNTRK Status:`,
            `  Status: ${agent.status.toUpperCase()}`,
            `  Version: ${agent.version}`,
            `  Performance: ${agent.performance}%`,
            `  Last Update: ${agent.lastUpdate}`,
            `  Description: ${agent.description}`,
          ])
        }
      } else if (command === "api") {
        const api = systemComponents.find((c) => c.id === "api")
        if (api) {
          setTerminalOutput((prev) => [
            ...prev,
            `API-MNTRK Status:`,
            `  Status: ${api.status.toUpperCase()}`,
            `  Version: ${api.version}`,
            `  Performance: ${api.performance}%`,
            `  Last Update: ${api.lastUpdate}`,
            `  Description: ${api.description}`,
          ])
        }
      } else if (command === "database") {
        const supabase = systemComponents.find((c) => c.id === "supabase")
        const postgres = systemComponents.find((c) => c.id === "postgres")
        if (supabase && postgres) {
          setTerminalOutput((prev) => [
            ...prev,
            `Database Status:`,
            `  Primary (Supabase): ${supabase.status.toUpperCase()} - v${supabase.version}`,
            `  Fallback (Postgres): ${postgres.status.toUpperCase()} - v${postgres.version}`,
            `  Supabase Performance: ${supabase.performance}%`,
            `  Postgres Performance: ${postgres.performance}%`,
            `  Last Update: ${supabase.lastUpdate}`,
          ])
        }
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
      case "degraded":
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
      case "degraded":
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

  const getComponentIcon = (id: string) => {
    switch (id) {
      case "deepseek":
        return <Brain className="h-4 w-4 text-purple-400" />
      case "agent":
        return <Activity className="h-4 w-4 text-cyan-400" />
      case "api":
        return <Code className="h-4 w-4 text-blue-400" />
      case "supabase":
        return <Database className="h-4 w-4 text-green-400" />
      case "postgres":
        return <Server className="h-4 w-4 text-yellow-400" />
      default:
        return <Cpu className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <Card
      className={`bg-black/90 backdrop-blur-md border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)] overflow-hidden transition-all duration-300 ${
        isExpanded ? "fixed inset-4 z-50" : isCollapsed ? "w-72" : "w-full max-w-6xl"
      }`}
    >
      <CardHeader className="pb-2 pt-3 border-b border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Brain className="h-5 w-5 text-purple-400" />
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
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-500 bg-clip-text text-transparent">
              MNTRK-DeepTrack™ Hub
            </CardTitle>
            <Badge variant="outline" className="text-[10px] h-4 border-purple-500/30 text-purple-400 px-1">
              v4.0.1
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
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-400">
                <X className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="p-0 flex flex-col h-[700px]">
          <Tabs
            defaultValue="dashboard"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="h-10 bg-gray-900/50 border-b border-purple-500/20 rounded-none px-2 justify-start gap-1 overflow-x-auto flex-nowrap">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400 h-8 px-3"
              >
                <Activity className="h-4 w-4 mr-1" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="components"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400 h-8 px-3"
              >
                <Cpu className="h-4 w-4 mr-1" />
                Components
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
                value="predictions"
                className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400 h-8 px-3"
              >
                <Brain className="h-4 w-4 mr-1" />
                AI Predictions
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
                        {/* 3D Rotating Brain/Orb */}
                        <div className="relative w-32 h-32">
                          <motion.div
                            className="absolute inset-0 w-full h-full"
                            style={{
                              perspective: "800px",
                              transformStyle: "preserve-3d",
                            }}
                          >
                            <motion.div
                              className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/50"
                              style={{
                                rotateX: brainRotation.x,
                                rotateY: brainRotation.y,
                                transformStyle: "preserve-3d",
                              }}
                            >
                              {/* Neural network connections */}
                              {Array.from({ length: 12 }).map((_, i) => (
                                <motion.div
                                  key={`connection-${i}`}
                                  className="absolute bg-gradient-to-r from-purple-500/40 to-pink-500/40"
                                  style={{
                                    width: `${20 + Math.random() * 40}px`,
                                    height: "1px",
                                    left: `${Math.random() * 80}%`,
                                    top: `${Math.random() * 80}%`,
                                    transform: `rotate(${Math.random() * 360}deg)`,
                                    transformStyle: "preserve-3d",
                                    translateZ: Math.random() * 20,
                                  }}
                                />
                              ))}

                              {/* Neural nodes */}
                              {Array.from({ length: 8 }).map((_, i) => (
                                <motion.div
                                  key={`node-${i}`}
                                  className="absolute w-2 h-2 rounded-full bg-purple-500"
                                  style={{
                                    left: `${Math.random() * 80}%`,
                                    top: `${Math.random() * 80}%`,
                                    transformStyle: "preserve-3d",
                                    translateZ: Math.random() * 30,
                                  }}
                                  animate={{
                                    opacity: [0.4, 1, 0.4],
                                    scale: [0.8, 1.2, 0.8],
                                  }}
                                  transition={{
                                    duration: 2 + Math.random() * 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: Math.random() * 2,
                                  }}
                                />
                              ))}
                            </motion.div>
                          </motion.div>

                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-5xl font-mono font-bold text-center text-purple-400">
                              {systemStatus.activeStations}
                            </div>
                            <div className="text-sm font-mono text-gray-500 absolute bottom-2">
                              /{systemStatus.totalStations}
                            </div>
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

                  <Card className="bg-black/80 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-mono flex items-center gap-2">
                        <Brain className="h-4 w-4 text-cyan-400" />
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                          AI PREDICTION SYSTEM
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 py-2">
                        {predictions.slice(0, 3).map((prediction, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={`${getActivityColor(prediction.riskLevel)} text-[10px] uppercase`}>
                                {prediction.riskLevel}
                              </Badge>
                              <span className="text-xs text-gray-300">{prediction.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-cyan-400">{prediction.confidence}%</span>
                              {getTrendIcon(prediction.trend)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">AI CONFIDENCE</span>
                          <span className="text-cyan-400">{systemStatus.aiConfidence}%</span>
                        </div>
                        <Progress
                          value={systemStatus.aiConfidence}
                          className="h-1.5"
                          indicatorClassName="bg-cyan-500"
                        />
                      </div>

                      <div className="mt-3 text-xs text-gray-400 font-mono">
                        <div className="flex justify-between">
                          <span>PREDICTION ACCURACY:</span>
                          <span className="text-cyan-400">{systemStatus.predictionAccuracy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>NEURAL CORE STATUS:</span>
                          <span className="text-green-400">OPTIMAL</span>
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
                </div>

                {/* System Components */}
                <Card className="bg-black/80 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-mono flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-cyan-400" />
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                          SYSTEM COMPONENTS
                        </span>
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-400">
                        ALL ONLINE
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {systemComponents.map((component) => (
                        <div key={component.id} className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {getComponentIcon(component.id)}
                            <span className="text-xs text-gray-300">{component.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {getStatusIndicator(component.status)}
                            <span className={`text-xs ${getStatusColor(component.status)}`}>
                              {component.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400">v{component.version}</div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">Performance</span>
                              <span className="text-cyan-300">{component.performance}%</span>
                            </div>
                            <Progress value={component.performance} className="h-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-2 border-purple-500/30 hover:bg-purple-950/30 hover:text-purple-400"
                  >
                    <Brain className="h-5 w-5" />
                    <span className="text-xs">Deepseek R1 7B</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-2 border-cyan-500/30 hover:bg-cyan-950/30 hover:text-cyan-400"
                  >
                    <Activity className="h-5 w-5" />
                    <span className="text-xs">Agent-MNTRK</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-2 border-blue-500/30 hover:bg-blue-950/30 hover:text-blue-400"
                  >
                    <Code className="h-5 w-5" />
                    <span className="text-xs">API-MNTRK</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-2 border-green-500/30 hover:bg-green-950/30 hover:text-green-400"
                  >
                    <Database className="h-5 w-5" />
                    <span className="text-xs">Supabase</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col gap-2 border-yellow-500/30 hover:bg-yellow-950/30 hover:text-yellow-400"
                  >
                    <Server className="h-5 w-5" />
                    <span className="text-xs">Postgres</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="components" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyan-400">System Components</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-cyan-500/30 text-cyan-400">
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    Refresh
                  </Button>
                </div>

                {systemComponents.map((component) => (
                  <div key={component.id} className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getComponentIcon(component.id)}
                        <div>
                          <h4 className="text-sm font-medium text-cyan-300">{component.name}</h4>
                          <p className="text-xs text-gray-400">v{component.version}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getStatusIndicator(component.status)}
                        <span className={`text-xs ${getStatusColor(component.status)}`}>
                          {component.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 mb-3">{component.description}</p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Performance</span>
                          <span className="text-cyan-300">{component.performance}%</span>
                        </div>
                        <Progress value={component.performance} className="h-1" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Update</span>
                          <span className="text-gray-300">{component.lastUpdate}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className={getStatusColor(component.status)}>
                            {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 border-cyan-500/30 text-cyan-400 flex-1"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 border-cyan-500/30 text-cyan-400 flex-1"
                      >
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
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

            {/* Other tabs would be implemented similarly */}
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}
