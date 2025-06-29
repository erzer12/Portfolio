import { createClient } from "npm:@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface ProfileUpdatePayload {
  username?: string
  bio?: string
  website?: string
  name?: string
  avatar_url?: string
}

interface ProfileUpdateResponse {
  success: boolean
  profile?: any
  user?: any
  error?: string
}

// Sanitize input data
function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

// Validate username format
function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/
  return usernameRegex.test(username)
}

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
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

    // Get authorization header
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing or invalid authorization header" 
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Get Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")

    if (!supabaseUrl || !supabaseAnonKey) {
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

    // Create Supabase client with user's token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    })

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid or expired authentication token" 
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    // Parse request body
    const payload: ProfileUpdatePayload = await req.json()

    // Validate and sanitize inputs
    const updates: any = {}
    const userUpdates: any = {}

    if (payload.username !== undefined) {
      const username = sanitizeInput(payload.username)
      if (username && !isValidUsername(username)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Username must be 3-30 characters and contain only letters, numbers, hyphens, and underscores" 
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
      updates.username = username || null
    }

    if (payload.bio !== undefined) {
      const bio = sanitizeInput(payload.bio)
      if (bio && bio.length > 500) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Bio must be 500 characters or less" 
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
      updates.bio = bio || null
    }

    if (payload.website !== undefined) {
      const website = sanitizeInput(payload.website)
      if (website && !isValidUrl(website)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Website must be a valid URL" 
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
      updates.website = website || null
    }

    if (payload.name !== undefined) {
      const name = sanitizeInput(payload.name)
      if (name && name.length > 100) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Name must be 100 characters or less" 
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
      userUpdates.name = name || null
    }

    if (payload.avatar_url !== undefined) {
      const avatar_url = sanitizeInput(payload.avatar_url)
      if (avatar_url && !isValidUrl(avatar_url)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Avatar URL must be a valid URL" 
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
      userUpdates.avatar_url = avatar_url || null
    }

    // Check if username is already taken (if being updated)
    if (updates.username) {
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", updates.username)
        .neq("id", user.id)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking username:", checkError)
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Database error while checking username" 
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

      if (existingProfile) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Username is already taken" 
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
    }

    // Update user data if needed
    let updatedUser = null
    if (Object.keys(userUpdates).length > 0) {
      const { data, error: userUpdateError } = await supabase
        .from("users")
        .update(userUpdates)
        .eq("id", user.id)
        .select()
        .single()

      if (userUpdateError) {
        console.error("Error updating user:", userUpdateError)
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Failed to update user information" 
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
      updatedUser = data
    }

    // Update profile data if needed
    let updatedProfile = null
    if (Object.keys(updates).length > 0) {
      const { data, error: profileUpdateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single()

      if (profileUpdateError) {
        console.error("Error updating profile:", profileUpdateError)
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Failed to update profile information" 
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
      updatedProfile = data
    }

    // If no updates were made, fetch current data
    if (!updatedUser && !updatedProfile) {
      const [userResult, profileResult] = await Promise.all([
        supabase.from("users").select("*").eq("id", user.id).single(),
        supabase.from("profiles").select("*").eq("id", user.id).single()
      ])

      updatedUser = userResult.data
      updatedProfile = profileResult.data
    } else {
      // Fetch the other data if only one was updated
      if (!updatedUser) {
        const { data } = await supabase.from("users").select("*").eq("id", user.id).single()
        updatedUser = data
      }
      if (!updatedProfile) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        updatedProfile = data
      }
    }

    // Return success response
    const response: ProfileUpdateResponse = {
      success: true,
      user: updatedUser,
      profile: updatedProfile,
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )

  } catch (error) {
    console.error("Profile update error:", error)
    
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