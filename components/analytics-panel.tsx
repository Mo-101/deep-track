"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, BarChart2 } from "lucide-react"
import { RiskChart } from "@/components/risk-chart"

export function AnalyticsPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Card className="w-72 bg-black/80 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/20">
      <CardHeader className="pb-1 pt-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            <span className="animate-pulse">📊</span> ANALYTICS
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
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <BarChart2 className="h-4 w-4 text-purple-400" />
              <span>Risk Trend Analysis</span>
            </div>

            <RiskChart />

            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Prediction Confidence:</span>
                <span className="text-purple-300">83%</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Data Points:</span>
                <span className="text-purple-300">1,245</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Trend Direction:</span>
                <span className="text-red-400">Increasing</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs border-purple-500/30 text-purple-400 hover:bg-purple-950/30"
            >
              View Full Analytics Dashboard
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
