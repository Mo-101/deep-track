"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Mock data for rodent colonies
const MOCK_COLONIES = [
  { id: 1, name: "Colony Alpha", x: 45, y: 35, population: 120, risk: "high", lastActive: Date.now() },
  {
    id: 2,
    name: "Colony Beta",
    x: 65,
    y: 25,
    population: 85,
    risk: "moderate",
    lastActive: Date.now() - 1000 * 60 * 5,
  },
  { id: 3, name: "Colony Gamma", x: 30, y: 45, population: 65, risk: "low", lastActive: Date.now() - 1000 * 60 * 15 },
  { id: 4, name: "Colony Delta", x: 75, y: 15, population: 150, risk: "high", lastActive: Date.now() - 1000 * 60 * 2 },
  {
    id: 5,
    name: "Colony Epsilon",
    x: 20,
    y: 55,
    population: 95,
    risk: "moderate",
    lastActive: Date.now() - 1000 * 60 * 8,
  },
]

// Mock movement paths between colonies
const MOCK_PATHS = [
  { from: 1, to: 2, intensity: 0.7, active: true },
  { from: 1, to: 3, intensity: 0.4, active: false },
  { from: 2, to: 4, intensity: 0.8, active: true },
  { from: 3, to: 5, intensity: 0.5, active: true },
  { from: 4, to: 5, intensity: 0.6, active: false },
]

// Mock outbreak predictions
const MOCK_OUTBREAKS = [
  {
    id: 1,
    colonyId: 1,
    probability: 0.82,
    detectedAt: Date.now() - 1000 * 60 * 30,
    status: "active",
    affectedArea: 15, // km radius
    estimatedCases: 12,
    riskFactors: ["high humidity", "increased rodent activity", "food storage issues"],
  },
  {
    id: 2,
    colonyId: 4,
    probability: 0.76,
    detectedAt: Date.now() - 1000 * 60 * 120,
    status: "monitoring",
    affectedArea: 8, // km radius
    estimatedCases: 5,
    riskFactors: ["seasonal patterns", "high population density"],
  },
]

export function FallbackMap() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [colonies, setColonies] = useState(MOCK_COLONIES)
  const [paths, setPaths] = useState(MOCK_PATHS)
  const [outbreaks, setOutbreaks] = useState(MOCK_OUTBREAKS)
  const [alerts, setAlerts] = useState<Array<{ id: string; type: string; message: string; timestamp: number }>>([])
  const [showAlert, setShowAlert] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<{
    id: string
    type: string
    message: string
    timestamp: number
  } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Simulate colony activity and movement
  useEffect(() => {
    const interval = setInterval(() => {
      // Update colony activity
      setColonies((prev) =>
        prev.map((colony) => {
          // Randomly update last active time for some colonies
          if (Math.random() > 0.7) {
            // Generate a new alert for significant activity
            if (Math.random() > 0.8) {
              const newAlert = {
                id: `colony-${colony.id}-${Date.now()}`,
                type: "activity",
                message: `Increased rodent activity detected in ${colony.name}`,
                timestamp: Date.now(),
              }
              setAlerts((prev) => [...prev, newAlert])
            }

            return { ...colony, lastActive: Date.now() }
          }
          return colony
        }),
      )

      // Update path activity
      setPaths((prev) =>
        prev.map((path) => {
          // Randomly toggle path activity
          if (Math.random() > 0.9) {
            const newActive = !path.active

            // Generate a new alert for new movement paths
            if (newActive) {
              const fromColony = MOCK_COLONIES.find((c) => c.id === path.from)
              const toColony = MOCK_COLONIES.find((c) => c.id === path.to)

              if (fromColony && toColony) {
                const newAlert = {
                  id: `path-${path.from}-${path.to}-${Date.now()}`,
                  type: "movement",
                  message: `Movement detected from ${fromColony.name} to ${toColony.name}`,
                  timestamp: Date.now(),
                }
                setAlerts((prev) => [...prev, newAlert])
              }
            }

            return { ...path, active: newActive }
          }
          return path
        }),
      )

      // Simulate new outbreak predictions
      if (Math.random() > 0.95) {
        const randomColony = MOCK_COLONIES[Math.floor(Math.random() * MOCK_COLONIES.length)]
        const newOutbreak = {
          id: Date.now(),
          colonyId: randomColony.id,
          probability: 0.7 + Math.random() * 0.25,
          detectedAt: Date.now(),
          status: "active",
          affectedArea: Math.floor(5 + Math.random() * 15),
          estimatedCases: Math.floor(Math.random() * 20),
          riskFactors: ["high humidity", "increased rodent activity", "seasonal patterns"],
        }

        // Generate critical alert for new outbreak
        const newAlert = {
          id: `outbreak-${newOutbreak.id}`,
          type: "outbreak",
          message: `CRITICAL: Lassa fever outbreak predicted in ${randomColony.name} (${Math.round(newOutbreak.probability * 100)}% probability)`,
          timestamp: Date.now(),
        }

        setAlerts((prev) => [...prev, newAlert])
        setOutbreaks((prev) => [...prev, newOutbreak])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Handle alert display
  useEffect(() => {
    if (alerts.length > 0 && !showAlert) {
      // Sort alerts by timestamp (newest first) and priority (outbreaks first)
      const sortedAlerts = [...alerts].sort((a, b) => {
        if (a.type === "outbreak" && b.type !== "outbreak") return -1
        if (a.type !== "outbreak" && b.type === "outbreak") return 1
        return b.timestamp - a.timestamp
      })

      setCurrentAlert(sortedAlerts[0])
      setShowAlert(true)

      // Remove the displayed alert after showing it
      const timer = setTimeout(() => {
        setShowAlert(false)
        setAlerts((prev) => prev.filter((a) => a.id !== sortedAlerts[0].id))
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [alerts, showAlert])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false)
        })
      }
    }
  }

  return (
    <div className="w-full h-full relative bg-gray-900">
      {/* Fallback map background */}
      <div className="absolute inset-0 bg-[url('https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57752/land_shallow_topo_2048.jpg')] bg-cover bg-center opacity-70"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>

      {/* SVG for paths and animations */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          {/* Animated dotted line pattern */}
          <pattern id="dotPattern" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
            <circle cx="3" cy="10" r="2" fill="cyan" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
            </circle>
          </pattern>

          {/* Glow filter for colonies */}
          <filter id="glow-high" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor="red" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-moderate" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="yellow" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-low" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="green" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Outbreak area pattern */}
          <pattern
            id="outbreakPattern"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="10" y2="0" stroke="red" strokeWidth="1" strokeOpacity="0.3" />
          </pattern>

          {/* Colony icon */}
          <symbol id="colony-icon" viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              fill="currentColor"
            />
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <path
              d="M12 7V5M12 19v-2M5 12H3M21 12h-2M7.05 7.05L5.63 5.63M18.37 18.37l-1.42-1.42M7.05 16.95l-1.42 1.42M18.37 5.63l-1.42 1.42"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </symbol>
        </defs>

        {/* Movement paths */}
        {paths.map((path) => {
          const fromColony = colonies.find((c) => c.id === path.from)
          const toColony = colonies.find((c) => c.id === path.to)

          if (!fromColony || !toColony) return null

          return (
            <g key={`path-${path.from}-${path.to}`}>
              {/* Base path line */}
              <line
                x1={`${fromColony.x}%`}
                y1={`${fromColony.y}%`}
                x2={`${toColony.x}%`}
                y2={`${toColony.y}%`}
                stroke="rgba(0, 255, 255, 0.2)"
                strokeWidth="2"
              />

              {/* Animated dotted line for active paths */}
              {path.active && (
                <line
                  x1={`${fromColony.x}%`}
                  y1={`${fromColony.y}%`}
                  x2={`${toColony.x}%`}
                  y2={`${toColony.y}%`}
                  stroke="url(#dotPattern)"
                  strokeWidth="4"
                  strokeDasharray="5,5"
                  strokeLinecap="round"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="100" dur="3s" repeatCount="indefinite" />
                </line>
              )}

              {/* Moving dot along the path */}
              {path.active && (
                <circle r="3" fill="cyan">
                  <animateMotion
                    path={`M${fromColony.x},${fromColony.y} L${toColony.x},${toColony.y}`}
                    dur="5s"
                    repeatCount="indefinite"
                    rotate="auto"
                  />
                </circle>
              )}
            </g>
          )
        })}

        {/* Outbreak areas */}
        {outbreaks.map((outbreak) => {
          const colony = colonies.find((c) => c.id === outbreak.colonyId)
          if (!colony) return null

          return (
            <g key={`outbreak-${outbreak.id}`}>
              {/* Outbreak area */}
              <circle
                cx={`${colony.x}%`}
                cy={`${colony.y}%`}
                r={`${outbreak.affectedArea}%`}
                fill="url(#outbreakPattern)"
                stroke="red"
                strokeWidth="1"
                strokeDasharray="5,5"
                opacity="0.6"
              >
                <animate
                  attributeName="r"
                  values={`${outbreak.affectedArea - 1}%;${outbreak.affectedArea}%;${outbreak.affectedArea - 1}%`}
                  dur="4s"
                  repeatCount="indefinite"
                />
                <animate attributeName="opacity" values="0.6;0.4;0.6" dur="4s" repeatCount="indefinite" />
              </circle>

              {/* Outbreak warning icon */}
              <g transform={`translate(${colony.x}%, ${colony.y - 10}%)`}>
                <circle r="8" fill="black" opacity="0.7" />
                <path d="M-5,0 L0,-5 L5,0 L0,5 Z" fill="red">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </path>
                <text textAnchor="middle" y="-15" fill="red" fontSize="10" fontWeight="bold">
                  OUTBREAK
                </text>
              </g>
            </g>
          )
        })}
      </svg>

      {/* Colony markers */}
      {colonies.map((colony) => {
        // Check if this colony has an active outbreak
        const hasOutbreak = outbreaks.some((o) => o.colonyId === colony.id && o.status === "active")

        // Calculate time since last activity
        const timeSinceActive = Date.now() - colony.lastActive
        const isRecentlyActive = timeSinceActive < 1000 * 60 * 10 // Active in last 10 minutes

        return (
          <div
            key={colony.id}
            className="absolute"
            style={{
              left: `${colony.x}%`,
              top: `${colony.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Pulsating background */}
            <div
              className={`absolute rounded-full ${
                hasOutbreak
                  ? "bg-red-500/30"
                  : colony.risk === "high"
                    ? "bg-red-500/20"
                    : colony.risk === "moderate"
                      ? "bg-yellow-500/20"
                      : "bg-green-500/20"
              }`}
              style={{
                width: "40px",
                height: "40px",
                left: "-20px",
                top: "-20px",
                animation: `${hasOutbreak ? "pulse 1.5s infinite" : isRecentlyActive ? "pulse 3s infinite" : "none"}`,
              }}
            />

            {/* Colony icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className={`relative ${
                colony.risk === "high"
                  ? "text-red-500 filter-glow-high"
                  : colony.risk === "moderate"
                    ? "text-yellow-500 filter-glow-moderate"
                    : "text-green-500 filter-glow-low"
              }`}
              style={{
                filter:
                  colony.risk === "high"
                    ? "url(#glow-high)"
                    : colony.risk === "moderate"
                      ? "url(#glow-moderate)"
                      : "url(#glow-low)",
              }}
            >
              <use href="#colony-icon" />
            </svg>

            {/* Colony name */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap border border-cyan-500/30">
              {colony.name}
              {hasOutbreak && <span className="ml-1 text-red-500 animate-pulse">⚠</span>}
            </div>

            {/* Population indicator */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-cyan-400 text-[10px] px-1 py-0.5 rounded-sm whitespace-nowrap">
              Pop: {colony.population}
            </div>
          </div>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        className="absolute bottom-20 right-4 z-10 bg-black/80 backdrop-blur-sm border-cyan-500/30 text-cyan-400 hover:bg-black/90 hover:text-cyan-300"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>

      {/* Map Legend */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-2 text-xs text-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Moderate Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Low Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span>Movement Path</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border border-red-500 bg-red-500/20"></div>
            <span>Outbreak Zone</span>
          </div>
        </div>
      </div>

      {/* Alert notification */}
      <AnimatePresence>
        {showAlert && currentAlert && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className={`absolute top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md flex items-center gap-2 max-w-md ${
              currentAlert.type === "outbreak"
                ? "bg-red-900/90 border-2 border-red-500"
                : currentAlert.type === "movement"
                  ? "bg-cyan-900/90 border border-cyan-500"
                  : "bg-yellow-900/90 border border-yellow-500"
            }`}
          >
            {currentAlert.type === "outbreak" && <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />}
            <div>
              <p
                className={`text-sm font-medium ${
                  currentAlert.type === "outbreak"
                    ? "text-red-300"
                    : currentAlert.type === "movement"
                      ? "text-cyan-300"
                      : "text-yellow-300"
                }`}
              >
                {currentAlert.message}
              </p>
              <p className="text-xs text-gray-400">{new Date(currentAlert.timestamp).toLocaleTimeString()}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        
        .filter-glow-high {
          filter: drop-shadow(0 0 5px rgba(255, 0, 0, 0.8));
        }
        
        .filter-glow-moderate {
          filter: drop-shadow(0 0 4px rgba(255, 255, 0, 0.7));
        }
        
        .filter-glow-low {
          filter: drop-shadow(0 0 3px rgba(0, 255, 0, 0.6));
        }
      `}</style>
    </div>
  )
}
