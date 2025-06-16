"use server"

import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"

// Create a single server-side client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
  throw new Error("Configuration error. Please try again later.")
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      return { success: false, error: "All fields are required" }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: "Please enter a valid email address" }
    }

    // Get client info
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || ""
    const forwarded = headersList.get("x-forwarded-for")
    const ipAddress = forwarded ? forwarded.split(",")[0] : "127.0.0.1"

    console.log("Attempting to insert contact submission...")

    // Test the connection first
    const { data: testData, error: testError } = await supabase
      .from("contact_submissions")
      .select("count", { count: "exact", head: true })

    if (testError) {
      console.error("Supabase connection test failed:", testError)
      return { success: false, error: "Database connection failed. Please try again later." }
    }

    console.log("Supabase connection test successful")

    // Prepare the data
    const submissionData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ip_address: ipAddress,
      user_agent: userAgent,
    }

    console.log("Inserting data:", submissionData)

    // Insert into Supabase
    const { data, error } = await supabase.from("contact_submissions").insert(submissionData).select()

    if (error) {
      console.error("Supabase insertion error:", JSON.stringify(error, null, 2))
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })

      // Handle specific error types
      if (error.code === "PGRST116") {
        return { success: false, error: "Database table not found. Please contact the administrator." }
      }

      if (error.code === "42501") {
        return { success: false, error: "Permission denied. Please check database policies." }
      }

      if (error.message?.includes("permission")) {
        return { success: false, error: "Permission denied. Please try again later." }
      }

      if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
        return { success: false, error: "Database table not found. Please contact support." }
      }

      return { success: false, error: `Database error: ${error.message || "Unknown error"}` }
    }

    console.log("Contact submission saved successfully:", data)

    return {
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
      data: data?.[0],
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      error: `Something went wrong: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
