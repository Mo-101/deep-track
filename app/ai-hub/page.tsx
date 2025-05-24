"use client"

import { WebSocketProvider } from "@/components/websocket-provider"
import { PredictionFeed } from "@/components/prediction-feed"

export default function AIHubPage() {
  // Get WebSocket URL from environment variable
  const wsUrl = process.env.NEXT_PUBLIC_PREDICTION_WS_URL || ""

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">AI Prediction Hub</h1>

      <WebSocketProvider wsUrl={wsUrl}>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Real-Time Predictions</h2>
          <PredictionFeed />
        </div>
      </WebSocketProvider>
    </div>
  )
}
