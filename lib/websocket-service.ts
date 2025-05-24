import { usePredictionStore } from "@/stores/prediction-store"

interface WebSocketConfig {
  url: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
}

export class WebSocketService {
  private static instance: WebSocketService | null = null
  private socket: WebSocket | null = null
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private missedHeartbeats = 0
  private config: WebSocketConfig

  private constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 2000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config,
    }
    this.connect()
  }

  public static getInstance(config: WebSocketConfig): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(config)
    }
    return WebSocketService.instance
  }

  public static destroyInstance(): void {
    if (WebSocketService.instance) {
      WebSocketService.instance.disconnect()
      WebSocketService.instance = null
    }
  }

  private connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      usePredictionStore.getState().setConnectionStatus("connecting")

      this.socket = new WebSocket(this.config.url)

      this.socket.onopen = this.handleOpen.bind(this)
      this.socket.onmessage = this.handleMessage.bind(this)
      this.socket.onclose = this.handleClose.bind(this)
      this.socket.onerror = this.handleError.bind(this)
    } catch (error) {
      console.error("WebSocket connection error:", error)
      this.scheduleReconnect()
    }
  }

  private handleOpen(event: Event): void {
    console.log("WebSocket connected")
    usePredictionStore.getState().setConnectionStatus("connected")
    this.reconnectAttempts = 0
    this.startHeartbeat()
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data)

      // Reset heartbeat counter on any message
      this.missedHeartbeats = 0

      // Handle different message types
      switch (data.type) {
        case "prediction":
          usePredictionStore.getState().addPrediction(data.payload)
          break
        case "heartbeat":
          // Heartbeat response received, nothing else to do
          break
        case "error":
          console.error("Server error:", data.payload)
          break
        default:
          console.warn("Unknown message type:", data.type)
      }
    } catch (error) {
      console.error("Error parsing message:", error)
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket closed: ${event.code} ${event.reason}`)
    usePredictionStore.getState().setConnectionStatus("disconnected")
    this.stopHeartbeat()
    this.scheduleReconnect()
  }

  private handleError(event: Event): void {
    console.error("WebSocket error:", event)
    usePredictionStore.getState().setConnectionStatus("disconnected")
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    if (this.reconnectAttempts < this.config.maxReconnectAttempts!) {
      const delay = Math.min(this.config.reconnectInterval! * Math.pow(1.5, this.reconnectAttempts), 30000)

      console.log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`)

      this.reconnectTimer = setTimeout(() => {
        this.reconnectAttempts++
        this.connect()
      }, delay)
    } else {
      console.error(`Max reconnect attempts (${this.config.maxReconnectAttempts}) reached`)
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()

    this.heartbeatTimer = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.missedHeartbeats++

        if (this.missedHeartbeats >= 2) {
          console.warn(`Missed ${this.missedHeartbeats} heartbeats, reconnecting...`)
          this.socket.close()
          return
        }

        this.socket.send(JSON.stringify({ type: "heartbeat" }))
      }
    }, this.config.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  public disconnect(): void {
    this.stopHeartbeat()

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  public send(data: any): boolean {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data))
      return true
    }
    return false
  }
}
