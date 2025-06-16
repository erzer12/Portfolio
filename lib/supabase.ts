import { createClient } from "@supabase/supabase-js"

// Create a single client instance to avoid multiple GoTrueClient instances
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
