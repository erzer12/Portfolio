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
import { motion } from "framer-motion"

export default function AboutMe() {
  return (
    <section id="about" className="py-10">
      <SectionHeading>About Me</SectionHeading>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Prominent Image with Motion */}
        <div className="w-full md:w-1/3">
          <Dialog>
            <DialogTrigger asChild>
              <motion.button
                className="relative w-full cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="overflow-hidden rounded-lg shadow-lg border-4 border-primary/10 transition-all duration-300 hover:shadow-xl hover:border-primary/30 aspect-[4/5]">
                  <img
                    src="/images/profile-final.jpeg"
                    alt="Harshil P"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pointer-events-none">
                    <div className="text-white p-4 text-center">
                      <span className="inline-block bg-black/50 px-4 py-2 rounded-full text-sm font-medium mb-2">
                        View Profile Details
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center">Harshil P</DialogTitle>
                <DialogDescription className="text-center">Software Developer & AI Enthusiast</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20">
                    <img src="/images/profile-final.jpeg" alt="Harshil P" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Kottarakkara, Kerala, India</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>B.Tech Student (2023-2027)</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Code className="h-4 w-4 text-primary" />
                    <span>Python Developer</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Brain className="h-4 w-4 text-primary" />
                    <span>AI & Automation Enthusiast</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-center">Specializations</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary">Web Scraping</Badge>
                    <Badge variant="secondary">Bot Development</Badge>
                    <Badge variant="secondary">AI Tools</Badge>
                    <Badge variant="secondary">Automation</Badge>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* About Me Text */}
        <div className="w-full md:w-2/3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="w-full h-full overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <p className="text-lg leading-relaxed mb-4">
                  Enthusiastic Computer Science undergraduate dedicated to software development, with a focus on app
                  creation, web scraping, bot development, and AI-driven tools. Proficient in Python, prompt
                  engineering, and generative AI.
                </p>
                <p className="text-base leading-relaxed mb-4 text-muted-foreground">
                  Currently pursuing my B.Tech degree while actively working on innovative projects that bridge the gap
                  between traditional software development and cutting-edge AI technologies. I have a passion for
                  creating automated solutions that solve real-world problems and enhance user experiences.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  My expertise spans across multiple domains including web scraping frameworks, chatbot development, and
                  AI-powered applications. I'm particularly interested in leveraging large language models to create
                  intelligent systems that can understand and respond to complex user requirements.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
