'use client';

import Image from 'next/image';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import type { Affiliation } from '@/types';

export const DEFAULT_AFFILIATIONS: Affiliation[] = [
	{
		id: 'mulearn',
		title: 'MuLearn',
		role: 'Frontend Intern',
		details:
			'Building reusable frontend components and integrating REST APIs for the MuLearn dashboard, serving 60,000+ members in the developer community.',
		tags: ['Next.js', 'React', 'TypeScript', 'REST API'],
		logo_url: '/logos/mulearn.svg',
		website: 'https://mulearn.org',
		date_range: 'January 2026 – Present',
	},
];

type PopoverPosition = {
	top: number;
	left: number;
	side: 'top' | 'bottom';
	arrowLeft: number;
};

type AffiliationRibbonProps = {
	items?: Affiliation[];
};

function AffiliationIcon({ item, size = 'sm' }: { item: Affiliation; size?: 'sm' | 'md' }) {
	// 1. Raw inline SVG code pasted by user in admin panel
	if (item.icon_svg?.trim().startsWith('<svg')) {
		return (
			<div
				className={`flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain text-accent ${
					size === 'sm' ? 'w-6 h-6 max-h-7 max-w-7' : 'w-8 h-8 max-h-10 max-w-10'
				}`}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: user-configured inline SVG in admin
				dangerouslySetInnerHTML={{ __html: item.icon_svg }}
			/>
		);
	}

	// 2. Logo image or asset path
	if (item.logo_url) {
		return (
			<Image
				src={item.logo_url}
				alt={`${item.title} Logo`}
				width={size === 'sm' ? 32 : 40}
				height={size === 'sm' ? 32 : 40}
				unoptimized
				className={
					size === 'sm'
						? 'flex max-h-8 min-h-7 w-auto min-w-6 grow-0 object-contain'
						: 'h-full w-full object-contain'
				}
				style={size === 'md' ? { transform: 'scale(1.15)' } : undefined}
			/>
		);
	}

	// 3. Fallback initials badge
	return (
		<span
			className={`flex items-center justify-center rounded bg-surface0 border border-surface1/60 font-mono font-bold text-accent shrink-0 ${
				size === 'sm' ? 'h-7 w-7 text-xs' : 'h-10 w-10 text-sm'
			}`}
		>
			{item.title.slice(0, 2).toUpperCase()}
		</span>
	);
}

export function AffiliationRibbon({ items }: AffiliationRibbonProps) {
	const [activeAff, setActiveAff] = useState<Affiliation | null>(null);
	const [popoverPos, setPopoverPos] = useState<PopoverPosition | null>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	// Strict max 3 badges limit
	const rawItems = items && items.length > 0 ? items : DEFAULT_AFFILIATIONS;
	const displayItems = rawItems.slice(0, 3);

	const handleClose = useCallback(() => {
		setActiveAff(null);
		setPopoverPos(null);
	}, []);

	const updatePosition = useCallback((btnEl: HTMLButtonElement) => {
		const rect = btnEl.getBoundingClientRect();
		const popoverWidth = Math.min(320, window.innerWidth - 32);
		const popoverEstimatedHeight = 220;

		const side: 'top' | 'bottom' = rect.top >= popoverEstimatedHeight + 16 ? 'top' : 'bottom';

		let left = rect.left + rect.width / 2 - popoverWidth / 2;
		left = Math.max(16, Math.min(left, window.innerWidth - popoverWidth - 16));

		const arrowCenter = rect.left + rect.width / 2 - left;
		const arrowLeft = Math.max(16, Math.min(arrowCenter, popoverWidth - 16));

		const top = side === 'top' ? rect.top - 8 : rect.bottom + 8;

		setPopoverPos({ top, left, side, arrowLeft });
	}, []);

	const handleToggle = (aff: Affiliation, btnEl: HTMLButtonElement) => {
		if (activeAff?.id === aff.id) {
			handleClose();
			return;
		}
		updatePosition(btnEl);
		setActiveAff(aff);
	};

	// Recalculate position on scroll/resize
	useEffect(() => {
		if (!activeAff) return;
		const handleScrollOrResize = () => {
			const btn = triggerRefs.current[activeAff.id];
			if (btn) {
				updatePosition(btn);
			}
		};
		window.addEventListener('scroll', handleScrollOrResize, { passive: true });
		window.addEventListener('resize', handleScrollOrResize);
		return () => {
			window.removeEventListener('scroll', handleScrollOrResize);
			window.removeEventListener('resize', handleScrollOrResize);
		};
	}, [activeAff, updatePosition]);

	// Close on click outside and escape key
	useEffect(() => {
		if (!activeAff) return;
		const handlePointerDown = (e: MouseEvent | TouchEvent) => {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(e.target as Node) &&
				!triggerRefs.current[activeAff.id]?.contains(e.target as Node)
			) {
				handleClose();
			}
		};
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				handleClose();
			}
		};
		document.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [activeAff, handleClose]);

	return (
		<section className="py-2 relative" aria-label="Key Affiliations">
			<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:justify-start">
				{displayItems.map((aff, idx) => {
					const isPast = aff.status?.toLowerCase().includes('past');
					const isCurrent = !isPast;
					const isOpen = activeAff?.id === aff.id;

					return (
						<Fragment key={aff.id}>
							<button
								ref={(el) => {
									triggerRefs.current[aff.id] = el;
								}}
								id={`aff-btn-${aff.id}`}
								aria-haspopup="dialog"
								aria-expanded={isOpen}
								data-state={isOpen ? 'open' : 'closed'}
								data-popover-trigger=""
								type="button"
								onClick={(e) => handleToggle(aff, e.currentTarget)}
								className={`focus-visible:ring-accent group focus-visible:ring-offset-base flex cursor-pointer items-center gap-2 rounded text-sm transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:opacity-80 focus-visible:opacity-100 ${
									isPast ? 'opacity-60' : ''
								}`}
								aria-label={`View details for ${aff.role} at ${aff.title}`}
							>
								<AffiliationIcon item={aff} size="sm" />
								<span className="text-subtext1 group-hover:text-text group-focus-visible:text-text">
									<span className="whitespace-nowrap">
										<span className={isCurrent ? 'text-text font-medium' : ''}>{aff.title}</span>
										{aff.status && (
											<>
												{' '}
												<span className="text-overlay0 text-xs">({aff.status})</span>
											</>
										)}
									</span>
								</span>
							</button>

							{idx < displayItems.length - 1 && (
								<span className="text-accent hidden md:inline select-none">/</span>
							)}
						</Fragment>
					);
				})}
			</div>

			{/* Floating Popover Matching User Specification */}
			{activeAff && popoverPos && (
				<div
					ref={popoverRef}
					tabIndex={-1}
					role="dialog"
					aria-modal="false"
					data-state="open"
					data-popover-content=""
					data-side={popoverPos.side}
					data-align="center"
					id={`popover-${activeAff.id}`}
					style={{
						position: 'fixed',
						top: `${popoverPos.top}px`,
						left: `${popoverPos.left}px`,
						width: 'min(320px, calc(100vw - 32px))',
						transform: popoverPos.side === 'top' ? 'translateY(-100%)' : 'none',
						pointerEvents: 'auto',
						zIndex: 50,
					}}
					className="border-surface0 bg-mantle text-text shadow-xl z-50 max-w-xs rounded-xl border p-4 animate-in fade-in-0 zoom-in-95 duration-150 font-sans text-left"
				>
					{/* Header row: Logo, Organization, Role, and Close */}
					<div className="mb-3 flex items-start justify-between gap-2">
						<div className="flex items-center gap-3 min-w-0">
							<div className="h-10 w-10 shrink-0 rounded-md bg-surface0/60 border border-surface1/60 flex items-center justify-center p-1 overflow-hidden">
								<AffiliationIcon item={activeAff} size="md" />
							</div>
							<div className="min-w-0">
								<h4 className="text-text group-hover:text-accent font-semibold transition-colors truncate">
									{activeAff.title}
								</h4>
								<p className="text-subtext0 text-sm truncate">{activeAff.role}</p>
							</div>
						</div>

						<button
							onClick={handleClose}
							className="text-subtext1 hover:text-accent -m-1 cursor-pointer rounded p-1 transition-colors shrink-0"
							aria-label="Close details"
							type="button"
							data-popover-close=""
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
								className="tabler-icon tabler-icon-x"
							>
								<path d="M18 6l-12 12" />
								<path d="M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Description / Content */}
					<p className="text-subtext1 mb-3 text-sm leading-relaxed">{activeAff.details}</p>

					{/* Date Range with Calendar Icon */}
					{activeAff.date_range && (
						<div className="text-overlay0 mb-3 flex items-center gap-1.5 text-xs font-mono">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
								className="tabler-icon tabler-icon-calendar-event flex-shrink-0"
							>
								<path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
								<path d="M16 3l0 4" />
								<path d="M8 3l0 4" />
								<path d="M4 11l16 0" />
								<path d="M8 15h2v2h-2l0 -2" />
							</svg>
							<span>{activeAff.date_range}</span>
						</div>
					)}

					{/* Visit Website Link */}
					{activeAff.website && (
						<a
							target="_blank"
							rel="noopener noreferrer"
							className="text-accent hover:text-accent/80 inline-flex items-center gap-1 text-sm transition-colors font-medium"
							href={activeAff.website}
						>
							<span>Visit Website</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
								className="tabler-icon tabler-icon-external-link"
							>
								<path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
								<path d="M11 13l9 -9" />
								<path d="M15 4h5v5" />
							</svg>
						</a>
					)}

					{/* Popover Arrow */}
					<span
						className="text-accent"
						data-popover-arrow=""
						data-side={popoverPos.side}
						style={{
							position: 'absolute',
							left: `${popoverPos.arrowLeft}px`,
							...(popoverPos.side === 'top'
								? { bottom: '0px', transform: 'translateY(100%)' }
								: { top: '0px', transform: 'translateY(-100%) rotate(180deg)' }),
						}}
					>
						<svg
							viewBox="0 0 30 10"
							preserveAspectRatio="none"
							data-arrow=""
							width="12"
							height="6"
							aria-hidden="true"
						>
							<polygon points="0,0 30,0 15,10" fill="currentColor" />
						</svg>
					</span>
				</div>
			)}
		</section>
	);
}
