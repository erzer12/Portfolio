"use client"

import SupabaseConnectionCheck from "@/components/supabase-connection-check"

export default function SupabaseTestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Supabase Connection Test</h1>
          <p className="text-muted-foreground">
            Check your Supabase configuration and connection status
          </p>
        </div>
        
        <div className="flex justify-center">
          <SupabaseConnectionCheck />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Visit <a href="/" className="underline hover:text-foreground">the main page</a> to test the contact form
          </p>
        </div>
      </div>
    </div>
  )
}