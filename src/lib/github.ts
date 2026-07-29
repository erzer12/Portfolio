export type Commit = {
	message: string;
	repo: string;
	time: string;
};

export type Language = {
	name: string;
	percentage: number;
	color: string;
};

const LANGUAGE_COLORS: Record<string, string> = {
	javascript: '#f1e05a',
	typescript: '#3178c6',
	python: '#3572A5',
	css: '#563d7c',
	html: '#e34c26',
	go: '#00ADD8',
	rust: '#dea584',
	c: '#555555',
	'c++': '#f34b7d',
	java: '#b07219',
	shell: '#89e051',
};

// Fallback mock data in case of rate limit or fetch failure
const MOCK_COMMITS: Commit[] = [
	{ message: 'feat: add dark mode toggle', repo: 'erzer12/Portfolio', time: '2h ago' },
	{ message: 'fix: nav mobile bug on safari', repo: 'erzer12/Portfolio', time: '5h ago' },
	{ message: 'refactor: optimize image loading', repo: 'erzer12/SignStream', time: '1d ago' },
	{
		message: 'docs: update project readme',
		repo: 'erzer12/Historical-Risk-Explorer',
		time: '2d ago',
	},
];

const MOCK_LANGUAGES: Language[] = [
	{ name: 'JavaScript', percentage: 62, color: '#f1e05a' },
	{ name: 'Python', percentage: 31, color: '#3572A5' },
	{ name: 'CSS', percentage: 7, color: '#563d7c' },
];

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
	} catch (_e) {
		return 'recently';
	}
}

export async function getRecentCommits(username: string): Promise<Commit[]> {
	try {
		const res = await fetch(`https://api.github.com/users/${username}/events/public`, {
			next: { revalidate: 1800 }, // Cache for 30 minutes
			headers: {
				'User-Agent': 'harshil-portfolio-app',
			},
		});

		if (!res.ok) {
			console.warn(`GitHub API events failed: ${res.status}. Using fallback commits.`);
			return MOCK_COMMITS;
		}

		const events = await res.json();
		const commits: Commit[] = [];

		for (const event of events) {
			if (event.type === 'PushEvent' && event.payload?.commits) {
				const repoName = event.repo.name.replace(`${username}/`, '');
				for (const c of event.payload.commits) {
					commits.push({
						message: c.message.split('\n')[0], // Get first line
						repo: repoName,
						time: getRelativeTime(event.created_at),
					});
					if (commits.length >= 4) break;
				}
			}
			if (commits.length >= 4) break;
		}

		return commits.length > 0 ? commits : MOCK_COMMITS;
	} catch (err) {
		console.error('Error fetching GitHub commits:', err);
		return MOCK_COMMITS;
	}
}

export async function getLanguageStats(username: string): Promise<Language[]> {
	try {
		const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
			next: { revalidate: 3600 }, // Cache for 1 hour
			headers: {
				'User-Agent': 'harshil-portfolio-app',
			},
		});

		if (!res.ok) {
			console.warn(`GitHub API repos failed: ${res.status}. Using fallback languages.`);
			return MOCK_LANGUAGES;
		}

		const repos = await res.json();
		const langBytes: Record<string, number> = {};
		let totalBytes = 0;

		for (const repo of repos) {
			if (repo.fork) continue; // Skip forks
			const lang = repo.language;
			// Use size as proxy for weight/bytes if size > 0
			if (lang && repo.size) {
				langBytes[lang] = (langBytes[lang] || 0) + repo.size;
				totalBytes += repo.size;
			}
		}

		if (totalBytes === 0) return MOCK_LANGUAGES;

		const sortedLangs = Object.entries(langBytes)
			.map(([name, bytes]) => {
				const percentage = Math.round((bytes / totalBytes) * 100);
				const colorKey = name.toLowerCase();
				return {
					name,
					percentage,
					color: LANGUAGE_COLORS[colorKey] || '#8c909f',
				};
			})
			.filter((l) => l.percentage > 0)
			.sort((a, b) => b.percentage - a.percentage);

		// Limit to top 3 and group rest into Other
		if (sortedLangs.length > 4) {
			const topLangs = sortedLangs.slice(0, 3);
			const otherPercentage = sortedLangs.slice(3).reduce((sum, l) => sum + l.percentage, 0);
			if (otherPercentage > 0) {
				topLangs.push({
					name: 'Other',
					percentage: otherPercentage,
					color: '#8c909f',
				});
			}
			return topLangs;
		}

		return sortedLangs.length > 0 ? sortedLangs : MOCK_LANGUAGES;
	} catch (err) {
		console.error('Error fetching GitHub languages:', err);
		return MOCK_LANGUAGES;
	}
}
