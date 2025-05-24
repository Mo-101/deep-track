"use client"

import { motion } from "framer-motion"
import { Radio } from "lucide-react"

export function MonitoringStations() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Radio className="h-4 w-4 text-purple-400" />
        <span className="text-sm font-mono text-purple-400">MONITORING STATIONS</span>
      </div>

      <div className="relative aspect-square max-w-[200px] mx-auto">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-500/30"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-purple-400">3</div>
            <div className="text-sm text-gray-400">/5</div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">BATTERY AVG:</span>
          <span className="text-purple-400">62%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">SIGNAL AVG:</span>
          <span className="text-purple-400">65%</span>
        </div>
      </div>
    </div>
  )
}
