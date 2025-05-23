import type React from "react"
interface SectionHeadingProps {
  children: React.ReactNode
}

export function SectionHeading({ children }: SectionHeadingProps) {
  return <h2 className="text-3xl font-bold tracking-tight mb-6 pb-2 border-b">{children}</h2>
}
