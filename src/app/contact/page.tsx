import { ArrowUpRight, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { MinimalFooter } from '@/components/layout/Footer';
import { MinimalNav } from '@/components/layout/Navigation';
import { ContactForm } from '@/components/resume/ContactForm';
import { getFooterLinks } from '@/lib/data/footer';
import { getProfile } from '@/lib/data/profile';
import { ensureExternalUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Get in Touch — Harshil P',
	description:
		'Contact Harshil P regarding software engineering internships, machine learning projects, or open-source collaborations.',
};

export default async function ContactPage() {
	const [profile, footerLinks] = await Promise.all([getProfile(), getFooterLinks()]);

	const email = profile?.email || 'harshilp1234@gmail.com';
	const github = ensureExternalUrl(profile?.social?.github || 'https://github.com/erzer12');
	const linkedin = ensureExternalUrl(
		profile?.social?.linkedin || 'https://www.linkedin.com/in/harshilp1/',
	);

	return (
		<div className="min-h-screen flex flex-col bg-base text-text selection:bg-surface1 selection:text-accent font-mono transition-colors">
			<MinimalNav
				name={profile?.name ?? 'harshil'}
				email={email}
				github={github}
				resume={profile?.resume}
				linkedin={linkedin}
			/>

			<main className="flex-1 mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-10 space-y-10 pb-20">
				{/* Breadcrumb Header */}
				<header className="space-y-3 border-b border-surface0/60 pb-6">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
								Get in Touch
							</h1>
						</div>
						<p className="text-subtext0 text-sm font-sans max-w-2xl leading-relaxed">
							Whether you have a technical question, an interesting internship opportunity, or a
							collaborative project proposal, my inbox is open.
						</p>
					</div>
				</header>

				{/* 2-Column Responsive Layout (Desktop: 2 balanced columns, Mobile: 1 column) */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
					{/* Left Column: Direct Contact Methods & Opportunities Note */}
					<div className="flex flex-col">
						<div className="rounded-xl border border-surface0/80 bg-mantle p-6 sm:p-8 shadow-lg flex-1 flex flex-col justify-between">
							{/* Header matching the right column form header */}
							<div className="space-y-1 border-b border-surface0/60 pb-4">
								<h2 className="text-xl font-bold text-text font-mono">Direct Channels</h2>
								<p className="text-xs text-subtext0">
									Direct lines of communication and current availability.
								</p>
							</div>

							{/* Content items distributed evenly */}
							<div className="flex-1 flex flex-col justify-between pt-6 space-y-4">
								{/* Opportunities Note */}
								<div className="p-4 rounded-xl bg-surface0/30 border border-surface1/30 space-y-2">
									<div className="flex items-center gap-2 text-xs font-mono text-green font-semibold">
										<span className="w-2 h-2 rounded-full bg-green inline-block animate-pulse" />
										<span>Open to Opportunities</span>
									</div>
									<p className="text-xs sm:text-[13px] font-sans text-subtext0 leading-relaxed">
										Currently open to software engineering internships, applied ML research roles,
										and open-source collaborations. I enjoy tackling hard problems in client-side
										inference, scalable web systems, and data pipelines.
									</p>
								</div>

								{/* Email Card */}
								<a
									href={`mailto:${email}`}
									className="group p-4 rounded-xl border border-surface0/80 bg-surface0/20 hover:bg-surface0/50 hover:border-surface1 transition-all duration-200 flex items-center justify-between"
								>
									<div className="flex items-center gap-3.5">
										<div className="w-10 h-10 rounded-lg bg-surface0 flex items-center justify-center text-peach group-hover:scale-105 transition-transform flex-shrink-0">
											<Mail className="w-4 h-4" />
										</div>
										<div>
											<div className="text-[11px] font-mono text-subtext1">Direct Email</div>
											<div className="text-xs sm:text-sm font-sans font-bold text-text group-hover:text-accent transition-colors">
												{email}
											</div>
										</div>
									</div>
									<ArrowUpRight className="w-4 h-4 text-subtext1 group-hover:text-accent transition-colors flex-shrink-0" />
								</a>

								{/* LinkedIn Card */}
								<a
									href={linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="group p-4 rounded-xl border border-surface0/80 bg-surface0/20 hover:bg-surface0/50 hover:border-surface1 transition-all duration-200 flex items-center justify-between"
								>
									<div className="flex items-center gap-3.5">
										<div className="w-10 h-10 rounded-lg bg-surface0 flex items-center justify-center text-blue group-hover:scale-105 transition-transform flex-shrink-0">
											<FaLinkedin className="w-4 h-4" />
										</div>
										<div>
											<div className="text-[11px] font-mono text-subtext1">LinkedIn Profile</div>
											<div className="text-xs sm:text-sm font-sans font-bold text-text group-hover:text-accent transition-colors">
												in/harshilp1
											</div>
										</div>
									</div>
									<ArrowUpRight className="w-4 h-4 text-subtext1 group-hover:text-accent transition-colors flex-shrink-0" />
								</a>

								{/* GitHub Card */}
								<a
									href={github}
									target="_blank"
									rel="noopener noreferrer"
									className="group p-4 rounded-xl border border-surface0/80 bg-surface0/20 hover:bg-surface0/50 hover:border-surface1 transition-all duration-200 flex items-center justify-between"
								>
									<div className="flex items-center gap-3.5">
										<div className="w-10 h-10 rounded-lg bg-surface0 flex items-center justify-center text-text group-hover:scale-105 transition-transform flex-shrink-0">
											<FaGithub className="w-4 h-4" />
										</div>
										<div>
											<div className="text-[11px] font-mono text-subtext1">GitHub Activity</div>
											<div className="text-xs sm:text-sm font-sans font-bold text-text group-hover:text-accent transition-colors">
												github.com/erzer12
											</div>
										</div>
									</div>
									<ArrowUpRight className="w-4 h-4 text-subtext1 group-hover:text-accent transition-colors flex-shrink-0" />
								</a>
							</div>
						</div>
					</div>

					{/* Right Column: Contact Form */}
					<div className="flex flex-col">
						<ContactForm recipientEmail={email} />
					</div>
				</div>
			</main>

			<MinimalFooter
				links={footerLinks}
				email={email}
				github={github}
				linkedin={linkedin}
				instagram={profile?.social?.instagram}
			/>
		</div>
	);
}
