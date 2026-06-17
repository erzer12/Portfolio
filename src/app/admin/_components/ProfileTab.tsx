'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { saveProfileAction } from '@/app/actions';
import { FileUpload } from '@/components/ui/FileUpload';
import { imageCropFrameStyle } from '@/lib/utils';

const ImageEditorModal = dynamic(() => import('@/components/ui/ImageEditorModal'), { ssr: false });

import type { Profile } from '@/types';

type Props = { profile: Profile | null };

export function ProfileTab({ profile }: Props) {
	const [isPending, startTransition] = useTransition();
	const [isSavingImage, setIsSavingImage] = useState(false);
	const [msg, setMsg] = useState('');

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
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	}

	function handleResumeUploadSuccess(url: string) {
		setForm((prev) => ({ ...prev, resume: url }));
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
		setMsg('');
		try {
			await persistProfile(nextForm);
			setMsg('Image saved.');
		} catch {
			setMsg('Error saving image.');
		} finally {
			setIsSavingImage(false);
		}
	}

	const previewCrop = form.imageCrop ? JSON.parse(String(form.imageCrop)) : null;
	const previewStyle = imageCropFrameStyle(previewCrop);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setMsg('');
		startTransition(async () => {
			try {
				await persistProfile(form);
				setMsg('Saved.');
			} catch {
				setMsg('Error saving.');
			}
		});
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{[
				{ label: 'Name', name: 'name' },
				{ label: 'Tagline', name: 'tagline' },
				{ label: 'Location', name: 'location' },
				{ label: 'Email', name: 'email' },
				{ label: 'GitHub URL', name: 'github' },
				{ label: 'LinkedIn URL', name: 'linkedin' },
			].map(({ label, name }) => (
				/* Fixed: Added structural id link to fields */
				<Field key={name} id={name} label={label}>
					<input
						id={name}
						name={name}
						value={form[name as keyof typeof form]}
						onChange={handleChange}
						className="admin-input"
					/>
				</Field>
			))}

			<Field id="profile-image-upload-btn" label="Profile Image">
				<div className="flex gap-4 items-start">
					<input type="hidden" name="image" value={form.image} />
					<input type="hidden" name="imageFocusX" value={form.imageFocusX} />
					<input type="hidden" name="imageFocusY" value={form.imageFocusY} />
					<input type="hidden" name="imageScale" value={form.imageScale} />
					<input type="hidden" name="imageCrop" value={form.imageCrop} />

					<div className="flex-1 flex items-start gap-4">
						<div>
							<div className="w-20 h-20 bg-[--muted] border border-[--rule] rounded overflow-hidden">
								{form.image ? (
									<button
										id="profile-image-upload-btn"
										type="button"
										onClick={() => window.open(form.image || undefined, '_blank')}
										className="relative w-full h-full block overflow-hidden"
									>
										<span className="absolute block" style={previewStyle}>
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
										</span>
									</button>
								) : (
									<div className="w-full h-full flex items-center justify-center text-xs text-[--ink-muted]">
										No image
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="w-48 shrink-0">
						<button type="button" onClick={openEditor} className="admin-btn-sm w-full">
							Upload / Edit Image
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
			</Field>

			<Field id="resume" label="Resume Link or PDF">
				<div className="flex gap-4 items-start">
					<input
						id="resume"
						name="resume"
						value={form.resume}
						onChange={handleChange}
						placeholder="https://..."
						className="admin-input flex-1"
					/>
					<div className="w-48 shrink-0">
						<FileUpload
							onUploadSuccess={handleResumeUploadSuccess}
							accept="application/pdf,image/*"
							label="Upload PDF"
						/>
					</div>
				</div>
			</Field>

			<Field id="summary" label="Summary">
				<textarea
					id="summary"
					name="summary"
					value={form.summary}
					onChange={handleChange}
					rows={4}
					className="admin-input"
				/>
			</Field>

			<div className="flex items-center gap-4">
				<button type="submit" disabled={isPending || isSavingImage} className="admin-btn">
					{isPending ? 'Saving…' : isSavingImage ? 'Saving Image…' : 'Save Profile'}
				</button>
				{msg && <p className="font-mono text-xs text-[--ink-muted]">{msg}</p>}
			</div>
		</form>
	);
}

// Fixed: Configured Field wrapper component to support htmlFor labels
function Field({ id, label, children }: { id?: string; label: string; children: React.ReactNode }) {
	return (
		<div>
			<label
				htmlFor={id}
				className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]"
			>
				{label}
			</label>
			{children}
		</div>
	);
}
