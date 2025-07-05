"use server"

import { adminDb } from "@/lib/firebase-admin"
import { Timestamp } from "firebase-admin/firestore"

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

// Helper function to format error for logging
function formatError(error: any): string {
  if (!error) return 'Unknown error'
  
  // If it's a string, return as is
  if (typeof error === 'string') return error
  
  // If it has a message property, use that
  if (error.message) return error.message
  
  // Try to stringify the error object
  try {
    return JSON.stringify(error, null, 2)
  } catch {
    return String(error)
  }
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

// Check rate limiting using Firestore
async function checkRateLimit(ipAddress: string): Promise<{ allowed: boolean; message?: string }> {
  try {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const cooldownTime = new Date(now.getTime() - RATE_LIMIT.COOLDOWN_MINUTES * 60 * 1000)

    const submissionsRef = adminDb.collection("contact_submissions")

    // Check submissions in the last hour
    const hourlyQuery = submissionsRef
      .where("ip_address", "==", ipAddress)
      .where("created_at", ">=", Timestamp.fromDate(oneHourAgo))
      .orderBy("created_at", "desc")
    
    const hourlySnapshot = await hourlyQuery.get()

    if (hourlySnapshot.size >= RATE_LIMIT.MAX_SUBMISSIONS_PER_HOUR) {
      return { 
        allowed: false, 
        message: `Too many submissions. Please wait before submitting again. (Max ${RATE_LIMIT.MAX_SUBMISSIONS_PER_HOUR} per hour)` 
      }
    }

    // Check submissions in the last day
    const dailyQuery = submissionsRef
      .where("ip_address", "==", ipAddress)
      .where("created_at", ">=", Timestamp.fromDate(oneDayAgo))
      .orderBy("created_at", "desc")
    
    const dailySnapshot = await dailyQuery.get()

    if (dailySnapshot.size >= RATE_LIMIT.MAX_SUBMISSIONS_PER_DAY) {
      return { 
        allowed: false, 
        message: `Daily submission limit reached. Please try again tomorrow. (Max ${RATE_LIMIT.MAX_SUBMISSIONS_PER_DAY} per day)` 
      }
    }

    // Check cooldown period
    const cooldownQuery = submissionsRef
      .where("ip_address", "==", ipAddress)
      .where("created_at", ">=", Timestamp.fromDate(cooldownTime))
      .orderBy("created_at", "desc")
      .limit(1)
    
    const cooldownSnapshot = await cooldownQuery.get()

    if (!cooldownSnapshot.empty) {
      return { 
        allowed: false, 
        message: `Please wait ${RATE_LIMIT.COOLDOWN_MINUTES} minutes between submissions.` 
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error("Rate limit check error:", formatError(error))
    return { allowed: true } // Allow on error to avoid blocking legitimate users
  }
}

export async function submitContactForm(formData: FormData, ipAddress?: string, userAgent?: string) {
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

    // Use provided client information or defaults
    const clientIP = ipAddress || "127.0.0.1"
    const clientUserAgent = userAgent || ""

    // Check rate limiting
    const rateLimitCheck = await checkRateLimit(clientIP)
    if (!rateLimitCheck.allowed) {
      return { success: false, error: rateLimitCheck.message || "Rate limit exceeded" }
    }

    // Insert into Firestore using Admin SDK
    const submissionData = {
      name,
      email,
      message,
      ip_address: clientIP,
      user_agent: clientUserAgent,
      status: 'pending',
      created_at: Timestamp.now(),
      processed: false
    }

    const docRef = await adminDb.collection("contact_submissions").add(submissionData)

    console.log("Contact form submitted successfully:", docRef.id)

    return { 
      success: true, 
      message: "Thank you for your message! I'll get back to you soon.",
      submissionId: docRef.id
    }

  } catch (error) {
    console.error("Contact form submission error:", formatError(error))
    return { 
      success: false, 
      error: "Something went wrong. Please try again later." 
    }
  }
}