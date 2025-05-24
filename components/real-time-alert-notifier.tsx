"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Alert {
  id: string
  type: "info" | "warning" | "critical"
  message: string
  timestamp: number
  location?: string
}

interface RealTimeAlertNotifierProps {
  onAlertClick?: (alert: Alert) => void
}

export function RealTimeAlertNotifier({ onAlertClick }: RealTimeAlertNotifierProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null)
  const [showAlert, setShowAlert] = useState(false)

  // Add ESC key close support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAlert(false)
        if (currentAlert) {
          setAlerts((prev) => prev.filter((a) => a.id !== currentAlert.id))
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [currentAlert])

  // Simulate incoming alerts
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: "alert-1",
        type: "warning",
        message: "Increased rodent activity detected in Lagos region",
        timestamp: Date.now() - 5000,
        location: "Lagos",
      },
      {
        id: "alert-2",
        type: "critical",
        message: "Potential Lassa fever outbreak in Ibadan",
        timestamp: Date.now() - 10000,
        location: "Ibadan",
      },
    ]
    setAlerts(mockAlerts)

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: Math.random() > 0.3 ? "warning" : "critical",
          message: Math.random() > 0.5 ? "New rodent colony detected" : "Potential Lassa fever case reported",
          timestamp: Date.now(),
          location: Math.random() > 0.5 ? "Kano" : "Abuja",
        }
        setAlerts((prev) => [...prev, newAlert])
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Display next alert
  useEffect(() => {
    if (alerts.length > 0 && !showAlert) {
      const sorted = [...alerts].sort((a, b) => {
        if (a.type === "critical" && b.type !== "critical") return -1
        if (a.type !== "critical" && b.type === "critical") return 1
        return b.timestamp - a.timestamp
      })
      const top = sorted[0]
      setCurrentAlert(top)
      setShowAlert(true)

      const timer = setTimeout(() => {
        setShowAlert(false)
        setAlerts((prev) => prev.filter((a) => a.id !== top.id))
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [alerts, showAlert])

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-900/90 border-red-500"
      case "warning":
        return "bg-amber-900/90 border-amber-500"
      default:
        return "bg-blue-900/90 border-blue-500"
    }
  }

  const handleClose = useCallback(() => {
    setShowAlert(false)
    if (currentAlert) {
      setAlerts((prev) => prev.filter((a) => a.id !== currentAlert.id))
    }
  }, [currentAlert])

  return (
    <AnimatePresence>
      {showAlert && currentAlert && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md flex items-center gap-2 max-w-md shadow-lg border ${getAlertStyle(
            currentAlert.type,
          )}`}
          role="alert"
          aria-live="assertive"
          onClick={() => onAlertClick?.(currentAlert)}
        >
          <AlertTriangle
            className={`h-5 w-5 ${
              currentAlert.type === "critical" ? "text-red-500 animate-pulse" : "text-amber-500"
            }`}
          />
          <div className="text-white">
            <p className="text-sm font-medium">{currentAlert.message}</p>
            {currentAlert.location && (
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-black/30 text-white text-[10px]">{currentAlert.location}</Badge>
                <span className="text-xs text-gray-300">
                  {new Date(currentAlert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
          <button className="ml-auto text-gray-300 hover:text-white" onClick={handleClose} aria-label="Close alert">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
