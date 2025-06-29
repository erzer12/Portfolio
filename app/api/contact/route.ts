import { NextRequest, NextResponse } from "next/server"
import { submitContactForm } from "@/app/actions/contact"

// Get client IP address from NextRequest
function getClientIP(request: NextRequest): string {
  try {
    const forwarded = request.headers.get("x-forwarded-for")
    const realIP = request.headers.get("x-real-ip")
    const cfConnectingIP = request.headers.get("cf-connecting-ip")
    
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
  } catch (error) {
    console.error("Error getting client IP:", error)
    return "127.0.0.1"
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Extract client information from request
    const userAgent = request.headers.get("user-agent") || ""
    const ipAddress = getClientIP(request)

    // Create FormData object
    const formData = new FormData()
    formData.append("name", name.trim())
    formData.append("email", email.trim())
    formData.append("message", message.trim())

    // Call server action with extracted client info
    const result = await submitContactForm(formData, ipAddress, userAgent)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    )
  }
}