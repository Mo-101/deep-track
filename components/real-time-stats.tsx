"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, AlertTriangle, Cpu } from "lucide-react"
import { useRealTimeStore } from "@/lib/real-time-service"
import { RealTimeStatus } from "@/components/real-time-status"

export function RealTimeStats() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { rodentSightings, lassaCases, colonies, paths, outbreaks, alerts } = useRealTimeStore()

  // Calculate risk level based on data
  const calculateRiskLevel = () => {
    const criticalAlerts = alerts.filter((a) => a.type === "critical" && !a.acknowledged).length
    const activeOutbreaks = outbreaks.filter((o) => o.status === "active").length
    const highRiskColonies = colonies.filter((c) => c.risk === "high").length

    if (criticalAlerts > 0 || activeOutbreaks > 0) return "critical"
    if (highRiskColonies > 0) return "high"
    if (rodentSightings.length > 10) return "moderate"
    return "low"
  }

  const riskLevel = calculateRiskLevel()

  // Calculate system load (mock data)
  const systemLoad = {
    cpu: 42,
    memory: 68,
    network: 35,
    storage: 51,
  }

  return (
    <Card className="w-72 bg-black/80 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/20">
      <CardHeader className="pb-1 pt-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text text-transparent">
            <span className="animate-pulse">📊</span> REAL-TIME STATS
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
            {/* Connection Status */}
            <div className="flex items-center justify-between text-xs">
              <RealTimeStatus />
            </div>

            {/* Entity Counts */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Total Entities</span>
                <span className="text-cyan-400">
                  {rodentSightings.length + lassaCases.length + colonies.length + paths.length + outbreaks.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Rodent Sightings</span>
                  <span className="text-cyan-300">{rodentSightings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lassa Cases</span>
                  <span className="text-cyan-300">{lassaCases.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Colonies</span>
                  <span className="text-cyan-300">{colonies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Paths</span>
                  <span className="text-cyan-300">{paths.length}</span>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs text-gray-300">Risk Assessment</span>
                </div>
                <Badge
                  className={`text-[10px] ${
                    riskLevel === "critical"
                      ? "bg-red-500/20 text-red-400"
                      : riskLevel === "high"
                        ? "bg-orange-500/20 text-orange-400"
                        : riskLevel === "moderate"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {riskLevel.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Active Outbreaks</span>
                  <span className="text-red-400">{outbreaks.filter((o) => o.status === "active").length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Unacknowledged Alerts</span>
                  <span className="text-amber-400">{alerts.filter((a) => !a.acknowledged).length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">High Risk Colonies</span>
                  <span className="text-orange-400">{colonies.filter((c) => c.risk === "high").length}</span>
                </div>
              </div>
            </div>

            {/* System Load */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs text-gray-300">System Load</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">CPU</span>
                    <span className="text-purple-400">{systemLoad.cpu}%</span>
                  </div>
                  <Progress value={systemLoad.cpu} className="h-1" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Memory</span>
                    <span className="text-purple-400">{systemLoad.memory}%</span>
                  </div>
                  <Progress value={systemLoad.memory} className="h-1" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
