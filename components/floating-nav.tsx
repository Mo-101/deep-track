"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Database, BarChart2, Settings } from "lucide-react"

interface FloatingNavProps {
  onToggleAnalytics?: () => void
  onToggleColonies?: () => void
  onToggleSettings?: () => void
}

export function FloatingNav({ onToggleAnalytics, onToggleColonies, onToggleSettings }: FloatingNavProps) {
  const [activeTab, setActiveTab] = useState("")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab === activeTab ? "" : tab)

    // Handle specific panel toggles
    if (tab === "analytics" && onToggleAnalytics) {
      onToggleAnalytics()
    } else if (tab === "colonies" && onToggleColonies) {
      onToggleColonies()
    } else if (tab === "settings" && onToggleSettings) {
      onToggleSettings()
    }
  }

  return (
    <motion.nav
      className="floating-nav fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[1002] bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-full px-2 py-1 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="flex items-center gap-1">
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
        <NavButton
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          isActive={activeTab === "settings"}
          onClick={() => handleTabChange("settings")}
        />
      </div>
    </motion.nav>
  )
}

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      className={`relative flex items-center justify-center p-2 rounded-full transition-colors ${
        isActive ? "bg-cyan-900/50 text-cyan-400" : "text-gray-400 hover:text-cyan-300 hover:bg-gray-800/50"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="sr-only md:not-sr-only md:ml-2 md:text-xs">{label}</span>
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
