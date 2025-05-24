"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Maximize2, Minimize2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your DeepTrack AI assistant. How can I help you with weather monitoring or Lassa fever risk assessment today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // In a real implementation, we would use the AI SDK to generate a response
      // const { text } = await generateText({
      //   model: openai("gpt-4o"),
      //   prompt: `You are an AI assistant for the DeepTrack weather monitoring and Lassa fever risk assessment system.
      //   Previous messages: ${JSON.stringify(messages)}
      //   User message: ${userMessage}
      //   Provide a helpful response about weather data or risk assessment.`,
      // });

      // Simulated AI response
      setTimeout(() => {
        let aiResponse = "I'm processing your request..."

        if (userMessage.toLowerCase().includes("weather")) {
          aiResponse =
            "Based on current weather patterns in West Africa, we're seeing increased humidity levels which could affect rodent habitats. The forecast shows potential heavy rainfall in Lagos region next week, which might increase the risk factors."
        } else if (userMessage.toLowerCase().includes("risk") || userMessage.toLowerCase().includes("lassa")) {
          aiResponse =
            "The current risk assessment for Lassa fever shows moderate to high levels in Lagos and Ibadan regions. This is correlated with recent rainfall patterns and increased rodent population density. I recommend focusing monitoring efforts in these areas."
        } else if (userMessage.toLowerCase().includes("data") || userMessage.toLowerCase().includes("statistics")) {
          aiResponse =
            "Our latest data shows a 12% increase in Mastomys natalensis populations in urban areas following the recent rainfall. Historical patterns suggest this could lead to increased human contact in the coming weeks."
        } else {
          aiResponse =
            "I can help you with weather monitoring, rodent population tracking, and Lassa fever risk assessment. Would you like me to show you the latest data for a specific region?"
        }

        setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Error generating AI response:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I encountered an error processing your request. Please try again." },
      ])
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full bg-cyan-950/80 border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/80 hover:text-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={`bg-gray-900/90 border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.3)] ${
        isExpanded ? "fixed inset-4 z-50 flex flex-col" : "w-80 h-96"
      }`}
    >
      <div className="flex items-center justify-between p-3 border-b border-cyan-500/30">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-cyan-400" />
          <span className="font-medium text-cyan-300">AI Assistant</span>
          <Badge variant="outline" className="text-[10px] h-4 border-cyan-500/30 text-cyan-400 px-1">
            DeepSeek
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-cyan-300"
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

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-2 ${
                message.role === "user" ? "bg-cyan-950/50 text-cyan-50" : "bg-gray-800/70 text-gray-200"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-2 bg-gray-800/70">
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce"></div>
                <div
                  className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-cyan-500/30">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about weather or risk data..."
            className="bg-gray-800/50 border-gray-700/50 focus-visible:ring-cyan-500/50"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
