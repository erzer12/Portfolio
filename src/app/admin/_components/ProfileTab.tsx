'use client';

import {
	Camera,
	Check,
	ExternalLink,
	FileText,
	ImageIcon,
	Loader2,
	RotateCcw,
	Save,
	Sparkles,
	Terminal,
	UserCheck,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { saveProfileAction } from '@/app/actions';
import { DEFAULT_ASCII_PORTRAIT } from '@/components/ui/AsciiImage';
import { FileUpload } from '@/components/ui/FileUpload';
import { imageCropFrameStyle } from '@/lib/utils';
import type { Profile } from '@/types';

const ImageEditorModal = dynamic(() => import('@/components/ui/ImageEditorModal'), { ssr: false });

type Props = { profile: Profile | null };

export function ProfileTab({ profile }: Props) {
	const [isPending, startTransition] = useTransition();
	const [isSavingImage, setIsSavingImage] = useState(false);
	const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

	const [form, setForm] = useState({
		name: profile?.name ?? '',
		tagline: profile?.tagline ?? '',
		summary: profile?.summary ?? '',
		location: profile?.location ?? '',
		email: profile?.email ?? '',
		resume: profile?.resume ?? '',
		image: profile?.image ?? '',
		github: profile?.social?.github ?? '',
		linkedin: profile?.social?.linkedin ?? '',
		imageFocusX: profile?.social?.imageMeta?.x ?? 50,
		imageFocusY: profile?.social?.imageMeta?.y ?? 50,
		imageScale: profile?.social?.imageMeta?.scale ?? 1,
		imageCrop: profile?.social?.imageCrop ? JSON.stringify(profile?.social?.imageCrop) : '',
		avatarMode: (profile?.social?.avatar_mode as 'ascii' | 'photo') || 'ascii',
		asciiArt: profile?.social?.ascii_art ?? '',
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	}

	function handleResumeUploadSuccess(url: string) {
		setForm((prev) => ({ ...prev, resume: url }));
		setMsg({
			text: 'Resume uploaded successfully. Click "Save Profile" to commit.',
			type: 'success',
		});
	}

	const [isEditorOpen, setIsEditorOpen] = useState(false);

	function openEditor() {
		setIsEditorOpen(true);
	}

	function closeEditor() {
		setIsEditorOpen(false);
	}

	async function persistProfile(nextForm: typeof form) {
		await saveProfileAction({
			name: nextForm.name,
			tagline: nextForm.tagline,
			summary: nextForm.summary,
			location: nextForm.location,
			email: nextForm.email,
			resume: nextForm.resume,
			image: nextForm.image,
			social: {
				github: nextForm.github,
				linkedin: nextForm.linkedin,
				imageMeta: {
					x: Number(nextForm.imageFocusX),
					y: Number(nextForm.imageFocusY),
					scale: Number(nextForm.imageScale),
				},
				imageCrop: nextForm.imageCrop ? JSON.parse(String(nextForm.imageCrop)) : undefined,
				avatar_mode: nextForm.avatarMode,
				ascii_art: nextForm.asciiArt,
			},
		});
	}

	async function handleEditorSave(
		url: string,
		meta: { x?: number; y?: number; scale?: number; crop?: unknown },
	) {
		const nextForm = {
			...form,
			image: url,
			imageFocusX: meta.x ?? form.imageFocusX,
			imageFocusY: meta.y ?? form.imageFocusY,
			imageScale: meta.scale ?? form.imageScale,
			imageCrop: meta.crop ? JSON.stringify(meta.crop) : form.imageCrop,
		};

		setForm(nextForm);
		setIsSavingImage(true);
		setMsg(null);
		try {
			await persistProfile(nextForm);
			setMsg({ text: 'Avatar image saved and synced to live site.', type: 'success' });
		} catch {
			setMsg({ text: 'Error saving avatar image.', type: 'error' });
		} finally {
			setIsSavingImage(false);
		}
	}

	const previewCrop = form.imageCrop ? JSON.parse(String(form.imageCrop)) : null;
	const previewStyle = imageCropFrameStyle(previewCrop);

	const [isConverting, setIsConverting] = useState(false);
	const currentAscii = form.asciiArt?.trim() ? form.asciiArt : DEFAULT_ASCII_PORTRAIT;

	function handleResetAscii() {
		setForm((prev) => ({ ...prev, asciiArt: DEFAULT_ASCII_PORTRAIT }));
		setMsg({
			text: 'Reset to default ASCII art portrait. Click "Save Profile" to publish.',
			type: 'success',
		});
	}

	async function handleConvertPhotoToAscii() {
		if (!form.image) return;
		setIsConverting(true);
		try {
			const ascii = await convertImageToAscii(form.image);
			setForm((prev) => ({ ...prev, asciiArt: ascii, avatarMode: 'ascii' }));
			setMsg({
				text: 'Successfully generated ASCII art from photo! Click "Save Profile" to publish.',
				type: 'success',
			});
		} catch (err) {
			console.error('Failed to convert image to ASCII:', err);
			setMsg({
				text: 'Could not convert image. Try uploading an image file directly.',
				type: 'error',
			});
		} finally {
			setIsConverting(false);
		}
	}

	function handleFileToAscii(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsConverting(true);
		const reader = new FileReader();
		reader.onload = async (ev) => {
			try {
				const src = ev.target?.result as string;
				if (src) {
					const ascii = await convertImageToAscii(src);
					setForm((prev) => ({ ...prev, asciiArt: ascii, avatarMode: 'ascii' }));
					setMsg({
						text: 'Converted uploaded image to ASCII art! Click "Save Profile" to publish.',
						type: 'success',
					});
				}
			} catch {
				setMsg({ text: 'Error converting image file to ASCII.', type: 'error' });
			} finally {
				setIsConverting(false);
			}
		};
		reader.readAsDataURL(file);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setMsg(null);
		startTransition(async () => {
			try {
				await persistProfile(form);
				setMsg({ text: 'Profile changes successfully published.', type: 'success' });
			} catch {
				setMsg({ text: 'Failed to save profile changes.', type: 'error' });
			}
		});
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-8 font-mono">
			<div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface0/80 pb-5">
				<div className="flex items-center gap-2">
					<UserCheck className="w-5 h-5 text-accent" />
					<span className="text-xs font-bold uppercase tracking-wider text-text">
						Profile Configuration
					</span>
				</div>

				<div className="flex items-center gap-3">
					{msg && (
						<span
							className={`text-xs px-3 py-1 rounded-lg border font-semibold flex items-center gap-1.5 ${
								msg.type === 'success'
									? 'border-green/40 bg-green/10 text-green'
									: 'border-red/40 bg-red/10 text-red'
							}`}
						>
							{msg.type === 'success' ? <Check className="w-3.5 h-3.5" /> : null}
							<span>{msg.text}</span>
						</span>
					)}

					<button
						type="submit"
						disabled={isPending || isSavingImage}
						className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-fg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-accent/10"
					>
						{isPending ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>Saving…</span>
							</>
						) : (
							<>
								<Save className="w-4 h-4" />
								<span>Save Profile</span>
							</>
						)}
					</button>
				</div>
			</div>

			<div className="space-y-4">
				<h3 className="text-xs font-bold uppercase tracking-widest text-accent">
					1. Core Identity & Contact
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<Field id="name" label="Display Name">
						<input
							id="name"
							name="name"
							value={form.name}
							onChange={handleChange}
							className="admin-input-modern"
						/>
					</Field>

					<Field id="location" label="Location">
						<input
							id="location"
							name="location"
							value={form.location}
							onChange={handleChange}
							className="admin-input-modern"
						/>
					</Field>

					<Field id="email" label="Primary Email">
						<input
							id="email"
							name="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							className="admin-input-modern"
						/>
					</Field>

					<Field id="tagline" label="Short Tagline">
						<input
							id="tagline"
							name="tagline"
							value={form.tagline}
							onChange={handleChange}
							className="admin-input-modern"
						/>
					</Field>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xs font-bold uppercase tracking-widest text-accent">
						2. Bio & Summary Narrative
					</h3>
					<span className="text-[11px] text-subtext0">{form.summary.length} characters</span>
				</div>
				<Field id="summary" label="Public Summary (Used on Home & OG Meta)">
					<textarea
						id="summary"
						name="summary"
						value={form.summary}
						onChange={handleChange}
						rows={4}
						className="admin-input-modern leading-relaxed"
					/>
				</Field>
			</div>

			<div className="space-y-4">
				<h3 className="text-xs font-bold uppercase tracking-widest text-accent">
					3. Social Profiles & Networks
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<Field id="github" label="GitHub Profile URL">
						<input
							id="github"
							name="github"
							value={form.github}
							onChange={handleChange}
							className="admin-input-modern"
						/>
					</Field>

					<Field id="linkedin" label="LinkedIn Profile URL">
						<input
							id="linkedin"
							name="linkedin"
							value={form.linkedin}
							onChange={handleChange}
							className="admin-input-modern"
						/>
					</Field>
				</div>
			</div>

			<div className="space-y-4">
				<h3 className="text-xs font-bold uppercase tracking-widest text-accent">
					4. Resume Document & PDF Storage
				</h3>
				<div className="rounded-xl border border-surface0 bg-base/40 p-5 space-y-4">
					<Field id="resume" label="Direct Resume Link or Upload New PDF">
						<div className="flex flex-col sm:flex-row gap-3 items-stretch">
							<input
								id="resume"
								name="resume"
								value={form.resume}
								onChange={handleChange}
								className="admin-input-modern flex-1"
							/>
							{form.resume && (
								<a
									href={form.resume}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-surface1 bg-surface0/60 text-xs font-bold text-text hover:text-accent hover:border-accent transition-all shrink-0"
								>
									<FileText className="w-3.5 h-3.5" />
									<span>Preview PDF</span>
									<ExternalLink className="w-3 h-3" />
								</a>
							)}
						</div>
					</Field>

					<div className="pt-2">
						<span className="text-[11px] text-subtext0 uppercase tracking-wider block mb-2 font-semibold">
							Upload PDF to Cloud Storage
						</span>
						<FileUpload
							onUploadSuccess={handleResumeUploadSuccess}
							accept="application/pdf"
							label="Upload Resume PDF"
							helperText="Select a PDF to store in Supabase portfolio_media bucket"
						/>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h3 className="text-xs font-bold uppercase tracking-widest text-accent">
							5. Avatar Presentation & Media (ASCII Art vs Photo)
						</h3>
						<p className="text-[11px] text-subtext0 mt-0.5">
							Sync whether your hero portrait displays custom ASCII text art or an uploaded photo.
						</p>
					</div>

					{/* Dual-Mode Selector Tabs */}
					<div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface0/70 border border-surface1">
						<button
							type="button"
							onClick={() => setForm((prev) => ({ ...prev, avatarMode: 'ascii' }))}
							className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
								form.avatarMode === 'ascii'
									? 'bg-accent text-accent-fg shadow-sm'
									: 'text-subtext0 hover:text-text'
							}`}
						>
							<Terminal className="w-3.5 h-3.5" />
							<span>ASCII Art Mode</span>
						</button>
						<button
							type="button"
							onClick={() => setForm((prev) => ({ ...prev, avatarMode: 'photo' }))}
							className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
								form.avatarMode === 'photo'
									? 'bg-accent text-accent-fg shadow-sm'
									: 'text-subtext0 hover:text-text'
							}`}
						>
							<ImageIcon className="w-3.5 h-3.5" />
							<span>Uploaded Photo Mode</span>
						</button>
					</div>
				</div>

				{/* Active Mode Notification Bar */}
				<div className="rounded-xl border border-surface0/80 bg-mantle/70 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
					<div className="flex items-center gap-2">
						<span className="w-2 h-2 rounded-full bg-green animate-pulse" />
						<span className="text-subtext0">Active presentation on Home:</span>
						<span className="text-accent font-bold uppercase">
							{form.avatarMode === 'ascii' ? 'ASCII Text Art' : 'Uploaded Photo'}
						</span>
					</div>
					<span className="text-[11px] text-subtext1">
						Visitors can also toggle between both formats on the hero
					</span>
				</div>

				{/* ASCII Art Workspace (Visible in ASCII Mode) */}
				{form.avatarMode === 'ascii' && (
					<div className="rounded-xl border border-surface0 bg-base/40 p-5 space-y-5">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Live Visual ASCII Preview */}
							<div className="space-y-2">
								<div className="flex items-center justify-between text-[11px]">
									<span className="text-subtext0 font-semibold uppercase flex items-center gap-1.5">
										<Terminal className="w-3.5 h-3.5 text-accent" />
										<span>Live ASCII Portrait Preview</span>
									</span>
									<span className="text-[10px] text-accent font-mono">Theme Reactive</span>
								</div>

								<div className="h-64 rounded-xl border border-surface1/70 bg-mantle p-3 overflow-hidden relative flex items-center justify-center shadow-inner">
									<div className="absolute top-2 left-2 flex items-center gap-1.5">
										<span className="w-2 h-2 rounded-full bg-red/80" />
										<span className="w-2 h-2 rounded-full bg-yellow/80" />
										<span className="w-2 h-2 rounded-full bg-green/80" />
										<span className="text-[9.5px] text-subtext1 font-mono ml-1">
											ascii_hero.art
										</span>
									</div>
									<pre
										className="font-mono text-accent whitespace-pre select-none pointer-events-none mt-2"
										style={{
											fontFamily: '"JetBrains Mono", "Courier New", Courier, monospace',
											fontSize: '2.5px',
											lineHeight: '1.05',
											letterSpacing: '0em',
											opacity: 0.85,
										}}
									>
										{currentAscii}
									</pre>
								</div>
							</div>

							{/* ASCII Customization & Actions */}
							<div className="space-y-3 flex flex-col justify-between">
								<div className="space-y-2">
									<div className="flex items-center justify-between text-[11px]">
										<span className="text-subtext0 font-semibold uppercase">
											Custom ASCII Art Characters:
										</span>
										<span className="text-subtext1">
											{(form.asciiArt || DEFAULT_ASCII_PORTRAIT).split('\n').length} lines •{' '}
											{(form.asciiArt || DEFAULT_ASCII_PORTRAIT).length} chars
										</span>
									</div>
									<textarea
										name="asciiArt"
										value={form.asciiArt}
										placeholder="Leave blank to use default portrait, or paste custom ASCII art text..."
										onChange={handleChange}
										rows={7}
										className="admin-input-modern font-mono text-[10px] leading-tight"
									/>
								</div>

								<div className="flex flex-wrap items-center gap-2 pt-1">
									<button
										type="button"
										onClick={handleResetAscii}
										className="cursor-pointer rounded-lg border border-surface1 bg-surface0/60 px-3 py-1.5 text-[11px] font-bold text-subtext0 hover:text-text hover:border-accent transition-all flex items-center gap-1.5"
									>
										<RotateCcw className="w-3.5 h-3.5" />
										<span>Reset to Default</span>
									</button>

									{form.image && (
										<button
											type="button"
											onClick={handleConvertPhotoToAscii}
											disabled={isConverting}
											className="cursor-pointer rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-[11px] font-bold text-accent hover:bg-accent/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
										>
											{isConverting ? (
												<Loader2 className="w-3.5 h-3.5 animate-spin" />
											) : (
												<Sparkles className="w-3.5 h-3.5" />
											)}
											<span>Convert Stored Photo to ASCII</span>
										</button>
									)}

									<label className="cursor-pointer rounded-lg border border-surface1 bg-surface0/60 px-3 py-1.5 text-[11px] font-bold text-subtext0 hover:text-text hover:border-accent transition-all flex items-center gap-1.5">
										<Camera className="w-3.5 h-3.5" />
										<span>Convert Any Image File…</span>
										<input
											type="file"
											accept="image/*"
											onChange={handleFileToAscii}
											className="hidden"
										/>
									</label>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Uploaded Photo Workspace */}
				<div
					className={`rounded-xl border border-surface0 bg-base/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${
						form.avatarMode === 'photo' ? 'ring-2 ring-accent/60 bg-accent/5' : ''
					}`}
				>
					<div className="flex items-center gap-4">
						<div className="w-20 h-20 rounded-xl bg-surface0 border border-surface1 overflow-hidden relative shadow-inner shrink-0">
							{form.image ? (
								<div className="relative w-full h-full" style={previewStyle}>
									<Image
										src={form.image}
										alt="Profile Preview"
										fill
										unoptimized
										className="object-cover"
										style={{
											objectPosition: previewCrop
												? '50% 50%'
												: `${form.imageFocusX}% ${form.imageFocusY}%`,
										}}
									/>
								</div>
							) : (
								<div className="w-full h-full flex items-center justify-center text-[10px] text-subtext0">
									No Photo
								</div>
							)}
						</div>

						<div className="space-y-1 text-left">
							<div className="flex items-center gap-2">
								<p className="text-xs font-bold text-text">Stored High-Res Photo</p>
								{form.avatarMode === 'photo' && (
									<span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/20 text-accent border border-accent/30">
										Active on Home
									</span>
								)}
							</div>
							<p className="text-[11px] text-subtext0 font-sans max-w-sm">
								{form.avatarMode === 'photo'
									? 'Currently showcased as the primary portrait on the homepage hero.'
									: 'Used for OpenGraph, metadata preview cards, and visitor toggle view.'}
							</p>
						</div>
					</div>

					<div className="shrink-0 w-full sm:w-auto">
						<button
							type="button"
							onClick={openEditor}
							className="w-full sm:w-auto cursor-pointer rounded-xl border border-surface1 bg-surface0/60 px-4 py-2 text-xs font-bold text-text hover:text-accent hover:border-accent transition-all"
						>
							Upload / Crop Photo
						</button>
						<ImageEditorModal
							isOpen={isEditorOpen}
							initialUrl={form.image}
							initialMeta={{
								x: Number(form.imageFocusX),
								y: Number(form.imageFocusY),
								scale: Number(form.imageScale),
								crop: form.imageCrop ? JSON.parse(String(form.imageCrop)) : undefined,
							}}
							onClose={closeEditor}
							onSave={handleEditorSave}
						/>
					</div>
				</div>
			</div>
		</form>
	);
}

function Field({ id, label, children }: { id?: string; label: string; children: React.ReactNode }) {
	return (
		<div className="space-y-1.5 text-left">
			<label
				htmlFor={id}
				className="block text-[11px] font-bold uppercase tracking-wider text-subtext0"
			>
				{label}
			</label>
			{children}
		</div>
	);
}

/**
 * Client-side helper that renders an image onto a hidden canvas,
 * downscales, and maps luminance to ASCII density characters.
 */
function convertImageToAscii(imageSrc: string, width = 110): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new window.Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const aspectRatio = img.height / img.width;
			const height = Math.max(10, Math.round(width * aspectRatio * 0.46));
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');
			if (!ctx) return reject(new Error('Canvas context unavailable'));
			ctx.drawImage(img, 0, 0, width, height);
			const imgData = ctx.getImageData(0, 0, width, height).data;
			const charset = ' .:-=+*#%@';
			let ascii = '';
			for (let y = 0; y < height; y++) {
				let line = '';
				for (let x = 0; x < width; x++) {
					const idx = (y * width + x) * 4;
					const r = imgData[idx];
					const g = imgData[idx + 1];
					const b = imgData[idx + 2];
					const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
					const charIndex = Math.min(charset.length - 1, Math.floor(brightness * charset.length));
					line += charset[charIndex];
				}
				ascii += `${line}\n`;
			}
			resolve(ascii);
		};
		img.onerror = (e) => reject(e);
		img.src = imageSrc;
	});
}
