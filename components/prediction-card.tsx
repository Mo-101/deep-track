"use client"

import type { Prediction, RiskLevel } from "@/stores/prediction-store"
import { useState } from "react"
import { FeedbackModal } from "./feedback-modal"

interface PredictionCardProps {
  prediction: Prediction
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const [showFeedback, setShowFeedback] = useState(false)

  const riskColors: Record<RiskLevel, string> = {
    low: "bg-green-50 border-green-200",
    medium: "bg-yellow-50 border-yellow-200",
    high: "bg-red-50 border-red-200",
  }

  const riskBadgeColors: Record<RiskLevel, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className={`rounded-lg border p-4 ${riskColors[prediction.risk_level]}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">
            {prediction.location.region ||
              `${prediction.location.latitude.toFixed(2)}, ${prediction.location.longitude.toFixed(2)}`}
          </h3>
          <p className="text-sm text-gray-500">{formatDate(prediction.timestamp)}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${riskBadgeColors[prediction.risk_level]}`}>
          {prediction.risk_level.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Risk Score</span>
            <span>{(prediction.risk_score * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${prediction.risk_score * 100}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Confidence</span>
            <span>{prediction.confidence.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${prediction.confidence}%` }}></div>
          </div>
        </div>

        {prediction.factors && (
          <div className="pt-2 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-2">Contributing Factors</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(prediction.factors).map(
                ([key, value]) =>
                  value !== undefined && (
                    <div key={key} className="text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        <span>{value.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-gray-500 h-1.5 rounded-full" style={{ width: `${value}%` }}></div>
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowFeedback(true)}
          className="w-full mt-3 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50"
        >
          Provide Feedback
        </button>
      </div>

      {showFeedback && <FeedbackModal predictionId={prediction.id} onClose={() => setShowFeedback(false)} />}
    </div>
  )
}
