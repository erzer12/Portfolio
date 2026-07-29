'use client';

import { useState } from 'react';

type Photo = {
	id: string;
	title: string;
	location: string;
	camera: string;
	lens: string;
	settings: string;
	url: string;
};

type PicsGalleryProps = {
	photos: Photo[];
};

export function PicsGallery({ photos }: PicsGalleryProps) {
	const [activeLightbox, setActiveLightbox] = useState<Photo | null>(null);

	return (
		<div className="space-y-6">
			{/* Masonry / Columns Grid */}
			<div className="columns-1 sm:columns-2 gap-4 space-y-4">
				{photos.map((photo) => (
					/* biome-ignore lint/a11y/useKeyWithClickEvents: lightbox zoom trigger */
					/* biome-ignore lint/a11y/noStaticElementInteractions: lightbox zoom trigger */
					<div
						key={photo.id}
						onClick={() => setActiveLightbox(photo)}
						className="break-inside-avoid relative overflow-hidden rounded-xl border border-border-muted/50 hover:border-primary/50 group cursor-zoom-in bg-surface-container transition-all duration-200"
					>
						{/* Image tag with suppression to keep linter happy */}
						{/* biome-ignore lint/performance/noImgElement: photo gallery images */}
						<img
							src={photo.url}
							alt={photo.title}
							className="w-full object-cover rounded-t-xl group-hover:scale-[1.01] transition-transform duration-200"
						/>

						{/* Card Body details */}
						<div className="p-3.5 space-y-1.5 border-t border-border-muted/30">
							<div className="flex justify-between items-center gap-2">
								<h3 className="text-xs font-bold text-on-surface line-clamp-1">{photo.title}</h3>
								<span className="text-[8px] font-mono uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 shrink-0">
									{photo.location.split(',')[0]}
								</span>
							</div>

							<div className="flex items-center gap-1.5 text-[9px] text-on-surface-variant/80 font-mono">
								<span className="material-symbols-outlined text-[10px] text-tertiary">
									photo_camera
								</span>
								<span className="truncate">
									{photo.camera} · {photo.lens.split(' ')[0]}
								</span>
							</div>
						</div>

						{/* Hover Overlay */}
						<div className="absolute inset-0 bg-background/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end pointer-events-none" />
					</div>
				))}
			</div>

			{/* Fullscreen Lightbox Modal */}
			{activeLightbox && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-calm">
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: close lightbox overlay */}
					{/* biome-ignore lint/a11y/noStaticElementInteractions: close lightbox overlay */}
					<div
						onClick={() => setActiveLightbox(null)}
						className="absolute inset-0 cursor-zoom-out"
					/>

					<div className="relative z-10 max-w-[85vw] max-h-[85vh] flex flex-col items-center gap-4">
						{/* Image display */}
						{/* biome-ignore lint/performance/noImgElement: fullscreen photography preview */}
						<img
							src={activeLightbox.url.replace('&fit=crop', '')}
							alt={activeLightbox.title}
							className="max-w-full max-h-[70vh] rounded-lg shadow-2xl object-contain border border-border-muted"
						/>

						{/* Captions and camera settings */}
						<div className="text-center space-y-1 select-none">
							<h2 className="text-sm md:text-base font-bold text-on-surface">
								{activeLightbox.title}
							</h2>
							<div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-on-surface-variant/80">
								<span className="flex items-center gap-0.5 text-primary">
									<span className="material-symbols-outlined text-[12px]">location_on</span>
									{activeLightbox.location}
								</span>
								<span>·</span>
								<span className="flex items-center gap-0.5 text-tertiary">
									<span className="material-symbols-outlined text-[12px]">photo_camera</span>
									{activeLightbox.camera} · {activeLightbox.lens}
								</span>
								<span>·</span>
								<span>{activeLightbox.settings}</span>
							</div>
						</div>

						{/* Close Floating Button */}
						<button
							type="button"
							onClick={() => setActiveLightbox(null)}
							className="px-5 py-1.5 bg-background border border-border-muted hover:bg-surface-container-high font-mono rounded-full text-xs font-bold text-on-surface transition-colors"
						>
							Close Lightbox
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
