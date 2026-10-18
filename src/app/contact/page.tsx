import { ArrowUpRight, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
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
					<nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-subtext1">
						<Link href="/" className="hover:text-accent transition-colors">
							~
						</Link>
						<span className="text-surface2">/</span>
						<span className="text-accent font-bold">contact</span>
					</nav>

					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<span className="text-accent text-xs font-mono font-bold">03 {'//'}</span>
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

				{/* 2-Column Responsive Layout (Desktop: 2 columns, Mobile: 1 column) */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
					{/* Left Column: Direct Contact Methods & Opportunities Note (5 columns) */}
					<div className="lg:col-span-5 space-y-6">
						{/* Opportunities Card */}
						<div className="p-6 rounded-xl border border-surface0/80 bg-mantle space-y-3">
							<div className="flex items-center gap-2 text-xs font-mono text-accent font-bold uppercase tracking-wider">
								<span className="w-2 h-2 rounded-full bg-green inline-block animate-pulse" />
								<span>Open to Opportunities</span>
							</div>
							<p className="text-xs sm:text-sm font-sans text-subtext0 leading-relaxed">
								Currently open to software engineering internships, applied ML research roles, and
								open-source collaborations. I enjoy tackling hard problems in client-side inference,
								scalable web systems, and data pipelines.
							</p>
						</div>

						{/* Contact Cards List */}
						<div className="space-y-3">
							<h3 className="text-xs font-mono font-semibold text-subtext1 uppercase tracking-wider">
								{'// Verified Direct Channels'}
							</h3>

							{/* Email Card */}
							<a
								href={`mailto:${email}`}
								className="group p-4 rounded-xl border border-surface0/80 bg-mantle hover:bg-surface0/30 hover:border-surface1 transition-all duration-200 flex items-center justify-between"
							>
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-lg bg-surface0 flex items-center justify-center text-peach group-hover:scale-105 transition-transform">
										<Mail className="w-5 h-5" />
									</div>
									<div>
										<div className="text-xs font-mono text-subtext1">Direct Email</div>
										<div className="text-sm font-sans font-bold text-text group-hover:text-accent transition-colors">
											{email}
										</div>
									</div>
								</div>
								<ArrowUpRight className="w-4 h-4 text-subtext1 group-hover:text-accent transition-colors" />
							</a>

							{/* LinkedIn Card */}
							<a
								href={linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="group p-4 rounded-xl border border-surface0/80 bg-mantle hover:bg-surface0/30 hover:border-surface1 transition-all duration-200 flex items-center justify-between"
							>
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-lg bg-surface0 flex items-center justify-center text-blue group-hover:scale-105 transition-transform">
										<FaLinkedin className="w-5 h-5" />
									</div>
									<div>
										<div className="text-xs font-mono text-subtext1">LinkedIn Profile</div>
										<div className="text-sm font-sans font-bold text-text group-hover:text-accent transition-colors">
											in/harshilp1
										</div>
									</div>
								</div>
								<ArrowUpRight className="w-4 h-4 text-subtext1 group-hover:text-accent transition-colors" />
							</a>

							{/* GitHub Card */}
							<a
								href={github}
								target="_blank"
								rel="noopener noreferrer"
								className="group p-4 rounded-xl border border-surface0/80 bg-mantle hover:bg-surface0/30 hover:border-surface1 transition-all duration-200 flex items-center justify-between"
							>
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-lg bg-surface0 flex items-center justify-center text-text group-hover:scale-105 transition-transform">
										<FaGithub className="w-5 h-5" />
									</div>
									<div>
										<div className="text-xs font-mono text-subtext1">GitHub Activity</div>
										<div className="text-sm font-sans font-bold text-text group-hover:text-accent transition-colors">
											github.com/erzer12
										</div>
									</div>
								</div>
								<ArrowUpRight className="w-4 h-4 text-subtext1 group-hover:text-accent transition-colors" />
							</a>
						</div>
					</div>

					{/* Right Column: Contact Form (7 columns) */}
					<div className="lg:col-span-7">
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
