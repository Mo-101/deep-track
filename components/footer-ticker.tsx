"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Database, Activity, CloudRain, Cpu, Clock, AlertTriangle, Zap } from "lucide-react"

type TickerItem = {
  id: string
  icon: React.ReactNode
  message: string
  timestamp: number
}

export function FooterTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Generate initial ticker items
  useEffect(() => {
    const initialItems: TickerItem[] = [
      {
        id: "1",
        icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
        message: "Colony Epsilon shows 42% outbreak probability",
        timestamp: Date.now(),
      },
      {
        id: "2",
        icon: <Activity className="h-4 w-4 text-yellow-400" />,
        message: "Lassa case detected near Jos",
        timestamp: Date.now() - 60000,
      },
      {
        id: "3",
        icon: <Zap className="h-4 w-4 text-cyan-400" />,
        message: "Satellite data updated 12 mins ago",
        timestamp: Date.now() - 120000,
      },
      {
        id: "4",
        icon: <Database className="h-4 w-4 text-purple-400" />,
        message: "AI system scan complete",
        timestamp: Date.now() - 180000,
      },
      {
        id: "5",
        icon: <Cpu className="h-4 w-4 text-green-400" />,
        message: "System load at 68%",
        timestamp: Date.now() - 240000,
      },
      {
        id: "6",
        icon: <CloudRain className="h-4 w-4 text-blue-400" />,
        message: "Weather conditions favorable for rodent activity",
        timestamp: Date.now() - 300000,
      },
      {
        id: "7",
        icon: <Clock className="h-4 w-4 text-pink-400" />,
        message: "Next scheduled scan in 15 minutes",
        timestamp: Date.now() - 360000,
      },
    ]

    setTickerItems(initialItems)

    // Simulate adding new items periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newItem: TickerItem = {
          id: `item-${Date.now()}`,
          icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
          message: `New alert: ${Math.random() > 0.5 ? "Rodent activity" : "Weather change"} detected in ${
            Math.random() > 0.5 ? "Lagos" : "Abuja"
          }`,
          timestamp: Date.now(),
        }
        setTickerItems((prev) => [...prev, newItem])
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Animate the ticker
  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    const animate = () => {
      if (!containerRef.current || !contentRef.current) return

      // Reset when scrolled past the end
      if (scrollPosition > contentRef.current.scrollWidth) {
        setScrollPosition(0)
      } else {
        setScrollPosition((prev) => prev + 1)
      }
    }

    const animationId = requestAnimationFrame(animate)
    const interval = setInterval(animate, 30) // Adjust speed here

    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(interval)
    }
  }, [scrollPosition])

  return (
    <div className="footer-ticker fixed bottom-0 w-full z-[1001] bg-black/80 backdrop-blur-md border-t border-cyan-500/30 py-2 px-4">
      <div ref={containerRef} className="overflow-hidden whitespace-nowrap">
        <div
          ref={contentRef}
          className="inline-block whitespace-nowrap"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {tickerItems.map((item, index) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-2 px-4 mx-4 border-l border-cyan-500/30 first:border-l-0"
            >
              {item.icon}
              <span className="text-sm text-white">{item.message}</span>
              {index === tickerItems.length - 1 && (
                <span className="inline-block w-screen"></span> // Add space at the end to create a pause before repeating
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
