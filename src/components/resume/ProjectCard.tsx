'use client';

import { Braces, ExternalLink } from 'lucide-react';
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
	SiSupabase,
	SiTailwindcss,
	SiTensorflow,
	SiTypescript,
} from 'react-icons/si';
import { displayText } from '@/lib/utils';
import type { Project } from '@/types';

type ProjectCardProps = {
	project: Project;
	index?: number;
};

// Brand icons map with case-insensitive lookup
const STACK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
	python: SiPython,
	react: SiReact,
	'next.js': SiNextdotjs,
	nextjs: SiNextdotjs,
	tensorflow: SiTensorflow,
	pytorch: SiPytorch,
	flask: SiFlask,
	'sentence transformers': SiHuggingface,
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
};

export function ProjectCard({ project, index: _index }: ProjectCardProps) {
	// Derive status
	const rawCategory = (project.category || '').toLowerCase();
	let status: 'Building' | 'Active' | 'Shipped' = 'Building';
	if (rawCategory.includes('shipped') || project.live) {
		status = 'Shipped';
	} else if (rawCategory.includes('active') || project.featured) {
		status = 'Active';
	} else if (rawCategory.includes('building')) {
		status = 'Building';
	}

	const accentColor = STATUS_ACCENT[status.toLowerCase()] || 'var(--color-peach)';
	const stack =
		project.tags && project.tags.length > 0 ? project.tags : ['Full-Stack', 'TypeScript'];
	const primaryHref = `/projects/${project.slug}`;

	return (
		<div
			className="group flex flex-col justify-between rounded-xl border border-surface0/80 bg-mantle hover:bg-surface0/40 transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden"
			style={{
				borderTopWidth: '3px',
				borderTopColor: accentColor,
			}}
		>
			{/* Compact Card Body */}
			<div className="p-4 sm:p-5 pb-3 flex-1 flex flex-col">
				<div className="flex items-start justify-between gap-2.5 mb-1.5">
					<h3 className="font-serif italic font-normal text-xl sm:text-2xl text-text group-hover:text-accent transition-colors tracking-tight leading-snug min-w-0">
						<a href={primaryHref} className="hover:underline">
							{displayText(project.title)}
						</a>
					</h3>

					{/* External GitHub / Live Links */}
					<div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5 text-xs font-mono text-subtext1">
						{project.github && (
							<a
								href={project.github}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-accent inline-flex items-center gap-0.5 transition-colors p-0.5"
								title="View GitHub Repository"
								aria-label={`${project.title} on GitHub`}
							>
								<FaGithub className="w-3.5 h-3.5" />
								<span className="hidden sm:inline text-[11px]">GH</span>
							</a>
						)}
						{project.live && (
							<a
								href={project.live}
								target="_blank"
								rel="noopener noreferrer"
								className="text-accent hover:underline inline-flex items-center gap-0.5 font-medium transition-colors p-0.5"
								title="View Live Demo"
								aria-label={`${project.title} live demo`}
							>
								<ExternalLink className="w-3.5 h-3.5" />
								<span className="hidden sm:inline text-[11px]">Live</span>
							</a>
						)}
					</div>
				</div>

				{/* Short Concise Description */}
				<p className="font-grotesk text-xs sm:text-[13px] leading-relaxed text-subtext0 line-clamp-2 mb-3 flex-grow">
					{displayText(project.description)}
				</p>

				{/* Compact Foot: Status and Tag Pills */}
				<div className="pt-2.5 border-t border-surface0/60 mt-auto">
					<div className="flex items-center justify-between mb-2">
						<span
							className="font-grotesk text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5"
							style={{ color: accentColor }}
						>
							<span
								className="w-1.5 h-1.5 rounded-full inline-block"
								style={{ backgroundColor: accentColor }}
							/>
							<span>{status}</span>
						</span>

						{project.date && (
							<span className="font-mono text-[10.5px] text-subtext1 opacity-70">
								{displayText(project.date)}
							</span>
						)}
					</div>

					{/* Stack Pills */}
					<div className="flex flex-wrap gap-1">
						{stack.map((tech) => {
							const Icon = getStackIcon(tech);
							return (
								<span
									key={tech}
									className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-surface0 bg-surface0/40 text-[11px] font-grotesk text-subtext1 hover:text-text hover:border-surface1 transition-colors"
								>
									<Icon className="w-3 h-3 flex-shrink-0" />
									<span>{tech}</span>
								</span>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
