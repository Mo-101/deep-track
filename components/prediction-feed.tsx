"use client"

import { usePredictionStore, type RiskLevel } from "@/stores/prediction-store"
import { PredictionCard } from "./prediction-card"
import { ConnectionStatus } from "./connection-status"
import { useEffect } from "react"

export function PredictionFeed() {
  const predictions = usePredictionStore((state) => state.filteredPredictions)
  const connectionStatus = usePredictionStore((state) => state.connectionStatus)
  const filter = usePredictionStore((state) => state.filter)
  const setFilter = usePredictionStore((state) => state.setFilter)

  // Set initial filter on mount
  useEffect(() => {
    setFilter("all")
  }, [setFilter])

  const filterOptions: { value: RiskLevel | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "low", label: "Low Risk" },
    { value: "medium", label: "Medium Risk" },
    { value: "high", label: "High Risk" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <ConnectionStatus status={connectionStatus} />

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1.5 text-sm rounded-md ${
                filter === option.value
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {predictions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">
            {connectionStatus === "connected"
              ? "No predictions available. Waiting for data..."
              : connectionStatus === "connecting"
                ? "Connecting to prediction service..."
                : "Disconnected from prediction service. Please check your connection."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predictions.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>
      )}
    </div>
  )
}
