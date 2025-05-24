"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cpu, Zap, Brain, Mic, MicOff, Activity } from "lucide-react"

export function NeuralCoreDashboard() {
  const [activeAgents, setActiveAgents] = useState(8)
  const [apiLatency, setApiLatency] = useState(24)
  const [computeUsage, setComputeUsage] = useState({
    training: 45,
    inference: 30,
    database: 25,
  })
  const [isListening, setIsListening] = useState(false)
  const [voiceCommand, setVoiceCommand] = useState("")
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [systemStatus, setSystemStatus] = useState("OPERATIONAL")
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString())

  // Simulate changing metrics
  useEffect(() => {
    const interval = setInterval(() => {
      // Update active agents (random fluctuation between 7-12)
      setActiveAgents((prev) => Math.max(7, Math.min(12, prev + Math.floor(Math.random() * 3) - 1)))

      // Update API latency (random fluctuation between 18-35ms)
      setApiLatency((prev) => Math.max(18, Math.min(35, prev + Math.floor(Math.random() * 5) - 2)))

      // Update compute usage
      setComputeUsage((prev) => {
        const trainingDelta = Math.floor(Math.random() * 6) - 2
        const inferenceDelta = Math.floor(Math.random() * 4) - 2
        const databaseDelta = Math.floor(Math.random() * 3) - 1

        return {
          training: Math.max(30, Math.min(60, prev.training + trainingDelta)),
          inference: Math.max(20, Math.min(40, prev.inference + inferenceDelta)),
          database: Math.max(15, Math.min(35, prev.database + databaseDelta)),
        }
      })

      // Update time
      setCurrentTime(new Date().toLocaleTimeString())
      setCurrentDate(new Date().toLocaleDateString())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Handle voice command
  const handleVoiceCommand = () => {
    setIsListening(true)

    // Simulate voice recognition
    setTimeout(() => {
      setVoiceCommand("Show agent diagnostics")
      setIsListening(false)

      // Process command
      setTimeout(() => {
        setShowDiagnostics(true)
        setVoiceCommand("")
      }, 1000)
    }, 2000)
  }

  return (
    <div className="neural-core-dashboard relative w-full overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 z-0"></div>

      {/* Header */}
      <div className="relative z-10 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
              NEURAL CORE DASHBOARD
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              <span className="text-cyan-400">SYS:</span> {systemStatus} <span className="text-cyan-400">|</span>{" "}
              <span className="text-purple-400">{currentDate}</span> <span className="text-cyan-400">|</span>{" "}
              <span className="text-pink-400">{currentTime}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-cyan-500/30 bg-black/50 text-cyan-400 hover:bg-cyan-950/30"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
            >
              <Activity className="h-3.5 w-3.5 mr-1.5" />
              Diagnostics
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`h-8 w-8 rounded-full ${isListening ? "border-pink-500/50 bg-pink-950/30 text-pink-400 animate-pulse" : "border-gray-700/50 bg-black/50 text-gray-400 hover:bg-gray-900 hover:text-cyan-400 hover:border-cyan-500/30"}`}
              onClick={handleVoiceCommand}
            >
              {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Voice command display */}
        <AnimatePresence>
          {voiceCommand && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 bg-black/80 border border-cyan-500/30 rounded-md px-3 py-1.5 text-sm font-mono text-cyan-400"
            >
              <span className="text-pink-400">&gt;</span> {voiceCommand}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Active AI Agents */}
        <Card className="bg-black/80 border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.15)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono flex items-center gap-2">
              <Brain className="h-4 w-4 text-cyan-400" />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                ACTIVE AI AGENTS
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="relative">
                <div className="text-5xl font-mono font-bold text-center text-cyan-400">{activeAgents}</div>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(34, 211, 238, 0)",
                      "0 0 0 10px rgba(34, 211, 238, 0.2)",
                      "0 0 0 0 rgba(34, 211, 238, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1 mt-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-full rounded-full ${i < activeAgents ? "bg-cyan-500" : "bg-gray-800"}`}
                />
              ))}
            </div>

            <div className="mt-3 text-xs text-gray-400 font-mono">
              <div className="flex justify-between">
                <span>AGENT POOL:</span>
                <span className="text-cyan-400">12</span>
              </div>
              <div className="flex justify-between">
                <span>UTILIZATION:</span>
                <span className="text-cyan-400">{Math.round((activeAgents / 12) * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Latency */}
        <Card className="bg-black/80 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                API LATENCY
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-4">
              <div className="text-5xl font-mono font-bold text-purple-400">{apiLatency}</div>
              <div className="text-xl font-mono text-gray-500">ms</div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">CURRENT</span>
                <span
                  className={`${apiLatency < 25 ? "text-green-400" : apiLatency < 30 ? "text-yellow-400" : "text-red-400"}`}
                >
                  {apiLatency < 25 ? "OPTIMAL" : apiLatency < 30 ? "ACCEPTABLE" : "DEGRADED"}
                </span>
              </div>

              <Progress
                value={100 - ((apiLatency - 18) / (35 - 18)) * 100}
                className="h-1.5"
                indicatorClassName={`${apiLatency < 25 ? "bg-green-500" : apiLatency < 30 ? "bg-yellow-500" : "bg-red-500"}`}
              />

              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>18ms</span>
                <span>35ms</span>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-400 font-mono">
              <div className="flex justify-between">
                <span>24h AVG:</span>
                <span className="text-purple-400">26ms</span>
              </div>
              <div className="flex justify-between">
                <span>PEAK:</span>
                <span className="text-purple-400">42ms</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Compute Usage */}
        <Card className="bg-black/80 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono flex items-center gap-2">
              <Cpu className="h-4 w-4 text-pink-400" />
              <span className="bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                COMPUTE USAGE
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[120px] w-[120px] mx-auto my-2">
              {/* Simulated 3D pie chart with CSS */}
              <div
                className="absolute inset-0 rounded-full border-8 border-transparent border-t-pink-500 border-r-cyan-500 border-b-purple-500 animate-spin"
                style={{ animationDuration: "10s" }}
              ></div>
              <div
                className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-400 border-r-cyan-400 border-b-purple-400 animate-spin"
                style={{ animationDuration: "7s", animationDirection: "reverse" }}
              ></div>
              <div className="absolute inset-4 rounded-full bg-black/80 flex items-center justify-center">
                <div className="text-2xl font-mono font-bold text-pink-400">
                  {computeUsage.training + computeUsage.inference + computeUsage.database}%
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                  <span className="text-gray-400">TRAINING:</span>
                </div>
                <span className="text-pink-400">{computeUsage.training}%</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                  <span className="text-gray-400">INFERENCE:</span>
                </div>
                <span className="text-cyan-400">{computeUsage.inference}%</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-gray-400">DATABASE:</span>
                </div>
                <span className="text-purple-400">{computeUsage.database}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Diagnostics Panel */}
      <AnimatePresence>
        {showDiagnostics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 bg-black/80 border border-cyan-500/30 rounded-lg p-4 relative z-10"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-mono font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                SYSTEM DIAGNOSTICS
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-gray-400 hover:text-cyan-400"
                onClick={() => setShowDiagnostics(false)}
              >
                CLOSE
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-cyan-400">NEURAL NETWORK STATUS</h4>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">PRIMARY CORTEX:</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">ONLINE</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">INFERENCE ENGINE:</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">ONLINE</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">TRAINING CLUSTER:</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">ACTIVE</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">MEMORY BANKS:</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">ONLINE</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono text-purple-400">RESOURCE ALLOCATION</h4>
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-gray-400">GPU MEMORY:</span>
                      <span className="text-purple-400">78%</span>
                    </div>
                    <Progress value={78} className="h-1" indicatorClassName="bg-purple-500" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-gray-400">CPU USAGE:</span>
                      <span className="text-purple-400">42%</span>
                    </div>
                    <Progress value={42} className="h-1" indicatorClassName="bg-purple-500" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-gray-400">MEMORY:</span>
                      <span className="text-purple-400">65%</span>
                    </div>
                    <Progress value={65} className="h-1" indicatorClassName="bg-purple-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono text-pink-400">SYSTEM LOGS</h4>
                <div className="bg-black/50 rounded p-2 font-mono text-[10px] text-gray-300 h-[80px] overflow-y-auto">
                  <p className="text-green-400">[08:45:12] Neural Core initialized</p>
                  <p className="text-cyan-400">[08:47:23] Agent pool connected</p>
                  <p className="text-cyan-400">[08:52:18] Training pipeline active</p>
                  <p className="text-yellow-400">[09:15:32] Warning: API latency spike (35ms)</p>
                  <p className="text-cyan-400">[09:22:45] Model checkpoint saved</p>
                  <p className="text-yellow-400">[09:25:30] Warning: Memory usage above 65%</p>
                  <p className="text-cyan-400">[09:30:15] Inference request processed</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Assistant Orb */}
      <div className="fixed bottom-20 right-6 z-20">
        <motion.div
          className={`relative h-12 w-12 rounded-full ${isListening ? "bg-pink-900/50 border-2 border-pink-500/50" : "bg-gray-900/50 border-2 border-cyan-500/30"} flex items-center justify-center cursor-pointer shadow-lg`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleVoiceCommand}
        >
          {isListening ? <Mic className="h-5 w-5 text-pink-400" /> : <MicOff className="h-5 w-5 text-cyan-400" />}

          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: isListening
                ? ["0 0 0 0 rgba(236,72,153,0)", "0 0 0 10px rgba(236,72,153,0.3)", "0 0 0 0 rgba(236,72,153,0)"]
                : ["0 0 0 0 rgba(34,211,238,0)", "0 0 0 4px rgba(34,211,238,0.2)", "0 0 0 0 rgba(34,211,238,0)"],
            }}
            transition={{ duration: isListening ? 1 : 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>
      </div>
    </div>
  )
}
