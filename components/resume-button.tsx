"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Eye, Mail, Github, Linkedin, Calendar } from "lucide-react"
import { useState } from "react"

interface ResumeButtonProps extends ButtonProps {
  showModal?: boolean
}

export function ResumeButton({
  showModal = true,
  children = "View Resume",
  variant = "default",
  ...props
}: ResumeButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // Create a link element for PDF download
      const link = document.createElement("a")
      link.href = "/resume.pdf"
      link.setAttribute("download", "Harshil_P_Resume.pdf")
      link.setAttribute("target", "_blank")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const ResumeContent = () => (
    <div className="max-h-[80vh] overflow-y-auto space-y-6">
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">HARSHIL P</h1>
        <p className="text-lg text-muted-foreground">ASPIRING SOFTWARE DEVELOPER | AI & BOT ENTHUSIAST</p>
        <div className="flex justify-center gap-4 mt-2">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-4 w-4" />
            <span>Gmail</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </div>
        </div>
      </div>

      {/* About Me */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">
            Enthusiastic Computer Science undergraduate dedicated to software development, with a focus on app creation,
            web scraping, bot development, and AI-driven tools. Proficient in Python, prompt engineering, and generative
            AI. Passionate about tackling challenges and crafting meaningful, user- centric solutions.
          </p>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Education</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">B.Tech Computer Science (AI & ML)</h3>
                <p className="text-sm text-muted-foreground">College of Engineering, Kottarakkara</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>2023 – 2027</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">NewsHunt – AI-Powered Discord Bot</h3>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>April 2025 – Present</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Personal Project</p>
                </div>
              </div>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>
                  Developed a modular Discord bot delivering international and local news with user-customized
                  preferences and language translation.
                </li>
                <li>
                  Integrated GPT-based article summarization, daily news scheduling, interactive slash commands, and
                  onboarding workflows.
                </li>
                <li>Deployed on Render with Flask for health checks and MongoDB for persistent user data.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Technical Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Python",
                  "Web Scraping",
                  "Bot Development",
                  "API Integration",
                  "Prompt Engineering",
                  "Generative AI",
                  "Cloud Deployment",
                  "MongoDB",
                  "Flask",
                  "Discord.py",
                  "GitHub",
                ].map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Soft Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Attention to Detail",
                  "Problem Solving",
                  "Critical Thinking",
                  "Communication",
                  "Collaboration",
                  "Adaptability",
                ].map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium">Python Programming MOOC</h4>
                <span className="text-sm text-muted-foreground">March 2025</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">University of Helsinki</p>
              <p className="text-xs text-muted-foreground">
                Completed an in-depth course covering core Python concepts, functions, object-oriented programming, and
                real-world problem-solving.
              </p>
            </div>
            <div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium">CSS (Basic) Certificate</h4>
                <span className="text-sm text-muted-foreground">19 Apr, 2025</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">HackerRank</p>
              <p className="text-xs text-muted-foreground">
                Covered topics such as cascading and inheritance, text styling fundamentals, layout techniques, and the
                boxing model in CSS, among others.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Button */}
      <div className="flex justify-center pt-4 border-t">
        <Button onClick={handleDownload} disabled={isDownloading} className="w-full">
          {isDownloading ? "Downloading..." : "Download PDF Resume"}
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  if (showModal) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={variant} {...props}>
            {children}
            <Eye className="ml-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Resume - Harshil P</DialogTitle>
          </DialogHeader>
          <ResumeContent />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Button onClick={handleDownload} disabled={isDownloading} variant={variant} {...props}>
      {isDownloading ? "Downloading..." : children}
      <Download className="ml-2 h-4 w-4" />
    </Button>
  )
}
