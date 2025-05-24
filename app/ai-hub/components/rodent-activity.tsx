"use client"

import { MousePointer2 } from "lucide-react"

export function RodentActivity() {
  const locations = [
    { name: "Lagos", count: 42, trend: "up" },
    { name: "Ibadan", count: 28, trend: "stable" },
    { name: "Abuja", count: 12, trend: "down" },
  ]

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <MousePointer2 className="h-4 w-4 text-pink-400" />
        <span className="text-sm font-mono text-pink-400">RODENT ACTIVITY</span>
      </div>

      <div className="space-y-3">
        {locations.map((location) => (
          <div key={location.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  location.count > 40
                    ? "bg-red-500/20 text-red-400"
                    : location.count > 20
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                }`}
              >
                {location.count > 40 ? "HIGH" : location.count > 20 ? "MODERATE" : "LOW"}
              </span>
              <span className="text-sm text-gray-300">{location.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pink-400">{location.count}</span>
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
            <span className="text-gray-400">DETECTION CONFIDENCE</span>
            <span className="text-pink-400">89%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-[89%] bg-pink-400 rounded-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">TOTAL DETECTIONS:</span>
            <span className="text-pink-400">149</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">24H CHANGE:</span>
            <span className="text-green-400">+12%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
