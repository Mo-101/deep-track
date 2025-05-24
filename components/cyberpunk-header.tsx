"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Zap, Signal, AlertTriangle, Activity } from "lucide-react"

export function CyberpunkHeader() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const [systemStatus, setSystemStatus] = useState("ONLINE")
  const [alertLevel, setAlertLevel] = useState("MODERATE")
  const [alertCount, setAlertCount] = useState(3)
  const [isAlertPulsing, setIsAlertPulsing] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    // Simulate changing alert levels
    const alertTimer = setInterval(() => {
      // Randomly change alert level
      const levels = ["LOW", "MODERATE", "HIGH", "CRITICAL"]
      const randomLevel = levels[Math.floor(Math.random() * levels.length)]
      setAlertLevel(randomLevel)

      // If alert level is HIGH or CRITICAL, pulse the alert
      setIsAlertPulsing(randomLevel === "HIGH" || randomLevel === "CRITICAL")

      // Increment alert count
      setAlertCount((prev) => prev + 1)
    }, 15000)

    return () => {
      clearInterval(timer)
      clearInterval(alertTimer)
    }
  }, [])

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center"
    >
      <div className="bg-black/80 backdrop-blur-md border-b-2 border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.2)] px-6 py-2 rounded-b-lg flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-300">DEEPTRACK</span>
        </div>

        <div className="h-3 w-[1px] bg-gray-700"></div>

        <div className="flex items-center gap-2">
          <Signal className="h-4 w-4 text-green-400" />
          <span className="text-xs font-mono text-green-300">STATUS: {systemStatus}</span>
        </div>

        <div className="h-3 w-[1px] bg-gray-700"></div>

        <motion.div
          className="flex items-center gap-2"
          animate={isAlertPulsing ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
        >
          <AlertTriangle
            className={`h-4 w-4 ${
              alertLevel === "LOW"
                ? "text-green-400"
                : alertLevel === "MODERATE"
                  ? "text-amber-400"
                  : alertLevel === "HIGH"
                    ? "text-orange-400"
                    : "text-red-400"
            }`}
          />
          <span
            className={`text-xs font-mono ${
              alertLevel === "LOW"
                ? "text-green-300"
                : alertLevel === "MODERATE"
                  ? "text-amber-300"
                  : alertLevel === "HIGH"
                    ? "text-orange-300"
                    : "text-red-300"
            }`}
          >
            ALERT: {alertLevel}
          </span>
        </motion.div>

        <div className="h-3 w-[1px] bg-gray-700"></div>

        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-mono text-purple-300">ALERTS: {alertCount}</span>
        </div>

        <div className="h-3 w-[1px] bg-gray-700"></div>

        <div className="text-xs font-mono text-gray-400">{currentTime}</div>
      </div>
    </motion.div>
  )
}
