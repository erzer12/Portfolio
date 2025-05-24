import { createClient } from "npm:@supabase/supabase-js@2.39.0"
import { SmtpClient } from "npm:smtp@0.1.4"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email and message are required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    const client = new SmtpClient()

    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: Deno.env.get("SMTP_USER"),
      password: Deno.env.get("SMTP_PASSWORD"),
    })

    await client.send({
      from: Deno.env.get("SMTP_USER")!,
      to: Deno.env.get("TO_EMAIL")!,
      subject: `New Contact Form Message from ${name}`,
      content: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
      headers: {
        "Reply-To": email, // ✅ So replies go to the client's email
      },
    })

    await client.close()

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
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
