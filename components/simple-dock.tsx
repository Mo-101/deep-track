"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DockItemProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  isActive?: boolean
}

function DockItem({ icon, label, onClick, isActive = false }: DockItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative flex items-center justify-center rounded-full bg-black/90 border-2 ${
        isActive ? "border-cyan-500/50" : "border-neutral-700"
      } shadow-md w-12 h-12 cursor-pointer`}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="text-white">{icon}</div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap rounded-md border border-neutral-700 bg-black/90 px-2 py-0.5 text-xs text-white"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface SimpleDockProps {
  items: Array<{
    id: string
    icon: React.ReactNode
    label: string
    onClick?: () => void
  }>
  activeItem?: string
}

export function SimpleDock({ items, activeItem }: SimpleDockProps) {
  return (
    <motion.div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="bg-black/80 backdrop-blur-md border-2 border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.2)] px-4 py-2 rounded-2xl flex items-center gap-3">
        {items.map((item) => (
          <DockItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            onClick={item.onClick}
            isActive={activeItem === item.id}
          />
        ))}
      </div>
    </motion.div>
  )
}
