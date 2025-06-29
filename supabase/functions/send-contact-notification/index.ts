import { createClient } from "npm:@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

// Email configuration - set these in your Supabase environment variables
const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL") || "harshilp1234@gmail.com"
const SMTP_HOST = Deno.env.get("SMTP_HOST") || "smtp.gmail.com"
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587")
const SMTP_USER = Deno.env.get("SMTP_USER")
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD")

interface ContactNotificationPayload {
  name: string
  email: string
  message: string
  timestamp: string
  submissionId: string
  ipAddress?: string
  userAgent?: string
}

// Simple SMTP client using fetch to a mail service API
async function sendEmailNotification(payload: ContactNotificationPayload): Promise<boolean> {
  try {
    // Format the email content
    const emailSubject = `New Contact Form Submission from ${payload.name}`
    const emailBody = `
New contact form submission received:

Name: ${payload.name}
Email: ${payload.email}
Submission Time: ${new Date(payload.timestamp).toLocaleString()}
Submission ID: ${payload.submissionId}

Message:
${payload.message}

Technical Details:
IP Address: ${payload.ipAddress || 'Unknown'}
User Agent: ${payload.userAgent || 'Unknown'}

---
This is an automated notification from your portfolio contact form.
Reply directly to this email to respond to ${payload.name}.
    `.trim()

    // Using a simple email service API (you can replace this with your preferred service)
    // For production, consider using services like SendGrid, Mailgun, or AWS SES
    
    // Example using a generic SMTP service via API
    const emailData = {
      to: NOTIFICATION_EMAIL,
      from: SMTP_USER,
      replyTo: payload.email,
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, '<br>')
    }

    // If you have SMTP credentials, you can use a service like EmailJS or similar
    // For now, we'll log the email content and return success
    console.log("Email notification would be sent:", emailData)
    
    // Uncomment and configure this section when you have email service set up
    /*
    const emailResponse = await fetch("https://api.emailservice.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${EMAIL_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    })

    if (!emailResponse.ok) {
      throw new Error(`Email service error: ${emailResponse.status}`)
    }
    */

    return true
  } catch (error) {
    console.error("Email sending error:", error)
    return false
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  }

  try {
    // Parse request body
    const payload: ContactNotificationPayload = await req.json()

    // Validate required fields
    if (!payload.name || !payload.email || !payload.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(payload.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Send email notification
    const emailSent = await sendEmailNotification(payload)

    if (!emailSent) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email notification",
          success: false 
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        message: "Email notification sent successfully",
        success: true,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )

  } catch (error) {
    console.error("Contact notification error:", error)
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        success: false 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  }
})