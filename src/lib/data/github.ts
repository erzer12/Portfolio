export type ContributionDay = {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
};

export type GitHubContributionsData = {
	total: number;
	contributions: ContributionDay[];
	currentStreak: number;
	longestStreak: number;
};

export type Commit = {
	message: string;
	repo: string;
	time: string;
	sha?: string;
	url?: string;
};

export type Language = {
	name: string;
	percentage: number;
	color: string;
};

export const FALLBACK_COMMITS: Commit[] = [
	{
		message: 'feat: add live 52-week GitHub contribution calendar with real-time stats',
		repo: 'Portfolio',
		time: 'Just now',
		sha: 'a4d9e21',
		url: 'https://github.com/erzer12/Portfolio',
	},
	{
		message: 'feat: implement Lab Spec Sheet project card design with tech specs table',
		repo: 'Portfolio',
		time: '2h ago',
		sha: '7f8c12b',
		url: 'https://github.com/erzer12/Portfolio',
	},
	{
		message:
			'feat: remove seed data capability and implement contact form honeypot spam protection',
		repo: 'Portfolio',
		time: '1d ago',
		sha: '293fe4a',
		url: 'https://github.com/erzer12/Portfolio',
	},
	{
		message: 'feat: implement root layout with analytics and reusable Navigation component',
		repo: 'Portfolio',
		time: '2d ago',
		sha: 'e493716',
		url: 'https://github.com/erzer12/Portfolio',
	},
	{
		message: 'feat: add Header component and ImageEditorModal for profile image cropping',
		repo: 'Portfolio',
		time: '3d ago',
		sha: 'd7f2568',
		url: 'https://github.com/erzer12/Portfolio',
	},
];

export const FALLBACK_LANGUAGES: Language[] = [
	{ name: 'TypeScript', percentage: 58, color: '#3178c6' },
	{ name: 'Python', percentage: 24, color: '#3572A5' },
	{ name: 'CSS / Tailwind', percentage: 12, color: '#563d7c' },
	{ name: 'JavaScript', percentage: 6, color: '#f1e05a' },
];

// Language color map (GitHub's canonical colors)
const LANGUAGE_COLORS: Record<string, string> = {
	TypeScript: '#3178c6',
	JavaScript: '#f1e05a',
	Python: '#3572A5',
	Rust: '#dea584',
	Go: '#00ADD8',
	Java: '#b07219',
	'C++': '#f34b7d',
	C: '#555555',
	'C#': '#178600',
	Ruby: '#701516',
	Swift: '#F05138',
	Kotlin: '#A97BFF',
	Dart: '#00B4AB',
	CSS: '#563d7c',
	HTML: '#e34c26',
	Shell: '#89e051',
	Dockerfile: '#384d54',
	Vue: '#41b883',
	Svelte: '#ff3e00',
	Lua: '#000080',
	PHP: '#4F5D95',
	Nix: '#7e7eff',
};

function getRelativeTime(dateString: string): string {
	try {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		return `${diffDays}d ago`;
	} catch {
		return 'recently';
	}
}

/** Build GitHub API headers — uses GITHUB_TOKEN if available for 5000 req/hr (vs 60 unauthenticated) */
function githubHeaders(): Record<string, string> {
	const headers: Record<string, string> = {
		'User-Agent': 'harshil-portfolio-app',
		Accept: 'application/vnd.github+json',
	};
	const token = process.env.GITHUB_TOKEN;
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}
	return headers;
}

export async function getGitHubContributions(
	username = 'erzer12',
): Promise<GitHubContributionsData> {
	try {
		const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
			// Cache for 1 hour to stay fast and avoid rate limits
			next: { revalidate: 3600 },
		});

		if (!res.ok) {
			throw new Error(`Failed to fetch GitHub contributions: ${res.status}`);
		}

		const data = await res.json();
		const contributions: ContributionDay[] = data.contributions || [];
		const total = data.total?.lastYear ?? contributions.reduce((acc, c) => acc + c.count, 0);

		// Calculate current streak & longest streak
		let currentStreak = 0;
		let longestStreak = 0;
		let tempStreak = 0;

		for (const day of contributions) {
			if (day.count > 0) {
				tempStreak += 1;
				if (tempStreak > longestStreak) {
					longestStreak = tempStreak;
				}
			} else {
				tempStreak = 0;
			}
		}

		// Calculate current streak backwards from today
		for (let i = contributions.length - 1; i >= 0; i--) {
			if (contributions[i].count > 0) {
				currentStreak += 1;
			} else {
				// Allow today to be 0 if earlier today had contributions
				if (i === contributions.length - 1) continue;
				break;
			}
		}

		return {
			total,
			contributions,
			currentStreak,
			longestStreak,
		};
	} catch (error) {
		console.warn('Error fetching GitHub contributions, using fallback:', error);
		return {
			total: 887,
			contributions: [],
			currentStreak: 4,
			longestStreak: 21,
		};
	}
}

export async function getRecentCommits(username = 'erzer12'): Promise<Commit[]> {
	try {
		// Use the Events API — this is what GitHub uses for recent public activity.
		// It captures all push activity including forks.
		const eventsRes = await fetch(
			`https://api.github.com/users/${username}/events/public?per_page=50`,
			{
				cache: 'no-store',
				headers: githubHeaders(),
			},
		);

		if (!eventsRes.ok) {
			console.warn(`GitHub events fetch failed: ${eventsRes.status} ${eventsRes.statusText}`);
			return FALLBACK_COMMITS;
		}

		const events = await eventsRes.json();
		if (!Array.isArray(events) || events.length === 0) {
			return FALLBACK_COMMITS;
		}

		// Filter for push events
		const pushEvents = events.filter(
			(e) => e.type === 'PushEvent' && (e.payload?.head || e.payload?.commits?.length),
		);

		type GitHubPushEvent = {
			type: string;
			created_at?: string;
			repo?: { name?: string };
			payload?: {
				head?: string;
				ref?: string;
				commits?: Array<{ sha?: string; message?: string }>;
			};
		};

		// Extract up to 5 unique recent push events
		const selectedEvents: GitHubPushEvent[] = [];
		const seenShas = new Set<string>();

		for (const pe of pushEvents as GitHubPushEvent[]) {
			const sha = pe.payload?.head || pe.payload?.commits?.[pe.payload.commits.length - 1]?.sha;
			if (sha && !seenShas.has(sha)) {
				seenShas.add(sha);
				selectedEvents.push(pe);
			}
			if (selectedEvents.length >= 5) break;
		}

		if (selectedEvents.length === 0) {
			return FALLBACK_COMMITS;
		}

		// Fetch commit details for each push event in parallel
		const commitResults = await Promise.allSettled(
			selectedEvents.map(async (event): Promise<Commit & { rawDate: number }> => {
				const repoFullName: string = event.repo?.name ?? '';
				const repoName = repoFullName.split('/')[1] || repoFullName;
				const sha: string =
					event.payload?.head ||
					event.payload?.commits?.[event.payload.commits.length - 1]?.sha ||
					'';
				const eventDate = event.created_at ? new Date(event.created_at).getTime() : Date.now();

				// If the event payload already has the commit message
				if (event.payload?.commits?.length) {
					const raw = event.payload.commits[event.payload.commits.length - 1];
					const message = raw?.message?.split('\n')[0] || 'Commit changes';
					return {
						message,
						repo: repoName,
						time: event.created_at ? getRelativeTime(event.created_at) : 'recently',
						sha: sha ? sha.slice(0, 7) : '',
						url: sha
							? `https://github.com/${repoFullName}/commit/${sha}`
							: `https://github.com/${repoFullName}`,
						rawDate: eventDate,
					};
				}

				// Otherwise fetch the commit details via GitHub API
				const commitRes = await fetch(
					`https://api.github.com/repos/${repoFullName}/commits/${sha}`,
					{
						cache: 'no-store',
						headers: githubHeaders(),
					},
				);

				if (!commitRes.ok) {
					return {
						message: `Pushed commits to ${event.payload?.ref?.replace('refs/heads/', '') || 'branch'}`,
						repo: repoName,
						time: event.created_at ? getRelativeTime(event.created_at) : 'recently',
						sha: sha ? sha.slice(0, 7) : '',
						url: sha
							? `https://github.com/${repoFullName}/commit/${sha}`
							: `https://github.com/${repoFullName}`,
						rawDate: eventDate,
					};
				}

				const commitData = await commitRes.json();
				const message = commitData.commit?.message?.split('\n')[0] || 'Commit changes';
				const commitDateStr = commitData.commit?.author?.date || event.created_at;
				const commitDate = commitDateStr ? new Date(commitDateStr).getTime() : eventDate;

				return {
					message,
					repo: repoName,
					time: commitDateStr ? getRelativeTime(commitDateStr) : 'recently',
					sha: sha ? sha.slice(0, 7) : '',
					url:
						commitData.html_url ||
						(sha
							? `https://github.com/${repoFullName}/commit/${sha}`
							: `https://github.com/${repoFullName}`),
					rawDate: commitDate,
				};
			}),
		);

		const validCommits = commitResults
			.filter(
				(r): r is PromiseFulfilledResult<Commit & { rawDate: number }> => r.status === 'fulfilled',
			)
			.map((r) => r.value)
			.sort((a, b) => b.rawDate - a.rawDate)
			.map(({ rawDate: _, ...commit }) => commit);

		return validCommits.length > 0 ? validCommits : FALLBACK_COMMITS;
	} catch (error) {
		console.warn('Error fetching recent commits:', error);
		return FALLBACK_COMMITS;
	}
}

export async function getLanguageStats(username = 'erzer12'): Promise<Language[]> {
	try {
		// 1. Get user's non-fork repos
		const reposRes = await fetch(
			`https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=20`,
			{
				next: { revalidate: 3600 },
				headers: githubHeaders(),
			},
		);

		if (!reposRes.ok) return FALLBACK_LANGUAGES;

		const repos = await reposRes.json();
		if (!Array.isArray(repos)) return FALLBACK_LANGUAGES;

		// 2. Fetch language bytes for each non-fork repo (limit to 10 to avoid rate limits)
		const ownRepos = repos.filter((r: { fork?: boolean }) => !r.fork).slice(0, 10);

		const langPromises = ownRepos.map(async (repo: { name: string }) => {
			try {
				const res = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`, {
					next: { revalidate: 3600 },
					headers: githubHeaders(),
				});
				if (!res.ok) return {};
				return (await res.json()) as Record<string, number>;
			} catch {
				return {};
			}
		});

		const langResults = await Promise.all(langPromises);

		// 3. Aggregate byte counts across all repos
		const totals: Record<string, number> = {};
		for (const langMap of langResults) {
			for (const [lang, bytes] of Object.entries(langMap)) {
				totals[lang] = (totals[lang] ?? 0) + bytes;
			}
		}

		const totalBytes = Object.values(totals).reduce((a, b) => a + b, 0);
		if (totalBytes === 0) return FALLBACK_LANGUAGES;

		// 4. Convert to percentages, take top 6
		const sorted = Object.entries(totals)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 6)
			.map(([name, bytes]) => ({
				name,
				percentage: Math.round((bytes / totalBytes) * 100),
				color: LANGUAGE_COLORS[name] ?? '#8b949e',
			}));

		// Ensure percentages sum to 100 (fix rounding)
		const sum = sorted.reduce((a, l) => a + l.percentage, 0);
		if (sorted.length > 0 && sum !== 100) {
			sorted[0].percentage += 100 - sum;
		}

		return sorted.length > 0 ? sorted : FALLBACK_LANGUAGES;
	} catch (error) {
		console.warn('Error fetching language stats:', error);
		return FALLBACK_LANGUAGES;
	}
}
