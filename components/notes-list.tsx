"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Clock } from "lucide-react"

interface Note {
  id: number
  title: string
}

export function NotesList({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [loading, setLoading] = useState(false)

  // Subscribe to changes
  useEffect(() => {
    const channel = supabase
      .channel("notes-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notes" }, (payload) => {
        setNotes((current) => [...current, payload.new as Note])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-t-2 border-cyan-500 rounded-full"></div>
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <p>No notes found in the database.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className="bg-gray-900/50 border-gray-800/50 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-gray-200">{note.title}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>ID: {note.id}</span>
                </div>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">Note</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
