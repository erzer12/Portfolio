import { execSync } from 'node:child_process';

/**
 * Retrieves the latest Git commit SHA for the Portfolio repository.
 * Order of priority:
 * 1. Vercel deployment commit SHA env var (VERCEL_GIT_COMMIT_SHA)
 * 2. Local git HEAD commit SHA (execSync)
 * 3. GitHub API latest commit for erzer12/Portfolio
 * 4. Safe fallback commit SHA
 */
export async function getLatestPortfolioCommitSha(): Promise<string> {
	if (process.env.VERCEL_GIT_COMMIT_SHA) {
		return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
	}

	try {
		const localSha = execSync('git rev-parse --short HEAD', {
			encoding: 'utf8',
			timeout: 2000,
		}).trim();
		if (localSha && /^[0-9a-f]{7,40}$/i.test(localSha)) {
			return localSha.slice(0, 7);
		}
	} catch {
		// Git command unavailable or not a git repository
	}

	try {
		const res = await fetch('https://api.github.com/repos/erzer12/Portfolio/commits?per_page=1', {
			headers: { 'User-Agent': 'harshil-portfolio-app' },
			next: { revalidate: 300 },
		});
		if (res.ok) {
			const data = await res.json();
			if (Array.isArray(data) && data[0]?.sha) {
				return data[0].sha.slice(0, 7);
			}
		}
	} catch {
		// GitHub API unavailable
	}

	return '3b18d67';
}
