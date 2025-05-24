"use client"

import type React from "react"

import { useEffect } from "react"
import { WebSocketService } from "@/lib/websocket-service"
import { usePredictionStore } from "@/stores/prediction-store"

interface WebSocketProviderProps {
  children: React.ReactNode
  wsUrl: string
}

export function WebSocketProvider({ children, wsUrl }: WebSocketProviderProps) {
  const setConnectionStatus = usePredictionStore((state) => state.setConnectionStatus)

  useEffect(() => {
    if (!wsUrl) {
      console.error("WebSocket URL is not defined")
      setConnectionStatus("disconnected")
      return
    }

    // Initialize WebSocket service
    const wsService = WebSocketService.getInstance({
      url: wsUrl,
      reconnectInterval: 2000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
    })

    // Cleanup on unmount
    return () => {
      WebSocketService.destroyInstance()
    }
  }, [wsUrl, setConnectionStatus])

  return <>{children}</>
}
