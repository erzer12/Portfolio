'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeContext';

export function ThemeToggle({
	className = '',
	showLabel = true,
}: {
	className?: string;
	showLabel?: boolean;
}) {
	const { palette, setPalette } = useTheme();

	const isDark = palette === 'mocha';

	const handleToggle = () => {
		setPalette(isDark ? 'latte' : 'mocha');
	};

	return (
		<button
			type="button"
			onClick={handleToggle}
			className={`inline-flex items-center gap-1.5 rounded-xl border border-surface0 bg-surface0/50 px-2.5 py-1.5 text-xs font-semibold text-text hover:border-accent hover:text-accent transition-all shadow-sm ${className}`}
			title={isDark ? 'Switch to Light Mode (Latte)' : 'Switch to Dark Mode (Mocha)'}
			aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
		>
			{isDark ? (
				<Sun className="h-3.5 w-3.5 text-yellow animate-in fade-in zoom-in-75 duration-200" />
			) : (
				<Moon className="h-3.5 w-3.5 text-accent animate-in fade-in zoom-in-75 duration-200" />
			)}
			{showLabel && (
				<span className="font-mono text-[11px] font-medium">{isDark ? 'Light' : 'Dark'}</span>
			)}
		</button>
	);
}
