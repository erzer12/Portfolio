"use server"

import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Helper function to create fetch with timeout
function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId)
  })
}

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      return { success: false, error: "All fields are required" }
    }

    // Get client info
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || ""
    const forwarded = headersList.get("x-forwarded-for")
    const ipAddress = forwarded ? forwarded.split(",")[0] : "127.0.0.1"

    // Insert into Supabase
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name,
          email,
          message,
          ip_address: ipAddress,
          user_agent: userAgent,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return { success: false, error: "Failed to save submission" }
    }

    // Send email notification (optional - you can set up email service)
    try {
      const emailResponse = await fetchWithTimeout(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ name, email, message }),
      }, 10000) // 10 second timeout
    } catch (emailError) {
      console.log("Email service not available, but form submitted successfully")
    }

    return { success: true, message: "Thank you for your message! I'll get back to you soon." }
  } catch (error) {
    console.error("Contact form error:", error)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}