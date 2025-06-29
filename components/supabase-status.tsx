"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ConnectionStatus {
  connected: boolean
  error?: string
  projectUrl?: string
}

export default function SupabaseStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({ connected: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkConnection() {
      try {
        // Try to make a simple query to test the connection
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('count', { count: 'exact', head: true })

        if (error) {
          setStatus({
            connected: false,
            error: error.message,
          })
        } else {
          setStatus({
            connected: true,
            projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
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
            <AlertCircle className="h-5 w-5 text-yellow-500" />
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
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              Supabase Connected
            </>
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
          <Badge variant={status.connected ? "default" : "destructive"}>
            {status.connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {status.connected && status.projectUrl && (
          <div className="text-sm">
            <span className="font-medium">Project URL:</span>
            <p className="text-muted-foreground break-all">{status.projectUrl}</p>
          </div>
        )}

        {status.error && (
          <div className="text-sm">
            <span className="font-medium text-red-500">Error:</span>
            <p className="text-red-500 text-xs mt-1">{status.error}</p>
          </div>
        )}

        {!status.connected && (
          <div className="text-sm text-muted-foreground">
            <p>Please check your environment variables and ensure Supabase is properly configured.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}