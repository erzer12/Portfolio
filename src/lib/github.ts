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

export type RepoStats = {
	stars: number;
	forks: number;
	contributors: Array<{ avatarUrl: string; login: string }>;
	contributorCount: number;
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
	jupyter: '#DA5B0B',
};

// Fallback mock data in case of rate limit or fetch failure
const MOCK_COMMITS: Commit[] = [
	{ message: 'feat: add dark mode toggle', repo: 'Portfolio', time: '2h ago' },
	{ message: 'fix: nav mobile bug on safari', repo: 'Portfolio', time: '5h ago' },
	{ message: 'refactor: optimize image loading', repo: 'SignStream', time: '1d ago' },
	{
		message: 'docs: update project readme',
		repo: 'Historical-Risk-Explorer',
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
		// Fetch recently updated repositories for the user
		const reposRes = await fetch(
			`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`,
			{
				next: { revalidate: 1800 },
				headers: { 'User-Agent': 'harshil-portfolio-app' },
			},
		);

		if (!reposRes.ok) {
			console.warn(`GitHub API user repos failed: ${reposRes.status}. Using fallback commits.`);
			return MOCK_COMMITS;
		}

		const repos = await reposRes.json();
		if (!Array.isArray(repos) || repos.length === 0) return MOCK_COMMITS;

		// Fetch top recent commits per repository
		const commitsNested = await Promise.all(
			repos.slice(0, 4).map(async (repo: { name: string; full_name: string }) => {
				try {
					const cRes = await fetch(
						`https://api.github.com/repos/${repo.full_name}/commits?per_page=2`,
						{
							next: { revalidate: 1800 },
							headers: { 'User-Agent': 'harshil-portfolio-app' },
						},
					);
					if (!cRes.ok) return [];
					const cData = await cRes.json();
					if (!Array.isArray(cData)) return [];

					return cData.map((c: { commit?: { message?: string; author?: { date?: string } } }) => ({
						message: c.commit?.message?.split('\n')[0] || 'Update code & features',
						repo: repo.name,
						time: c.commit?.author?.date ? getRelativeTime(c.commit.author.date) : 'recently',
						rawDate: c.commit?.author?.date ? new Date(c.commit.author.date).getTime() : 0,
					}));
				} catch (_err) {
					return [];
				}
			}),
		);

		const allCommits = commitsNested
			.flat()
			.sort((a, b) => b.rawDate - a.rawDate)
			.slice(0, 4)
			.map(({ message, repo, time }) => ({ message, repo, time }));

		return allCommits.length > 0 ? allCommits : MOCK_COMMITS;
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

export async function getRepoDetails(username: string, repoSlug: string): Promise<RepoStats> {
	try {
		const [repoRes, contribRes] = await Promise.all([
			fetch(`https://api.github.com/repos/${username}/${repoSlug}`, {
				next: { revalidate: 3600 },
				headers: { 'User-Agent': 'harshil-portfolio-app' },
			}),
			fetch(`https://api.github.com/repos/${username}/${repoSlug}/contributors?per_page=5`, {
				next: { revalidate: 3600 },
				headers: { 'User-Agent': 'harshil-portfolio-app' },
			}),
		]);

		let stars = 0;
		let forks = 0;
		let contributors: Array<{ avatarUrl: string; login: string }> = [];

		if (repoRes.ok) {
			const repoData = await repoRes.json();
			stars = repoData.stargazers_count || 0;
			forks = repoData.forks_count || 0;
		}

		if (contribRes.ok) {
			const contribData = await contribRes.json();
			if (Array.isArray(contribData)) {
				contributors = contribData.map((c: { avatar_url: string; login: string }) => ({
					avatarUrl: c.avatar_url,
					login: c.login,
				}));
			}
		}

		return {
			stars,
			forks,
			contributors,
			contributorCount: contributors.length || 1,
		};
	} catch (_err) {
		return {
			stars: 3,
			forks: 1,
			contributors: [],
			contributorCount: 1,
		};
	}
}
