"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, Database, Code, Server, Activity } from "lucide-react"

export function MNTRKDeepTrackLoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing MNTRK-DeepTrack™ System...")
  const [loadingComponent, setLoadingComponent] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }

        // Update loading text and component at certain points
        if (prev === 15) {
          setLoadingText("Initializing Deepseek R1 7B model...")
          setLoadingComponent("deepseek")
        } else if (prev === 35) {
          setLoadingText("Activating Agent-MNTRK...")
          setLoadingComponent("agent")
        } else if (prev === 55) {
          setLoadingText("Connecting to API-MNTRK...")
          setLoadingComponent("api")
        } else if (prev === 70) {
          setLoadingText("Establishing Supabase connection...")
          setLoadingComponent("supabase")
        } else if (prev === 85) {
          setLoadingText("Preparing Postgres fallback...")
          setLoadingComponent("postgres")
        } else if (prev === 95) {
          setLoadingText("Finalizing system initialization...")
          setLoadingComponent(null)
        }

        return prev + 5
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  const getComponentIcon = () => {
    switch (loadingComponent) {
      case "deepseek":
        return <Brain className="h-8 w-8 text-purple-400" />
      case "agent":
        return <Activity className="h-8 w-8 text-cyan-400" />
      case "api":
        return <Code className="h-8 w-8 text-blue-400" />
      case "supabase":
        return <Database className="h-8 w-8 text-green-400" />
      case "postgres":
        return <Server className="h-8 w-8 text-yellow-400" />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
      <div className="w-96 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-500 bg-clip-text text-transparent">
            MNTRK-DeepTrack™
          </div>
          <div className="text-sm text-gray-400 text-center mt-1">Advanced Monitoring & AI Prediction System</div>

          <motion.div
            className="absolute -inset-4 rounded-full"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(168, 85, 247, 0)",
                "0 0 0 10px rgba(168, 85, 247, 0.2)",
                "0 0 0 0 rgba(168, 85, 247, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>

        <div className="w-full space-y-4">
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
              {getComponentIcon()}
              <span>{loadingText}</span>
            </div>
            <div className="text-xs text-purple-400 font-mono">{progress}%</div>
          </div>
        </div>

        {/* Component loading indicators */}
        <div className="mt-8 grid grid-cols-5 gap-4 w-full">
          <div className={`flex flex-col items-center ${progress >= 15 ? "opacity-100" : "opacity-30"}`}>
            <Brain className="h-6 w-6 text-purple-400" />
            <div className="text-[10px] text-gray-400 mt-1">Deepseek R1 7B</div>
            <div className={`h-1 w-full mt-1 rounded-full ${progress >= 35 ? "bg-green-500" : "bg-gray-700"}`}></div>
          </div>

          <div className={`flex flex-col items-center ${progress >= 35 ? "opacity-100" : "opacity-30"}`}>
            <Activity className="h-6 w-6 text-cyan-400" />
            <div className="text-[10px] text-gray-400 mt-1">Agent-MNTRK</div>
            <div className={`h-1 w-full mt-1 rounded-full ${progress >= 55 ? "bg-green-500" : "bg-gray-700"}`}></div>
          </div>

          <div className={`flex flex-col items-center ${progress >= 55 ? "opacity-100" : "opacity-30"}`}>
            <Code className="h-6 w-6 text-blue-400" />
            <div className="text-[10px] text-gray-400 mt-1">API-MNTRK</div>
            <div className={`h-1 w-full mt-1 rounded-full ${progress >= 70 ? "bg-green-500" : "bg-gray-700"}`}></div>
          </div>

          <div className={`flex flex-col items-center ${progress >= 70 ? "opacity-100" : "opacity-30"}`}>
            <Database className="h-6 w-6 text-green-400" />
            <div className="text-[10px] text-gray-400 mt-1">Supabase</div>
            <div className={`h-1 w-full mt-1 rounded-full ${progress >= 85 ? "bg-green-500" : "bg-gray-700"}`}></div>
          </div>

          <div className={`flex flex-col items-center ${progress >= 85 ? "opacity-100" : "opacity-30"}`}>
            <Server className="h-6 w-6 text-yellow-400" />
            <div className="text-[10px] text-gray-400 mt-1">Postgres</div>
            <div className={`h-1 w-full mt-1 rounded-full ${progress >= 95 ? "bg-green-500" : "bg-gray-700"}`}></div>
          </div>
        </div>

        {/* Grid background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20 pointer-events-none" />

        {/* Neural network animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="relative w-96 h-96">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={`line-${i}`}
                className="absolute bg-gradient-to-r from-purple-500/30 to-cyan-500/30"
                style={{
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 90}%`,
                  height: "1px",
                  width: `${30 + Math.random() * 70}px`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
                animate={{
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Trademark notice */}
        <div className="absolute bottom-4 text-[10px] text-gray-500">
          MNTRK-DeepTrack™ is a registered trademark of DeepTrack Systems Inc.
        </div>
      </div>
    </div>
  )
}
