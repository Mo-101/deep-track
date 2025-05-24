import { createServerClient } from "@/utils/supabase/server"
import { NotesList } from "@/components/notes-list"
import { CreateNoteForm } from "@/components/create-note-form"

export default async function NotesPage() {
  const supabase = await createServerClient()
  const { data: notes, error } = await supabase.from("notes").select()

  if (error) {
    console.error("Error fetching notes:", error)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-8">
          DeepTrack Notes System
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.2)] rounded-lg p-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
                Notes Database
              </h2>
              <NotesList initialNotes={notes || []} />
            </div>
          </div>

          <div>
            <div className="bg-black/80 backdrop-blur-md border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] rounded-lg p-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
                Add New Note
              </h2>
              <CreateNoteForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
