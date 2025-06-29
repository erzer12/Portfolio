import { createClient } from "npm:@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface RegistrationPayload {
  email: string
  name?: string
  avatar_url?: string
}

interface RegistrationResponse {
  success: boolean
  user?: any
  profile?: any
  error?: string
}

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Sanitize input data
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

Deno.serve(async (req) => {
  try {
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
        JSON.stringify({ 
          success: false, 
          error: "Method not allowed" 
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Get Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Server configuration error" 
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const payload: RegistrationPayload = await req.json()

    // Validate required fields
    if (!payload.email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email is required" 
        }),
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
    if (!isValidEmail(payload.email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid email format" 
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Sanitize inputs
    const email = sanitizeInput(payload.email.toLowerCase())
    const name = payload.name ? sanitizeInput(payload.name) : null
    const avatar_url = payload.avatar_url ? sanitizeInput(payload.avatar_url) : null

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing user:", checkError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Database error while checking user" 
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

    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "User with this email already exists" 
        }),
        {
          status: 409,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Create new user
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert([
        {
          email,
          name,
          avatar_url,
        },
      ])
      .select()
      .single()

    if (userError) {
      console.error("Error creating user:", userError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to create user account" 
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

    // Get the created profile (should be created automatically by trigger)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", newUser.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      // User was created but profile fetch failed - still return success
    }

    // Return success response
    const response: RegistrationResponse = {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar_url: newUser.avatar_url,
        created_at: newUser.created_at,
      },
      profile: profile || null,
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 201,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )

  } catch (error) {
    console.error("User registration error:", error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Internal server error" 
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