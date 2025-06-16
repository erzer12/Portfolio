"use server"

import { createClient } from "@supabase/supabase-js"

export async function testSupabaseConnection() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("Testing Supabase connection...")
    console.log("URL:", supabaseUrl)
    console.log("Key exists:", !!supabaseKey)

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        error: "Missing environment variables",
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
        },
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test basic connection
    const { data, error } = await supabase.from("contact_submissions").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Connection test failed:", error)
      return {
        success: false,
        error: "Connection failed",
        details: error,
      }
    }

    return {
      success: true,
      message: "Supabase connection successful",
      data,
    }
  } catch (error) {
    console.error("Test error:", error)
    return {
      success: false,
      error: "Test failed",
      details: error,
    }
  }
}
