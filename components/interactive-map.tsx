"use client"

import { useState, useEffect, useRef } from "react"
import { HistoricalDataVisualization } from "./historical-data-visualization"
import { Button } from "@/components/ui/button"
import { Layers, MapIcon, BarChart2, AlertTriangle } from "lucide-react"

export function InteractiveMap() {
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  // Initialize map on component mount
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Render map placeholder during loading
  if (!mapLoaded) {
    return (
      <div className="relative h-full w-full bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <MapIcon className="w-12 h-12 text-cyan-400 animate-pulse mb-4" />
          <h3 className="text-xl font-bold text-white">Loading Map</h3>
          <p className="text-gray-400 mt-2">Initializing interactive map...</p>
        </div>
      </div>
    )
  }

  // Render map with historical data visualization
  return (
    <div className="relative h-full w-full">
      {/* Map component */}
      <div ref={mapRef} className="h-full w-full bg-gray-900">
        {/* This would be replaced with your actual map component */}
        <div className="absolute inset-0 bg-[#0a1520] opacity-90">
          {/* Map of Nigeria */}
          <svg viewBox="0 0 800 800" className="h-full w-full opacity-30" preserveAspectRatio="xMidYMid meet">
            {/* Simplified Nigeria map outline */}
            <path
              d="M400,150 L500,200 L550,300 L600,350 L650,400 L600,500 L550,600 L500,650 L400,700 L300,650 L250,600 L200,500 L150,400 L200,300 L250,200 L300,150 Z"
              fill="none"
              stroke="rgba(0, 255, 255, 0.3)"
              strokeWidth="2"
            />

            {/* Major regions */}
            <path
              d="M400,300 L450,350 L400,400 L350,350 Z"
              fill="rgba(0, 255, 255, 0.1)"
              stroke="rgba(0, 255, 255, 0.2)"
              strokeWidth="1"
            />

            <path
              d="M500,400 L550,450 L500,500 L450,450 Z"
              fill="rgba(0, 255, 255, 0.1)"
              stroke="rgba(0, 255, 255, 0.2)"
              strokeWidth="1"
            />

            <path
              d="M300,400 L350,450 L300,500 L250,450 Z"
              fill="rgba(0, 255, 255, 0.1)"
              stroke="rgba(0, 255, 255, 0.2)"
              strokeWidth="1"
            />

            <path
              d="M400,500 L450,550 L400,600 L350,550 Z"
              fill="rgba(0, 255, 255, 0.1)"
              stroke="rgba(0, 255, 255, 0.2)"
              strokeWidth="1"
            />

            {/* Grid lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="100"
                y1={200 + i * 50}
                x2="700"
                y2={200 + i * 50}
                stroke="rgba(0, 255, 255, 0.1)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            ))}

            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={200 + i * 50}
                y1="100"
                x2={200 + i * 50}
                y2="700"
                stroke="rgba(0, 255, 255, 0.1)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Historical data visualization */}
      <HistoricalDataVisualization mapComponent={null} />

      {/* Map controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-900/80 backdrop-blur-md border-gray-700 text-white hover:bg-gray-800 hover:text-cyan-400"
        >
          <Layers className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="bg-gray-900/80 backdrop-blur-md border-gray-700 text-white hover:bg-gray-800 hover:text-cyan-400"
        >
          <BarChart2 className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="bg-gray-900/80 backdrop-blur-md border-gray-700 text-white hover:bg-gray-800 hover:text-cyan-400"
        >
          <AlertTriangle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
