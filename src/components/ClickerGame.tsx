'use client';

import { useEffect, useState } from 'react';

export function ClickerGame() {
	const [userClicks, setUserClicks] = useState<number>(0);
	const [globalClicks, setGlobalClicks] = useState<number>(42108);
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
		<div className="bg-surface-container rounded-xl border border-border-muted p-4 flex flex-col items-center justify-center h-48 text-center relative w-full transition-colors duration-300">
			<span
				className="material-symbols-outlined absolute top-2 right-2 text-outline text-[14px] cursor-help"
				title="Fun clicker game to pass the time"
			>
				info
			</span>

			<div
				className={`font-mono text-2xl font-bold text-tertiary leading-none mb-2 select-none transition-transform duration-100 ${isAnimating ? 'scale-110 text-primary' : ''}`}
			>
				{globalClicks.toLocaleString()}
			</div>

			<button
				type="button"
				onClick={handleClick}
				className="px-4 py-1.5 bg-primary text-background font-mono rounded font-bold text-xs tracking-wider transition-all duration-100 hover:opacity-90 active:scale-95 mb-2 uppercase"
			>
				Click Me
			</button>

			<div className="text-[9px] text-on-surface-variant font-mono uppercase tracking-wider">
				you've clicked {userClicks} {userClicks === 1 ? 'time' : 'times'}
			</div>
		</div>
	);
}
