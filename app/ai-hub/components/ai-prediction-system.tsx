"use client"

import { Brain } from "lucide-react"

export function AIPredictionSystem() {
  const locations = [
    { name: "Lagos", risk: "HIGH", percentage: 87, trend: "up" },
    { name: "Ibadan", risk: "MODERATE", percentage: 72, trend: "stable" },
    { name: "Abuja", risk: "LOW", percentage: 91, trend: "down" },
  ]

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-4 w-4 text-cyan-400" />
        <span className="text-sm font-mono text-cyan-400">AI PREDICTION SYSTEM</span>
      </div>

      <div className="space-y-3">
        {locations.map((location) => (
          <div key={location.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  location.risk === "HIGH"
                    ? "bg-red-500/20 text-red-400"
                    : location.risk === "MODERATE"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                }`}
              >
                {location.risk}
              </span>
              <span className="text-sm text-gray-300">{location.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">{location.percentage}%</span>
              <span className="text-gray-400">
                {location.trend === "up" ? "↑" : location.trend === "down" ? "↓" : "—"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">AI CONFIDENCE</span>
            <span className="text-cyan-400">89%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-[89%] bg-cyan-400 rounded-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">PREDICTION ACCURACY:</span>
            <span className="text-cyan-400">92%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">NEURAL CORE STATUS:</span>
            <span className="text-green-400">OPTIMAL</span>
          </div>
        </div>
      </div>
    </div>
  )
}
