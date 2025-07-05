import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

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

    // Get submission status from Firestore using Admin SDK
    const docRef = adminDb.collection("contact_submissions").doc(submissionId)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404, headers: corsHeaders }
      )
    }

    const data = docSnap.data()
    
    return NextResponse.json(
      {
        id: docSnap.id,
        status: data?.status,
        submitted_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
      },
      { headers: corsHeaders }
    )

  } catch (error) {
    console.error("Contact status error:", formatError(error))
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

    const body = await request.json().catch(() => ({}))
    const { page = 1, limit: pageLimit = 20, status } = body

    const submissionsRef = adminDb.collection("contact_submissions")
    let query = submissionsRef.orderBy("created_at", "desc")

    if (status) {
      query = submissionsRef
        .where("status", "==", status)
        .orderBy("created_at", "desc") as any
    }

    // Apply limit for pagination
    if (pageLimit > 0) {
      query = query.limit(pageLimit * page) as any
    }

    const querySnapshot = await query.get()
    const allSubmissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at
    }))

    // Simple pagination simulation (for better performance, use Firestore pagination)
    const startIndex = (page - 1) * pageLimit
    const endIndex = startIndex + pageLimit
    const paginatedSubmissions = pageLimit > 0 ? allSubmissions.slice(startIndex, endIndex) : allSubmissions

    return NextResponse.json(
      {
        submissions: paginatedSubmissions,
        total: allSubmissions.length,
        page,
        limit: pageLimit,
      },
      { headers: corsHeaders }
    )

  } catch (error) {
    console.error("Admin contact fetch error:", formatError(error))
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}