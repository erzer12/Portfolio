import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

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
