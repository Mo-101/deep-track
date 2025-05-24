import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function createServerClient() {
  const cookieStore = cookies()

  return createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_ANON_KEY || "", {
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  })
}
