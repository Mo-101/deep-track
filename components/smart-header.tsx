"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  MapPin,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Map,
  Cloud,
  Database,
  BarChart2,
  Layers,
  Settings,
  Bot,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SmartHeaderProps {
  visible: boolean
  onToggleWeather: () => void
  onToggleRisk: () => void
  onToggleControl: () => void
  onToggleColonies: () => void
  onToggleAnalytics: () => void
  onToggleSettings: () => void
  onToggleAIHub: () => void
}

export function SmartHeader({
  visible,
  onToggleWeather,
  onToggleRisk,
  onToggleControl,
  onToggleColonies,
  onToggleAnalytics,
  onToggleSettings,
  onToggleAIHub,
}: SmartHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const [location, setLocation] = useState("Nigeria")
  const [riskLevel, setRiskLevel] = useState<"low" | "moderate" | "high" | "critical">("moderate")
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("map")
  const [alertCount, setAlertCount] = useState(3)
  const [isAlertPulsing, setIsAlertPulsing] = useState(false)
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [hasNotification, setHasNotification] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    // Simulate risk level changes
    const riskTimer = setInterval(() => {
      const levels: Array<"low" | "moderate" | "high" | "critical"> = ["low", "moderate", "high", "critical"]
      const randomIndex = Math.floor(Math.random() * levels.length)
      setRiskLevel(levels[randomIndex])

      // If risk level is HIGH or CRITICAL, pulse the alert
      setIsAlertPulsing(levels[randomIndex] === "high" || levels[randomIndex] === "critical")
    }, 30000)

    // Simulate alert activity
    const alertTimer = setInterval(() => {
      if (Math.random() > 0.7) {
        setAlertCount((prev) => prev + 1)
        setIsAlertPulsing(true)

        // Reset pulsing after 5 seconds
        setTimeout(() => {
          setIsAlertPulsing(false)
        }, 5000)
      }
    }, 15000)

    return () => {
      clearInterval(timer)
      clearInterval(riskTimer)
      clearInterval(alertTimer)
    }
  }, [])

  const getRiskColor = () => {
    switch (riskLevel) {
      case "low":
        return "bg-green-500 text-green-50"
      case "moderate":
        return "bg-yellow-500 text-yellow-50"
      case "high":
        return "bg-orange-500 text-orange-50"
      case "critical":
        return "bg-red-500 text-red-50"
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)

    // Handle specific panel toggles
    if (tab === "weather") {
      onToggleWeather()
    } else if (tab === "risk") {
      onToggleRisk()
    } else if (tab === "layers") {
      onToggleControl()
    } else if (tab === "colonies") {
      onToggleColonies()
    } else if (tab === "analytics") {
      onToggleAnalytics()
    } else if (tab === "settings") {
      onToggleSettings()
    } else if (tab === "ai-hub") {
      onToggleAIHub()
    }
  }

  return (
    <AnimatePresence>
      <motion.header
        className="smart-header fixed top-0 w-full z-[999] flex flex-col"
        initial={{ opacity: 1, y: 0 }}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : -50,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Main header bar */}
        <div className="flex justify-between items-center px-4 py-2 bg-black/80 backdrop-blur-md border-b border-cyan-500/30">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-white">{location}</span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <NavButton
              icon={<Map className="h-5 w-5" />}
              label="Map"
              isActive={activeTab === "map"}
              onClick={() => handleTabChange("map")}
            />
            <NavButton
              icon={<Cloud className="h-5 w-5" />}
              label="Weather"
              isActive={activeTab === "weather"}
              onClick={() => handleTabChange("weather")}
            />
            <NavButton
              icon={<AlertTriangle className="h-5 w-5" />}
              label="Risk"
              isActive={activeTab === "risk"}
              onClick={() => handleTabChange("risk")}
            />
            <NavButton
              icon={<Layers className="h-5 w-5" />}
              label="Layers"
              isActive={activeTab === "layers"}
              onClick={() => handleTabChange("layers")}
            />
            <NavButton
              icon={<Database className="h-5 w-5" />}
              label="Colonies"
              isActive={activeTab === "colonies"}
              onClick={() => handleTabChange("colonies")}
            />
            <NavButton
              icon={<BarChart2 className="h-5 w-5" />}
              label="Analytics"
              isActive={activeTab === "analytics"}
              onClick={() => handleTabChange("analytics")}
            />
            <Link href="/ai-hub">
              <Button
                variant={activeButton === "ai-hub" ? "default" : "ghost"}
                size="sm"
                className={`relative ${
                  activeButton === "ai-hub" ? "bg-cyan-600 text-white" : "text-gray-300 hover:text-cyan-400"
                }`}
                onClick={() => {
                  setActiveButton("ai-hub")
                  onToggleAIHub()
                }}
              >
                <Bot className="h-4 w-4 mr-1.5" />
                AI Hub
                {hasNotification && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>}
              </Button>
            </Link>
            <NavButton
              icon={<Settings className="h-5 w-5" />}
              label="Settings"
              isActive={activeTab === "settings"}
              onClick={() => handleTabChange("settings")}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-mono text-white">{currentTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`h-4 w-4 ${riskLevel === "critical" || riskLevel === "high" ? "animate-pulse" : ""}`}
                style={{
                  color:
                    riskLevel === "low"
                      ? "#10B981"
                      : riskLevel === "moderate"
                        ? "#F59E0B"
                        : riskLevel === "high"
                          ? "#F97316"
                          : "#EF4444",
                }}
              />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRiskColor()} uppercase`}>
                {riskLevel}
              </span>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-black/70 backdrop-blur-md border-b border-cyan-500/30 overflow-hidden"
            >
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                  <h3 className="text-sm font-medium text-cyan-400 mb-2">Weather Conditions</h3>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Temperature</span>
                      <span>78°F</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Humidity</span>
                      <span>65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wind</span>
                      <span>8 mph NE</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                  <h3 className="text-sm font-medium text-amber-400 mb-2">Risk Assessment</h3>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Population Density</span>
                      <span>72%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Environmental Factors</span>
                      <span>65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Historical Patterns</span>
                      <span>58%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                  <h3 className="text-sm font-medium text-purple-400 mb-2">System Status</h3>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div className="flex justify-between">
                      <span>AI Model</span>
                      <span className="text-green-400">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Freshness</span>
                      <span>2 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Alerts</span>
                      <span className="text-amber-400">{alertCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </AnimatePresence>
  )
}

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
  badge?: string
}

function NavButton({ icon, label, isActive, onClick, badge }: NavButtonProps) {
  return (
    <button
      className={`relative flex items-center justify-center p-2 rounded-md transition-colors ${
        isActive ? "bg-cyan-900/50 text-cyan-400" : "text-gray-400 hover:text-cyan-300 hover:bg-gray-800/50"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="sr-only md:not-sr-only md:ml-2 md:text-xs">{label}</span>
      {badge && (
        <Badge
          className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white"
          variant="outline"
        >
          {badge}
        </Badge>
      )}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute bottom-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full"
          style={{ x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  )
}
