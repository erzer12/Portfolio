"use client"

import type React from "react"
import { useRef, useEffect } from "react"

interface HoverCardProps {
  children: React.ReactNode
}

export function HoverCard({ children }: HoverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      card.style.setProperty("--mouse-x", `${x}px`)
      card.style.setProperty("--mouse-y", `${y}px`)
    }

    card.addEventListener("mousemove", handleMouseMove)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div ref={cardRef} className="relative transition-all duration-300 hover:brightness-105 group">
      <div
        className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 rounded-lg blur-sm bg-gradient-to-r from-primary/20 to-primary/10 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(var(--primary-rgb), 0.15), transparent 40%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
