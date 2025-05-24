import type { ConnectionStatus as PredictionStatus } from "@/stores/prediction-store"
import { AlertCircle, CheckCircle, WifiOff } from "lucide-react"

interface ConnectionStatusProps {
  status: PredictionStatus
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const statusConfig = {
    connected: {
      icon: <CheckCircle className="h-4 w-4" />,
      text: "Connected",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    connecting: {
      icon: <AlertCircle className="h-4 w-4 animate-pulse" />,
      text: "Connecting...",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    disconnected: {
      icon: <WifiOff className="h-4 w-4" />,
      text: "Disconnected",
      className: "bg-red-100 text-red-800 border-red-300",
    },
  }

  const config = statusConfig[status]

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  )
}
