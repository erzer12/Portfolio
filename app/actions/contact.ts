"use server"

import { createClient } from "@supabase/supabase-js"
import { headers } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_SUBMISSIONS_PER_HOUR: 5,
  MAX_SUBMISSIONS_PER_DAY: 10,
  COOLDOWN_MINUTES: 15, // Minimum time between submissions from same IP
}

// Spam detection patterns
const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i,
  /\b(click here|visit now|act now|limited time)\b/i,
  /\b(make money|work from home|earn \$\d+)\b/i,
  /(https?:\/\/[^\s]+){3,}/i, // Multiple URLs
  /(.)\1{10,}/i, // Repeated characters
]

// Helper function to create fetch with timeout
function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 15000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId)
  })
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Check for spam content
function containsSpam(text: string): boolean {
  return SPAM_PATTERNS.some(pattern => pattern.test(text))
}

// Get client IP address
function getClientIP(headersList: Headers): string {
  const forwarded = headersList.get("x-forwarded-for")
  const realIP = headersList.get("x-real-ip")
  const cfConnectingIP = headersList.get("cf-connecting-ip")
  
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  return "127.0.0.1"
}

// Check rate limiting
async function checkRateLimit(ipAddress: string): Promise<{ allowed: boolean; message?: string }> {
  try {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const cooldownTime = new Date(now.getTime() - RATE_LIMIT.COOLDOWN_MINUTES * 60 * 1000)

    // Check submissions in the last hour
    const { count: hourlyCount, error: hourlyError } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ipAddress)
      .gte("created_at", oneHourAgo.toISOString())

    if (hourlyError) {
      console.error("Rate limit check error (hourly):", hourlyError)
      return { allowed: true } // Allow on error to avoid blocking legitimate users
    }

    if ((hourlyCount || 0) >= RATE_LIMIT.MAX_SUBMISSIONS_PER_HOUR) {
      return { 
        allowed: false, 
        message: `Too many submissions. Please wait before submitting again. (Max ${RATE_LIMIT.MAX_SUBMISSIONS_PER_HOUR} per hour)` 
      }
    }

    // Check submissions in the last day
    const { count: dailyCount, error: dailyError } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ipAddress)
      .gte("created_at", oneDayAgo.toISOString())

    if (dailyError) {
      console.error("Rate limit check error (daily):", dailyError)
      return { allowed: true }
    }

    if ((dailyCount || 0) >= RATE_LIMIT.MAX_SUBMISSIONS_PER_DAY) {
      return { 
        allowed: false, 
        message: `Daily submission limit reached. Please try again tomorrow. (Max ${RATE_LIMIT.MAX_SUBMISSIONS_PER_DAY} per day)` 
      }
    }

    // Check cooldown period
    const { data: recentSubmissions, error: cooldownError } = await supabase
      .from("contact_submissions")
      .select("created_at")
      .eq("ip_address", ipAddress)
      .gte("created_at", cooldownTime.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)

    if (cooldownError) {
      console.error("Rate limit check error (cooldown):", cooldownError)
      return { allowed: true }
    }

    if (recentSubmissions && recentSubmissions.length > 0) {
      return { 
        allowed: false, 
        message: `Please wait ${RATE_LIMIT.COOLDOWN_MINUTES} minutes between submissions.` 
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error("Rate limit check error:", error)
    return { allowed: true } // Allow on error
  }
}

export async function submitContactForm(formData: FormData) {
  try {
    // Extract and validate form data
    const name = (formData.get("name") as string)?.trim()
    const email = (formData.get("email") as string)?.trim().toLowerCase()
    const message = (formData.get("message") as string)?.trim()

    // Basic validation
    if (!name || !email || !message) {
      return { success: false, error: "All fields are required" }
    }

    if (name.length < 2 || name.length > 100) {
      return { success: false, error: "Name must be between 2 and 100 characters" }
    }

    if (!isValidEmail(email)) {
      return { success: false, error: "Please enter a valid email address" }
    }

    if (message.length < 10 || message.length > 2000) {
      return { success: false, error: "Message must be between 10 and 2000 characters" }
    }

    // Spam detection
    if (containsSpam(name) || containsSpam(email) || containsSpam(message)) {
      return { success: false, error: "Your message appears to contain spam content. Please revise and try again." }
    }

    // Get client information
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || ""
    const ipAddress = getClientIP(headersList)

    // Check rate limiting
    const rateLimitCheck = await checkRateLimit(ipAddress)
    if (!rateLimitCheck.allowed) {
      return { success: false, error: rateLimitCheck.message || "Rate limit exceeded" }
    }

    // Insert into Supabase database
    const { data: submissionData, error: dbError } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name,
          email,
          message,
          ip_address: ipAddress,
          user_agent: userAgent,
          status: 'pending'
        },
      ])
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return { success: false, error: "Failed to save your message. Please try again." }
    }

    // Send email notification
    try {
      const emailPayload = {
        name,
        email,
        message,
        timestamp: submissionData.created_at,
        submissionId: submissionData.id,
        ipAddress,
        userAgent
      }

      const emailResponse = await fetchWithTimeout(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-contact-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify(emailPayload),
        },
        15000 // 15 second timeout for email
      )

      if (!emailResponse.ok) {
        console.error("Email service error:", await emailResponse.text())
        // Don't fail the submission if email fails
      }

      // Update submission status to indicate email was attempted
      await supabase
        .from("contact_submissions")
        .update({ status: 'processed' })
        .eq("id", submissionData.id)

    } catch (emailError) {
      console.error("Email notification error:", emailError)
      // Don't fail the submission if email fails
      
      // Update status to indicate email failed
      await supabase
        .from("contact_submissions")
        .update({ status: 'email_failed' })
        .eq("id", submissionData.id)
    }

    return { 
      success: true, 
      message: "Thank you for your message! I'll get back to you soon.",
      submissionId: submissionData.id
    }

  } catch (error) {
    console.error("Contact form submission error:", error)
    return { 
      success: false, 
      error: "Something went wrong. Please try again later." 
    }
  }
}