"use client"

import { useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeading } from "@/components/section-heading"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const projects = [
  {
    id: 1,
    title: "NewsHunt – AI-Powered Discord Bot",
    description:
      "Delivers news with GPT summarization, user preferences, and translations. Built with Flask, MongoDB, and Discord.py.",
    technologies: ["Python", "Flask", "MongoDB", "Discord.py", "GPT", "API Integration"],
    image: "/images/NewsHunt Bot.png", // Make sure this file exists in /public/images
  },
  // Add more projects as needed
]

export default function Projects() {
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    let animationId: number
    let scrollPosition = 0
    let isPaused = false

    const scroll = () => {
      if (!carousel || isPaused) return

      scrollPosition += 0.5
      if (scrollPosition >= carousel.scrollWidth - carousel.clientWidth) {
        scrollPosition = 0
      }

      carousel.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(scroll)
    }

    const handleMouseEnter = () => {
      isPaused = true
      cancelAnimationFrame(animationId)
    }

    const handleMouseLeave = () => {
      isPaused = false
      animationId = requestAnimationFrame(scroll)
    }

    carousel.addEventListener("mouseenter", handleMouseEnter)
    carousel.addEventListener("mouseleave", handleMouseLeave)

    animationId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationId)
      carousel.removeEventListener("mouseenter", handleMouseEnter)
      carousel.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <section id="projects" className="py-10">
      <SectionHeading>Projects</SectionHeading>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto pb-8 hide-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="flex gap-6 min-w-max">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-[500px]"
            >
              <Card className="h-full overflow-hidden">
                <div className="h-[300px] w-full overflow-hidden">
                  <img
                    src={project.image ?? "/placeholder.svg"}
                    alt={project.title || "Project"}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
