"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Activity, ArrowRight, Zap } from "lucide-react"

type Alert = {
  id: string
  type: "outbreak" | "movement" | "activity"
  message: string
  timestamp: number
  probability?: number
}

export function AlertTicker() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  // Simulate receiving alerts
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: "1",
        type: "outbreak",
        message: "CRITICAL: Lassa fever outbreak predicted in Colony Beta",
        timestamp: Date.now(),
        probability: 76,
      },
      {
        id: "2",
        type: "movement",
        message: "Movement detected between Colony Alpha and Colony Gamma",
        timestamp: Date.now() - 5000,
      },
      {
        id: "3",
        type: "activity",
        message: "Increased rodent activity in Colony Delta",
        timestamp: Date.now() - 10000,
      },
      {
        id: "4",
        type: "outbreak",
        message: "WARNING: Potential outbreak conditions in Colony Epsilon",
        timestamp: Date.now() - 15000,
        probability: 42,
      },
    ]

    setAlerts(mockAlerts)

    // Auto-scroll the ticker
    const scrollInterval = setInterval(() => {
      if (scrollRef.current) {
        const scrollElement = scrollRef.current
        const scrollAmount = 1

        if (scrollElement.scrollLeft >= scrollElement.scrollWidth - scrollElement.clientWidth) {
          scrollElement.scrollLeft = 0
        } else {
          scrollElement.scrollLeft += scrollAmount
        }
      }
    }, 30)

    return () => clearInterval(scrollInterval)
  }, [])

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "outbreak":
        return (
          <div className="relative">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500/50"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        )
      case "movement":
        return (
          <div className="relative">
            <ArrowRight className="h-5 w-5 text-cyan-500" />
            <motion.div
              className="absolute inset-0"
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        )
      case "activity":
        return (
          <div className="relative">
            <Activity className="h-5 w-5 text-yellow-500" />
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        )
      default:
        return <Zap className="h-5 w-5 text-white" />
    }
  }

  return (
    <div className="alert-ticker fixed bottom-0 w-full z-[1001]">
      <div className="bg-black/80 backdrop-blur-md border-t border-cyan-500/30 h-10">
        <div ref={scrollRef} className="scroll-content h-10 flex items-center whitespace-nowrap overflow-x-hidden">
          <div className="inline-flex animate-marquee">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center gap-2 px-4 py-1 mx-4 border-l-4 ${
                  alert.type === "outbreak"
                    ? "border-l-red-500"
                    : alert.type === "movement"
                      ? "border-l-cyan-500"
                      : "border-l-yellow-500"
                }`}
              >
                {getAlertIcon(alert.type)}
                <span className="text-sm text-white font-medium">{alert.message}</span>
                {alert.probability && (
                  <span className="text-xs text-white/70 ml-2">({alert.probability}% probability)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
