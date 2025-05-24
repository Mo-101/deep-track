import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prediction_id, rating, comment } = body

    // Validate input
    if (!prediction_id) {
      return NextResponse.json({ error: "Prediction ID is required" }, { status: 400 })
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Insert feedback
    const { error } = await supabase.from("prediction_feedback").insert({
      prediction_id,
      rating,
      comment: comment || null,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error inserting feedback:", error)
      return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
