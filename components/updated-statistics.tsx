"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeading } from "@/components/section-heading"
import { Trophy, Calendar, Award, Target } from "lucide-react"
import { motion } from "framer-motion"

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
    <motion.div
      ref={ref}
      className="text-center group"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="transition-all duration-300 hover:shadow-lg">
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
    </motion.div>
  )
}

export default function UpdatedStatistics() {
  const statItems = [
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      value: 2,
      label: "Years of Experience",
      suffix: "+",
    },
    {
      icon: <Trophy className="h-6 w-6 text-primary" />,
      value: 2,
      label: "Certifications Earned",
      suffix: "",
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      value: 10,
      label: "Projects Completed",
      suffix: "+",
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      value: 5,
      label: "Technologies Mastered",
      suffix: "+",
    },
  ]

  return (
    <section id="statistics" className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <SectionHeading>Achievements</SectionHeading>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A snapshot of my journey in software development and continuous learning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <StatItem
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
                duration={2000 + index * 200}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
