"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import { getTranslation } from "@/lib/data-fetcher"

interface OutbreakAlertProps {
  outbreak: {
    id: string
    latitude: number
    longitude: number
    startDate: Date
    endDate: Date
    caseCount: number
    severity: number
    state?: string | null
  }
  visible: boolean
  onClose: () => void
  language?: "english" | "hausa" | "yoruba" | "igbo"
  autoDismissMs?: number
  onZoomToLocation?: (lat: number, lng: number) => void
}

export function OutbreakAlert({
  outbreak,
  visible,
  onClose,
  language = "english",
  autoDismissMs = 10000,
  onZoomToLocation,
}: OutbreakAlertProps) {
  // Date formatter
  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "Invalid date"
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getSeverityText = (severity: number) =>
    ({
      1: getTranslation("Low", language),
      2: getTranslation("Moderate", language),
      3: getTranslation("High", language),
      4: getTranslation("Very High", language),
      5: getTranslation("Critical", language),
    }[severity] || getTranslation("Unknown", language))

  const getSeverityColor = (severity: number) =>
    ({
      1: "bg-yellow-500",
      2: "bg-orange-500",
      3: "bg-red-500",
      4: "bg-red-600",
      5: "bg-purple-600",
    }[severity] || "bg-gray-500")

  // Auto-dismiss logic
  useEffect(() => {
    if (visible && autoDismissMs > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, autoDismissMs)
      return () => clearTimeout(timer)
    }
  }, [visible, autoDismissMs, onClose])

  // ESC key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="bg-gray-900/90 backdrop-blur-md rounded-lg border border-purple-500/50 shadow-lg shadow-purple-500/20 overflow-hidden"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-purple-400 mr-2" />
                <h3 className="text-lg font-bold text-white">
                  {getTranslation("Lassa Fever Outbreak", language)}
                </h3>
              </div>

              <button
                onClick={onClose}
                aria-label={getTranslation("Close Alert", language)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 cursor-pointer" onClick={() => onZoomToLocation?.(outbreak.latitude, outbreak.longitude)}>
              <div className="flex items-center mb-3">
                <span className="text-gray-400 mr-2">{getTranslation("High Risk Area", language)}:</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getSeverityColor(outbreak.severity)}`}
                >
                  {getSeverityText(outbreak.severity)}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-300">
                {outbreak.state && (
                  <p>
                    <span className="text-gray-400">{getTranslation("State", language)}:</span> {outbreak.state}
                  </p>
                )}
                <p>
                  <span className="text-gray-400">{getTranslation("Location", language)}:</span>{" "}
                  {outbreak.latitude.toFixed(4)}, {outbreak.longitude.toFixed(4)}
                </p>
                <p>
                  <span className="text-gray-400">{getTranslation("Period", language)}:</span>{" "}
                  {formatDate(outbreak.startDate)} – {formatDate(outbreak.endDate)}
                </p>
                <p>
                  <span className="text-gray-400">{getTranslation("Cases", language)}:</span> {outbreak.caseCount}
                </p>
              </div>

              <div className="mt-4 text-xs text-gray-400">
                {getTranslation("Take Precautions", language)}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
