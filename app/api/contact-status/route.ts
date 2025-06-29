import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get("id")

    if (!submissionId) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Get submission status
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("id, status, created_at")
      .eq("id", submissionId)
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        id: data.id,
        status: data.status,
        submitted_at: data.created_at,
      },
      { headers: corsHeaders }
    )

  } catch (error) {
    console.error("Contact status error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}

// Admin endpoint to get all submissions (requires authentication)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    
    // Simple API key authentication (replace with your preferred auth method)
    const expectedApiKey = process.env.ADMIN_API_KEY
    if (!expectedApiKey || authHeader !== `Bearer ${expectedApiKey}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: corsHeaders }
      )
    }

    const { page = 1, limit = 20, status } = await request.json()

    let query = supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { error: "Failed to fetch submissions" },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        submissions: data,
        total: count,
        page,
        limit,
      },
      { headers: corsHeaders }
    )

  } catch (error) {
    console.error("Admin contact fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}