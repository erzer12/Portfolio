"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ConnectionStatus {
  connected: boolean
  error?: string
  projectUrl?: string
  tableExists?: boolean
}

export default function SupabaseStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({ connected: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkConnection() {
      try {
        // Check if we have environment variables
        const hasEnvVars = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        
        if (!hasEnvVars) {
          setStatus({
            connected: false,
            error: "Environment variables not configured",
          })
          setLoading(false)
          return
        }

        // Try to make a simple query to test the connection
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('count', { count: 'exact', head: true })

        if (error) {
          // Check if it's a table not found error
          if (error.message.includes('relation "contact_submissions" does not exist')) {
            setStatus({
              connected: true,
              error: "Database connected but contact_submissions table not found. Please run migrations.",
              projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
              tableExists: false,
            })
          } else {
            setStatus({
              connected: false,
              error: error.message,
            })
          }
        } else {
          setStatus({
            connected: true,
            projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            tableExists: true,
          })
        }
      } catch (error) {
        setStatus({
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      } finally {
        setLoading(false)
      }
    }

    checkConnection()
  }, [])

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            Checking Supabase Connection...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.connected ? (
            status.tableExists ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                Supabase Connected
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Supabase Connected (Setup Required)
              </>
            )
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              Supabase Connection Failed
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={status.connected ? (status.tableExists ? "default" : "secondary") : "destructive"}>
            {status.connected ? (status.tableExists ? "Ready" : "Setup Required") : "Disconnected"}
          </Badge>
        </div>

        {status.connected && status.projectUrl && (
          <div className="text-sm">
            <span className="font-medium">Project URL:</span>
            <p className="text-muted-foreground break-all text-xs">{status.projectUrl}</p>
          </div>
        )}

        {status.error && (
          <div className="text-sm">
            <span className="font-medium text-red-500">Issue:</span>
            <p className="text-red-500 text-xs mt-1">{status.error}</p>
          </div>
        )}

        {!status.connected && (
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">To connect Supabase:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Create a Supabase project</li>
              <li>Add your credentials to .env.local</li>
              <li>Restart your development server</li>
            </ol>
          </div>
        )}

        {status.connected && !status.tableExists && (
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Database connected! Next steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>The contact_submissions table will be created automatically</li>
              <li>Try submitting the contact form to test</li>
            </ol>
          </div>
        )}

        {status.connected && status.tableExists && (
          <div className="text-sm text-green-600">
            <p>✅ Everything is working correctly!</p>
            <p className="text-xs mt-1">Contact form is ready to receive submissions.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}