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
  size: number
  fork: boolean
  archived?: boolean // Added for archived field
}

interface GitHubUser {
  login: string
  name: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
  avatar_url: string
  html_url: string
}

interface GitHubStats {
  totalRepos: number
  totalStars: number
  totalForks: number
  languages: { [key: string]: number }
  yearsActive: number
}

interface LanguageStat {
  name: string
  count: number
  percentage: number
  color: string
}

const GITHUB_USERNAME = "erzer12"

// Repositories to exclude from display
// Add your specific repository names here (case-insensitive)
const EXCLUDED_REPOS = [
  // Generic test/practice repositories
  "test-repo",
  "practice",
  "learning",
  "temp",
  "example",
  "demo",
  "playground",
  "sandbox",
  "experiment",
  "tutorial",
  "sample",
  "template",
  "boilerplate",
  "starter",
  "hello-world",
  "test",
  "testing",
  "trial",
  "scratch",
  "draft",

  // Common GitHub default repositories
  "erzer12", // Your username repository (if it exists)
  "readme",
  "profile",

  // Add your specific repositories here:
  // "repository-name-1",
  // "repository-name-2",
  // "old-project",
  // "broken-project",
  // "incomplete-project",

  // You can uncomment and modify these examples:
  // "my-first-repo",
  // "college-assignment",
  // "random-scripts",
  // "backup-files",
]

// Additional filtering options - you can customize these
const FILTERING_OPTIONS = {
  // Minimum repository size in KB (set to 0 to disable)
  minSize: 50,

  // Exclude repositories without descriptions (set to false to include all)
  requireDescription: false,

  // Exclude repositories without topics (set to false to include all)
  requireTopics: false,

  // Minimum stars required (set to 0 to disable)
  minStars: 0,

  // Exclude archived repositories
  excludeArchived: true,

  // Maximum age in days (set to 0 to disable)
  maxAgeDays: 0, // 365 = 1 year, 730 = 2 years
}

// Language colors based on GitHub's language colors
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  Go: "#00ADD8",
  PHP: "#4F5D95",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Rust: "#dea584",
  Dart: "#00B4AB",
  Shell: "#89e051",
  Jupyter: "#DA5B0B",
  Vue: "#4FC08D",
  React: "#61DAFB",
  // Default color for languages not in this list
  default: "#8257e5",
}

// Helper function to create fetch with timeout
function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId)
  })
}

export async function fetchGitHubUser(): Promise<GitHubUser | null> {
  try {
    const response = await fetchWithTimeout(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }, 10000) // 10 second timeout

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub user")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching GitHub user:", error)
    return null
  }
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const response = await fetchWithTimeout(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }, 10000) // 10 second timeout

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub repos")
    }

    const repos: GitHubRepo[] = await response.json()
    return repos
  } catch (error) {
    console.error("Error fetching GitHub repos:", error)
    return []
  }
}

// Function to filter repositories based on quality criteria
export function filterQualityRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return repos.filter((repo) => {
    // Exclude repositories by name (case-insensitive)
    if (EXCLUDED_REPOS.some((excludedName) => repo.name.toLowerCase().includes(excludedName.toLowerCase()))) {
      console.log(`Excluding repository: ${repo.name} (matched exclusion list)`)
      return false
    }

    // Exclude forks
    if (repo.fork) {
      console.log(`Excluding repository: ${repo.name} (is a fork)`)
      return false
    }

    // Exclude archived repositories
    if (FILTERING_OPTIONS.excludeArchived && (repo as any).archived) {
      console.log(`Excluding repository: ${repo.name} (is archived)`)
      return false
    }

    // Exclude repositories without a description (if required)
    if (FILTERING_OPTIONS.requireDescription && (!repo.description || repo.description.trim() === "")) {
      console.log(`Excluding repository: ${repo.name} (no description)`)
      return false
    }

    // Exclude repositories without topics (if required)
    if (FILTERING_OPTIONS.requireTopics && (!repo.topics || repo.topics.length === 0)) {
      console.log(`Excluding repository: ${repo.name} (no topics)`)
      return false
    }

    // Exclude very small repositories
    if (FILTERING_OPTIONS.minSize > 0 && repo.size < FILTERING_OPTIONS.minSize) {
      console.log(`Excluding repository: ${repo.name} (too small: ${repo.size}KB)`)
      return false
    }

    // Exclude repositories with insufficient stars
    if (FILTERING_OPTIONS.minStars > 0 && repo.stargazers_count < FILTERING_OPTIONS.minStars) {
      console.log(`Excluding repository: ${repo.name} (insufficient stars: ${repo.stargazers_count})`)
      return false
    }

    // Exclude old repositories (if age limit is set)
    if (FILTERING_OPTIONS.maxAgeDays > 0) {
      const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceUpdate > FILTERING_OPTIONS.maxAgeDays) {
        console.log(`Excluding repository: ${repo.name} (too old: ${Math.round(daysSinceUpdate)} days)`)
        return false
      }
    }

    console.log(`Including repository: ${repo.name}`)
    return true
  })
}

export async function getFilteredRepos(): Promise<GitHubRepo[]> {
  const allRepos = await fetchGitHubRepos()
  const filteredRepos = filterQualityRepos(allRepos)

  console.log(`Filtered ${allRepos.length} repositories down to ${filteredRepos.length}`)

  // Sort by stars first, then by recent updates
  return filteredRepos.sort((a, b) => {
    // Sort by stars first
    if (b.stargazers_count !== a.stargazers_count) {
      return b.stargazers_count - a.stargazers_count
    }
    // Then by recent updates
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })
}

export async function calculateGitHubStats(): Promise<GitHubStats> {
  try {
    const [user, repos] = await Promise.all([fetchGitHubUser(), getFilteredRepos()])

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0)

    const languages: { [key: string]: number } = {}
    repos.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1
      }
    })

    const yearsActive = user ? new Date().getFullYear() - new Date(user.created_at).getFullYear() + 1 : 2

    return {
      totalRepos: repos.length,
      totalStars,
      totalForks,
      languages,
      yearsActive,
    }
  } catch (error) {
    console.error("Error calculating GitHub stats:", error)
    return {
      totalRepos: 5,
      totalStars: 0,
      totalForks: 0,
      languages: {},
      yearsActive: 2,
    }
  }
}

export async function getLanguageStats(): Promise<LanguageStat[]> {
  try {
    const repos = await getFilteredRepos()

    // Count languages
    const languageCounts: Record<string, number> = {}
    repos.forEach((repo) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
      }
    })

    // Filter out null or empty languages
    const filteredLanguages = Object.entries(languageCounts).filter(
      ([name]) => name && name !== "null" && name !== "undefined",
    )

    // Sort by count (descending)
    const sortedLanguages = filteredLanguages.sort((a, b) => b[1] - a[1])

    // Calculate total for percentages
    const totalReposWithLanguage = sortedLanguages.reduce((sum, [_, count]) => sum + count, 0)

    // Create language stats with percentages and colors
    const languageStats: LanguageStat[] = sortedLanguages.map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalReposWithLanguage) * 100),
      color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS.default,
    }))

    return languageStats
  } catch (error) {
    console.error("Error fetching language stats:", error)

    // Return mock data if there's an error
    return [
      { name: "Python", count: 8, percentage: 40, color: LANGUAGE_COLORS.Python },
      { name: "JavaScript", count: 5, percentage: 25, color: LANGUAGE_COLORS.JavaScript },
      { name: "HTML", count: 4, percentage: 20, color: LANGUAGE_COLORS.HTML },
      { name: "CSS", count: 3, percentage: 15, color: LANGUAGE_COLORS.CSS },
    ]
  }
}

// Helper function to get excluded repositories list (for debugging)
export function getExcludedRepos(): string[] {
  return EXCLUDED_REPOS
}

// Helper function to get filtering options (for debugging)
export function getFilteringOptions() {
  return FILTERING_OPTIONS
}