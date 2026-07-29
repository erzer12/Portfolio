import { LayoutWrapper } from '@/components/LayoutWrapper';
import { getAchievements } from '@/lib/data/achievements';
import { getCertifications } from '@/lib/data/certifications';
import { getEducation } from '@/lib/data/education';
import { getExperience } from '@/lib/data/experience';
import { getProfile } from '@/lib/data/profile';
import { getSkills } from '@/lib/data/skills';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
	const [_profile, education, skills, experience, achievements, certifications] = await Promise.all(
		[
			getProfile(),
			getEducation(),
			getSkills(),
			getExperience(),
			getAchievements(),
			getCertifications(),
		],
	);

	return (
		<LayoutWrapper>
			<div className="space-y-12 py-4 w-full">
				{/* Header */}
				<header className="space-y-3">
					<h1 className="text-3xl font-semibold tracking-tight text-on-surface">
						Hi, I'm Harshil.
					</h1>
					<hr className="border-border-muted/40" />
				</header>

				{/* Bio Paragraphs */}
				<section className="space-y-6 text-base leading-relaxed text-on-surface-variant">
					<p>
						I am a Computer Science student at{' '}
						<span className="text-primary font-medium">College of Engineering Kottarakkara</span>,
						building at the intersection of machine learning models and high-performance, accessible
						web products. My core interest lies in client-side deep learning applications and
						optimizing frontend frameworks for community impact.
					</p>
					<p>
						Currently, I work as a frontend intern at{' '}
						<span className="text-primary font-medium">GTech MuLearn</span>, contributing to a
						platform serving over 60,000 community members. Through this and my freelance
						engineering projects, I've developed a focus on performance, standardizing UI modules,
						and database optimizations.
					</p>
					<p>
						When I am not coding, I contribute to community initiatives, research AI/ML
						developments, and read technical docs. I believe in writing clear, well-commented code,
						building semantic, accessible structures, and optimizing systems to run efficiently
						under heavy traffic.
					</p>
				</section>

				<hr className="border-border-muted/40" />

				{/* Experience Block */}
				{experience.length > 0 && (
					<section className="space-y-6">
						<h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
							Experience
						</h2>
						<div className="space-y-8">
							{experience.map((exp) => {
								const initials = exp.company.charAt(0);
								return (
									<div key={exp.id} className="space-y-2">
										<div className="flex justify-between items-start flex-wrap gap-1">
											<div className="flex items-center gap-2">
												<span className="w-5 h-5 rounded border border-border-muted bg-surface-container-high flex items-center justify-center text-[9px] font-bold font-mono">
													{initials}
												</span>
												<h3 className="font-semibold text-on-surface text-sm">
													{exp.role} <span className="text-primary">@ {exp.company}</span>
												</h3>
											</div>
											<span className="text-xs font-mono text-on-surface-variant">
												{exp.start_date} – {exp.end_date || 'Present'}
											</span>
										</div>
										<ul className="list-disc pl-5 text-xs text-on-surface-variant space-y-1 font-sans">
											{exp.bullets.map((bullet) => (
												<li key={bullet}>{bullet}</li>
											))}
										</ul>
									</div>
								);
							})}
						</div>
					</section>
				)}

				<hr className="border-border-muted/40" />

				{/* Education Block */}
				{education.length > 0 && (
					<section className="space-y-6">
						<h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
							Education
						</h2>
						<div className="space-y-6">
							{education.map((edu) => (
								<div key={edu.id} className="space-y-1">
									<div className="flex justify-between items-start flex-wrap gap-1">
										<h3 className="font-semibold text-on-surface text-sm">
											{edu.degree} · {edu.school}
										</h3>
										<span className="text-xs font-mono text-on-surface-variant">{edu.year}</span>
									</div>
									{edu.description && (
										<p className="text-xs text-on-surface-variant leading-relaxed">
											{edu.description}
										</p>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				<hr className="border-border-muted/40" />

				{/* Skills Block */}
				{skills.length > 0 && (
					<section className="space-y-6">
						<h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
							Skills
						</h2>
						<div className="space-y-4">
							{skills.map((skillGroup) => (
								<div
									key={skillGroup.id}
									className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4"
								>
									<div className="w-full md:w-[130px] shrink-0 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
										{skillGroup.category}
									</div>
									<div className="flex flex-wrap gap-1.5 flex-grow">
										{skillGroup.skills.map((skill) => (
											<span
												key={skill}
												className="px-2.5 py-0.5 bg-surface-container border border-border-muted rounded-full text-xs text-on-surface font-medium hover:border-primary transition-colors"
											>
												{skill}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</section>
				)}

				<hr className="border-border-muted/40" />

				{/* Achievements & Certifications Block */}
				{(achievements.length > 0 || certifications.length > 0) && (
					<section className="space-y-6">
						<h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
							Achievements & Certifications
						</h2>
						<div className="space-y-6">
							{/* Achievements */}
							{achievements.map((ach) => (
								<div
									key={ach.id}
									className="flex justify-between items-start gap-4 text-xs border-b border-border-muted/20 pb-2"
								>
									<div className="space-y-0.5">
										<div className="font-bold text-on-surface">{ach.title}</div>
										{ach.description && (
											<div className="text-on-surface-variant">{ach.description}</div>
										)}
									</div>
									<div className="font-mono text-on-surface-variant text-[10px] shrink-0">
										{ach.date}
									</div>
								</div>
							))}

							{/* Certifications */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
								{certifications.map((cert) => (
									<div
										key={cert.id}
										className="flex items-center gap-3 p-3 bg-surface-container/30 border border-border-muted/50 rounded-lg"
									>
										<div className="w-8 h-8 rounded-lg bg-surface-container-high border border-border-muted flex items-center justify-center shrink-0 overflow-hidden">
											{cert.image ? (
												<>
													{/* biome-ignore lint/performance/noImgElement: external cert badges */}
													<img
														src={cert.image}
														alt={cert.name}
														className="w-full h-full object-cover"
													/>
												</>
											) : (
												<span className="material-symbols-outlined text-[18px] text-tertiary">
													workspace_premium
												</span>
											)}
										</div>
										<div className="min-w-0">
											<div className="text-xs font-bold text-on-surface truncate" title={cert.name}>
												{cert.name}
											</div>
											<div className="text-[10px] text-on-surface-variant/80 truncate">
												{cert.issuer}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</section>
				)}
			</div>
		</LayoutWrapper>
	);
}
