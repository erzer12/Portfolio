import { NextRequest, NextResponse } from "next/server"
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

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

    // Get submission status from Firestore
    const docRef = doc(db, "contact_submissions", submissionId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404, headers: corsHeaders }
      )
    }

    const data = docSnap.data()
    
    return NextResponse.json(
      {
        id: docSnap.id,
        status: data.status,
        submitted_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
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

    const submissionsRef = collection(db, "contact_submissions")
    let q = query(
      submissionsRef,
      orderBy("created_at", "desc")
    )

    if (status) {
      q = query(
        submissionsRef,
        where("status", "==", status),
        orderBy("created_at", "desc")
      )
    }

    // Note: Firestore doesn't have built-in pagination like SQL LIMIT/OFFSET
    // For production, you'd want to implement cursor-based pagination
    const querySnapshot = await getDocs(q)
    const allSubmissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at
    }))

    // Simple pagination simulation (not efficient for large datasets)
    const startIndex = (page - 1) * pageLimit
    const endIndex = startIndex + pageLimit
    const paginatedSubmissions = allSubmissions.slice(startIndex, endIndex)

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