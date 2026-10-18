'use client';

import {
	Camera,
	Check,
	ChevronDown,
	ChevronUp,
	ExternalLink,
	FileText,
	ImageIcon,
	Loader2,
	Pencil,
	Plus,
	RotateCcw,
	Save,
	Sparkles,
	Terminal,
	Trash2,
	UserCheck,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { saveProfileAction } from '@/app/actions';
import { DEFAULT_AFFILIATIONS } from '@/components/resume/AffiliationRibbon';
import { DEFAULT_ASCII_PORTRAIT } from '@/components/ui/AsciiImage';
import { FileUpload } from '@/components/ui/FileUpload';
import { imageCropFrameStyle } from '@/lib/utils';
import type { Affiliation, Profile } from '@/types';

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

	const MAX_AFFILIATIONS = 3;

	const [affiliations, setAffiliations] = useState<Affiliation[]>(() => {
		if (profile?.social?.affiliations && Array.isArray(profile.social.affiliations)) {
			return profile.social.affiliations.slice(0, MAX_AFFILIATIONS);
		}
		return DEFAULT_AFFILIATIONS.slice(0, MAX_AFFILIATIONS);
	});

	const [isAddingAff, setIsAddingAff] = useState(false);
	const [editingAffId, setEditingAffId] = useState<string | null>(null);
	const [itemForm, setItemForm] = useState<Affiliation>({
		id: '',
		title: '',
		status: '',
		role: '',
		details: '',
		tags: [],
		logo_url: '',
		icon_svg: '',
		website: '',
		date_range: '',
	});
	const [tagsInput, setTagsInput] = useState('');

	function handleStartAddAff() {
		if (affiliations.length >= MAX_AFFILIATIONS) {
			setMsg({ text: 'Maximum of 3 affiliation badges allowed.', type: 'error' });
			return;
		}
		setEditingAffId(null);
		setIsAddingAff(true);
		setItemForm({
			id: `aff-${Date.now()}`,
			title: '',
			status: '',
			role: '',
			details: '',
			tags: [],
			logo_url: '',
			icon_svg: '',
			website: '',
			date_range: '',
		});
		setTagsInput('');
	}

	function handleEditAff(aff: Affiliation) {
		setIsAddingAff(false);
		setEditingAffId(aff.id);
		setItemForm({ ...aff });
		setTagsInput(aff.tags?.join(', ') || '');
	}

	function handleCancelAff() {
		setIsAddingAff(false);
		setEditingAffId(null);
	}

	function handleSaveAff() {
		if (!itemForm.title.trim()) return;
		if (!editingAffId && affiliations.length >= MAX_AFFILIATIONS) {
			setMsg({ text: 'Maximum of 3 affiliation badges allowed.', type: 'error' });
			return;
		}

		const parsedTags = tagsInput
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);

		const updatedItem: Affiliation = {
			...itemForm,
			title: itemForm.title.trim(),
			status: itemForm.status?.trim() || undefined,
			role: itemForm.role.trim(),
			details: itemForm.details.trim(),
			tags: parsedTags,
			logo_url: itemForm.logo_url?.trim() || undefined,
			icon_svg: itemForm.icon_svg?.trim() || undefined,
			website: itemForm.website?.trim() || undefined,
			date_range: itemForm.date_range?.trim() || undefined,
		};

		if (editingAffId) {
			setAffiliations((prev) =>
				prev.map((item) => (item.id === editingAffId ? updatedItem : item)),
			);
		} else {
			setAffiliations((prev) => [...prev, updatedItem].slice(0, MAX_AFFILIATIONS));
		}

		setIsAddingAff(false);
		setEditingAffId(null);
	}

	function handleDeleteAff(id: string) {
		setAffiliations((prev) => prev.filter((item) => item.id !== id));
		if (editingAffId === id) {
			setEditingAffId(null);
			setIsAddingAff(false);
		}
	}

	function handleMoveAff(index: number, direction: 'up' | 'down') {
		const targetIndex = direction === 'up' ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= affiliations.length) return;
		setAffiliations((prev) => {
			const copy = [...prev];
			const [moved] = copy.splice(index, 1);
			copy.splice(targetIndex, 0, moved);
			return copy;
		});
	}

	async function persistProfile(nextForm: typeof form, currentAffiliations = affiliations) {
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
				affiliations: currentAffiliations,
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
				await persistProfile(form, affiliations);
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
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div>
						<div className="flex items-center gap-2">
							<h3 className="text-xs font-bold uppercase tracking-widest text-accent">
								4. Key Affiliations & Ribbon Badges
							</h3>
							<span className="text-[10px] px-2 py-0.5 rounded-full bg-surface0 border border-surface1 text-accent font-mono font-semibold">
								{affiliations.length} / {MAX_AFFILIATIONS} Max
							</span>
						</div>
						<p className="text-[11px] text-subtext0 mt-0.5">
							Configure up to 3 badges shown in the hero ribbon with custom SVG icons or logos,
							titles, and popover content.
						</p>
					</div>

					{!isAddingAff && !editingAffId && (
						<button
							type="button"
							onClick={handleStartAddAff}
							disabled={affiliations.length >= MAX_AFFILIATIONS}
							className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface0 hover:bg-surface1 border border-surface1 hover:border-accent text-accent text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
						>
							<Plus className="w-3.5 h-3.5" />
							<span>
								{affiliations.length >= MAX_AFFILIATIONS
									? 'Max 3 Badges Reached'
									: 'Add Affiliation'}
							</span>
						</button>
					)}
				</div>

				{/* Affiliation Editor Form */}
				{(isAddingAff || editingAffId) && (
					<div className="rounded-xl border border-accent/40 bg-surface0/30 p-5 space-y-4 animate-in fade-in">
						<div className="flex items-center justify-between border-b border-surface0/80 pb-3">
							<span className="text-xs font-bold uppercase tracking-wider text-text">
								{editingAffId ? 'Edit Affiliation' : 'New Affiliation'}
							</span>
							<button
								type="button"
								onClick={handleCancelAff}
								className="text-subtext0 hover:text-text p-1 text-xs cursor-pointer"
								aria-label="Cancel editing"
							>
								✕
							</button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Field id="aff-title" label="Name / Organization (e.g. MuLearn)">
								<input
									id="aff-title"
									value={itemForm.title}
									onChange={(e) => setItemForm((prev) => ({ ...prev, title: e.target.value }))}
									placeholder="MuLearn"
									className="admin-input-modern"
								/>
							</Field>

							<Field id="aff-role" label="Role / Subtitle (e.g. Frontend Intern)">
								<input
									id="aff-role"
									value={itemForm.role}
									onChange={(e) => setItemForm((prev) => ({ ...prev, role: e.target.value }))}
									placeholder="Frontend Intern"
									className="admin-input-modern"
								/>
							</Field>

							<Field
								id="aff-status"
								label="Status Tag (e.g. Past, Current, Active — leave blank for active)"
							>
								<input
									id="aff-status"
									value={itemForm.status ?? ''}
									onChange={(e) => setItemForm((prev) => ({ ...prev, status: e.target.value }))}
									placeholder="Past or leave blank"
									className="admin-input-modern"
								/>
							</Field>

							<Field
								id="aff-date-range"
								label="Date Range (e.g. January 2026 – Present or Oct 2025)"
							>
								<input
									id="aff-date-range"
									value={itemForm.date_range ?? ''}
									onChange={(e) => setItemForm((prev) => ({ ...prev, date_range: e.target.value }))}
									placeholder="January 2026 – Present"
									className="admin-input-modern"
								/>
							</Field>

							<Field id="aff-website" label="Website URL (Optional, for click dialog)">
								<input
									id="aff-website"
									value={itemForm.website ?? ''}
									onChange={(e) => setItemForm((prev) => ({ ...prev, website: e.target.value }))}
									placeholder="https://mulearn.org"
									className="admin-input-modern"
								/>
							</Field>

							<Field id="aff-tags" label="Tags (comma-separated)">
								<input
									id="aff-tags"
									value={tagsInput}
									onChange={(e) => setTagsInput(e.target.value)}
									placeholder="Next.js, React, TypeScript"
									className="admin-input-modern"
								/>
							</Field>
						</div>

						{/* Icon SVG & Logo Input Options */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
							<Field
								id="aff-icon-svg"
								label="Icon SVG Code (Optional, paste raw <svg>...</svg> vector code)"
							>
								<div className="flex gap-2 items-start">
									<textarea
										id="aff-icon-svg"
										value={itemForm.icon_svg ?? ''}
										onChange={(e) => setItemForm((prev) => ({ ...prev, icon_svg: e.target.value }))}
										placeholder="<svg viewBox='0 0 24 24'>...</svg>"
										rows={2}
										className="admin-input-modern flex-1 font-mono text-xs"
									/>
									{itemForm.icon_svg?.trim().startsWith('<svg') && (
										<div
											className="w-10 h-10 rounded-lg bg-surface0 border border-surface1 flex items-center justify-center p-1.5 shrink-0 text-accent [&>svg]:w-full [&>svg]:h-full"
											// biome-ignore lint/security/noDangerouslySetInnerHtml: admin SVG preview
											dangerouslySetInnerHTML={{ __html: itemForm.icon_svg }}
										/>
									)}
								</div>
							</Field>

							<Field
								id="aff-logo"
								label="Or Logo Image URL / File Path (e.g. /logos/mulearn.svg or https://...)"
							>
								<div className="flex gap-2 items-center">
									<input
										id="aff-logo"
										value={itemForm.logo_url ?? ''}
										onChange={(e) => setItemForm((prev) => ({ ...prev, logo_url: e.target.value }))}
										placeholder="/logos/mulearn.svg or https://..."
										className="admin-input-modern flex-1"
									/>
									{itemForm.logo_url && (
										<div className="w-9 h-9 rounded bg-surface0 border border-surface1 flex items-center justify-center p-1 shrink-0">
											<Image
												src={itemForm.logo_url}
												alt="Logo preview"
												width={28}
												height={28}
												unoptimized
												className="max-h-7 max-w-7 object-contain"
											/>
										</div>
									)}
								</div>
							</Field>
						</div>

						<div className="pt-1">
							<p className="text-[11px] font-bold uppercase tracking-wider text-subtext0 mb-1.5">
								Or Upload Logo File (Optional)
							</p>
							<FileUpload
								onUploadSuccess={(url) => setItemForm((prev) => ({ ...prev, logo_url: url }))}
								label="Upload Logo File"
								helperText="SVG, PNG, or WebP logo file"
							/>
						</div>

						<Field id="aff-details" label="Content / Narrative (Shown in Click Popover)">
							<textarea
								id="aff-details"
								value={itemForm.details}
								onChange={(e) => setItemForm((prev) => ({ ...prev, details: e.target.value }))}
								placeholder="Describe responsibilities, contributions, and context..."
								rows={3}
								className="admin-input-modern leading-relaxed"
							/>
						</Field>

						<div className="flex items-center justify-end gap-2 pt-2">
							<button
								type="button"
								onClick={handleCancelAff}
								className="px-3.5 py-1.5 rounded-lg border border-surface1 hover:border-surface2 text-subtext0 text-xs font-semibold cursor-pointer"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleSaveAff}
								disabled={!itemForm.title.trim()}
								className="px-4 py-1.5 rounded-lg bg-accent text-accent-fg hover:brightness-110 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
							>
								{editingAffId ? 'Update Item' : 'Add to Ribbon'}
							</button>
						</div>
					</div>
				)}

				{/* Affiliation Items List */}
				<div className="space-y-2.5">
					{affiliations.length === 0 ? (
						<div className="p-6 rounded-xl border border-dashed border-surface1 bg-surface0/20 text-center text-subtext0 text-xs">
							No affiliations configured. Click &quot;Add Affiliation&quot; to create one.
						</div>
					) : (
						affiliations.map((aff, idx) => (
							<div
								key={aff.id}
								className="p-3.5 rounded-xl border border-surface0/80 bg-mantle hover:border-surface1 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
							>
								<div className="flex items-center gap-3">
									{aff.icon_svg?.trim().startsWith('<svg') ? (
										<div
											className="w-9 h-9 rounded-lg bg-surface0 border border-surface1 flex items-center justify-center p-1 shrink-0 text-accent [&>svg]:w-6 [&>svg]:h-6"
											// biome-ignore lint/security/noDangerouslySetInnerHtml: admin SVG thumbnail
											dangerouslySetInnerHTML={{ __html: aff.icon_svg }}
										/>
									) : aff.logo_url ? (
										<div className="w-9 h-9 rounded-lg bg-surface0 border border-surface1 flex items-center justify-center p-1 shrink-0">
											<Image
												src={aff.logo_url}
												alt={aff.title}
												width={28}
												height={28}
												unoptimized
												className="max-h-7 max-w-7 object-contain"
											/>
										</div>
									) : (
										<div className="w-9 h-9 rounded-lg bg-surface0 border border-surface1 flex items-center justify-center text-xs font-mono font-bold text-accent shrink-0">
											{aff.title.slice(0, 2).toUpperCase()}
										</div>
									)}
									<div>
										<div className="flex items-center gap-2">
											<span className="text-xs font-bold text-text">{aff.title}</span>
											{aff.status && (
												<span className="text-[10px] font-mono text-subtext1 px-1.5 py-0.5 rounded bg-surface0 border border-surface1/40">
													({aff.status})
												</span>
											)}
										</div>
										<p className="text-[11px] text-subtext0 font-sans line-clamp-1 mt-0.5">
											{aff.role} — {aff.details}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
									<button
										type="button"
										onClick={() => handleMoveAff(idx, 'up')}
										disabled={idx === 0}
										className="p-1.5 rounded-lg text-subtext1 hover:text-text hover:bg-surface0 disabled:opacity-30 transition-colors cursor-pointer"
										title="Move Up"
										aria-label="Move Up"
									>
										<ChevronUp className="w-3.5 h-3.5" />
									</button>
									<button
										type="button"
										onClick={() => handleMoveAff(idx, 'down')}
										disabled={idx === affiliations.length - 1}
										className="p-1.5 rounded-lg text-subtext1 hover:text-text hover:bg-surface0 disabled:opacity-30 transition-colors cursor-pointer"
										title="Move Down"
										aria-label="Move Down"
									>
										<ChevronDown className="w-3.5 h-3.5" />
									</button>
									<button
										type="button"
										onClick={() => handleEditAff(aff)}
										className="p-1.5 rounded-lg text-subtext1 hover:text-accent hover:bg-surface0 transition-colors cursor-pointer"
										title="Edit"
										aria-label="Edit"
									>
										<Pencil className="w-3.5 h-3.5" />
									</button>
									<button
										type="button"
										onClick={() => handleDeleteAff(aff.id)}
										className="p-1.5 rounded-lg text-subtext1 hover:text-red hover:bg-surface0 transition-colors cursor-pointer"
										title="Delete"
										aria-label="Delete"
									>
										<Trash2 className="w-3.5 h-3.5" />
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			<div className="space-y-4">
				<h3 className="text-xs font-bold uppercase tracking-widest text-accent">
					5. Resume Document & PDF Storage
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
							6. Avatar Presentation & Media (ASCII Art vs Photo)
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
