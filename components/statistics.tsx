"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeading } from "@/components/section-heading"
import { Code, Trophy, Star, Calendar } from "lucide-react"
import { calculateGitHubStats } from "@/lib/github"

interface StatItemProps {
  icon: React.ReactNode
  value: number
  label: string
  suffix?: string
  duration?: number
  loading?: boolean
}

function StatItem({ icon, value, label, suffix = "", duration = 2000, loading = false }: StatItemProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible || loading) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isVisible, value, duration, loading])

  return (
    <div ref={ref} className="text-center group">
      <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
              {icon}
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">
                {loading ? (
                  <div className="w-12 h-8 bg-muted animate-pulse rounded"></div>
                ) : (
                  <>
                    {count}
                    {suffix}
                  </>
                )}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{label}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Statistics() {
  const [stats, setStats] = useState({
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    yearsActive: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const githubStats = await calculateGitHubStats()
        setStats(githubStats)
      } catch (error) {
        console.error("Error loading GitHub stats:", error)
        // Fallback to default values
        setStats({
          totalRepos: 5,
          totalStars: 0,
          totalForks: 0,
          yearsActive: 2,
        })
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const statItems = [
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      value: stats.totalRepos,
      label: "GitHub Repositories",
      suffix: "",
    },
    {
      icon: <Star className="h-6 w-6 text-primary" />,
      value: stats.totalStars,
      label: "GitHub Stars",
      suffix: "",
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      value: stats.yearsActive,
      label: "Years Active",
      suffix: "+",
    },
    {
      icon: <Trophy className="h-6 w-6 text-primary" />,
      value: 2,
      label: "Certifications Earned",
      suffix: "",
    },
  ]

  return (
    <section id="statistics" className="py-10">
      <SectionHeading>Achievements</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => (
          <StatItem
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            suffix={stat.suffix}
            duration={2000 + index * 200}
            loading={loading}
          />
        ))}
      </div>
    </section>
  )
}
