"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AnimatedMapMarkerProps {
  latitude: number
  longitude: number
  type: "colony" | "mastomys-case" | "lassa-case" | "lassa-location" | "outbreak"
  size?: number
  opacity?: number
  pulse?: boolean
  visible: boolean
  onClick?: () => void
  severity?: number
}

export function AnimatedMapMarker({
  latitude,
  longitude,
  type,
  size = 10,
  opacity = 0.8,
  pulse = false,
  visible,
  onClick,
  severity = 1,
}: AnimatedMapMarkerProps) {
  // Convert lat/long to x/y coordinates (this is a simplified example)
  // In a real implementation, you would use the map's projection
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Get color based on type and severity
  const getColor = () => {
    switch (type) {
      case "colony":
        return "rgba(255, 165, 0, 0.8)" // Orange
      case "mastomys-case":
        return "rgba(255, 87, 51, 0.8)" // Red-orange
      case "lassa-case":
        return "rgba(255, 0, 0, 0.8)" // Red
      case "lassa-location":
        return "rgba(128, 0, 0, 0.8)" // Dark red
      case "outbreak":
        return "rgba(255, 0, 255, 0.8)" // Magenta
      default:
        return "rgba(0, 128, 255, 0.8)" // Blue
    }
  }

  // Adjust size based on severity (1-5)
  const adjustedSize = size * (1 + (severity - 1) * 0.5)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute rounded-full cursor-pointer"
          style={{
            left: position.x,
            top: position.y,
            width: adjustedSize,
            height: adjustedSize,
            backgroundColor: getColor(),
            opacity: opacity,
            transform: "translate(-50%, -50%)",
            zIndex: type === "outbreak" ? 10 : 5,
          }}
          initial={{ scale: 0 }}
          animate={{
            scale: pulse ? [1, 1.3, 1] : 1,
            opacity: opacity,
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: pulse ? 2 : 0.3,
            repeat: pulse ? Number.POSITIVE_INFINITY : 0,
            repeatType: "loop",
          }}
          onClick={onClick}
        >
          {type === "outbreak" && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: "2px solid rgba(255, 0, 255, 0.8)",
              }}
              animate={{
                scale: [1, 2],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
