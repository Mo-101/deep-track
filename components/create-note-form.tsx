"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"

export function CreateNoteForm() {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.from("notes").insert([{ title }])

      if (error) throw error

      setTitle("")
      setSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Error creating note:", err)
      setError("Failed to create note. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note content..."
          className="bg-gray-900/50 border-gray-700 focus-visible:ring-purple-500/50"
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !title.trim()}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Add Note
          </>
        )}
      </Button>

      {error && <div className="text-sm text-red-400 mt-2">{error}</div>}

      {success && <div className="text-sm text-green-400 mt-2">Note added successfully!</div>}
    </form>
  )
}
