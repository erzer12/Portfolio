'use client';

import { Braces, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { FaGithub } from 'react-icons/fa6';
import {
	SiCplusplus,
	SiDocker,
	SiFastapi,
	SiFlask,
	SiGit,
	SiGo,
	SiGooglegemini,
	SiHuggingface,
	SiJavascript,
	SiJupyter,
	SiLinux,
	SiMongodb,
	SiNextdotjs,
	SiNodedotjs,
	SiOnnx,
	SiPostgresql,
	SiPython,
	SiPytorch,
	SiReact,
	SiRedis,
	SiRust,
	SiStreamlit,
	SiSupabase,
	SiTailwindcss,
	SiTensorflow,
	SiTypescript,
} from 'react-icons/si';
import { displayText, ensureExternalUrl } from '@/lib/utils';
import type { Project } from '@/types';

type ProjectCardProps = {
	project: Project;
	index?: number;
};

// Brand icons map with case-insensitive lookup
const STACK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
	python: SiPython,
	streamlit: SiStreamlit,
	'jupyter notebook': SiJupyter,
	jupyter: SiJupyter,
	react: SiReact,
	'next.js': SiNextdotjs,
	nextjs: SiNextdotjs,
	tensorflow: SiTensorflow,
	pytorch: SiPytorch,
	flask: SiFlask,
	'sentence transformers': SiHuggingface,
	'hugging face': SiHuggingface,
	huggingface: SiHuggingface,
	onnx: SiOnnx,
	'onnx runtime web': SiOnnx,
	gemini: SiGooglegemini,
	typescript: SiTypescript,
	ts: SiTypescript,
	javascript: SiJavascript,
	js: SiJavascript,
	golang: SiGo,
	go: SiGo,
	rust: SiRust,
	docker: SiDocker,
	supabase: SiSupabase,
	postgresql: SiPostgresql,
	postgres: SiPostgresql,
	tailwind: SiTailwindcss,
	tailwindcss: SiTailwindcss,
	fastapi: SiFastapi,
	node: SiNodedotjs,
	'node.js': SiNodedotjs,
	'c++': SiCplusplus,
	linux: SiLinux,
	mongodb: SiMongodb,
	redis: SiRedis,
	git: SiGit,
};

function getStackIcon(name: string) {
	const key = name.toLowerCase().trim();
	return STACK_ICONS[key] || Braces;
}

// Status accent colors mapped to Catppuccin tokens
const STATUS_ACCENT: Record<string, string> = {
	building: 'var(--color-peach)',
	active: 'var(--color-green)',
	shipped: 'var(--color-blue)',
	'web app': 'var(--color-blue)',
	'ai workflow': 'var(--color-mauve)',
	'hugging face app': 'var(--color-yellow)',
	'open source': 'var(--color-teal)',
	'data science': 'var(--color-sky)',
};

export function ProjectCard({ project, index: _index }: ProjectCardProps) {
	const primaryHref = `/projects/${project.slug}`;
	const safeGithubUrl = ensureExternalUrl(project.github);
	const safeLiveUrl = ensureExternalUrl(project.live);

	// Derive status and badge text
	const rawCategory = (project.category || '').toLowerCase().trim();
	let status: 'Building' | 'Active' | 'Shipped' = 'Building';
	if (rawCategory.includes('shipped') || project.live) {
		status = 'Shipped';
	} else if (rawCategory.includes('active') || project.featured) {
		status = 'Active';
	} else if (rawCategory.includes('building')) {
		status = 'Building';
	}

	const badgeText = project.category?.trim() || status;
	const accentColor =
		STATUS_ACCENT[rawCategory] || STATUS_ACCENT[status.toLowerCase()] || 'var(--color-blue)';

	const stack =
		project.tags && project.tags.length > 0 ? project.tags : ['Full-Stack', 'TypeScript'];

	// Standardized skills: show up to 3 tags + remaining count pill for uniform height & alignment
	const visibleTags = stack.slice(0, 3);
	const remainingCount = stack.length - 3;

	return (
		<div
			className="group flex flex-col justify-between rounded-xl border border-surface0/80 bg-mantle hover:bg-surface0/40 transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden h-full min-h-[235px] sm:min-h-[255px]"
			style={{
				borderTopWidth: '3px',
				borderTopColor: accentColor,
			}}
		>
			{/* Card Body */}
			<div className="p-5 sm:p-6 pb-4 flex-1 flex flex-col">
				{/* Title row: fixed min-h so description always starts at the same Y regardless of title length */}
				<div className="flex items-start justify-between gap-2.5 mb-3 min-h-[3.5rem]">
					<h3 className="font-inconsolata font-semibold text-xl sm:text-2xl text-text group-hover:text-accent transition-colors tracking-tight leading-snug min-w-0 line-clamp-2">
						<Link href={primaryHref} className="hover:underline">
							{displayText(project.title)}
						</Link>
					</h3>

					{/* Action Buttons: Clean standalone icons */}
					<div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5 text-xs font-mono text-subtext1">
						{safeGithubUrl && (
							<a
								href={safeGithubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-accent inline-flex items-center justify-center p-1 rounded-md hover:bg-surface0/60 transition-colors"
								title="View GitHub Repository"
								aria-label={`${project.title} on GitHub`}
							>
								<FaGithub className="w-3.5 h-3.5" />
							</a>
						)}
						{safeLiveUrl && (
							<a
								href={safeLiveUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-accent hover:underline inline-flex items-center justify-center p-1 rounded-md hover:bg-surface0/60 transition-colors"
								title="View Live Demo"
								aria-label={`${project.title} live demo`}
							>
								<ExternalLink className="w-3.5 h-3.5" />
							</a>
						)}
					</div>
				</div>

				{/* Description with room to breathe */}
				<p className="font-inconsolata text-xs sm:text-[13px] leading-relaxed text-subtext0 line-clamp-3 mb-4 flex-grow">
					{displayText(project.description)}
				</p>

				{/* Card Foot: Status and Tag Pills */}
				<div className="pt-3.5 border-t border-surface0/60 mt-auto">
					<div className="flex items-center justify-between mb-2">
						<span
							className="font-inconsolata text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5"
							style={{ color: accentColor }}
						>
							<span
								className="w-1.5 h-1.5 rounded-full inline-block"
								style={{ backgroundColor: accentColor }}
							/>
							<span>{displayText(badgeText)}</span>
						</span>

						{project.date && (
							<span className="font-mono text-[10.5px] text-subtext1 opacity-70">
								{displayText(project.date)}
							</span>
						)}
					</div>

					{/* Standardized Stack Pills */}
					<div className="flex flex-wrap gap-1">
						{visibleTags.map((tech) => {
							const Icon = getStackIcon(tech);
							return (
								<span
									key={tech}
									className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-surface0 bg-surface0/40 text-[11px] font-inconsolata text-subtext1 hover:text-text hover:border-surface1 transition-colors"
								>
									<Icon className="w-3 h-3 flex-shrink-0" />
									<span>{displayText(tech)}</span>
								</span>
							);
						})}
						{remainingCount > 0 && (
							<span
								className="inline-flex items-center px-2 py-0.5 rounded-full border border-surface0/70 bg-surface0/30 text-[10.5px] font-inconsolata text-subtext1 hover:text-text hover:border-surface1 transition-colors"
								title={stack.slice(3).join(', ')}
							>
								+{remainingCount}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
