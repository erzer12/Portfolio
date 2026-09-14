import { ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { loginAction } from '@/app/actions';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
	const { error } = await searchParams;

	return (
		<main className="min-h-screen flex items-center justify-center bg-base text-text px-4 font-mono selection:bg-surface1 selection:text-accent">
			{/* Ambient background glow */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
				<div className="w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
			</div>

			<div className="relative w-full max-w-md space-y-4 z-10">
				{/* Top return link & Theme Switcher */}
				<div className="flex items-center justify-between">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-xs text-subtext0 hover:text-accent transition-colors"
					>
						<ArrowLeft className="w-3.5 h-3.5" />
						<span>Back to Portfolio</span>
					</Link>
					<ThemeToggle />
				</div>

				{/* Login Card */}
				<div className="rounded-2xl border border-surface0/80 bg-mantle/90 backdrop-blur-md p-8 shadow-2xl space-y-6">
					{/* Header */}
					<div className="space-y-2 border-b border-surface0/60 pb-5">
						<div className="flex items-center justify-between text-xs text-subtext1">
							<span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-accent">
								<ShieldCheck className="w-4 h-4 text-accent" />
								CMS / Admin Access
							</span>
							<span className="flex items-center gap-1 text-[11px] text-green">
								<span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
								System Online
							</span>
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-text">Admin Console</h1>
						<p className="text-xs text-subtext0 font-sans leading-relaxed">
							Authenticate with your master passcode to manage projects, experiences, and site
							content.
						</p>
					</div>

					{/* Error Alert */}
					{error && (
						<div className="rounded-lg border border-red/40 bg-red/10 px-3.5 py-2.5 text-xs text-red flex items-center gap-2">
							<span className="font-bold">Error:</span> Invalid access code. Please verify and try
							again.
						</div>
					)}

					{/* Form */}
					<form action={loginAction} className="space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="code"
								className="block text-xs uppercase tracking-widest text-subtext0 font-semibold"
							>
								Access Passcode
							</label>
							<div className="relative">
								<input
									id="code"
									name="code"
									type="password"
									required
									autoComplete="current-password"
									className="w-full rounded-xl border border-surface1 bg-base/80 px-4 py-3 pl-11 text-center font-mono text-base tracking-[0.3em] text-text outline-none transition-all placeholder:text-surface2 placeholder:tracking-normal focus:border-accent focus:ring-1 focus:ring-accent/40"
									placeholder="••••••••"
								/>
								<KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext0 pointer-events-none" />
							</div>
						</div>

						<button
							type="submit"
							className="w-full cursor-pointer rounded-xl bg-accent px-4 py-3 text-xs font-bold uppercase tracking-widest text-accent-fg transition-all hover:brightness-110 active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-accent/10"
						>
							Authenticate & Enter
						</button>
					</form>

					<div className="pt-2 border-t border-surface0/40 text-center">
						<span className="text-[11px] text-subtext0/70 font-mono">
							Authorized administrator sessions only
						</span>
					</div>
				</div>
			</div>
		</main>
	);
}
