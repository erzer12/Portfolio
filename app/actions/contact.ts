"use server"

import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"

// Create a single server-side client with better error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("Supabase URL:", supabaseUrl ? "Set" : "Missing")
console.log("Supabase Key:", supabaseKey ? "Set" : "Missing")

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Helper function to extract error details
function extractErrorDetails(error: any) {
  const details: any = {}

  // Try to get all possible error properties
  try {
    details.message = error?.message || "No message"
    details.code = error?.code || "No code"
    details.details = error?.details || "No details"
    details.hint = error?.hint || "No hint"
    details.status = error?.status || "No status"
    details.statusText = error?.statusText || "No statusText"

    // Get all enumerable properties
    Object.keys(error || {}).forEach((key) => {
      details[key] = error[key]
    })

    // Try to stringify the entire error
    details.fullError = JSON.stringify(error)

    // Get constructor name
    details.constructor = error?.constructor?.name || "Unknown"

    // Get all property names (including non-enumerable)
    if (error) {
      details.allProperties = Object.getOwnPropertyNames(error)
    }
  } catch (e) {
    details.extractionError = "Failed to extract error details"
  }

  return details
}

export async function submitContactForm(formData: FormData) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return {
        success: false,
        error: "Database not configured. Please check environment variables.",
      }
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    console.log("Form data received:", { name: !!name, email: !!email, message: !!message })

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

    // Prepare the data
    const submissionData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ip_address: ipAddress,
      user_agent: userAgent,
    }

    console.log("Attempting to insert:", submissionData)

    // Try the insertion with comprehensive error handling
    const { data, error } = await supabase.from("contact_submissions").insert(submissionData).select()

    if (error) {
      console.error("Raw error object:", error)
      console.error("Error type:", typeof error)
      console.error("Error instanceof Error:", error instanceof Error)

      const errorDetails = extractErrorDetails(error)
      console.error("Extracted error details:", errorDetails)

      // Return a more informative error message
      let errorMessage = "Failed to save your message."

      if (errorDetails.message && errorDetails.message !== "No message") {
        errorMessage = errorDetails.message
      } else if (errorDetails.code && errorDetails.code !== "No code") {
        errorMessage = `Database error (${errorDetails.code})`
      } else if (errorDetails.status) {
        errorMessage = `Request failed with status ${errorDetails.status}`
      }

      return {
        success: false,
        error: errorMessage,
        debug: errorDetails, // Include debug info for development
      }
    }

    console.log("Contact submission saved successfully:", data)

    return {
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
      data: data?.[0],
    }
  } catch (error) {
    console.error("Outer catch error:", error)
    console.error("Outer error type:", typeof error)

    const errorDetails = extractErrorDetails(error)
    console.error("Outer error details:", errorDetails)

    return {
      success: false,
      error: `Something went wrong: ${error instanceof Error ? error.message : "Unknown error"}`,
      debug: errorDetails,
    }
  }
}
