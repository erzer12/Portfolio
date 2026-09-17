'use client';

import { useState } from 'react';
import { AsciiImage } from '@/components/ui/AsciiImage';
import { displayText } from '@/lib/utils';

type HeaderProps = {
	name: string;
	tagline: string;
	location: string;
	status: string;
	summary?: string;
	email?: string;
	github?: string;
	linkedin?: string;
	resume?: string;
	image?: string;
	customAscii?: string | null;
};

export function Header({
	name = 'Harshil P',
	tagline = 'CS Student & Builder',
	location = 'Kerala, India',
	status = 'Open to work',
	summary,
	email = 'harshilp1234@gmail.com',
	github = 'https://github.com/erzer12',
	linkedin = 'https://linkedin.com',
	resume,
	image,
	customAscii,
}: HeaderProps) {
	const [hoverPronounce, setHoverPronounce] = useState(false);

	const defaultBio =
		summary ||
		`Third-year Computer Science student & software builder based in ${location}. I craft clean, reliable full-stack web applications, robust backend services, and explore practical applied AI/ML systems. Seeing code I wrote actually help people solve real problems is what keeps me building.`;

	return (
		<section id="about" className="space-y-6 pt-4 pb-2 transition-colors">
			<div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-6">
				<div className="space-y-4 max-w-2xl">
					{/* Main Title with interactive phonetic easter egg */}
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
						Hey! I&apos;m{' '}
						<button
							type="button"
							className="text-accent cursor-pointer transition-colors relative inline-block text-left p-0 bg-transparent border-none font-inherit"
							onMouseEnter={() => setHoverPronounce(true)}
							onMouseLeave={() => setHoverPronounce(false)}
							onFocus={() => setHoverPronounce(true)}
							onBlur={() => setHoverPronounce(false)}
						>
							<span className="underline decoration-dashed decoration-accent underline-offset-4 opacity-90">
								{displayText(name)}
							</span>
							{hoverPronounce && (
								<span className="absolute -top-8 left-0 z-20 text-[11px] font-normal px-2 py-0.5 rounded bg-surface1 text-text shadow-md whitespace-nowrap animate-in fade-in zoom-in-95 font-mono">
									pronounced /hɑːr·ʃɪl/ ✦ builder
								</span>
							)}
						</button>
					</h1>

					{/* Tagline */}
					{tagline && (
						<p className="text-xs sm:text-sm font-mono text-accent font-semibold tracking-wide">
							{displayText(tagline)}
						</p>
					)}

					{/* Authentic developer narrative */}
					<p className="text-subtext0 text-base sm:text-lg leading-relaxed font-sans">
						{defaultBio}
					</p>

					{/* Availability & Location beacon */}
					<div className="flex items-center gap-2 text-xs font-mono text-subtext1">
						<span className="relative flex h-2.5 w-2.5">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
							<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green" />
						</span>
						<span>{displayText(status)}</span>
						<span className="text-surface2">•</span>
						<span>{displayText(location)}</span>
					</div>

					{/* Pipe-separated Social Ribbon (directly matching Jason's site) */}
					<div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 text-xs sm:text-sm font-mono text-subtext0">
						{github && (
							<>
								<a
									href={github}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-accent inline-flex items-center gap-1.5 transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<title>GitHub Icon</title>
										<path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.76.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.59.23 2.76.11 3.05.73.8 1.18 1.82 1.18 3.07 0 4.4-2.71 5.38-5.29 5.66.41.35.77 1.04.77 2.1 0 1.52-.014 2.74-.014 3.11 0 .3.2.66.79.55A11.52 11.52 0 0 0 23.5 12.02C23.5 5.73 18.27.5 12 .5z" />
									</svg>
									<span>GitHub</span>
								</a>
								<span className="text-surface2">|</span>
							</>
						)}

						{linkedin && (
							<>
								<a
									href={linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-accent inline-flex items-center gap-1.5 transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<title>LinkedIn Icon</title>
										<path d="M4.98 3.5C4.98 5 3.9 6 2.5 6S0 5 0 3.5 1.1 1 2.5 1 4.98 2 4.98 3.5zM0 8h5v14H0zM8.5 8h4.6v2h.1c.6-1.1 2-2.3 4.2-2.3 4.5 0 5.4 3 5.4 6.9V22H18v-6.5c0-1.6 0-3.6-2.3-3.6-2.3 0-2.6 1.8-2.6 3.4V22H8.5V8z" />
									</svg>
									<span>LinkedIn</span>
								</a>
								<span className="text-surface2">|</span>
							</>
						)}

						{resume && (
							<>
								<a
									href={resume}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-accent inline-flex items-center gap-1.5 transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Resume Document Icon</title>
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
										<path d="M14 2v6h6" />
										<line x1="16" y1="13" x2="8" y2="13" />
										<line x1="16" y1="17" x2="8" y2="17" />
									</svg>
									<span>Resume</span>
								</a>
								<span className="text-surface2">|</span>
							</>
						)}

						{email && (
							<>
								<a
									href={`mailto:${email}`}
									className="hover:text-accent inline-flex items-center gap-1.5 transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Email Envelope Icon</title>
										<rect x="2" y="4" width="20" height="16" rx="2" />
										<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
									</svg>
									<span>Email</span>
								</a>
								<span className="text-surface2">|</span>
							</>
						)}

						<a
							href="#projects"
							className="group text-accent hover:underline inline-flex items-center gap-1 font-semibold"
						>
							<span>Explore work</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="transition-transform duration-200 group-hover:translate-x-0.5"
							>
								<title>Arrow Right</title>
								<line x1="5" y1="12" x2="19" y2="12" />
								<polyline points="12 5 19 12 12 19" />
							</svg>
						</a>
					</div>
				</div>

				{/* ASCII Portrait — always ASCII mode, no switcher */}
				<div className="flex-shrink-0 flex items-center justify-center">
					<AsciiImage
						src={image}
						mode="ascii"
						customAscii={customAscii}
						className="w-64 h-56 sm:w-80 sm:h-64 md:w-96 md:h-72"
					/>
				</div>
			</div>
		</section>
	);
}
