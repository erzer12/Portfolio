import type { Metadata } from 'next';
import { MinimalFooter } from '@/components/layout/Footer';
import { MinimalNav } from '@/components/layout/Navigation';
import { ContactSection } from '@/components/resume/ContactSection';
import { TestimonialsSection } from '@/components/resume/TestimonialsSection';
import { getFooterLinks } from '@/lib/data/footer';
import { getSiteSettings } from '@/lib/data/settings';
import { getApprovedTestimonials } from '@/lib/data/testimonials';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Contact & Testimonials — Harshil P',
	description: 'Send a message, submit a recommendation, or view testimonials and endorsements.',
};

export default async function ContactPage() {
	const [testimonials, settings, footerLinks] = await Promise.all([
		getApprovedTestimonials(),
		getSiteSettings(),
		getFooterLinks(),
	]);

	return (
		<div className="min-h-screen flex flex-col bg-base text-text selection:bg-surface1 selection:text-accent font-mono transition-colors">
			<MinimalNav
				name="harshil"
				email="harshilp1234@gmail.com"
				github="https://github.com/erzer12"
			/>

			<main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-12 pb-20">
				<header className="space-y-3 border-b border-surface0/60 pb-6">
					<a
						href="/"
						className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline mb-1"
					>
						<span>← Back to Home</span>
					</a>
					<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">Get In Touch</h1>
					<p className="text-subtext0 text-sm font-sans max-w-2xl leading-relaxed">
						Have an engineering question, project proposal, or want to collaborate? Send a message
						directly or leave a recommendation.
					</p>
				</header>

				{/* Contact Form & Submission Tabs */}
				<section aria-label="Contact and Testimonial Submission Form">
					<ContactSection />
				</section>

				{/* Approved Testimonials Showcase */}
				{settings.show_testimonials && testimonials.length > 0 && (
					<section
						className="space-y-6 pt-6 border-t border-surface0/60"
						aria-labelledby="testimonials-heading"
					>
						<div className="space-y-1">
							<h2
								id="testimonials-heading"
								className="text-xl font-bold text-text flex items-center gap-2"
							>
								<span className="text-accent select-none">{'//'}</span>
								<span>Peer Recommendations & Endorsements</span>
							</h2>
							<p className="text-xs text-subtext0 font-sans">
								Kind words from colleagues, collaborators, and mentors.
							</p>
						</div>
						<TestimonialsSection items={testimonials} />
					</section>
				)}
			</main>

			<MinimalFooter links={footerLinks} />
		</div>
	);
}
