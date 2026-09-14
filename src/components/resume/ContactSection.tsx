'use client';

import type React from 'react';
import { useState, useTransition } from 'react';
import { sendContactEmailAction, submitTestimonialAction } from '@/app/actions';

export function ContactSection() {
	const [activeTab, setActiveTab] = useState<'contact' | 'testimonial'>('contact');
	const [isPending, startTransition] = useTransition();
	const [msg, setMsg] = useState('');
	const [copied, setCopied] = useState(false);

	const handleCopyEmail = () => {
		navigator.clipboard.writeText('harshilp1234@gmail.com');
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleTestimonialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get('name') as string;
		const role = formData.get('role') as string;
		const message = formData.get('message') as string;

		if (!name || !role || !message) {
			setMsg('Please fill out all fields.');
			return;
		}

		setMsg('');
		startTransition(async () => {
			try {
				await submitTestimonialAction({ name, role, message, rating: 5 });
				setMsg('Thanks! Your testimonial has been submitted for review.');
				(e.target as HTMLFormElement).reset();
			} catch {
				setMsg('Something went wrong. Please try again.');
			}
		});
	};

	const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const message = formData.get('message') as string;
		const website = formData.get('website') as string;

		if (!name || !email || !message) {
			setMsg('Please fill out all fields.');
			return;
		}

		setMsg('');
		startTransition(async () => {
			try {
				await sendContactEmailAction({ name, email, message, website });
				setMsg('Message sent! I will get back to you soon.');
				(e.target as HTMLFormElement).reset();
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Something went wrong. Please try again.';
				setMsg(errorMessage);
			}
		});
	};

	return (
		<div className="border border-surface0/80 bg-mantle rounded-xl p-5 sm:p-6 shadow-lg space-y-5 font-sans">
			{/* Quick direct copy banner */}
			<div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-surface0/50 border border-surface0 text-xs font-mono">
				<div className="flex items-center gap-2">
					<span className="text-accent">✉</span>
					<span className="text-subtext0">Direct Email:</span>
					<span className="text-text font-bold">harshilp1234@gmail.com</span>
				</div>
				<button
					type="button"
					onClick={handleCopyEmail}
					className="px-2.5 py-1 rounded bg-surface1 text-text hover:text-accent hover:border-accent text-xs transition-all cursor-pointer font-medium"
				>
					{copied ? 'Copied! ✓' : 'Copy Email'}
				</button>
			</div>

			{/* Tab Selector */}
			<div
				className="flex gap-2 border-b border-surface0/80 pb-3 font-mono text-xs"
				role="tablist"
				aria-label="Contact options"
			>
				<button
					type="button"
					onClick={() => {
						setActiveTab('contact');
						setMsg('');
					}}
					className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
						activeTab === 'contact'
							? 'bg-surface0 text-accent font-bold ring-1 ring-accent shadow-xs'
							: 'text-subtext0 hover:text-text'
					}`}
					role="tab"
					aria-selected={activeTab === 'contact'}
					aria-controls="contact-panel"
				>
					Send Message
				</button>
				<button
					type="button"
					onClick={() => {
						setActiveTab('testimonial');
						setMsg('');
					}}
					className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
						activeTab === 'testimonial'
							? 'bg-surface0 text-accent font-bold ring-1 ring-accent shadow-xs'
							: 'text-subtext0 hover:text-text'
					}`}
					role="tab"
					aria-selected={activeTab === 'testimonial'}
					aria-controls="testimonial-panel"
				>
					Leave Testimonial
				</button>
			</div>

			{activeTab === 'contact' ? (
				<form
					onSubmit={handleContactSubmit}
					className="space-y-4"
					id="contact-panel"
					role="tabpanel"
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label
								htmlFor="contact-name"
								className="block text-xs font-mono text-subtext1 mb-1.5"
							>
								Your Name
							</label>
							<input
								id="contact-name"
								name="name"
								disabled={isPending}
								className="w-full border border-surface1/80 bg-base rounded-lg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none transition-colors"
								placeholder="Jane Doe"
							/>
						</div>
						<div>
							<label
								htmlFor="contact-email"
								className="block text-xs font-mono text-subtext1 mb-1.5"
							>
								Your Email
							</label>
							<input
								id="contact-email"
								name="email"
								type="email"
								disabled={isPending}
								className="w-full border border-surface1/80 bg-base rounded-lg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none transition-colors"
								placeholder="jane@example.com"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="contact-message"
							className="block text-xs font-mono text-subtext1 mb-1.5"
						>
							Your Message
						</label>
						<textarea
							id="contact-message"
							name="message"
							disabled={isPending}
							rows={4}
							className="w-full border border-surface1/80 bg-base rounded-lg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none transition-colors resize-y"
							placeholder="Hi Harshil, let's talk about..."
						/>
					</div>

					{/* Honeypot: hidden from real users, bots fill it automatically */}
					<label
						htmlFor="contact-website"
						style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
						aria-hidden="true"
					>
						Website
						<input
							id="contact-website"
							name="website"
							type="text"
							autoComplete="off"
							tabIndex={-1}
						/>
					</label>

					<div className="flex items-center gap-4 pt-1">
						<button
							type="submit"
							disabled={isPending}
							className="px-5 py-2.5 rounded-lg bg-accent text-accent-fg font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
						>
							{isPending ? 'Sending...' : 'Send Message'}
						</button>
						{msg && <p className="font-mono text-xs text-accent">{msg}</p>}
					</div>
				</form>
			) : (
				<form
					onSubmit={handleTestimonialSubmit}
					className="space-y-4"
					id="testimonial-panel"
					role="tabpanel"
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label
								htmlFor="testimonial-name"
								className="block text-xs font-mono text-subtext1 mb-1.5"
							>
								Your Name
							</label>
							<input
								id="testimonial-name"
								name="name"
								disabled={isPending}
								className="w-full border border-surface1/80 bg-base rounded-lg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none transition-colors"
								placeholder="Alex Smith"
							/>
						</div>
						<div>
							<label
								htmlFor="testimonial-role"
								className="block text-xs font-mono text-subtext1 mb-1.5"
							>
								Your Role / Organization
							</label>
							<input
								id="testimonial-role"
								name="role"
								disabled={isPending}
								className="w-full border border-surface1/80 bg-base rounded-lg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none transition-colors"
								placeholder="Tech Lead @ Company"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="testimonial-message"
							className="block text-xs font-mono text-subtext1 mb-1.5"
						>
							Your Testimonial
						</label>
						<textarea
							id="testimonial-message"
							name="message"
							disabled={isPending}
							rows={4}
							className="w-full border border-surface1/80 bg-base rounded-lg px-3 py-2 text-sm text-text focus:border-accent focus:outline-none transition-colors resize-y"
							placeholder="Harshil is a talented builder who delivered..."
						/>
					</div>

					<div className="flex items-center gap-4 pt-1">
						<button
							type="submit"
							disabled={isPending}
							className="px-5 py-2.5 rounded-lg bg-accent text-accent-fg font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
						>
							{isPending ? 'Submitting...' : 'Submit Testimonial'}
						</button>
						{msg && <p className="font-mono text-xs text-accent">{msg}</p>}
					</div>
				</form>
			)}
		</div>
	);
}
