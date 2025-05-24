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
  Bot,
  X,
  Maximize2,
  Minimize2,
  Send,
  Brain,
  Cpu,
  Database,
  AlertTriangle,
  Terminal,
  Zap,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Layers,
  Eye,
  Map,
} from "lucide-react"
import { NeuralCoreDashboard } from "./neural-core-dashboard"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
}

type AIModel = {
  id: string
  name: string
  version: string
  status: "online" | "offline" | "training"
  accuracy: number
  lastUpdated: string
}

type DataSource = {
  id: string
  name: string
  status: "connected" | "disconnected" | "syncing"
  lastSync: string
  recordCount: number
}

type PredictionResult = {
  id: string
  timestamp: number
  confidence: number
  riskLevel: "low" | "moderate" | "high" | "critical"
  affectedAreas: string[]
  factors: {
    [key: string]: number
  }
}

export function AIHub({ isFullPage = false }: { isFullPage?: boolean }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "system",
      content: "DeepSeek AI initialized. Ready to assist with Lassa fever risk assessment and monitoring.",
      timestamp: Date.now() - 60000,
    },
    {
      id: "2",
      role: "assistant",
      content: "Welcome to DeepTrack AI Hub. How can I assist with your risk assessment needs today?",
      timestamp: Date.now(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [aiModels, setAiModels] = useState<AIModel[]>([
    {
      id: "1",
      name: "DeepSeek Core",
      version: "4.2.1",
      status: "online",
      accuracy: 94.7,
      lastUpdated: "2 hours ago",
    },
    {
      id: "2",
      name: "RiskPredictor",
      version: "2.8.5",
      status: "online",
      accuracy: 89.3,
      lastUpdated: "6 hours ago",
    },
    {
      id: "3",
      name: "PatternAnalyzer",
      version: "1.9.2",
      status: "training",
      accuracy: 86.1,
      lastUpdated: "1 day ago",
    },
  ])
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "1",
      name: "Weather API",
      status: "connected",
      lastSync: "5 minutes ago",
      recordCount: 12458,
    },
    {
      id: "2",
      name: "Colony Database",
      status: "connected",
      lastSync: "12 minutes ago",
      recordCount: 5723,
    },
    {
      id: "3",
      name: "Historical Patterns",
      status: "syncing",
      lastSync: "1 hour ago",
      recordCount: 28945,
    },
    {
      id: "4",
      name: "Satellite Imagery",
      status: "connected",
      lastSync: "30 minutes ago",
      recordCount: 3621,
    },
  ])
  const [predictions, setPredictions] = useState<PredictionResult[]>([
    {
      id: "1",
      timestamp: Date.now() - 1000 * 60 * 30,
      confidence: 92.4,
      riskLevel: "high",
      affectedAreas: ["Lagos", "Ibadan"],
      factors: {
        humidity: 78,
        temperature: 82,
        populationDensity: 91,
        rodentActivity: 85,
      },
    },
    {
      id: "2",
      timestamp: Date.now() - 1000 * 60 * 120,
      confidence: 87.1,
      riskLevel: "moderate",
      affectedAreas: ["Abuja"],
      factors: {
        humidity: 65,
        temperature: 79,
        populationDensity: 72,
        rodentActivity: 61,
      },
    },
    {
      id: "3",
      timestamp: Date.now() - 1000 * 60 * 240,
      confidence: 95.8,
      riskLevel: "critical",
      affectedAreas: ["Lagos", "Ibadan", "Ondo"],
      factors: {
        humidity: 85,
        temperature: 88,
        populationDensity: 94,
        rodentActivity: 92,
      },
    },
  ])
  const [systemStatus, setSystemStatus] = useState({
    cpuUsage: 42,
    memoryUsage: 68,
    networkLatency: 24,
    uptime: "5 days, 7 hours",
    activeUsers: 8,
    pendingTasks: 3,
  })
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisSteps, setAnalysisSteps] = useState([
    { name: "Data Collection", status: "pending" },
    { name: "Pattern Recognition", status: "pending" },
    { name: "Risk Calculation", status: "pending" },
    { name: "Prediction Generation", status: "pending" },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    if (isRunningAnalysis) {
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsRunningAnalysis(false)

            // Add a new prediction
            const newPrediction: PredictionResult = {
              id: Date.now().toString(),
              timestamp: Date.now(),
              confidence: 91.2,
              riskLevel: "high",
              affectedAreas: ["Lagos", "Ibadan", "Kano"],
              factors: {
                humidity: 82,
                temperature: 85,
                populationDensity: 88,
                rodentActivity: 79,
              },
            }

            setPredictions((prev) => [newPrediction, ...prev])

            // Add a message about the new prediction
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: "assistant",
                content: `New prediction generated: HIGH risk level detected in Lagos, Ibadan, and Kano regions with 91.2% confidence. Recommend immediate preventive measures.`,
                timestamp: Date.now(),
              },
            ])

            return 100
          }

          // Update steps
          const stepIndex = Math.floor(prev / 25)
          if (stepIndex < analysisSteps.length) {
            setAnalysisSteps((steps) =>
              steps.map((step, i) => ({
                ...step,
                status: i < stepIndex ? "completed" : i === stepIndex ? "processing" : "pending",
              })),
            )
          }

          return prev + 5
        })
      }, 300)

      return () => clearInterval(interval)
    }
  }, [isRunningAnalysis])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setIsLoading(true)

    try {
      // Simulate AI response
      setTimeout(() => {
        let aiResponse = "I'm processing your request..."

        if (userMessage.toLowerCase().includes("weather")) {
          aiResponse =
            "Based on current weather patterns in West Africa, we're seeing increased humidity levels (78%) which could affect rodent habitats. The forecast shows potential heavy rainfall in Lagos region next week, which might increase the risk factors by approximately 15%."
        } else if (userMessage.toLowerCase().includes("risk") || userMessage.toLowerCase().includes("lassa")) {
          aiResponse =
            "The current risk assessment for Lassa fever shows moderate to high levels in Lagos and Ibadan regions. This is correlated with recent rainfall patterns and increased rodent population density. I recommend focusing monitoring efforts in these areas. The prediction model indicates a 68% probability of increased transmission in the next 30 days."
        } else if (userMessage.toLowerCase().includes("data") || userMessage.toLowerCase().includes("statistics")) {
          aiResponse =
            "Our latest data shows a 12% increase in Mastomys natalensis populations in urban areas following the recent rainfall. Historical patterns suggest this could lead to increased human contact in the coming weeks. The correlation coefficient between current environmental conditions and historical outbreak patterns is 0.83."
        } else if (userMessage.toLowerCase().includes("predict") || userMessage.toLowerCase().includes("forecast")) {
          aiResponse =
            "Running predictive analysis based on current data... The model forecasts a high risk scenario (confidence: 92.4%) for Lagos and Ibadan regions in the next 14-21 days. Key contributing factors include elevated humidity (78%), increased temperature (82°F), high population density (91/100), and significant rodent activity (85/100)."
        } else if (userMessage.toLowerCase().includes("recommend") || userMessage.toLowerCase().includes("action")) {
          aiResponse =
            "Based on current risk assessment, I recommend: 1) Increased surveillance in Lagos and Ibadan regions, 2) Implementation of rodent control measures in identified hotspots, 3) Public awareness campaigns about food storage and hygiene, 4) Preparation of healthcare facilities for potential cases. Would you like a detailed action plan for any of these recommendations?"
        } else {
          aiResponse =
            "I can help you with weather monitoring, rodent population tracking, risk assessment, predictive modeling, and recommended actions for Lassa fever prevention. Would you like me to show you the latest data for a specific region or run a new risk analysis?"
        }

        const newAiMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: aiResponse,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, newAiMessage])
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error generating AI response:", error)

      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "system",
        content: "Error processing request. Please try again.",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  const runNewAnalysis = () => {
    setIsRunningAnalysis(true)
    setAnalysisProgress(0)
    setAnalysisSteps((steps) =>
      steps.map((step) => ({
        ...step,
        status: "pending",
      })),
    )

    // Add a system message about starting analysis
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "system",
        content: "Initiating comprehensive risk analysis. This may take a moment...",
        timestamp: Date.now(),
      },
    ])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "connected":
        return "text-green-400"
      case "training":
      case "syncing":
        return "text-blue-400"
      case "offline":
      case "disconnected":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "online":
      case "connected":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>
      case "training":
      case "syncing":
        return (
          <div className="h-2 w-2 rounded-full bg-blue-500 relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          </div>
        )
      case "offline":
      case "disconnected":
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  return (
    <Card
      className={`bg-black/90 backdrop-blur-md border-cyan-500/30 shadow-[0_0_20px_rgba(0,255,255,0.3)] overflow-hidden transition-all duration-300 ${
        isFullPage ? "w-full h-full" : isExpanded ? "fixed inset-4 z-50" : isCollapsed ? "w-72" : "w-full max-w-5xl"
      }`}
    >
      <CardHeader className="pb-2 pt-3 border-b border-cyan-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-5 w-5 text-cyan-400" />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(34, 211, 238, 0)",
                    "0 0 0 4px rgba(34, 211, 238, 0.3)",
                    "0 0 0 0 rgba(34, 211, 238, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              DeepSeek AI Hub
            </CardTitle>
            <Badge variant="outline" className="text-[10px] h-4 border-cyan-500/30 text-cyan-400 px-1">
              v4.2.1
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-cyan-300"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-cyan-300"
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
            <TabsList className="h-10 bg-gray-900/50 border-b border-cyan-500/20 rounded-none px-2 justify-start gap-1">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-cyan-900/30 data-[state=active]:text-cyan-400 h-8 px-3"
              >
                <Brain className="h-4 w-4 mr-1" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-cyan-900/30 data-[state=active]:text-cyan-400 h-8 px-3"
              >
                <Terminal className="h-4 w-4 mr-1" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="models"
                className="data-[state=active]:bg-cyan-900/30 data-[state=active]:text-cyan-400 h-8 px-3"
              >
                <Brain className="h-4 w-4 mr-1" />
                Models
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="data-[state=active]:bg-cyan-900/30 data-[state=active]:text-cyan-400 h-8 px-3"
              >
                <Database className="h-4 w-4 mr-1" />
                Data
              </TabsTrigger>
              <TabsTrigger
                value="predictions"
                className="data-[state=active]:bg-cyan-900/30 data-[state=active]:text-cyan-400 h-8 px-3"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Predictions
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="data-[state=active]:bg-cyan-900/30 data-[state=active]:text-cyan-400 h-8 px-3"
              >
                <Cpu className="h-4 w-4 mr-1" />
                System
              </TabsTrigger>
              <TabsTrigger
                value="visualize"
                className="data-[state=active]:bg-cyan-900/30 data-[state=active]:text-cyan-400 h-8 px-3"
              >
                <Eye className="h-4 w-4 mr-1" />
                Visualize
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <NeuralCoreDashboard />
            </TabsContent>

            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0 data-[state=inactive]:hidden">
              <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-gray-900">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-2 ${
                        message.role === "user"
                          ? "bg-cyan-950/50 text-cyan-50 border border-cyan-500/30"
                          : message.role === "system"
                            ? "bg-purple-950/50 text-purple-50 border border-purple-500/30"
                            : "bg-gray-800/70 text-gray-200 border border-gray-700/30"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className={`text-xs font-medium ${
                            message.role === "user"
                              ? "text-cyan-400"
                              : message.role === "system"
                                ? "text-purple-400"
                                : "text-blue-400"
                          }`}
                        >
                          {message.role === "user" ? "You" : message.role === "system" ? "System" : "DeepSeek AI"}
                        </span>
                        <span className="text-[10px] text-gray-500 ml-2">{formatTimestamp(message.timestamp)}</span>
                      </div>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-2 bg-gray-800/70 border border-gray-700/30">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce"></div>
                        <div
                          className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-cyan-500/30 bg-gray-900/30">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about risk assessment, weather data, or predictions..."
                    className="bg-gray-800/50 border-gray-700/50 focus-visible:ring-cyan-500/50"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="models" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyan-400">AI Models</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-cyan-500/30 text-cyan-400">
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiModels.map((model) => (
                    <div key={model.id} className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm font-medium text-cyan-300">{model.name}</h4>
                          <p className="text-xs text-gray-400">v{model.version}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusIndicator(model.status)}
                          <span className={`text-xs ${getStatusColor(model.status)}`}>
                            {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Accuracy</span>
                            <span className="text-cyan-300">{model.accuracy}%</span>
                          </div>
                          <Progress value={model.accuracy} className="h-1" />
                        </div>

                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Last Updated</span>
                          <span className="text-gray-300">{model.lastUpdated}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 border-cyan-500/30 text-cyan-400 flex-1"
                        >
                          Details
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

                <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    <h4 className="text-sm font-medium text-cyan-300">Run New Analysis</h4>
                  </div>

                  {isRunningAnalysis ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-300">Analysis Progress</span>
                          <span className="text-cyan-300">{analysisProgress}%</span>
                        </div>
                        <Progress value={analysisProgress} className="h-1.5" />
                      </div>

                      <div className="space-y-2">
                        {analysisSteps.map((step, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {step.status === "pending" ? (
                              <div className="h-3 w-3 rounded-full border border-gray-600"></div>
                            ) : step.status === "processing" ? (
                              <RefreshCw className="h-3 w-3 text-cyan-400 animate-spin" />
                            ) : (
                              <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            )}
                            <span
                              className={`text-xs ${
                                step.status === "pending"
                                  ? "text-gray-400"
                                  : step.status === "processing"
                                    ? "text-cyan-300"
                                    : "text-green-300"
                              }`}
                            >
                              {step.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-300 mb-3">
                        Run a comprehensive analysis using all available models and data sources to generate new risk
                        predictions.
                      </p>
                      <Button
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs"
                        onClick={runNewAnalysis}
                      >
                        Start Analysis
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyan-400">Data Sources</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-cyan-500/30 text-cyan-400">
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    Sync All
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dataSources.map((source) => (
                    <div key={source.id} className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-cyan-300">{source.name}</h4>
                        <div className="flex items-center gap-1.5">
                          {getStatusIndicator(source.status)}
                          <span className={`text-xs ${getStatusColor(source.status)}`}>
                            {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Sync</span>
                          <span className="text-gray-300">{source.lastSync}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Records</span>
                          <span className="text-gray-300">{source.recordCount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 border-cyan-500/30 text-cyan-400 flex-1"
                        >
                          View Data
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 border-cyan-500/30 text-cyan-400 flex-1"
                        >
                          Sync Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-cyan-300 mb-2">Data Integration</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">Total Records</span>
                      <span className="text-cyan-300">50,747</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">Last Full Sync</span>
                      <span className="text-cyan-300">Today, 08:45 AM</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">Data Freshness</span>
                      <span className="text-green-400">Good</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">Sync Schedule</span>
                      <span className="text-cyan-300">Every 15 minutes</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs">Add New Data Source</Button>
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyan-400">Risk Predictions</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-cyan-500/30 text-cyan-400">
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    Refresh
                  </Button>
                </div>

                {predictions.map((prediction) => (
                  <div key={prediction.id} className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-cyan-300">Prediction #{prediction.id}</h4>
                        <p className="text-xs text-gray-400">{formatTimestamp(prediction.timestamp)}</p>
                      </div>
                      <Badge className={`${getRiskColor(prediction.riskLevel)} uppercase text-[10px]`}>
                        {prediction.riskLevel}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Confidence</span>
                          <span className="text-cyan-300">{prediction.confidence}%</span>
                        </div>
                        <Progress value={prediction.confidence} className="h-1" />
                      </div>

                      <div className="text-xs">
                        <span className="text-gray-400">Affected Areas: </span>
                        <span className="text-gray-300">{prediction.affectedAreas.join(", ")}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(prediction.factors).map(([factor, value]) => (
                          <div key={factor} className="flex justify-between">
                            <span className="text-gray-400 capitalize">{factor}</span>
                            <span className="text-gray-300">{value}%</span>
                          </div>
                        ))}
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
                        Export
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs"
                  onClick={runNewAnalysis}
                  disabled={isRunningAnalysis}
                >
                  {isRunningAnalysis ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" />
                      Generating Prediction...
                    </>
                  ) : (
                    "Generate New Prediction"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="system" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyan-400">System Status</h3>
                  <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-400">
                    Operational
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-cyan-300 mb-2">Resource Usage</h4>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">CPU Usage</span>
                          <span className="text-cyan-300">{systemStatus.cpuUsage}%</span>
                        </div>
                        <Progress value={systemStatus.cpuUsage} className="h-1" />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Memory Usage</span>
                          <span className="text-cyan-300">{systemStatus.memoryUsage}%</span>
                        </div>
                        <Progress value={systemStatus.memoryUsage} className="h-1" />
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Network Latency</span>
                        <span className="text-cyan-300">{systemStatus.networkLatency} ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-cyan-300 mb-2">System Info</h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Uptime</span>
                        <span className="text-gray-300">{systemStatus.uptime}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Users</span>
                        <span className="text-gray-300">{systemStatus.activeUsers}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Pending Tasks</span>
                        <span className="text-gray-300">{systemStatus.pendingTasks}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Backup</span>
                        <span className="text-gray-300">Today, 06:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-cyan-300 mb-2">System Logs</h4>

                  <div className="bg-black/50 rounded p-2 font-mono text-xs text-gray-300 h-32 overflow-y-auto">
                    <p className="text-green-400">[08:45:12] System startup complete</p>
                    <p className="text-cyan-400">[08:47:23] Data sync initiated for all sources</p>
                    <p className="text-cyan-400">[08:52:18] Data sync completed successfully</p>
                    <p className="text-yellow-400">[09:15:32] Warning: High network latency detected (45ms)</p>
                    <p className="text-cyan-400">[09:22:45] AI model DeepSeek Core loaded</p>
                    <p className="text-cyan-400">[09:23:12] AI model RiskPredictor loaded</p>
                    <p className="text-yellow-400">[09:25:30] Warning: Memory usage above 65%</p>
                    <p className="text-cyan-400">[09:30:15] Risk analysis completed for Lagos region</p>
                    <p className="text-red-400">[09:45:22] Alert: High risk level detected in Lagos</p>
                    <p className="text-cyan-400">[10:00:05] Scheduled data sync started</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs border-cyan-500/30 text-cyan-400 flex-1">
                    System Diagnostics
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs border-cyan-500/30 text-cyan-400 flex-1">
                    View All Logs
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visualize" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyan-400">Data Visualization</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-cyan-500/30 text-cyan-400">
                    <Layers className="h-3 w-3 mr-1.5" />
                    Toggle Layers
                  </Button>
                </div>

                <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-cyan-300 mb-2">Risk Heatmap</h4>

                  <div className="relative h-48 bg-black/30 rounded-lg overflow-hidden border border-gray-800/50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Map className="h-8 w-8 text-gray-700" />
                      <span className="absolute text-xs text-gray-500">Map Visualization</span>
                    </div>

                    {/* Simulated heatmap overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-radial from-red-500/20 via-yellow-500/10 to-transparent"
                      style={{ left: "30%", top: "40%", width: "40%", height: "40%" }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-radial from-orange-500/20 via-yellow-500/10 to-transparent"
                      style={{ left: "60%", top: "20%", width: "30%", height: "30%" }}
                    ></div>

                    {/* Colony markers */}
                    <div
                      className="absolute h-2 w-2 rounded-full bg-red-500 animate-pulse"
                      style={{ left: "35%", top: "45%" }}
                    ></div>
                    <div
                      className="absolute h-2 w-2 rounded-full bg-yellow-500"
                      style={{ left: "65%", top: "25%" }}
                    ></div>
                    <div
                      className="absolute h-2 w-2 rounded-full bg-green-500"
                      style={{ left: "50%", top: "65%" }}
                    ></div>

                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                  </div>

                  <div className="mt-2 flex justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="text-gray-300">High Risk</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <span className="text-gray-300">Moderate Risk</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-gray-300">Low Risk</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-cyan-300 mb-2">Risk Factors</h4>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Humidity</span>
                          <span className="text-cyan-300">78%</span>
                        </div>
                        <Progress value={78} className="h-1" />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Temperature</span>
                          <span className="text-cyan-300">82%</span>
                        </div>
                        <Progress value={82} className="h-1" />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Population Density</span>
                          <span className="text-cyan-300">91%</span>
                        </div>
                        <Progress value={91} className="h-1" />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Rodent Activity</span>
                          <span className="text-cyan-300">85%</span>
                        </div>
                        <Progress value={85} className="h-1" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-cyan-300 mb-2">Regional Analysis</h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Lagos</span>
                        <div className="flex items-center gap-1">
                          <span className="text-red-400">High Risk</span>
                          <AlertTriangle className="h-3 w-3 text-red-400" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Ibadan</span>
                        <div className="flex items-center gap-1">
                          <span className="text-red-400">High Risk</span>
                          <AlertTriangle className="h-3 w-3 text-red-400" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Abuja</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">Moderate Risk</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Kano</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">Moderate Risk</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Port Harcourt</span>
                        <div className="flex items-center gap-1">
                          <span className="text-green-400">Low Risk</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs">
                  Open Full Visualization Dashboard
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}
