import Link from 'next/link';
import { ClickerGame } from '@/components/ClickerGame';
import { GitHubContributionHeatmap } from '@/components/GitHubContributionHeatmap';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { LiveClock } from '@/components/LiveClock';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getExperience } from '@/lib/data/experience';
import { getProfile } from '@/lib/data/profile';
import { getFeaturedProjects } from '@/lib/data/projects';
import { getLanguageStats, getRecentCommits, getRepoDetails, type RepoStats } from '@/lib/github';

export const dynamic = 'force-dynamic';

export default async function Home() {
	const username = 'erzer12';

	const [profile, featuredProjects, experience, commits, languages] = await Promise.all([
		getProfile(),
		getFeaturedProjects(),
		getExperience(),
		getRecentCommits(username),
		getLanguageStats(username),
	]);

	// limit to 2 projects for the homepage featured section
	const homepageProjects = featuredProjects.slice(0, 2);

	// Fetch real dynamic repo details (stars, contributors) from GitHub API
	const repoStatsList: RepoStats[] = await Promise.all(
		homepageProjects.map((p) => getRepoDetails(username, p.slug)),
	);

	return (
		<LayoutWrapper>
			<div className="space-y-12">
				{/* § 1 — Hero Section */}
				<section className="flex flex-col gap-6 pt-4 font-mono">
					<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface">
						Hey! I'm <span className="text-primary">{profile?.name || 'Harshil P'}</span>
					</h1>
					<p className="text-on-surface-variant text-sm md:text-base leading-relaxed max-w-2xl font-sans">
						{profile?.summary ||
							"I'm a CS student building at the intersection of AI/ML and full-stack web. NASA Space Apps 2025 Global Nominee."}
					</p>

					{/* Social Links Row */}
					<div className="flex flex-wrap items-center gap-4 text-xs font-mono tracking-wider text-on-surface-variant">
						{profile?.social?.github && (
							<a
								href={profile.social.github}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 hover:text-on-surface transition-colors"
							>
								<span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
									code
								</span>{' '}
								GitHub
							</a>
						)}
						<span className="text-border-muted select-none">|</span>
						{profile?.social?.linkedin && (
							<a
								href={profile.social.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 hover:text-on-surface transition-colors"
							>
								<span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
									work
								</span>{' '}
								LinkedIn
							</a>
						)}
						<span className="text-border-muted select-none">|</span>
						<a
							href={`mailto:${profile?.email || 'harshilp1234@gmail.com'}`}
							className="flex items-center gap-1.5 hover:text-on-surface transition-colors"
						>
							<span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
								email
							</span>{' '}
							Email
						</a>
						<span className="text-border-muted select-none">|</span>
						<Link
							href="/about"
							className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
						>
							More about me{' '}
							<span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
								arrow_forward
							</span>
						</Link>
					</div>
				</section>

				{/* § 2 — Experience Strip */}
				{experience.length > 0 && (
					<section className="flex flex-wrap gap-2 items-center text-xs font-mono text-on-surface-variant bg-surface-container/40 p-3 rounded-lg border border-border-muted overflow-x-auto whitespace-nowrap no-scrollbar transition-colors duration-300">
						{experience.map((exp, index) => {
							const colors: Record<string, string> = {
								'mulearn foundation': 'bg-[#ff9900]/15 text-[#ff9900] border-[#ff9900]/30',
								geeksforgeeks: 'bg-[#2f8d46]/15 text-[#2f8d46] border-[#2f8d46]/30',
								'inovus labs': 'bg-[#1a73e8]/15 text-[#1a73e8] border-[#1a73e8]/30',
							};
							const key = exp.company.toLowerCase();
							const themeClass = colors[key] || 'bg-primary/10 text-primary border-primary/20';
							const initial = exp.company.charAt(0);

							return (
								<div key={exp.id} className="flex items-center">
									{index > 0 && <span className="text-border-muted mx-2.5">/</span>}

									<div className="relative group cursor-pointer hover:opacity-80 transition-opacity">
										<Link href="/experience" className="flex items-center gap-2">
											<span
												className={`w-5 h-5 rounded border flex items-center justify-center text-[9px] font-bold ${themeClass}`}
											>
												{initial}
											</span>
											<span className="font-semibold text-on-surface">{exp.company}</span>
											<span className="text-[10px] text-on-surface-variant/70">
												({exp.end_date ? exp.end_date.split(' ').pop() : 'Present'})
											</span>
										</Link>

										{/* Tooltip Card */}
										<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-surface-container-high border border-border-muted rounded-lg shadow-xl p-3 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-normal">
											<div className="font-bold text-xs text-on-surface">{exp.role}</div>
											<div className="text-[10px] text-primary mb-1">
												{exp.company} · {exp.start_date} – {exp.end_date || 'Present'}
											</div>
											<ul className="list-disc pl-3 text-[10px] text-on-surface-variant space-y-1.5 font-sans">
												{exp.bullets.slice(0, 2).map((bullet) => (
													<li key={bullet}>{bullet}</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							);
						})}
					</section>
				)}

				{/* § 3 — Featured Projects */}
				<section className="space-y-4">
					<div className="flex justify-between items-end border-b border-border-muted pb-2">
						<h2 className="text-xl font-bold tracking-tight text-on-surface flex items-center gap-2">
							<span
								className="material-symbols-outlined text-tertiary"
								style={{ fontVariationSettings: "'FILL' 1" }}
							>
								star
							</span>
							Featured Projects
						</h2>
						<Link
							href="/projects"
							className="text-xs font-mono text-tertiary hover:underline hover:underline-offset-4"
						>
							View all →
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{homepageProjects.map((project, idx) => {
							const stats = repoStatsList[idx] || { stars: 0, contributors: [] };
							return (
								<Link
									key={project.id}
									href={`/projects/${project.slug}`}
									className="group flex flex-col justify-between transition-all duration-200"
								>
									{/* macOS-style Terminal Box */}
									<div className="bg-[#0f1422] border border-border-muted rounded-xl overflow-hidden shadow-lg flex flex-col justify-between aspect-video w-full transition-transform duration-200 group-hover:scale-[1.01] group-hover:border-primary/50">
										{/* Window Titlebar */}
										<div className="bg-[#151b27] px-4 py-2.5 flex items-center justify-between border-b border-border-muted/50 select-none">
											<div className="flex gap-1.5">
												<span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
												<span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
												<span className="w-2 h-2 rounded-full bg-[#27c93f]" />
											</div>
											<div className="flex items-center gap-1 text-[9px] font-mono text-on-surface-variant/80">
												<span className="material-symbols-outlined text-[10px] text-tertiary">
													star
												</span>
												<span>{stats.stars}</span>
											</div>
										</div>

										{/* Terminal Content */}
										<div className="p-4 flex-grow flex flex-col justify-between font-mono text-[10px] text-on-surface-variant/90 leading-relaxed">
											<div className="space-y-1.5">
												<div className="text-[11px] font-bold">
													<span className="text-tertiary">erzer12</span>
													<span className="text-on-surface-variant/50"> / </span>
													<span className="text-primary">{project.slug}</span>
												</div>
												<p className="text-[9px] text-on-surface-variant/70 leading-relaxed line-clamp-3 font-mono">
													{project.description}
												</p>
											</div>

											{/* Dynamic Contributor Avatars from GitHub API */}
											<div className="flex items-center justify-between pt-3 border-t border-border-muted/10">
												<div className="flex -space-x-1.5 overflow-hidden">
													{stats.contributors.length > 0 ? (
														stats.contributors.slice(0, 3).map((c) => (
															/* biome-ignore lint/performance/noImgElement: contributor avatar */
															<img
																key={c.login}
																src={c.avatarUrl}
																alt={c.login}
																className="inline-block h-4 w-4 rounded-full ring-1 ring-[#0f1422] object-cover"
															/>
														))
													) : (
														<span className="inline-block h-4 w-4 rounded-full ring-1 ring-[#0f1422] bg-primary/20 text-[7px] flex items-center justify-center font-bold text-primary">
															HP
														</span>
													)}
												</div>
												<span className="text-[8px] opacity-60">
													{stats.contributors.length || 1} Contributor
													{(stats.contributors.length || 1) > 1 ? 's' : ''}
												</span>
											</div>
										</div>
									</div>

									{/* Details Outside the Terminal */}
									<div className="space-y-2 mt-3.5 px-1">
										<h3 className="font-sans text-base font-bold text-primary group-hover:text-primary/80 transition-colors">
											{project.title}
										</h3>
										<p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
											{project.description}
										</p>

										{/* Tech tags and Date */}
										<div className="pt-2 flex items-center justify-between border-t border-border-muted/20">
											<div className="flex flex-wrap gap-1.5">
												{project.tags.slice(0, 3).map((tag) => (
													<span
														key={tag}
														className="px-1.5 py-0.5 bg-surface-container border border-border-muted/30 rounded text-[9px] font-mono text-on-surface-variant"
													>
														{tag}
													</span>
												))}
											</div>
											<span className="font-mono text-[9px] text-on-surface-variant/70">
												{project.date || 'Active'}
											</span>
										</div>
									</div>
								</Link>
							);
						})}

						{homepageProjects.length === 0 && (
							<p className="text-xs font-mono text-on-surface-variant py-4">
								No featured projects found.
							</p>
						)}
					</div>
				</section>

				{/* § 4 — Bento Grid Dashboard */}
				<section className="space-y-4">
					<div className="flex justify-between items-end border-b border-border-muted pb-2">
						<h2 className="text-xl font-bold tracking-tight text-on-surface flex items-center gap-2">
							<span className="material-symbols-outlined text-tertiary">dashboard</span>
							Dashboard & Activity
						</h2>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Widget 1: Theme Selector */}
						<ThemeToggle />

						{/* Widget 2: Let's Connect */}
						<div className="bg-surface-container rounded-xl border border-border-muted p-4 flex flex-col justify-between h-48 w-full transition-colors duration-300">
							<div className="flex items-center gap-1.5 text-on-surface-variant mb-2">
								<span
									className="material-symbols-outlined text-primary"
									style={{ fontSize: '16px' }}
								>
									chat_bubble
								</span>
								<span className="font-mono text-[10px] uppercase tracking-[0.15em] font-semibold">
									Connect
								</span>
							</div>
							<p className="text-[11px] text-on-surface-variant leading-relaxed mb-3">
								Always open to interesting projects, hackathons, and AI research collaborations.
							</p>
							<Link
								href="/contact"
								className="w-full py-1.5 bg-primary text-background text-center rounded text-xs font-semibold hover:opacity-90 active:scale-95 transition-all uppercase tracking-wider font-mono"
							>
								Get In Touch
							</Link>
						</div>

						{/* Widget 3: Live Clock / Based In Kerala */}
						<LiveClock />

						{/* Widget 4: Clicker Game */}
						<ClickerGame />

						{/* Widget 5: Recent Commits & Languages (Spans 2 columns - Left Tile) */}
						<div className="bg-surface-container rounded-xl border border-border-muted p-5 flex flex-col justify-between sm:col-span-2 min-h-[14rem] transition-colors duration-300">
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-on-surface-variant font-semibold">
										Recent Commits
									</h3>
									<a
										href={`https://github.com/${username}`}
										target="_blank"
										rel="noopener noreferrer"
										className="font-mono text-[9px] text-primary hover:underline hover:underline-offset-4"
									>
										GitHub →
									</a>
								</div>
								<div className="flex flex-col gap-3">
									{commits.map((commit, idx) => (
										/* biome-ignore lint/suspicious/noArrayIndexKey: commits feed */
										<div key={idx} className="flex justify-between items-start gap-4 text-xs">
											<span className="text-on-surface font-sans line-clamp-1">
												{commit.message}
											</span>
											<div className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant/80 shrink-0">
												<span className="px-1.5 py-0.5 bg-surface-container-high rounded border border-border-muted">
													{commit.repo}
												</span>
												<span>{commit.time}</span>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Languages Used Segmented Bar */}
							<div className="space-y-2.5 pt-4 border-t border-border-muted/30">
								<h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-on-surface-variant font-semibold">
									Languages Used
								</h3>

								{/* Flex segmented bar */}
								<div className="w-full h-2.5 rounded-full overflow-hidden flex bg-surface-container-high border border-border-muted transition-colors duration-300">
									{languages.map((lang) => (
										<div
											key={lang.name}
											className="h-full group relative transition-all duration-300 hover:opacity-85"
											style={{
												width: `${lang.percentage}%`,
												backgroundColor: lang.color,
											}}
										>
											{/* Hover Tooltip */}
											<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-surface-container-highest text-[10px] font-mono rounded shadow-md border border-border-muted opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 whitespace-nowrap text-on-surface">
												{lang.name} {lang.percentage}%
											</div>
										</div>
									))}
								</div>

								{/* Language Labels Row */}
								<div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
									{languages.map((lang) => (
										<div
											key={lang.name}
											className="flex items-center gap-1.5 text-[9px] font-mono text-on-surface-variant"
										>
											<span
												className="w-1.5 h-1.5 rounded-full inline-block"
												style={{ backgroundColor: lang.color }}
											/>
											<span>{lang.name}</span>
											<span className="opacity-60">{lang.percentage}%</span>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Widget 6: Original GitHub Contribution Heatmap Grid (Spans 2 columns - Right Tile Next to Recent Commits) */}
						<GitHubContributionHeatmap username={username} />
					</div>
				</section>
			</div>
		</LayoutWrapper>
	);
}
