'use client';

import { useEffect, useState } from 'react';

export function ClickerGame() {
	const [userClicks, setUserClicks] = useState<number>(0);
	const [globalClicks, setGlobalClicks] = useState<number>(821074);
	const [isAnimating, setIsAnimating] = useState<boolean>(false);

	useEffect(() => {
		const storedUser = localStorage.getItem('clicker_user_clicks');
		const storedGlobal = localStorage.getItem('clicker_global_clicks');
		if (storedUser) {
			setUserClicks(parseInt(storedUser, 10));
		}
		if (storedGlobal) {
			setGlobalClicks(parseInt(storedGlobal, 10));
		}
	}, []);

	const handleClick = () => {
		const nextUser = userClicks + 1;
		const nextGlobal = globalClicks + 1;

		setUserClicks(nextUser);
		setGlobalClicks(nextGlobal);
		setIsAnimating(true);

		localStorage.setItem('clicker_user_clicks', nextUser.toString());
		localStorage.setItem('clicker_global_clicks', nextGlobal.toString());

		setTimeout(() => setIsAnimating(false), 150);
	};

	return (
		<div className="bg-surface-container rounded-xl border border-border-muted p-4 flex flex-col items-center justify-between h-48 text-center relative w-full transition-colors duration-300">
			<div className="flex items-center justify-between w-full text-on-surface-variant">
				<div className="flex items-center gap-1">
					<span className="material-symbols-outlined text-primary text-[14px]">sports_esports</span>
					<span className="font-mono text-[9px] uppercase tracking-wider font-semibold">
						Mini Game
					</span>
				</div>
				<span
					className="material-symbols-outlined text-[13px] opacity-60 cursor-help"
					title="Interactive click counter"
				>
					info
				</span>
			</div>

			<div className="flex flex-col items-center justify-center my-auto space-y-2">
				<div
					className={`font-mono text-3xl font-extrabold text-primary leading-none tracking-tight select-none transition-transform duration-100 ${isAnimating ? 'scale-110 text-tertiary' : ''}`}
				>
					{globalClicks.toLocaleString()}
				</div>

				<button
					type="button"
					onClick={handleClick}
					className="px-6 py-2 bg-primary text-background font-mono rounded-lg font-extrabold text-xs tracking-wider transition-all duration-150 hover:scale-105 active:scale-95 uppercase shadow-md"
				>
					Click Me
				</button>
			</div>

			<div className="text-[9px] text-on-surface-variant font-mono uppercase tracking-wider">
				you've clicked {userClicks} {userClicks === 1 ? 'time' : 'times'}
			</div>
		</div>
	);
}
