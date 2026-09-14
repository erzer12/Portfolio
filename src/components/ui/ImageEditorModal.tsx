'use client';

import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { uploadMediaAction } from '@/app/actions';

type Meta = {
	x: number;
	y: number;
	scale: number;
	crop?: { left: number; top: number; size: number };
};

export default function ImageEditorModal({
	isOpen,
	initialUrl,
	initialMeta,
	onClose,
	onSave,
}: {
	isOpen: boolean;
	initialUrl?: string;
	initialMeta?: Meta | null;
	onClose: () => void;
	onSave: (url: string, meta: Meta) => void;
}) {
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | undefined>(initialUrl);
	const [x, setX] = useState<number>(initialMeta?.x ?? 50);
	const [y, setY] = useState<number>(initialMeta?.y ?? 50);
	const [scale, setScale] = useState<number>(initialMeta?.scale ?? 1);
	const [cropLeft, setCropLeft] = useState<number>(initialMeta?.crop?.left ?? 0);
	const [cropTop, setCropTop] = useState<number>(initialMeta?.crop?.top ?? 0);
	const [cropSize, setCropSize] = useState<number>(initialMeta?.crop?.size ?? 50);
	const [isDraggingOverlay, setIsDraggingOverlay] = useState(false);
	const [isResizingOverlay, setIsResizingOverlay] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const dragStateRef = useRef<{
		x: number;
		y: number;
		left: number;
		top: number;
		size: number;
	} | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isOpen) return;

		setPreview(initialUrl);
		setFile(null);

		if (initialMeta?.crop) {
			setCropLeft(initialMeta.crop.left);
			setCropTop(initialMeta.crop.top);
			setCropSize(initialMeta.crop.size);
			setX(initialMeta.x ?? initialMeta.crop.left + initialMeta.crop.size / 2);
			setY(initialMeta.y ?? initialMeta.crop.top + initialMeta.crop.size / 2);
			setScale(initialMeta.scale ?? Math.max(1, 100 / initialMeta.crop.size));
			return;
		}

		const derivedSize = Math.min(100, Math.max(20, 100 / (initialMeta?.scale ?? 1)));
		const derivedLeft = (initialMeta?.x ?? 50) - derivedSize / 2;
		const derivedTop = (initialMeta?.y ?? 50) - derivedSize / 2;
		setCropLeft(Math.max(0, Math.min(100 - derivedSize, derivedLeft)));
		setCropTop(Math.max(0, Math.min(100 - derivedSize, derivedTop)));
		setCropSize(derivedSize);
		setX(initialMeta?.x ?? 50);
		setY(initialMeta?.y ?? 50);
		setScale(initialMeta?.scale ?? 1);
	}, [initialUrl, initialMeta, isOpen]);

	useEffect(() => {
		if (!file) return;
		const url = URL.createObjectURL(file);
		setPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

	if (!isOpen) return null;

	async function handleSave() {
		setError(null);
		setIsUploading(true);
		try {
			let url = preview ?? '';
			if (file) {
				const formData = new FormData();
				formData.append('file', file);
				url = await uploadMediaAction(formData);
			}

			const crop = {
				left: Number(cropLeft.toFixed(2)),
				top: Number(cropTop.toFixed(2)),
				size: Number(cropSize.toFixed(2)),
			};
			const centerX = crop.left + crop.size / 2;
			const centerY = crop.top + crop.size / 2;
			const calculatedScale = Number(Math.max(1, 100 / crop.size).toFixed(2));

			onSave(url, {
				x: Number(centerX.toFixed(2)),
				y: Number(centerY.toFixed(2)),
				scale: calculatedScale,
				crop,
			});
			onClose();
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Upload failed';
			setError(errorMessage);
		} finally {
			setIsUploading(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/80 backdrop-blur-sm">
			<div className="w-full max-w-3xl rounded-2xl border border-surface0 bg-mantle p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-surface0 pb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
							<Upload className="h-4 w-4" />
						</div>
						<div>
							<h3 className="text-sm font-semibold text-text">Upload & Adjust Avatar</h3>
							<p className="text-[11px] text-subtext0">
								Position the focal square or select a new headshot photo
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-1.5 text-subtext0 hover:bg-surface0 hover:text-text transition-colors"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<div className="flex flex-col sm:flex-row gap-6 items-start">
					{/* Cropper Container */}
					<div
						ref={containerRef}
						role="application"
						aria-label="Image cropper. Drag the square overlay to move it and drag the corner handle to resize"
						className="w-72 h-72 sm:w-80 sm:h-80 bg-base border border-surface1 rounded-xl overflow-hidden relative shrink-0 shadow-inner select-none"
						style={{ touchAction: 'none' }}
					>
						{preview ? (
							<Image
								src={preview}
								alt="preview"
								fill
								unoptimized
								className="object-cover pointer-events-none"
								style={{
									objectPosition: `${x}% ${y}%`,
									transform: `scale(${scale})`,
									transformOrigin: 'center',
								}}
							/>
						) : (
							<div className="text-xs text-subtext0 flex items-center justify-center h-full font-mono">
								No image selected
							</div>
						)}

						{/* Crop selection overlay box */}
						<div
							className="absolute bg-base/20 border-2 border-accent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing"
							style={{
								left: `${cropLeft}%`,
								top: `${cropTop}%`,
								width: `${cropSize}%`,
								height: `${cropSize}%`,
								cursor: isDraggingOverlay ? 'grabbing' : 'grab',
							}}
							onPointerDown={(e) => {
								e.stopPropagation();
								(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
								setIsDraggingOverlay(true);
								dragStateRef.current = {
									x: e.clientX,
									y: e.clientY,
									left: cropLeft,
									top: cropTop,
									size: cropSize,
								};
							}}
							onPointerMove={(e) => {
								if (!isDraggingOverlay || !dragStateRef.current) return;
								const rect = containerRef.current?.getBoundingClientRect();
								if (!rect) return;
								const dx = e.clientX - dragStateRef.current.x;
								const dy = e.clientY - dragStateRef.current.y;
								const nextLeft = Math.max(
									0,
									Math.min(
										100 - dragStateRef.current.size,
										dragStateRef.current.left + (dx / rect.width) * 100,
									),
								);
								const nextTop = Math.max(
									0,
									Math.min(
										100 - dragStateRef.current.size,
										dragStateRef.current.top + (dy / rect.height) * 100,
									),
								);
								const currentSize = dragStateRef.current.size;
								setCropLeft(nextLeft);
								setCropTop(nextTop);
								setX(nextLeft + currentSize / 2);
								setY(nextTop + currentSize / 2);
							}}
							onPointerUp={(e) => {
								try {
									(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
								} catch {}
								setIsDraggingOverlay(false);
								dragStateRef.current = null;
							}}
							onPointerCancel={() => {
								setIsDraggingOverlay(false);
								dragStateRef.current = null;
							}}
						>
							{/* Corner resize handle */}
							<div
								className="absolute w-4 h-4 bg-accent border-2 border-base rounded-xs -right-2 -bottom-2 cursor-nwse-resize shadow-md"
								onPointerDown={(e) => {
									e.stopPropagation();
									(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
									setIsResizingOverlay(true);
									dragStateRef.current = {
										x: e.clientX,
										y: e.clientY,
										left: cropLeft,
										top: cropTop,
										size: cropSize,
									};
								}}
								onPointerMove={(e) => {
									if (!isResizingOverlay || !dragStateRef.current) return;
									const rect = containerRef.current?.getBoundingClientRect();
									if (!rect) return;
									const dx = e.clientX - dragStateRef.current.x;
									const dy = e.clientY - dragStateRef.current.y;
									const delta = (Math.max(dx, dy) / rect.width) * 100;
									const nextSize = Math.max(20, Math.min(100, dragStateRef.current.size + delta));
									const nextLeft = Math.max(0, Math.min(100 - nextSize, dragStateRef.current.left));
									const nextTop = Math.max(0, Math.min(100 - nextSize, dragStateRef.current.top));
									setCropSize(nextSize);
									setCropLeft(nextLeft);
									setCropTop(nextTop);
									setX(nextLeft + nextSize / 2);
									setY(nextTop + nextSize / 2);
									setScale(Math.max(1, Math.min(5, Number((100 / nextSize).toFixed(2)))));
								}}
								onPointerUp={(e) => {
									try {
										(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
									} catch {}
									setIsResizingOverlay(false);
									dragStateRef.current = null;
								}}
								onPointerCancel={() => {
									setIsResizingOverlay(false);
									dragStateRef.current = null;
								}}
							/>

							{/* Rule of thirds grid lines */}
							<div className="absolute inset-0 pointer-events-none">
								<div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
								<div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
								<div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
								<div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
							</div>
						</div>
					</div>

					{/* Controls column */}
					<div className="flex-1 flex flex-col justify-between w-full space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="file-chooser"
								className="block text-xs font-semibold uppercase tracking-wider text-subtext0"
							>
								Choose Replacement Image
							</label>
							<input
								id="file-chooser"
								type="file"
								accept="image/*"
								className="text-xs font-mono text-subtext0 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border file:border-surface1 file:text-xs file:font-semibold file:text-text file:bg-surface0 file:hover:border-accent file:hover:text-accent file:transition-all cursor-pointer w-full"
								onChange={(e) => setFile(e.target.files?.[0] ?? null)}
							/>
							<p className="text-[11px] text-subtext0/70 font-mono">
								Supported formats: PNG, JPG, WebP. Recommended 1:1 square ratio.
							</p>
						</div>

						{error && (
							<div className="rounded-xl border border-red/40 bg-red/10 px-3.5 py-2.5 text-xs text-red font-mono">
								{error}
							</div>
						)}

						<div className="flex items-center justify-end gap-3 pt-4 border-t border-surface0">
							<button
								type="button"
								onClick={onClose}
								className="rounded-xl border border-surface1 px-4 py-2.5 text-xs font-semibold text-subtext0 hover:bg-surface0 hover:text-text transition-colors"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleSave}
								disabled={isUploading}
								className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-fg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-accent/10"
							>
								{isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
								<span>{isUploading ? 'Uploading...' : 'Save Avatar'}</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
