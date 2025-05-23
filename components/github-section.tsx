import { SectionHeading } from "@/components/section-heading"
import GitHubRepos from "@/components/github-repos"
import LanguageChart from "@/components/language-chart"
import RepoFilterConfig from "@/components/repo-filter-config"

export default function GitHubSection() {
  return (
    <section id="github" className="py-10">
      <div className="flex items-center justify-between mb-6">
        <SectionHeading>GitHub Portfolio</SectionHeading>
        <RepoFilterConfig />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          <LanguageChart />
        </div>
        <div className="lg:col-span-1">
          <div className="h-full flex flex-col">
            <div className="bg-card rounded-lg border p-6 flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-4">Why These Languages?</h3>
              <p className="text-muted-foreground mb-4">
                My language choices reflect my focus on building practical applications with modern technologies. I
                prioritize languages that enable rapid development while maintaining performance and scalability.
              </p>
              <p className="text-muted-foreground">
                Python is my primary language for AI/ML projects and automation, while JavaScript/TypeScript powers my
                web applications. I'm constantly expanding my language knowledge to tackle diverse challenges.
              </p>
            </div>
          </div>
        </div>
      </div>

      <GitHubRepos />
    </section>
  )
}
