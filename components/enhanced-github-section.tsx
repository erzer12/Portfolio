"use client"

import { useEffect, useState } from "react"
import { SectionHeading } from "@/components/section-heading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Star, GitFork, Calendar, Code, TrendingUp, Users } from "lucide-react"
import { motion } from "framer-motion"
import { getFilteredRepos, calculateGitHubStats } from "@/lib/github"
import LanguageChart from "@/components/language-chart"

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
}

interface GitHubStats {
  totalRepos: number
  totalStars: number
  totalForks: number
  yearsActive: number
}

export default function EnhancedGitHubSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [repoData, statsData] = await Promise.all([getFilteredRepos(), calculateGitHubStats()])
        setRepos(repoData)
        setStats(statsData)
      } catch (error) {
        console.error("Error loading GitHub data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const displayedRepos = showAll ? repos : repos.slice(0, 6)

  const statItems = stats
    ? [
        {
          icon: Code,
          label: "Repositories",
          value: stats.totalRepos,
          suffix: "",
          color: "text-blue-500",
        },
        {
          icon: Star,
          label: "Total Stars",
          value: stats.totalStars,
          suffix: "",
          color: "text-yellow-500",
        },
        {
          icon: GitFork,
          label: "Total Forks",
          value: stats.totalForks,
          suffix: "",
          color: "text-green-500",
        },
        {
          icon: TrendingUp,
          label: "Years Active",
          value: stats.yearsActive,
          suffix: "+",
          color: "text-purple-500",
        },
      ]
    : []

  if (loading) {
    return (
      <section id="github" className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <SectionHeading>GitHub Portfolio</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-12 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="github" className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <SectionHeading>GitHub Portfolio</SectionHeading>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore my coding journey through GitHub statistics, programming languages, and featured repositories.
          </p>
        </motion.div>

        {/* GitHub Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {statItems.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div
                    className={`inline-flex p-3 rounded-full bg-muted mb-4 group-hover:scale-110 transition-transform ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {stat.value}
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Language Chart and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <LanguageChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Development Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  My programming language choices reflect my focus on building practical applications with modern
                  technologies.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Python for AI/ML & Automation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">JavaScript/TypeScript for Web</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Modern Frameworks & Tools</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Repository Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold mb-8 text-center">Featured Repositories</h3>

          {repos.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No repositories to display</h3>
              <p className="text-muted-foreground mb-6">Check back later or visit my GitHub profile directly.</p>
              <Button asChild>
                <a
                  href="https://github.com/erzer12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit GitHub Profile
                </a>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayedRepos.map((repo, index) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="h-full group hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span className="truncate">{repo.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View ${repo.name} on GitHub`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </CardTitle>
                        {repo.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{repo.description}</p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {repo.language && (
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                              <span>{repo.language}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{repo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" />
                            <span>{repo.forks_count}</span>
                          </div>
                        </div>

                        {repo.topics && repo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {repo.topics.slice(0, 3).map((topic) => (
                              <Badge key={topic} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                            {repo.topics.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{repo.topics.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Show More/Less Button */}
              {repos.length > 6 && (
                <div className="text-center">
                  <Button variant="outline" onClick={() => setShowAll(!showAll)} className="min-w-[120px]">
                    {showAll ? "Show Less" : `Show All (${repos.length})`}
                  </Button>
                </div>
              )}

              {/* GitHub Profile Link */}
              <div className="text-center mt-8">
                <Button asChild>
                  <a
                    href="https://github.com/erzer12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View All on GitHub
                  </a>
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
