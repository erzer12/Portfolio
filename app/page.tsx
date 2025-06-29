import EnhancedHeader from "@/components/enhanced-header"
import AboutMe from "@/components/about-me"
import UpdatedStatistics from "@/components/updated-statistics"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import EnhancedGitHubSection from "@/components/enhanced-github-section"
import Education from "@/components/education"
import Certifications from "@/components/certifications"
import ToolkitSection from "@/components/toolkit-section"
import EnhancedContact from "@/components/enhanced-contact"
import { HoverCard } from "@/components/hover-card"
import { Toaster } from "@/components/ui/toaster"
import CollaborationCTA from "@/components/collaboration-cta"
import SupabaseStatus from "@/components/supabase-status"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <EnhancedHeader />

      {/* Add top padding to account for fixed header */}
      <main className="container mx-auto px-4 py-8 space-y-20">
        {/* Development helper - remove in production */}
        <div className="fixed bottom-4 right-4 z-50">
          <SupabaseStatus />
        </div>

        <HoverCard>
          <AboutMe />
        </HoverCard>

        <HoverCard>
          <UpdatedStatistics />
        </HoverCard>

        <HoverCard>
          <Skills />
        </HoverCard>

        <HoverCard>
          <Projects />
        </HoverCard>

        <HoverCard>
          <EnhancedGitHubSection />
        </HoverCard>

        <ToolkitSection />

        <CollaborationCTA />

        <HoverCard>
          <Education />
        </HoverCard>

        <HoverCard>
          <Certifications />
        </HoverCard>

        <EnhancedContact />
      </main>

      <footer className="py-6 text-center text-muted-foreground border-t mt-20">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Harshil P. All rights reserved.</p>
          <p className="text-sm mt-2">Built with Next.js, TypeScript, and Supabase</p>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}