'use client';

import { useState } from 'react';
import { sendContactEmailAction } from '@/app/actions';

export function ContactForm() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	// Honeypot field state for bot defense
	const [honeypot, setHoneypot] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMsg('');

		// Silent reject if honeypot is filled
		if (honeypot) {
			setIsSuccess(true);
			return;
		}

		if (!name.trim() || !email.trim() || !message.trim()) {
			setErrorMsg('Please fill in all fields.');
			return;
		}

		setIsLoading(true);

		try {
			await sendContactEmailAction({ name, email, message });
			setIsSuccess(true);
			setName('');
			setEmail('');
			setMessage('');
		} catch (err) {
			console.error('Contact submit error:', err);
			setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{isSuccess ? (
				<div className="p-6 bg-surface-container border border-primary rounded-xl flex items-center gap-3 animate-calm transition-all duration-300">
					<span className="material-symbols-outlined text-primary text-2xl font-bold">
						check_circle
					</span>
					<div>
						<div className="text-sm font-bold text-primary font-mono uppercase tracking-wider">
							Message sent!
						</div>
						<div className="text-xs text-on-surface-variant mt-0.5">
							I'll get back to you soon. Thank you!
						</div>
					</div>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					{/* Honeypot field (hidden from users, bot trap) */}
					<div className="hidden" aria-hidden="true">
						<input
							type="text"
							name="website"
							value={honeypot}
							onChange={(e) => setHoneypot(e.target.value)}
							tabIndex={-1}
							autoComplete="off"
						/>
					</div>

					{/* Name */}
					<div className="flex flex-col">
						<input
							type="text"
							placeholder="Name"
							disabled={isLoading}
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="bg-transparent border-b border-border-muted hover:border-on-surface-variant focus:border-primary text-xs py-2 px-1 text-on-surface outline-none transition-colors duration-150"
							required
						/>
					</div>

					{/* Email */}
					<div className="flex flex-col">
						<input
							type="email"
							placeholder="Email"
							disabled={isLoading}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="bg-transparent border-b border-border-muted hover:border-on-surface-variant focus:border-primary text-xs py-2 px-1 text-on-surface outline-none transition-colors duration-150"
							required
						/>
					</div>

					{/* Message */}
					<div className="flex flex-col">
						<textarea
							placeholder="Message"
							rows={5}
							disabled={isLoading}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="bg-transparent border-b border-border-muted hover:border-on-surface-variant focus:border-primary text-xs py-2 px-1 text-on-surface outline-none transition-colors duration-150 resize-none"
							required
						/>
					</div>

					{/* Error display */}
					{errorMsg && (
						<div className="text-xs font-semibold text-error flex items-center gap-1.5 animate-calm">
							<span className="material-symbols-outlined text-[14px]">error</span>
							{errorMsg}
						</div>
					)}

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isLoading}
						className="px-6 py-2 bg-primary text-background font-mono rounded font-bold text-xs tracking-wider transition-all duration-150 uppercase self-end hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						{isLoading ? (
							<>
								Sending
								<span className="w-3.5 h-3.5 border-2 border-background border-t-transparent rounded-full animate-spin inline-block" />
							</>
						) : (
							<>
								Send
								<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
							</>
						)}
					</button>
				</form>
			)}
		</div>
	);
}
