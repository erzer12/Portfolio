"use client"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeading } from "@/components/section-heading"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Code, Brain } from "lucide-react"

export default function AboutMe() {
  return (
    <section id="about" className="py-10">
      <SectionHeading>About Me</SectionHeading>
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3 flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="profile-container relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <img
                      src="/images/profile.jpeg"
                      alt="Harshil P"
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Click to view
                      </div>
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Harshil P</DialogTitle>
                    <DialogDescription className="text-lg">
                      Aspiring Software Developer | AI & Bot Enthusiast
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex justify-center">
                      <div className="w-64 h-64 rounded-lg overflow-hidden border-2 border-primary/20">
                        <img
                          src="/images/profile.jpeg"
                          alt="Harshil P - Full Size"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>Kottarakkara, Kerala, India</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>B.Tech Student (2023-2027)</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Code className="h-4 w-4 text-primary" />
                          <span>Python Developer</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Brain className="h-4 w-4 text-primary" />
                          <span>AI & Automation Enthusiast</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold">Specializations</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">Web Scraping</Badge>
                          <Badge variant="secondary">Bot Development</Badge>
                          <Badge variant="secondary">AI Tools</Badge>
                          <Badge variant="secondary">Automation</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold">Current Focus</h4>
                        <p className="text-sm text-muted-foreground">
                          Building intelligent automation tools and exploring the intersection of AI and software
                          development. Currently working on projects that leverage GPT models for enhanced user
                          experiences.
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-full md:w-2/3">
              <p className="text-lg leading-relaxed">
                Enthusiastic Computer Science undergraduate dedicated to software development, with a focus on app
                creation, web scraping, bot development, and AI-driven tools. Proficient in Python, prompt engineering,
                and generative AI.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
