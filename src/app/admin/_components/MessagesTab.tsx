'use client';

import { Check, CheckCheck, Copy, Inbox, Mail, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { deleteContactMessageAction, markContactMessageReadAction } from '@/app/actions';
import type { ContactMessage } from '@/types';

type Props = {
	messages: ContactMessage[];
};

export function MessagesTab({ messages }: Props) {
	const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
	const [isPending, startTransition] = useTransition();
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const unreadCount = messages ? messages.filter((m) => !m.read).length : 0;

	const filteredMessages = (messages || []).filter((m) => {
		if (filter === 'unread') return !m.read;
		if (filter === 'read') return m.read;
		return true;
	});

	const handleToggleRead = (id: string, currentRead: boolean) => {
		startTransition(async () => {
			await markContactMessageReadAction(id, !currentRead);
		});
	};

	const handleDelete = (id: string) => {
		if (!window.confirm('Are you sure you want to delete this contact message?')) return;
		startTransition(async () => {
			await deleteContactMessageAction(id);
		});
	};

	const handleCopyEmail = (email: string, id: string) => {
		navigator.clipboard.writeText(email);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2000);
	};

	const formatDate = (isoString: string) => {
		try {
			const d = new Date(isoString);
			return d.toLocaleString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
		} catch {
			return isoString;
		}
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Top Bar: Summary & Filter Pills */}
			<div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface0/80 pb-5">
				<div className="flex items-center gap-3">
					<Inbox className="w-5 h-5 text-accent" />
					<h3 className="text-sm font-bold text-text uppercase tracking-wider">
						Message Inbox ({messages.length})
					</h3>
					{unreadCount > 0 && (
						<span className="rounded-full bg-accent/20 text-accent border border-accent/30 px-2.5 py-0.5 text-xs font-bold animate-pulse">
							{unreadCount} unread
						</span>
					)}
				</div>

				<div className="flex items-center gap-1.5 p-1 rounded-xl bg-base/80 border border-surface0 text-xs">
					{(['all', 'unread', 'read'] as const).map((tab) => {
						const isActive = filter === tab;
						const count =
							tab === 'all'
								? messages.length
								: tab === 'unread'
									? unreadCount
									: messages.length - unreadCount;
						return (
							<button
								key={tab}
								type="button"
								onClick={() => setFilter(tab)}
								className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
									isActive
										? 'bg-surface1 text-accent shadow-sm'
										: 'text-subtext0 hover:text-text hover:bg-surface0/40'
								}`}
							>
								<span>{tab}</span>
								<span className="ml-1.5 text-[10px] opacity-75 font-mono">({count})</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Message List */}
			<div className="space-y-4">
				{filteredMessages.map((msg) => (
					<div
						key={msg.id}
						className={`p-5 rounded-2xl border transition-all ${
							msg.read
								? 'border-surface0/80 bg-base/40 opacity-80 hover:opacity-100 hover:border-surface1'
								: 'border-accent/40 bg-accent/5 shadow-md hover:border-accent'
						}`}
					>
						{/* Header row */}
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-surface0/60">
							<div className="flex items-start gap-3">
								<div className="w-9 h-9 rounded-xl bg-surface0 border border-surface1 flex items-center justify-center text-xs font-bold text-accent shrink-0">
									{msg.name?.charAt(0)?.toUpperCase() || '?'}
								</div>

								<div className="space-y-0.5">
									<div className="flex items-center gap-2">
										{!msg.read && (
											<span
												className="w-2 h-2 rounded-full bg-accent animate-pulse"
												title="Unread"
											/>
										)}
										<span className="font-bold text-sm text-text">{msg.name}</span>
									</div>

									<div className="flex items-center gap-2">
										<a
											href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry from ${encodeURIComponent(msg.name)}`}
											className="text-xs text-subtext0 hover:text-accent hover:underline transition-colors"
										>
											{msg.email}
										</a>
										<button
											type="button"
											onClick={() => handleCopyEmail(msg.email, msg.id)}
											className="text-surface2 hover:text-accent transition-colors"
											title="Copy email address"
										>
											{copiedId === msg.id ? (
												<Check className="w-3.5 h-3.5 text-green" />
											) : (
												<Copy className="w-3.5 h-3.5" />
											)}
										</button>
									</div>
								</div>
							</div>

							<div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end sm:self-center">
								<span className="text-[11px] text-subtext0/70 font-mono">
									{formatDate(msg.created_at)}
								</span>

								<div className="flex items-center gap-1.5">
									<a
										href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry from ${encodeURIComponent(msg.name)}`}
										className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface1 bg-surface0/60 text-xs font-bold text-text hover:text-accent hover:border-accent transition-all"
									>
										<Mail className="w-3.5 h-3.5 text-accent" />
										<span>Reply</span>
									</a>

									<button
										type="button"
										disabled={isPending}
										onClick={() => handleToggleRead(msg.id, msg.read)}
										className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface1 bg-surface0/60 text-xs font-bold text-text hover:text-accent hover:border-accent transition-all"
									>
										<CheckCheck className="w-3.5 h-3.5" />
										<span>{msg.read ? 'Mark Unread' : 'Mark Read'}</span>
									</button>

									<button
										type="button"
										disabled={isPending}
										onClick={() => handleDelete(msg.id)}
										className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red/30 bg-red/10 text-xs font-bold text-red hover:bg-red/20 transition-all"
										title="Delete message"
									>
										<Trash2 className="w-3.5 h-3.5" />
									</button>
								</div>
							</div>
						</div>

						{/* Body Content */}
						<div className="pt-4 font-sans text-xs sm:text-sm text-text leading-relaxed whitespace-pre-wrap selection:bg-surface1 selection:text-accent">
							{msg.message}
						</div>
					</div>
				))}

				{filteredMessages.length === 0 && (
					<div className="rounded-2xl border border-dashed border-surface1 p-8 sm:p-12 text-center text-xs text-subtext0 space-y-4">
						<p className="font-semibold text-text">
							{filter === 'all'
								? 'No contact form messages received yet.'
								: `No ${filter} messages in inbox.`}
						</p>
						<p className="text-[11px] text-subtext0 max-w-md mx-auto leading-relaxed">
							When visitors send messages via your portfolio contact form, they will be archived
							here and dispatched to your email / Discord webhook.
						</p>

						<div className="pt-2">
							<button
								type="button"
								onClick={() => {
									const sql = `-- Run this in Supabase SQL Editor:
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);
alter table contact_messages enable row level security;
create policy "public_insert_contact_messages" on contact_messages for insert with check (true);`;
									navigator.clipboard.writeText(sql);
									alert(
										'SQL setup snippet copied to clipboard! Paste and run it in your Supabase SQL Editor.',
									);
								}}
								className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface1 bg-surface0/60 text-xs font-mono text-subtext1 hover:text-accent hover:border-accent transition-colors"
							>
								<Copy className="w-3.5 h-3.5" />
								<span>Copy Supabase SQL Setup Script</span>
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
