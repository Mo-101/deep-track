"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Home, BarChart2, Cloud, AlertTriangle, Settings, Map } from "lucide-react"
import { SimpleDock } from "./simple-dock"

// Dynamically import the complex Dock with SSR disabled
const DynamicDock = dynamic(() => import("./dock"), {
  ssr: false,
  loading: () => null,
})

export function CyberpunkNav() {
  const [activeItem, setActiveItem] = useState("dashboard")
  const [useFallback, setUseFallback] = useState(false)

  const handleItemClick = (id: string) => {
    setActiveItem(id)
    // Additional navigation logic could go here
  }

  const items = [
    {
      id: "dashboard",
      icon: <Home size={22} className="text-cyan-400 group-hover:text-cyan-300" />,
      label: "Dashboard",
      onClick: () => handleItemClick("dashboard"),
      className: activeItem === "dashboard" ? "border-cyan-500/50 group" : "group",
    },
    {
      id: "weather",
      icon: <Cloud size={22} className="text-blue-400 group-hover:text-blue-300" />,
      label: "Weather",
      onClick: () => handleItemClick("weather"),
      className: activeItem === "weather" ? "border-blue-500/50 group" : "group",
    },
    {
      id: "risk",
      icon: <AlertTriangle size={22} className="text-amber-400 group-hover:text-amber-300" />,
      label: "Risk Assessment",
      onClick: () => handleItemClick("risk"),
      className: activeItem === "risk" ? "border-amber-500/50 group" : "group",
    },
    {
      id: "analytics",
      icon: <BarChart2 size={22} className="text-purple-400 group-hover:text-purple-300" />,
      label: "Analytics",
      onClick: () => handleItemClick("analytics"),
      className: activeItem === "analytics" ? "border-purple-500/50 group" : "group",
    },
    {
      id: "map",
      icon: <Map size={22} className="text-green-400 group-hover:text-green-300" />,
      label: "Map Layers",
      onClick: () => handleItemClick("map"),
      className: activeItem === "map" ? "border-green-500/50 group" : "group",
    },
    {
      id: "settings",
      icon: <Settings size={22} className="text-gray-400 group-hover:text-gray-300" />,
      label: "Settings",
      onClick: () => handleItemClick("settings"),
      className: activeItem === "settings" ? "border-gray-500/50 group" : "group",
    },
  ]

  // If we're using the fallback, render the SimpleDock
  if (useFallback) {
    return <SimpleDock items={items} activeItem={activeItem} />
  }

  // Try to render the complex Dock, with an error handler
  try {
    return (
      <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
        <DynamicDock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
          className="bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 border-t border-cyan-500/30"
        />
      </div>
    )
  } catch (error) {
    console.error("Error rendering Dock, falling back to SimpleDock:", error)
    setUseFallback(true)
    return <SimpleDock items={items} activeItem={activeItem} />
  }
}
