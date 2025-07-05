"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Calendar, User, MessageSquare, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  status: string
  created_at: string
  ip_address?: string
  user_agent?: string
}

export default function ContactSubmissionsPage() {
  const { toast } = useToast()
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState("")
  const [authenticated, setAuthenticated] = useState(false)

  const fetchSubmissions = async () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter your admin API key",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/contact-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page: 1, limit: 50 })
      })

      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
        setAuthenticated(true)
        toast({
          title: "Success",
          description: `Loaded ${data.submissions?.length || 0} submissions`,
        })
      } else {
        throw new Error('Failed to fetch submissions')
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast({
        title: "Error",
        description: "Failed to fetch contact submissions. Check your API key.",
        variant: "destructive",
      })
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'processed': return 'bg-green-500'
      case 'spam': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Admin Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="apiKey" className="text-sm font-medium">
                  Admin API Key
                </label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your admin API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <Button onClick={fetchSubmissions} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Access Admin Panel'
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                The API key is set in your environment variables (ADMIN_API_KEY)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Contact Submissions</h1>
            <p className="text-muted-foreground">Manage contact form submissions from your portfolio</p>
          </div>
          <Button onClick={fetchSubmissions} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Submissions ({submissions.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({submissions.filter(s => s.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="processed">
              Processed ({submissions.filter(s => s.status === 'processed').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {submissions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
                  <p className="text-muted-foreground">Contact form submissions will appear here</p>
                </CardContent>
              </Card>
            ) : (
              submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {submission.name}
                      </CardTitle>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${submission.email}`} className="hover:underline">
                        {submission.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(submission.created_at)}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Message:</h4>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
                      </div>
                    </div>

                    {submission.ip_address && (
                      <div className="text-xs text-muted-foreground">
                        IP: {submission.ip_address}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {submissions.filter(s => s.status === 'pending').map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {submission.name}
                    </CardTitle>
                    <Badge className="bg-yellow-500">pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${submission.email}`} className="hover:underline">
                      {submission.email}
                    </a>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Message:</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="processed" className="space-y-4">
            {submissions.filter(s => s.status === 'processed').map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {submission.name}
                    </CardTitle>
                    <Badge className="bg-green-500">processed</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${submission.email}`} className="hover:underline">
                      {submission.email}
                    </a>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Message:</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}