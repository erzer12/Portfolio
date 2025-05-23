"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Star, GitFork, Calendar } from "lucide-react"
import { getFilteredRepos } from "@/lib/github"

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

export default function GitHubRepos() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function loadRepos() {
      try {
        const repoData = await getFilteredRepos()
        setRepos(repoData)
      } catch (error) {
        console.error("Error loading repos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRepos()
  }, [])

  const displayedRepos = showAll ? repos : repos.slice(0, 6)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (repos.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2">No repositories to display</h3>
        <p className="text-muted-foreground mb-4">
          Check back later or visit my GitHub profile directly to see my latest projects.
        </p>
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
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedRepos.map((repo) => (
          <Card key={repo.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
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
              {repo.description && <p className="text-sm text-muted-foreground line-clamp-2">{repo.description}</p>}
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
        ))}
      </div>

      {repos.length > 6 && (
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => setShowAll(!showAll)} className="min-w-[120px]">
            {showAll ? "Show Less" : `Show All (${repos.length})`}
          </Button>
        </div>
      )}

      <div className="text-center mt-6">
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
    </div>
  )
}
