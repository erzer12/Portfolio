import { createClient as createBrowserClient } from "@/supabase/client"
import { createClient as createServerClient } from "@/supabase/server"
import { cookies } from "next/headers"

// Client-side Supabase client
export const supabase = createBrowserClient()

// Server-side Supabase client
export const getServerSupabase = () => {
  const cookieStore = cookies()
  return createServerClient(cookieStore)
}

// Type definitions for your database
export type ContactSubmission = {
  id?: string
  name: string
  email: string
  message: string
  ip_address?: string
  user_agent?: string
  submitted_at?: string
}
