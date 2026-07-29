'use client';

import { useEffect, useState } from 'react';

export function LiveClock() {
	const [timeString, setTimeString] = useState<string>('');

	useEffect(() => {
		const updateTime = () => {
			const formatter = new Intl.DateTimeFormat('en-US', {
				timeZone: 'Asia/Kolkata',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false,
			});
			setTimeString(`${formatter.format(new Date())} IST`);
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="bg-surface-container rounded-xl border border-border-muted p-4 flex flex-col justify-between h-48 relative overflow-hidden group w-full transition-colors duration-300">
			<div className="flex items-center gap-1.5 text-on-surface-variant mb-1 z-10 relative">
				<span className="material-symbols-outlined text-error" style={{ fontSize: '16px' }}>
					location_on
				</span>
				<span className="font-mono text-[10px] uppercase tracking-[0.15em] font-semibold">
					Based In
				</span>
			</div>

			<div
				className="absolute inset-0 top-8 opacity-40 group-hover:opacity-65 transition-opacity duration-300 grayscale"
				style={{
					backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUrFQyId618thzQ1yiBEfb4ulV_dUe6OE7mO99_jRnL54gdwoypPYR01mr-fqwqKoqJJ_OiMmsiOZr82cihgIL614Et14XT981R3v26esHY3UZcJVXdDgW6kuj6kuzEN5d2ttvIAFxX2oJoI9CIoZBuWeLsPMA695JNF-CEEGQUEGlfzHUMmOsJ1dBLNp5fmJbulU77XG0lFqBfCIFKWazl2X7ChEWz2elCPaTLgJN9UD9hGOFsUlm')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			/>

			<div className="z-10 relative mt-auto flex justify-between items-end w-full">
				<div className="text-xs font-semibold bg-background/80 px-2 py-0.5 rounded backdrop-blur border border-border-muted text-on-surface">
					Kerala, IN
				</div>
				<div className="text-[10px] text-primary bg-background/80 px-2 py-0.5 rounded backdrop-blur flex items-center gap-1 border border-border-muted font-mono font-medium">
					<span className="material-symbols-outlined" style={{ fontSize: '10px' }}>
						schedule
					</span>
					{timeString || '--:-- IST'}
				</div>
			</div>
		</div>
	);
}
