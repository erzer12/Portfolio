"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLanguageStats } from "@/lib/github"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface LanguageStat {
  name: string
  count: number
  percentage: number
  color: string
}

export default function LanguageChart() {
  const [languages, setLanguages] = useState<LanguageStat[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadLanguages() {
      try {
        const stats = await getLanguageStats()
        // Limit to top 6 languages for better visualization
        setLanguages(stats.slice(0, 6))
      } catch (error) {
        console.error("Error loading language stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLanguages()
  }, [])

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  // Format data for the chart
  const chartData = languages.map((lang) => ({
    name: lang.name,
    value: lang.count,
    percentage: lang.percentage,
    color: lang.color,
  }))

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Programming Languages</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Programming Languages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative bg-background/50 rounded-lg p-2" ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                animationDuration={1000}
                animationBegin={200}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="transparent"
                    strokeWidth={activeIndex === index ? 2 : 0}
                    style={{
                      filter: activeIndex === index ? "drop-shadow(0 0 6px rgba(0, 0, 0, 0.3))" : "none",
                      transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                      transformOrigin: "center",
                      transition: "transform 0.2s, filter 0.2s",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const language = languages.find((lang) => lang.name === name)
                  return [`${value} repos (${language?.percentage}%)`, name]
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  opacity: 1,
                  backdropFilter: "blur(8px)",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: "10px" }}
                formatter={(value) => {
                  const language = languages.find((lang) => lang.name === value)
                  return (
                    <span className="text-sm">
                      {value} ({language?.percentage}%)
                    </span>
                  )
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {languages.map((language) => (
            <div key={language.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: language.color }}></div>
              <div className="text-sm">
                <span className="font-medium">{language.name}</span>
                <span className="text-muted-foreground ml-1 text-xs">({language.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
