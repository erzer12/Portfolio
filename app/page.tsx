import Header from "@/components/header"
import AboutMe from "@/components/about-me"
import Statistics from "@/components/statistics"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import GitHubSection from "@/components/github-section"
import Education from "@/components/education"
import Certifications from "@/components/certifications"
import Contact from "@/components/contact"
import { HoverCard } from "@/components/hover-card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-20">
        <HoverCard>
          <AboutMe />
        </HoverCard>

        <HoverCard>
          <Statistics />
        </HoverCard>

        <HoverCard>
          <Skills />
        </HoverCard>

        <HoverCard>
          <Projects />
        </HoverCard>

        <HoverCard>
          <GitHubSection />
        </HoverCard>

        <HoverCard>
          <Education />
        </HoverCard>

        <HoverCard>
          <Certifications />
        </HoverCard>

        <HoverCard>
          <Contact />
        </HoverCard>
      </main>

      <footer className="py-6 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Harshil P. All rights reserved.</p>
      </footer>
    </div>
  )
}
