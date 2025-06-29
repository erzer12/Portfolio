import { createClient } from "@supabase/supabase-js"

// Admin client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase admin environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing')
}

// Create admin client only if we have the required environment variables
let supabaseAdmin: any = null

if (supabaseUrl && supabaseServiceKey) {
  try {
    new URL(supabaseUrl)
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  } catch (error) {
    console.error('Invalid Supabase URL format:', supabaseUrl)
  }
}

export { supabaseAdmin }

// Helper function to get all contact submissions (admin only)
export async function getAllContactSubmissions() {
  try {
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Supabase admin client not configured' } }
    }

    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contact submissions:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { data: null, error }
  }
}

// Helper function to update submission status
export async function updateSubmissionStatus(id: string, status: string) {
  try {
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Supabase admin client not configured' } }
    }

    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating submission status:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { data: null, error }
  }
}