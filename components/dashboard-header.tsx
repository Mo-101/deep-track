"use client"

import { useState } from "react"
import { Bell, Settings, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "./mobile-nav"

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  // Update time every second
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  })

  return (
    <header className="border-b border-cyan-500/30 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5 text-cyan-400" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-gray-900/95 border-cyan-500/30 text-white">
              <MobileNav />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <span className="text-xs font-bold">DT</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              DeepTrack
            </h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-300 transition">
                  Analytics
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-300 transition">
                  Reports
                </a>
              </li>
              <li>
                <a href="/notes" className="text-gray-400 hover:text-cyan-300 transition">
                  Notes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-300 transition">
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-gray-800/50 rounded-full px-3 py-1.5 border border-gray-700/50">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-7 w-[120px] lg:w-[200px] text-sm"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-400" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyan-500"></span>
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-gray-400" />
          </Button>

          <div className="hidden md:block text-xs text-gray-400 font-mono">{currentTime}</div>
        </div>
      </div>
    </header>
  )
}
