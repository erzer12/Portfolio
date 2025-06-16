"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { testSupabaseConnection } from "@/app/actions/test-supabase"

export default function TestSupabasePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    try {
      const result = await testSupabaseConnection()
      setResult(result)
    } catch (error) {
      setResult({ success: false, error: "Test failed", details: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleTest} disabled={loading}>
            {loading ? "Testing..." : "Test Supabase Connection"}
          </Button>

          {result && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <h4 className="font-semibold mb-2">Environment Variables Check:</h4>
            <ul className="space-y-1">
              <li>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</li>
              <li>
                NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
