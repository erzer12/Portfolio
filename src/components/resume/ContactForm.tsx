'use client';

import { AlertCircle, CheckCircle2, Mail, Send } from 'lucide-react';
import type React from 'react';
import { useState, useTransition } from 'react';
import { sendContactEmailAction } from '@/app/actions';

type Props = {
	recipientEmail?: string;
};

export function ContactForm({ recipientEmail = 'harshilp1234@gmail.com' }: Props) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [website, setWebsite] = useState(''); // Honeypot
	const [fieldErrors, setFieldErrors] = useState<{
		name?: string;
		email?: string;
		message?: string;
	}>({});
	const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
		null,
	);
	const [isPending, startTransition] = useTransition();

	const validate = () => {
		const errors: { name?: string; email?: string; message?: string } = {};
		if (!name.trim()) errors.name = 'Please provide your name.';
		if (!email.trim()) {
			errors.email = 'Please provide your email address.';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			errors.email = 'Please provide a valid email format (e.g., name@domain.com).';
		}
		if (!message.trim()) {
			errors.message = 'Please enter a message.';
		} else if (message.trim().length < 5) {
			errors.message = 'Message must be at least 5 characters.';
		}
		setFieldErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatusMsg(null);

		if (!validate()) return;

		startTransition(async () => {
			try {
				await sendContactEmailAction({
					name: name.trim(),
					email: email.trim(),
					message: message.trim(),
					website, // Honeypot
				});

				setStatusMsg({
					type: 'success',
					text: "Your message was delivered successfully! Thank you for reaching out; I'll get back to you soon.",
				});
				setName('');
				setEmail('');
				setMessage('');
				setFieldErrors({});
			} catch (err) {
				const errorText =
					err instanceof Error
						? err.message
						: 'Message delivery failed. Please send an email directly using the mailto link below.';
				setStatusMsg({
					type: 'error',
					text: errorText,
				});
			}
		});
	};

	return (
		<div className="rounded-xl border border-surface0/80 bg-mantle p-6 sm:p-8 shadow-lg space-y-6 font-sans">
			<div className="space-y-1 border-b border-surface0/60 pb-4">
				<h2 className="text-xl font-bold text-text font-mono">Send a Message</h2>
				<p className="text-xs text-subtext0">
					Drop a note regarding opportunities, collaboration, or questions.
				</p>
			</div>

			{statusMsg?.type === 'success' && (
				<div
					role="status"
					aria-live="polite"
					className="rounded-lg bg-green/10 border border-green/30 p-4 text-xs font-mono text-green flex items-start gap-3"
				>
					<CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
					<div className="space-y-1">
						<div className="font-bold">Message Sent</div>
						<div className="text-subtext0 font-sans">{statusMsg.text}</div>
					</div>
				</div>
			)}

			{statusMsg?.type === 'error' && (
				<div
					role="alert"
					aria-live="assertive"
					className="rounded-lg bg-red/10 border border-red/30 p-4 text-xs font-mono text-red flex items-start gap-3"
				>
					<AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
					<div className="space-y-1.5 flex-1">
						<div className="font-bold">Delivery Notice</div>
						<div className="text-subtext0 font-sans leading-relaxed">{statusMsg.text}</div>
						<div className="pt-1">
							<a
								href={`mailto:${recipientEmail}?subject=Direct%20Inquiry%20via%20Portfolio&body=${encodeURIComponent(
									message,
								)}`}
								className="inline-flex items-center gap-1.5 text-xs text-peach hover:underline font-mono"
							>
								<Mail className="w-3.5 h-3.5" />
								<span>Click here to open email client directly</span>
							</a>
						</div>
					</div>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4" noValidate>
				{/* Name Field */}
				<div className="space-y-1.5">
					<label htmlFor="contact-name" className="block text-xs font-mono text-text font-semibold">
						Your Name <span className="text-accent">*</span>
					</label>
					<input
						id="contact-name"
						type="text"
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
						}}
						disabled={isPending}
						placeholder="Jane Doe"
						className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-base text-text transition-colors focus:outline-none ${
							fieldErrors.name
								? 'border-red focus:border-red focus:ring-1 focus:ring-red'
								: 'border-surface1 focus:border-accent'
						} disabled:opacity-50`}
						aria-required="true"
						aria-invalid={Boolean(fieldErrors.name)}
						aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
					/>
					{fieldErrors.name && (
						<p id="contact-name-error" className="text-xs font-mono text-red">
							{fieldErrors.name}
						</p>
					)}
				</div>

				{/* Email Field */}
				<div className="space-y-1.5">
					<label
						htmlFor="contact-email"
						className="block text-xs font-mono text-text font-semibold"
					>
						Your Email <span className="text-accent">*</span>
					</label>
					<input
						id="contact-email"
						type="email"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
						}}
						disabled={isPending}
						placeholder="jane@example.com"
						className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-base text-text transition-colors focus:outline-none ${
							fieldErrors.email
								? 'border-red focus:border-red focus:ring-1 focus:ring-red'
								: 'border-surface1 focus:border-accent'
						} disabled:opacity-50`}
						aria-required="true"
						aria-invalid={Boolean(fieldErrors.email)}
						aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
					/>
					{fieldErrors.email && (
						<p id="contact-email-error" className="text-xs font-mono text-red">
							{fieldErrors.email}
						</p>
					)}
				</div>

				{/* Message Field */}
				<div className="space-y-1.5">
					<label
						htmlFor="contact-message"
						className="block text-xs font-mono text-text font-semibold"
					>
						Message <span className="text-accent">*</span>
					</label>
					<textarea
						id="contact-message"
						rows={5}
						value={message}
						onChange={(e) => {
							setMessage(e.target.value);
							if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: undefined }));
						}}
						disabled={isPending}
						placeholder="Hello Harshil, I would like to discuss..."
						className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-base text-text transition-colors focus:outline-none resize-y ${
							fieldErrors.message
								? 'border-red focus:border-red focus:ring-1 focus:ring-red'
								: 'border-surface1 focus:border-accent'
						} disabled:opacity-50`}
						aria-required="true"
						aria-invalid={Boolean(fieldErrors.message)}
						aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
					/>
					{fieldErrors.message && (
						<p id="contact-message-error" className="text-xs font-mono text-red">
							{fieldErrors.message}
						</p>
					)}
				</div>

				{/* Honeypot Field */}
				<div className="hidden" aria-hidden="true">
					<label htmlFor="contact-website">Website</label>
					<input
						id="contact-website"
						type="text"
						tabIndex={-1}
						autoComplete="off"
						value={website}
						onChange={(e) => setWebsite(e.target.value)}
					/>
				</div>

				{/* Submit Button */}
				<div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
					<button
						type="submit"
						disabled={isPending}
						className="px-6 py-2.5 rounded-lg bg-accent text-accent-fg font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
					>
						{isPending ? (
							<>
								<span className="w-3.5 h-3.5 border-2 border-accent-fg border-t-transparent rounded-full animate-spin" />
								<span>Sending...</span>
							</>
						) : (
							<>
								<Send className="w-3.5 h-3.5" />
								<span>Send Message</span>
							</>
						)}
					</button>

					<a
						href={`mailto:${recipientEmail}`}
						className="text-xs font-mono text-subtext0 hover:text-accent transition-colors"
					>
						Or email directly: {recipientEmail}
					</a>
				</div>
			</form>
		</div>
	);
}
