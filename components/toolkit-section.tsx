"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/section-heading"
import { motion, AnimatePresence } from "framer-motion"
import { Code2, Database, Globe, Zap, Terminal, Cloud, ExternalLink, ChevronRight, Sparkles } from "lucide-react"

interface Tool {
  id: string
  name: string
  category: string
  description: string
  icon: any
  color: string
  skills: string[]
  projects?: string[]
  link?: string
}

const tools: Tool[] = [
  {
    id: "python",
    name: "Python",
    category: "Programming Language",
    description: "Versatile programming language for web development, automation, data analysis, and AI.",
    icon: Code2,
    color: "bg-blue-500",
    skills: ["Flask", "FastAPI", "Django", "Pandas", "NumPy", "Beautiful Soup", "Selenium"],
    projects: ["NewsHunt Bot", "Web Scrapers", "Data Analysis Tools"],
  },
  {
    id: "javascript",
    name: "JavaScript/TypeScript",
    category: "Programming Language",
    description: "Modern web development with JavaScript and TypeScript for frontend and backend.",
    icon: Globe,
    color: "bg-yellow-500",
    skills: ["React", "Next.js", "Node.js", "TypeScript", "Express.js"],
    projects: ["Portfolio Website", "Web Applications", "API Development"],
  },
  {
    id: "react",
    name: "React & Next.js",
    category: "Frontend Framework",
    description: "Building modern, responsive web applications with React ecosystem.",
    icon: Globe,
    color: "bg-cyan-500",
    skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "React Hook Form"],
    projects: ["Portfolio Website", "Dashboard Apps", "Landing Pages"],
  },
  {
    id: "database",
    name: "Databases",
    category: "Database",
    description: "Database design and management for scalable applications.",
    icon: Database,
    color: "bg-green-500",
    skills: ["MongoDB", "PostgreSQL", "Supabase", "MySQL", "Database Design"],
    projects: ["User Management Systems", "Content Storage", "Analytics Platforms"],
  },
  {
    id: "git",
    name: "Git & GitHub",
    category: "Version Control",
    description: "Version control and collaborative development workflows.",
    icon: Terminal,
    color: "bg-orange-500",
    skills: ["Git", "GitHub", "GitHub Actions", "Version Control", "Collaboration"],
    projects: ["All Projects", "Open Source Contributions", "Team Development"],
  },
  {
    id: "cloud",
    name: "Cloud Platforms",
    category: "Deployment",
    description: "Deploying and hosting applications on cloud platforms.",
    icon: Cloud,
    color: "bg-purple-500",
    skills: ["Vercel", "Netlify", "Heroku", "Firebase", "AWS"],
    projects: ["Portfolio Deployment", "Web App Hosting", "API Deployment"],
  },
]

const categories = ["All", "Programming Language", "Frontend Framework", "Database", "Version Control", "Deployment"]

export default function ToolkitSection() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)

  const filteredTools = selectedCategory === "All" ? tools : tools.filter((tool) => tool.category === selectedCategory)

  return (
    <section id="toolkit" className="py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <SectionHeading>Developer Toolkit</SectionHeading>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            The core technologies and development tools I use to build modern web applications and solve complex
            problems.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-200"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence mode="wait">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="h-full cursor-pointer group hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedTool(tool)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`p-2 rounded-lg ${tool.color} text-white group-hover:scale-110 transition-transform`}
                      >
                        <tool.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {tool.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {tool.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{tool.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Tool Detail Modal */}
        <AnimatePresence>
          {selectedTool && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedTool(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${selectedTool.color} text-white`}>
                    <selectedTool.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedTool.name}</h3>
                    <Badge variant="secondary">{selectedTool.category}</Badge>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{selectedTool.description}</p>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Skills & Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTool.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedTool.projects && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        Related Projects
                      </h4>
                      <div className="space-y-2">
                        {selectedTool.projects.map((project) => (
                          <div key={project} className="flex items-center gap-2 text-sm">
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            {project}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t">
                  {selectedTool.link && (
                    <Button asChild>
                      <a
                        href={selectedTool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Learn More
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedTool(null)}>
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        
      </div>
    </section>
  )
}
