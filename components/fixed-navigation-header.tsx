"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Search,
  Bell,
  User,
  Menu,
  X,
  Settings,
  HelpCircle,
  LogOut,
  Map,
  BarChart2,
  AlertTriangle,
  Radio,
  Database,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FixedNavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="h-6 w-6 text-purple-400" />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(168, 85, 247, 0)",
                  "0 0 0 4px rgba(168, 85, 247, 0.3)",
                  "0 0 0 0 rgba(168, 85, 247, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
          <div className="text-lg font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-500 bg-clip-text text-transparent">
            MNTRK-DeepTrack™
          </div>
          <Badge variant="outline" className="text-[10px] h-4 border-purple-500/30 text-purple-400 px-1 hidden sm:flex">
            v4.0.1
          </Badge>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-purple-400 hover:bg-purple-950/30">
            <Map className="h-4 w-4 mr-1.5" />
            Map
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-purple-400 hover:bg-purple-950/30">
            <BarChart2 className="h-4 w-4 mr-1.5" />
            Analytics
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-purple-400 hover:bg-purple-950/30">
            <AlertTriangle className="h-4 w-4 mr-1.5" />
            Alerts
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-purple-400 hover:bg-purple-950/30">
            <Radio className="h-4 w-4 mr-1.5" />
            Stations
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-purple-400 hover:bg-purple-950/30">
            <Database className="h-4 w-4 mr-1.5" />
            Data
          </Button>
        </nav>

        {/* Search, Notifications, and User */}
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="w-48 pl-9 h-9 bg-gray-900/50 border-gray-800 focus-visible:ring-purple-500/50"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-purple-400">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500">
                <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></span>
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-purple-900/30 text-purple-300">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-purple-500/30">
              <DropdownMenuLabel className="text-purple-400">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem className="text-gray-300 focus:bg-purple-950/50 focus:text-purple-300">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-purple-950/50 focus:text-purple-300">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-purple-950/50 focus:text-purple-300">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem className="text-red-400 focus:bg-red-950/50 focus:text-red-300">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300 hover:text-purple-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-purple-500/20 bg-black/95"
        >
          <div className="p-3">
            <Input
              placeholder="Search..."
              className="w-full h-9 bg-gray-900/50 border-gray-800 focus-visible:ring-purple-500/50 mb-3"
            />
            <nav className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-gray-300 hover:text-purple-400 hover:bg-purple-950/30"
              >
                <Map className="h-4 w-4 mr-2" />
                Map
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-gray-300 hover:text-purple-400 hover:bg-purple-950/30"
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-gray-300 hover:text-purple-400 hover:bg-purple-950/30"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-gray-300 hover:text-purple-400 hover:bg-purple-950/30"
              >
                <Radio className="h-4 w-4 mr-2" />
                Stations
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-gray-300 hover:text-purple-400 hover:bg-purple-950/30"
              >
                <Database className="h-4 w-4 mr-2" />
                Data
              </Button>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  )
}
