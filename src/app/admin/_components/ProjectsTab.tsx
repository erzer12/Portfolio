'use client';

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	Check,
	Edit3,
	ExternalLink,
	FolderGit2,
	GripVertical,
	Loader2,
	Plus,
	Save,
	Star,
	Trash2,
	X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';
import {
	deleteProjectAction,
	fetchGithubRepoAction,
	saveProjectAction,
	updateProjectsOrderAction,
} from '@/app/actions';
import { FileUpload } from '@/components/ui/FileUpload';
import type { Project } from '@/types';

type Props = { projects: Project[] };

const EMPTY: Partial<Project> = {
	title: '',
	slug: '',
	description: '',
	long_description: '',
	image: '',
	tags: [],
	github: '',
	live: '',
	category: '',
	date: '',
	featured: false,
	order: 0,
};

function SortableProjectItem({
	p,
	onEdit,
	onDelete,
}: {
	p: Project;
	onEdit: (p: Project) => void;
	onDelete: (id: string) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: p.id });
	const style = { transform: CSS.Transform.toString(transform), transition };

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-surface0 bg-base/50 p-4 hover:border-surface1 hover:bg-base/80 transition-all group"
		>
			<div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
				<div
					{...attributes}
					{...listeners}
					className="cursor-grab text-surface2 group-hover:text-accent active:cursor-grabbing p-1 -ml-1 rounded transition-colors"
					title="Drag to reorder"
				>
					<GripVertical className="w-4 h-4" />
				</div>

				{/* Thumbnail preview */}
				<div className="w-12 h-12 rounded-lg bg-surface0 border border-surface1 overflow-hidden shrink-0 relative flex items-center justify-center">
					{p.image ? (
						<Image src={p.image} alt={p.title} fill unoptimized className="object-cover" />
					) : (
						<FolderGit2 className="w-5 h-5 text-subtext0/50" />
					)}
				</div>

				<div className="flex-1 min-w-0 space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<h4 className="text-sm font-bold text-text truncate">{p.title}</h4>
						{p.featured && (
							<span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 rounded-full">
								<Star className="w-3 h-3 fill-accent text-accent" />
								Featured
							</span>
						)}
						{p.category && (
							<span className="text-[10px] font-mono text-subtext0 bg-surface0 px-2 py-0.5 rounded-md">
								{p.category}
							</span>
						)}
					</div>

					<p className="text-xs text-subtext0 font-sans line-clamp-1">{p.description}</p>

					<div className="flex flex-wrap items-center gap-2 text-[11px] text-subtext0/70 font-mono pt-0.5">
						<span className="text-accent">/{p.slug}</span>
						{p.date && <span>• {p.date}</span>}
						{p.tags && p.tags.length > 0 && (
							<span>
								• {p.tags.slice(0, 3).join(', ')}
								{p.tags.length > 3 ? '...' : ''}
							</span>
						)}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-2 self-end sm:self-center shrink-0">
				{p.slug && (
					<a
						href={`/projects/${p.slug}`}
						target="_blank"
						rel="noreferrer"
						className="p-2 rounded-lg border border-surface0 hover:border-accent text-subtext0 hover:text-accent hover:bg-surface0/30 transition-colors"
						title="View public page"
					>
						<ExternalLink className="w-3.5 h-3.5" />
					</a>
				)}
				<button
					type="button"
					onClick={() => onEdit(p)}
					className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface1 bg-surface0/60 text-xs font-bold text-text hover:text-accent hover:border-accent transition-all"
				>
					<Edit3 className="w-3.5 h-3.5" />
					<span>Edit</span>
				</button>
				<button
					type="button"
					onClick={() => onDelete(p.id)}
					className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red/30 bg-red/10 text-xs font-bold text-red hover:bg-red/20 transition-all"
				>
					<Trash2 className="w-3.5 h-3.5" />
					<span>Delete</span>
				</button>
			</div>
		</div>
	);
}

export function ProjectsTab({ projects }: Props) {
	const [items, setItems] = useState(projects);
	const [editing, setEditing] = useState<Partial<Project> | null>(null);
	const [isPending, startTransition] = useTransition();
	const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
	const [githubUrl, setGithubUrl] = useState('');
	const [isFetchingGithub, setIsFetchingGithub] = useState(false);
	const [tagInput, setTagInput] = useState('');

	useEffect(() => {
		setItems(projects);
	}, [projects]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			const oldIndex = items.findIndex((i) => i.id === active.id);
			const newIndex = items.findIndex((i) => i.id === over.id);
			const newItems = arrayMove(items, oldIndex, newIndex);
			setItems(newItems);

			const updates = newItems.map((item, index) => ({ id: item.id, order: index }));
			startTransition(() => {
				updateProjectsOrderAction(updates);
			});
		}
	}

	function handleEdit(p: Project) {
		setEditing({ ...p });
		setMsg(null);
	}

	function handleNew() {
		setEditing({ ...EMPTY, order: items.length });
		setMsg(null);
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value, type } = e.target;
		setEditing((prev) =>
			prev
				? {
						...prev,
						[name]:
							type === 'checkbox'
								? (e.target as HTMLInputElement).checked
								: name === 'order'
									? Number(value)
									: value,
					}
				: prev,
		);
	}

	function handleAddTag() {
		const clean = tagInput.trim();
		if (!clean || !editing) return;
		const currentTags = editing.tags || [];
		if (!currentTags.includes(clean)) {
			setEditing({ ...editing, tags: [...currentTags, clean] });
		}
		setTagInput('');
	}

	function handleRemoveTag(tagToRemove: string) {
		if (!editing) return;
		setEditing({
			...editing,
			tags: (editing.tags || []).filter((t) => t !== tagToRemove),
		});
	}

	function handleImageUpload(url: string) {
		setEditing((prev) => (prev ? { ...prev, image: url } : prev));
		setMsg({ text: 'Cover image uploaded and attached to project.', type: 'success' });
	}

	async function handleGithubImport() {
		if (!githubUrl) return;
		setIsFetchingGithub(true);
		setMsg(null);
		try {
			const data = await fetchGithubRepoAction(githubUrl);
			setEditing((prev) =>
				prev
					? {
							...prev,
							title: prev.title || data.title,
							slug: prev.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
							description: prev.description || data.description,
							github: githubUrl,
							tags: prev.tags?.length
								? prev.tags
								: [data.language, ...(data.tags || [])].filter(Boolean),
						}
					: prev,
			);
			setGithubUrl('');
			setMsg({ text: `Imported repository metadata from GitHub!`, type: 'success' });
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to import from GitHub';
			setMsg({ text: errorMessage, type: 'error' });
		} finally {
			setIsFetchingGithub(false);
		}
	}

	function handleSave(e: React.FormEvent) {
		e.preventDefault();
		if (!editing) return;
		setMsg(null);
		startTransition(async () => {
			try {
				await saveProjectAction(editing);
				setMsg({ text: 'Project saved successfully and published.', type: 'success' });
				setEditing(null);
			} catch {
				setMsg({ text: 'Failed to save project.', type: 'error' });
			}
		});
	}

	function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this project?')) return;
		startTransition(async () => {
			await deleteProjectAction(id);
			setMsg({ text: 'Project deleted.', type: 'success' });
		});
	}

	return (
		<div className="space-y-8 font-mono">
			{/* Top Bar: Actions & GitHub Import */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface0/80 pb-5">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={handleNew}
						className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-fg hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-accent/10"
					>
						<Plus className="w-4 h-4" />
						<span>New Project</span>
					</button>

					<span className="text-xs text-subtext0">
						{items.length} {items.length === 1 ? 'project' : 'projects'} listed
					</span>
				</div>

				{/* GitHub Fast Import Box */}
				<div className="flex items-center gap-2">
					<div className="relative flex-1 sm:w-64">
						<input
							value={githubUrl}
							onChange={(e) => setGithubUrl(e.target.value)}
							placeholder="https://github.com/org/repo"
							className="admin-input-modern text-xs py-2 pl-8"
						/>
						<FolderGit2 className="w-3.5 h-3.5 text-subtext0 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
					</div>
					<button
						type="button"
						onClick={handleGithubImport}
						disabled={isFetchingGithub || !githubUrl}
						className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-surface1 bg-surface0/60 text-xs font-bold text-text hover:text-accent hover:border-accent transition-all disabled:opacity-50 shrink-0"
					>
						{isFetchingGithub ? (
							<Loader2 className="w-3.5 h-3.5 animate-spin" />
						) : (
							<span>Import</span>
						)}
					</button>
				</div>
			</div>

			{/* Status Banner */}
			{msg && (
				<div
					className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold ${
						msg.type === 'success'
							? 'border-green/40 bg-green/10 text-green'
							: 'border-red/40 bg-red/10 text-red'
					}`}
				>
					{msg.type === 'success' ? <Check className="w-4 h-4" /> : null}
					<span>{msg.text}</span>
				</div>
			)}

			{/* Project Editor Form Modal / Drawer */}
			{editing && (
				<form
					onSubmit={handleSave}
					className="rounded-2xl border border-accent/40 bg-base/80 p-6 space-y-6 shadow-2xl relative"
				>
					<div className="flex items-center justify-between border-b border-surface0/80 pb-4">
						<div className="flex items-center gap-2">
							<FolderGit2 className="w-5 h-5 text-accent" />
							<h3 className="text-sm font-bold text-text uppercase tracking-wider">
								{editing.id ? 'Edit Project' : 'Create New Project'}
							</h3>
						</div>
						<button
							type="button"
							onClick={() => setEditing(null)}
							className="p-1 rounded-lg text-subtext0 hover:text-text hover:bg-surface0"
						>
							<X className="w-4 h-4" />
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<FormField id="proj-title" label="Project Title *">
							<input
								id="proj-title"
								name="title"
								required
								value={editing.title ?? ''}
								onChange={handleChange}
								placeholder="SignBridge AI"
								className="admin-input-modern"
							/>
						</FormField>

						<FormField id="proj-slug" label="URL Slug (e.g. /projects/slug) *">
							<input
								id="proj-slug"
								name="slug"
								required
								value={editing.slug ?? ''}
								onChange={handleChange}
								placeholder="signbridge-ai"
								className="admin-input-modern"
							/>
						</FormField>

						<FormField id="proj-category" label="Category">
							<input
								id="proj-category"
								name="category"
								value={editing.category ?? ''}
								onChange={handleChange}
								placeholder="AI / ML, Full Stack, Tool"
								className="admin-input-modern"
							/>
						</FormField>

						<FormField id="proj-date" label="Date / Timeline">
							<input
								id="proj-date"
								name="date"
								value={editing.date ?? ''}
								onChange={handleChange}
								placeholder="Jan 2025 – Present"
								className="admin-input-modern"
							/>
						</FormField>

						<FormField id="proj-github" label="GitHub Repository URL">
							<input
								id="proj-github"
								name="github"
								value={editing.github ?? ''}
								onChange={handleChange}
								placeholder="https://github.com/erzer12/..."
								className="admin-input-modern"
							/>
						</FormField>

						<FormField id="proj-live" label="Live Demo URL">
							<input
								id="proj-live"
								name="live"
								value={editing.live ?? ''}
								onChange={handleChange}
								placeholder="https://myproject.com"
								className="admin-input-modern"
							/>
						</FormField>
					</div>

					{/* Image Cover Upload */}
					<div className="space-y-2">
						<FormField id="proj-image" label="Project Cover Image URL">
							<div className="flex flex-col sm:flex-row gap-3">
								<input
									id="proj-image"
									name="image"
									value={editing.image ?? ''}
									onChange={handleChange}
									placeholder="https://... image URL"
									className="admin-input-modern flex-1"
								/>
								{editing.image && (
									<div className="w-12 h-10 rounded-lg overflow-hidden border border-surface1 relative shrink-0">
										<Image
											src={editing.image}
											alt="Thumbnail"
											fill
											unoptimized
											className="object-cover"
										/>
									</div>
								)}
							</div>
						</FormField>

						<div className="pt-1">
							<FileUpload
								onUploadSuccess={handleImageUpload}
								accept="image/*"
								label="Upload Cover Image"
								helperText="Drop an image file to upload directly to Supabase storage"
							/>
						</div>
					</div>

					{/* Short Description */}
					<FormField id="proj-desc" label="Short Summary (Homepage Spec Sheet Card)">
						<textarea
							id="proj-desc"
							name="description"
							value={editing.description ?? ''}
							onChange={handleChange}
							rows={2}
							placeholder="Brief one-to-two sentence explanation of what this project solves..."
							className="admin-input-modern leading-relaxed"
						/>
					</FormField>

					{/* Full Long Description */}
					<FormField id="proj-long-desc" label="Full Detailed Description (Dedicated Detail Page)">
						<textarea
							id="proj-long-desc"
							name="long_description"
							value={editing.long_description ?? ''}
							onChange={handleChange}
							rows={5}
							placeholder="In-depth breakdown of architecture, models used, engineering challenges, and results..."
							className="admin-input-modern leading-relaxed font-sans text-xs"
						/>
					</FormField>

					{/* Tag pills manager */}
					<div className="space-y-2">
						<label
							htmlFor="tag-input-field"
							className="block text-[11px] font-bold uppercase tracking-wider text-subtext0"
						>
							Technologies & Tags
						</label>
						<div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl border border-surface1 bg-base/60">
							{(editing.tags || []).map((tag) => (
								<span
									key={tag}
									className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface0 border border-surface1 text-xs font-mono text-text"
								>
									<span>{tag}</span>
									<button
										type="button"
										onClick={() => handleRemoveTag(tag)}
										className="text-subtext0 hover:text-red transition-colors"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							))}

							<div className="flex items-center gap-2 flex-1 min-w-[140px]">
								<input
									id="tag-input-field"
									value={tagInput}
									onChange={(e) => setTagInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											handleAddTag();
										}
									}}
									placeholder="Add tag and press Enter..."
									className="bg-transparent text-xs text-text placeholder:text-surface2 outline-none w-full"
								/>
								<button
									type="button"
									onClick={handleAddTag}
									className="text-[10px] uppercase font-bold text-accent hover:underline shrink-0"
								>
									Add
								</button>
							</div>
						</div>
					</div>

					{/* Featured checkbox */}
					<div className="flex items-center gap-3 p-3 rounded-xl border border-surface0 bg-surface0/30">
						<input
							id="proj-featured"
							name="featured"
							type="checkbox"
							checked={editing.featured ?? false}
							onChange={handleChange}
							className="w-4 h-4 rounded border-surface1 text-accent focus:ring-accent accent-accent cursor-pointer"
						/>
						<label
							htmlFor="proj-featured"
							className="text-xs text-text font-semibold cursor-pointer select-none"
						>
							Feature on Homepage Lab Spec Sheet Grid (Top priority)
						</label>
					</div>

					{/* Buttons */}
					<div className="flex items-center justify-end gap-3 pt-4 border-t border-surface0/80">
						<button
							type="button"
							onClick={() => setEditing(null)}
							className="cursor-pointer px-4 py-2 rounded-xl border border-surface1 text-xs font-bold text-subtext0 hover:text-text hover:bg-surface0 transition-all"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isPending}
							className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-accent-fg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
						>
							{isPending ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Save className="w-4 h-4" />
							)}
							<span>Save Project</span>
						</button>
					</div>
				</form>
			)}

			{/* Sortable List of Projects */}
			<div className="space-y-3">
				<p className="text-[11px] uppercase tracking-widest text-subtext0 font-semibold">
					Drag items to reorder priority on live site
				</p>
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
						<div className="space-y-2.5">
							{items.map((p) => (
								<SortableProjectItem key={p.id} p={p} onEdit={handleEdit} onDelete={handleDelete} />
							))}
							{items.length === 0 && (
								<div className="text-center p-8 rounded-xl border border-dashed border-surface1 text-subtext0 text-xs">
									No projects found. Click &quot;New Project&quot; above to create one.
								</div>
							)}
						</div>
					</SortableContext>
				</DndContext>
			</div>
		</div>
	);
}

function FormField({
	id,
	label,
	children,
}: {
	id: string;
	label: string;
	children: React.ReactNode;
}) {
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
