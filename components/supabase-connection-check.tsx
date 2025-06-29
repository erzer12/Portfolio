"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw, Database, Key, Globe } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ConnectionStatus {
  connected: boolean
  error?: string
  projectUrl?: string
  tableExists?: boolean
  envVarsSet?: {
    url: boolean
    anonKey: boolean
    serviceKey: boolean
  }
  details?: string[]
}

export default function SupabaseConnectionCheck() {
  const [status, setStatus] = useState<ConnectionStatus>({ connected: false })
  const [loading, setLoading] = useState(true)

  const checkConnection = async () => {
    setLoading(true)
    try {
      const details: string[] = []
      
      // Check environment variables
      const envVars = {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }

      details.push(`Environment Variables: URL=${envVars.url ? '✓' : '✗'}, ANON_KEY=${envVars.anonKey ? '✓' : '✗'}, SERVICE_KEY=${envVars.serviceKey ? '✓' : '✗'}`)

      if (!envVars.url || !envVars.anonKey) {
        setStatus({
          connected: false,
          error: "Missing required environment variables",
          envVarsSet: envVars,
          details
        })
        return
      }

      // Test basic connection
      details.push("Testing basic connection...")
      const { data: connectionTest, error: connectionError } = await supabase
        .from('_supabase_migrations')
        .select('version', { count: 'exact', head: true })
        .limit(1)

      if (connectionError && !connectionError.message.includes('relation "_supabase_migrations" does not exist')) {
        details.push(`Connection failed: ${connectionError.message}`)
        setStatus({
          connected: false,
          error: connectionError.message,
          envVarsSet: envVars,
          details
        })
        return
      }

      details.push("✓ Basic connection successful")

      // Check for contact_submissions table
      details.push("Checking contact_submissions table...")
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('count', { count: 'exact', head: true })
        .limit(1)

      if (error) {
        if (error.message.includes('relation "contact_submissions" does not exist') || 
            error.message.includes('does not exist') ||
            error.code === 'PGRST116') {
          details.push("⚠ Table 'contact_submissions' not found (will be created automatically)")
          setStatus({
            connected: true,
            error: "Database connected but contact_submissions table not found. The table will be created automatically when you submit the contact form.",
            projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            tableExists: false,
            envVarsSet: envVars,
            details
          })
        } else {
          details.push(`Table check failed: ${error.message}`)
          setStatus({
            connected: false,
            error: error.message,
            envVarsSet: envVars,
            details
          })
        }
      } else {
        details.push("✓ Table 'contact_submissions' exists and accessible")
        setStatus({
          connected: true,
          projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          tableExists: true,
          envVarsSet: envVars,
          details
        })
      }
    } catch (error) {
      const details = [`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      setStatus({
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
    if (status.connected) {
      return status.tableExists ? 
        <CheckCircle className="h-5 w-5 text-green-500" /> : 
        <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusText = () => {
    if (loading) return "Checking Connection..."
    if (status.connected) {
      return status.tableExists ? "Fully Connected" : "Connected (Setup Required)"
    }
    return "Connection Failed"
  }

  const getStatusBadge = () => {
    if (loading) return <Badge variant="secondary">Checking...</Badge>
    if (status.connected) {
      return status.tableExists ? 
        <Badge variant="default">Ready</Badge> : 
        <Badge variant="secondary">Setup Required</Badge>
    }
    return <Badge variant="destructive">Disconnected</Badge>
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {getStatusText()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnection}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Status:</span>
          {getStatusBadge()}
        </div>

        {/* Environment Variables Check */}
        {status.envVarsSet && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              Environment Variables
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2">
                {status.envVarsSet.url ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> : 
                  <XCircle className="h-3 w-3 text-red-500" />
                }
                <span>SUPABASE_URL</span>
              </div>
              <div className="flex items-center gap-2">
                {status.envVarsSet.anonKey ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> : 
                  <XCircle className="h-3 w-3 text-red-500" />
                }
                <span>ANON_KEY</span>
              </div>
              <div className="flex items-center gap-2">
                {status.envVarsSet.serviceKey ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> : 
                  <XCircle className="h-3 w-3 text-red-500" />
                }
                <span>SERVICE_KEY</span>
              </div>
            </div>
          </div>
        )}

        {/* Project URL */}
        {status.connected && status.projectUrl && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Project URL
            </h4>
            <p className="text-xs text-muted-foreground break-all bg-muted p-2 rounded">
              {status.projectUrl}
            </p>
          </div>
        )}

        {/* Database Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database Status
          </h4>
          <div className="text-xs space-y-1">
            {status.details?.map((detail, index) => (
              <div key={index} className="text-muted-foreground">
                {detail}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {status.error && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> {status.error}
            </p>
          </div>
        )}

        {/* Setup Instructions */}
        {!status.connected && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Setup Instructions:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-xs text-blue-700 dark:text-blue-300">
              <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
              <li>Copy your project URL and API keys from Settings → API</li>
              <li>Add them to your .env.local file:
                <pre className="mt-1 p-2 bg-blue-100 dark:bg-blue-800 rounded text-xs">
{`NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key`}
                </pre>
              </li>
              <li>Restart your development server</li>
            </ol>
          </div>
        )}

        {/* Success Message */}
        {status.connected && status.tableExists && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✅ <strong>Everything is working perfectly!</strong> Your contact form is ready to receive submissions.
            </p>
          </div>
        )}

        {/* Partial Success Message */}
        {status.connected && !status.tableExists && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ <strong>Almost ready!</strong> The database table will be created automatically when someone submits the contact form for the first time.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}