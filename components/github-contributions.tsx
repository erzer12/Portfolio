"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ContributionDay {
  date: string
  count: number
  level: number
}

export default function GitHubContributions() {
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate mock contribution data for the last year
    // In a real implementation, you'd fetch this from GitHub's GraphQL API
    const generateMockContributions = () => {
      const data: ContributionDay[] = []
      const today = new Date()

      for (let i = 365; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        const count = Math.floor(Math.random() * 10)
        const level = count === 0 ? 0 : Math.ceil(count / 3)

        data.push({
          date: date.toISOString().split("T")[0],
          count,
          level: Math.min(level, 4),
        })
      }

      return data
    }

    setTimeout(() => {
      setContributions(generateMockContributions())
      setLoading(false)
    }, 1000)
  }, [])

  const getContributionColor = (level: number) => {
    const colors = [
      "bg-muted", // 0 contributions
      "bg-green-200", // 1-3 contributions
      "bg-green-400", // 4-6 contributions
      "bg-green-600", // 7-9 contributions
      "bg-green-800", // 10+ contributions
    ]
    return colors[level] || colors[0]
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="grid grid-cols-53 gap-1">
              {[...Array(371)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-muted rounded-sm"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-53 gap-1 min-w-[800px]">
            {contributions.map((day, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-sm ${getContributionColor(day.level)} transition-all hover:scale-110`}
                title={`${day.count} contributions on ${day.date}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
