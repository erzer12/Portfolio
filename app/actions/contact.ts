"use server"

import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"

// Create a single server-side client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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

    // Insert into Supabase with better error handling
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insertion error:", error)

      // Handle specific error types
      if (error.code === "PGRST116") {
        return { success: false, error: "Database table not found. Please contact the administrator." }
      }

      if (error.message?.includes("permission")) {
        return { success: false, error: "Permission denied. Please try again later." }
      }

      return { success: false, error: "Failed to save your message. Please try again." }
    }

    console.log("Contact submission saved successfully:", data)

    return {
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
      data: data,
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
    }
  }
}
