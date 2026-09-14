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
	Briefcase,
	Check,
	Edit3,
	ExternalLink,
	GripVertical,
	Loader2,
	Plus,
	Save,
	Trash2,
	X,
} from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import {
	deleteExperienceAction,
	saveExperienceAction,
	updateExperienceOrderAction,
} from '@/app/actions';
import type { Experience } from '@/types';

type Props = { experience: Experience[] };

const EMPTY: Partial<Experience> = {
	company: '',
	role: '',
	employment_type: '',
	start_date: '',
	end_date: '',
	description: '',
	bullets: [],
	tags: [],
	certificate_url: '',
	recommendation_url: '',
	repo_url: '',
	related_projects: [],
	order: 0,
};

function SortableExperienceItem({
	ex,
	onEdit,
	onDelete,
}: {
	ex: Experience;
	onEdit: (ex: Experience) => void;
	onDelete: (id: string) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ex.id });
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

				<div className="w-10 h-10 rounded-lg bg-surface0 border border-surface1 flex items-center justify-center text-accent shrink-0">
					<Briefcase className="w-5 h-5" />
				</div>

				<div className="flex-1 min-w-0 space-y-1">
					<div className="flex flex-wrap items-center gap-2">
						<h4 className="text-sm font-bold text-text truncate">{ex.company}</h4>
						{ex.employment_type && (
							<span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
								{ex.employment_type}
							</span>
						)}
					</div>

					<p className="text-xs text-subtext0 font-sans">
						<span className="font-semibold text-text">{ex.role}</span>
						<span className="text-surface2 mx-1.5">•</span>
						<span>
							{ex.start_date} – {ex.end_date || 'Present'}
						</span>
					</p>

					{ex.bullets && ex.bullets.length > 0 && (
						<p className="text-[11px] text-subtext0/70 font-sans line-clamp-1">{ex.bullets[0]}</p>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2 self-end sm:self-center shrink-0">
				{ex.certificate_url && (
					<a
						href={ex.certificate_url}
						target="_blank"
						rel="noreferrer"
						className="p-2 rounded-lg border border-surface0 hover:border-accent text-subtext0 hover:text-accent hover:bg-surface0/30 transition-colors"
						title="Certificate"
					>
						<ExternalLink className="w-3.5 h-3.5" />
					</a>
				)}
				<button
					type="button"
					onClick={() => onEdit(ex)}
					className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface1 bg-surface0/60 text-xs font-bold text-text hover:text-accent hover:border-accent transition-all"
				>
					<Edit3 className="w-3.5 h-3.5" />
					<span>Edit</span>
				</button>
				<button
					type="button"
					onClick={() => onDelete(ex.id)}
					className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red/30 bg-red/10 text-xs font-bold text-red hover:bg-red/20 transition-all"
				>
					<Trash2 className="w-3.5 h-3.5" />
					<span>Delete</span>
				</button>
			</div>
		</div>
	);
}

export function ExperienceTab({ experience }: Props) {
	const [items, setItems] = useState(experience);
	const [editing, setEditing] = useState<Partial<Experience> | null>(null);
	const [isPending, startTransition] = useTransition();
	const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

	useEffect(() => {
		setItems(experience);
	}, [experience]);

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
				updateExperienceOrderAction(updates);
			});
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		setEditing((prev) =>
			prev
				? {
						...prev,
						[name]:
							name === 'bullets' || name === 'tags' || name === 'related_projects'
								? value
										.split('\n')
										.map((v) => v.trim())
										.filter(Boolean)
								: name === 'order'
									? Number(value)
									: value,
					}
				: prev,
		);
	}

	function handleSave(e: React.FormEvent) {
		e.preventDefault();
		if (!editing) return;
		setMsg(null);
		startTransition(async () => {
			try {
				await saveExperienceAction(editing);
				setMsg({ text: 'Experience saved and published successfully.', type: 'success' });
				setEditing(null);
			} catch {
				setMsg({ text: 'Error saving experience.', type: 'error' });
			}
		});
	}

	function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this experience position?')) return;
		startTransition(async () => {
			await deleteExperienceAction(id);
			setMsg({ text: 'Position deleted.', type: 'success' });
		});
	}

	return (
		<div className="space-y-8 font-mono">
			{/* Top action header */}
			<div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface0/80 pb-5">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => {
							setEditing({ ...EMPTY, order: items.length });
							setMsg(null);
						}}
						className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-accent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-accent-fg hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-accent/10"
					>
						<Plus className="w-4 h-4" />
						<span>New Position</span>
					</button>

					<span className="text-xs text-subtext0">
						{items.length} {items.length === 1 ? 'position' : 'positions'} recorded
					</span>
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

			{/* Experience Editor Form */}
			{editing && (
				<form
					onSubmit={handleSave}
					className="rounded-2xl border border-accent/40 bg-base/80 p-6 space-y-6 shadow-2xl relative"
				>
					<div className="flex items-center justify-between border-b border-surface0/80 pb-4">
						<div className="flex items-center gap-2">
							<Briefcase className="w-5 h-5 text-accent" />
							<h3 className="text-sm font-bold text-text uppercase tracking-wider">
								{editing.id ? 'Edit Experience Position' : 'Create New Position'}
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
						<Field id="company" label="Organization / Company *">
							<input
								id="company"
								name="company"
								required
								value={editing.company ?? ''}
								onChange={handleChange}
								placeholder="GTech MuLearn"
								className="admin-input-modern"
							/>
						</Field>

						<Field id="role" label="Role / Title *">
							<input
								id="role"
								name="role"
								required
								value={editing.role ?? ''}
								onChange={handleChange}
								placeholder="Frontend Engineer Intern"
								className="admin-input-modern"
							/>
						</Field>

						<Field id="employment_type" label="Employment Type">
							<input
								id="employment_type"
								name="employment_type"
								value={editing.employment_type ?? ''}
								onChange={handleChange}
								placeholder="Internship, Full-time, Remote, Hybrid"
								className="admin-input-modern"
							/>
						</Field>

						<div className="grid grid-cols-2 gap-3">
							<Field id="start_date" label="Start Date *">
								<input
									id="start_date"
									name="start_date"
									required
									value={editing.start_date ?? ''}
									onChange={handleChange}
									placeholder="Jun 2024"
									className="admin-input-modern"
								/>
							</Field>

							<Field id="end_date" label="End Date">
								<input
									id="end_date"
									name="end_date"
									value={editing.end_date ?? ''}
									onChange={handleChange}
									placeholder="Present (or date)"
									className="admin-input-modern"
								/>
							</Field>
						</div>

						<Field id="repo_url" label="Project / Internship Repo URL">
							<input
								id="repo_url"
								name="repo_url"
								value={editing.repo_url ?? ''}
								onChange={handleChange}
								placeholder="https://github.com/..."
								className="admin-input-modern"
							/>
						</Field>

						<Field id="certificate_url" label="Certificate / Letter URL">
							<input
								id="certificate_url"
								name="certificate_url"
								value={editing.certificate_url ?? ''}
								onChange={handleChange}
								placeholder="https://..."
								className="admin-input-modern"
							/>
						</Field>
					</div>

					<Field id="bullets" label="Key Achievements & Responsibilities (One per line)">
						<textarea
							id="bullets"
							name="bullets"
							value={(editing.bullets ?? []).join('\n')}
							onChange={handleChange}
							rows={4}
							placeholder="Engineered interactive Discord bots for community onboarding&#10;Contributed to MuLearn frontend platform with 60k+ active users"
							className="admin-input-modern leading-relaxed"
						/>
					</Field>

					<Field id="tags" label="Technologies Used (One per line)">
						<textarea
							id="tags"
							name="tags"
							value={(editing.tags ?? []).join('\n')}
							onChange={handleChange}
							rows={2}
							placeholder="Next.js&#10;TypeScript&#10;TailwindCSS"
							className="admin-input-modern leading-relaxed"
						/>
					</Field>

					<Field id="related_projects" label="Related Project Slugs (One per line)">
						<textarea
							id="related_projects"
							name="related_projects"
							value={(editing.related_projects ?? []).join('\n')}
							onChange={handleChange}
							rows={2}
							placeholder="signbridge-ai"
							className="admin-input-modern leading-relaxed"
						/>
					</Field>

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
							<span>Save Position</span>
						</button>
					</div>
				</form>
			)}

			{/* Sortable List of Experiences */}
			<div className="space-y-3">
				<p className="text-[11px] uppercase tracking-widest text-subtext0 font-semibold">
					Drag items to order chronological seniority
				</p>
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
						<div className="space-y-2.5">
							{items.map((ex) => (
								<SortableExperienceItem
									key={ex.id}
									ex={ex}
									onEdit={(ex) => {
										setEditing(ex);
										setMsg(null);
									}}
									onDelete={handleDelete}
								/>
							))}
							{items.length === 0 && (
								<div className="text-center p-8 rounded-xl border border-dashed border-surface1 text-subtext0 text-xs">
									No experience entries yet. Click &quot;New Position&quot; above.
								</div>
							)}
						</div>
					</SortableContext>
				</DndContext>
			</div>
		</div>
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
