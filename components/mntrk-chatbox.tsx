"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MousePointer, X, Minimize2, Maximize2, Send } from "lucide-react"

export function MNTRKChatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot"; timestamp: number }[]>([
    {
      text: "Welcome to MNTRK Assistant. How can I help you with rodent monitoring today?",
      sender: "bot",
      timestamp: Date.now(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simulate receiving a message occasionally
  useEffect(() => {
    const botMessages = [
      "Alert: High rodent activity detected in Kano region.",
      "Environmental conditions in Lagos are favorable for increased rodent activity.",
      "Station MS003 maintenance has been completed.",
      "Would you like to see the latest activity report?",
      "Humidity levels are rising in the southern regions.",
      "Detection algorithms have been updated to version 3.2.1.",
    ]

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const newMessage = {
          text: botMessages[Math.floor(Math.random() * botMessages.length)],
          sender: "bot" as const,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, newMessage])

        if (!isOpen) {
          setUnreadCount((prev) => prev + 1)
        }
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isOpen])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Reset unread count when opening chat
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        text: inputValue,
        sender: "user",
        timestamp: Date.now(),
      },
    ])

    setInputValue("")

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        "I'm analyzing the data from our monitoring stations now.",
        "The latest reports show moderate rodent activity in that area.",
        "I've updated your dashboard with the latest information.",
        "Would you like me to generate a detailed report on that?",
        "I've sent an alert to the field team about this issue.",
        "The environmental conditions are being monitored closely.",
      ]

      setMessages((prev) => [
        ...prev,
        {
          text: botResponses[Math.floor(Math.random() * botResponses.length)],
          sender: "bot",
          timestamp: Date.now(),
        },
      ])
    }, 1000)
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed z-[1000] ${isExpanded ? "inset-4" : "bottom-20 right-4 w-80"}`}
          >
            <Card className="bg-black/90 backdrop-blur-md border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)] h-full flex flex-col">
              <CardHeader className="pb-2 pt-3 border-b border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <MousePointer className="h-5 w-5 text-purple-400" />
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
                    <CardTitle className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      MNTRK Assistant
                    </CardTitle>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-purple-300"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-red-400"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.sender === "user"
                          ? "bg-purple-600/30 border border-purple-500/30 text-purple-50"
                          : "bg-gray-800/50 border border-gray-700/50 text-gray-200"
                      }`}
                    >
                      <div>{message.text}</div>
                      <div
                        className={`text-[10px] mt-1 ${
                          message.sender === "user" ? "text-purple-300" : "text-gray-400"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              <div className="p-3 border-t border-purple-500/30">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="bg-black/50 border-gray-800 focus-visible:ring-purple-500/50 text-sm"
                  />
                  <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700 text-white h-9 w-9">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-[1000] bg-black/90 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:bg-gray-900 p-3 h-auto rounded-full"
        >
          <div className="relative">
            <MousePointer className="h-5 w-5 text-purple-400" />
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

            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </div>
            )}
          </div>
        </Button>
      )}
    </>
  )
}
