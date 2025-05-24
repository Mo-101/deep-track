"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Database, AlertTriangle } from "lucide-react"

export function ColoniesPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Card className="w-72 bg-black/80 backdrop-blur-sm border-primary/30 shadow-lg shadow-primary/20">
      <CardHeader className="pb-1 pt-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">
            <span className="animate-pulse">🔍</span> COLONIES MONITOR
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
              <Database className="h-4 w-4 text-blue-400" />
              <span>5 active colonies detected</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-300">Colony Alpha</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Risk:</span>
                  <span className="text-red-400">High</span>
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-300">Colony Beta</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Risk:</span>
                  <span className="text-yellow-400">Moderate</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-300">Colony Gamma</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Risk:</span>
                  <span className="text-green-400">Low</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-300">Colony Delta</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Risk:</span>
                  <span className="text-red-400">High</span>
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-blue-300">Colony Epsilon</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Risk:</span>
                  <span className="text-yellow-400">Moderate</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs border-blue-500/30 text-blue-400 hover:bg-blue-950/30"
            >
              View Detailed Colony Data
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
