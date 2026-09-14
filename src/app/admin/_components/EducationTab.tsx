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
	GraduationCap,
	GripVertical,
	Loader2,
	Plus,
	Save,
	Trash2,
	X,
} from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import {
	deleteEducationAction,
	saveEducationAction,
	updateEducationOrderAction,
} from '@/app/actions';
import type { Education } from '@/types';

type Props = { education: Education[] };

const EMPTY: Partial<Education> = {
	school: '',
	degree: '',
	year: '',
	description: '',
	order: 0,
};

function SortableEducationItem({
	edu,
	onEdit,
	onDelete,
}: {
	edu: Education;
	onEdit: (edu: Education) => void;
	onDelete: (id: string) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: edu.id });
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
					<GraduationCap className="w-5 h-5" />
				</div>

				<div className="flex-1 min-w-0 space-y-1">
					<h4 className="text-sm font-bold text-text truncate">{edu.school}</h4>
					<p className="text-xs text-subtext0 font-sans">
						<span className="font-semibold text-text">{edu.degree}</span>
						<span className="text-surface2 mx-1.5">•</span>
						<span>{edu.year}</span>
					</p>
					{edu.description && (
						<p className="text-[11px] text-subtext0/70 font-sans line-clamp-1">{edu.description}</p>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2 self-end sm:self-center shrink-0">
				<button
					type="button"
					onClick={() => onEdit(edu)}
					className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface1 bg-surface0/60 text-xs font-bold text-text hover:text-accent hover:border-accent transition-all"
				>
					<Edit3 className="w-3.5 h-3.5" />
					<span>Edit</span>
				</button>
				<button
					type="button"
					onClick={() => onDelete(edu.id)}
					className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red/30 bg-red/10 text-xs font-bold text-red hover:bg-red/20 transition-all"
				>
					<Trash2 className="w-3.5 h-3.5" />
					<span>Delete</span>
				</button>
			</div>
		</div>
	);
}

export function EducationTab({ education }: Props) {
	const [items, setItems] = useState(education);
	const [editing, setEditing] = useState<Partial<Education> | null>(null);
	const [isPending, startTransition] = useTransition();
	const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

	useEffect(() => {
		setItems(education);
	}, [education]);

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
				updateEducationOrderAction(updates);
			});
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		setEditing((prev) =>
			prev ? { ...prev, [name]: name === 'order' ? Number(value) : value } : prev,
		);
	}

	function handleSave(e: React.FormEvent) {
		e.preventDefault();
		if (!editing) return;
		setMsg(null);
		startTransition(async () => {
			try {
				await saveEducationAction(editing);
				setMsg({ text: 'Education saved and published.', type: 'success' });
				setEditing(null);
			} catch {
				setMsg({ text: 'Error saving education entry.', type: 'error' });
			}
		});
	}

	function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this education entry?')) return;
		startTransition(async () => {
			await deleteEducationAction(id);
			setMsg({ text: 'Education entry deleted.', type: 'success' });
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
						<span>New Education</span>
					</button>

					<span className="text-xs text-subtext0">
						{items.length} {items.length === 1 ? 'record' : 'records'} listed
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

			{/* Education Editor Form */}
			{editing && (
				<form
					onSubmit={handleSave}
					className="rounded-2xl border border-accent/40 bg-base/80 p-6 space-y-6 shadow-2xl relative"
				>
					<div className="flex items-center justify-between border-b border-surface0/80 pb-4">
						<div className="flex items-center gap-2">
							<GraduationCap className="w-5 h-5 text-accent" />
							<h3 className="text-sm font-bold text-text uppercase tracking-wider">
								{editing.id ? 'Edit Academic Entry' : 'Create Academic Entry'}
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
						<Field id="school" label="Institution / University *">
							<input
								id="school"
								name="school"
								required
								value={editing.school ?? ''}
								onChange={handleChange}
								placeholder="College of Engineering Kottarakkara"
								className="admin-input-modern"
							/>
						</Field>

						<Field id="degree" label="Degree / Program *">
							<input
								id="degree"
								name="degree"
								required
								value={editing.degree ?? ''}
								onChange={handleChange}
								placeholder="B.Tech in Computer Science and Engineering"
								className="admin-input-modern"
							/>
						</Field>

						<Field id="year" label="Academic Timeline / Year *">
							<input
								id="year"
								name="year"
								required
								value={editing.year ?? ''}
								onChange={handleChange}
								placeholder="2022 – 2026"
								className="admin-input-modern"
							/>
						</Field>
					</div>

					<Field id="description" label="Highlights & Relevant Coursework">
						<textarea
							id="description"
							name="description"
							value={editing.description ?? ''}
							onChange={handleChange}
							rows={3}
							placeholder="Specializing in Artificial Intelligence and Machine Learning..."
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
							<span>Save Education</span>
						</button>
					</div>
				</form>
			)}

			{/* Sortable List */}
			<div className="space-y-3">
				<p className="text-[11px] uppercase tracking-widest text-subtext0 font-semibold">
					Drag items to reorder priority
				</p>
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
						<div className="space-y-2.5">
							{items.map((edu) => (
								<SortableEducationItem
									key={edu.id}
									edu={edu}
									onEdit={(edu) => {
										setEditing(edu);
										setMsg(null);
									}}
									onDelete={handleDelete}
								/>
							))}
							{items.length === 0 && (
								<div className="text-center p-8 rounded-xl border border-dashed border-surface1 text-subtext0 text-xs">
									No education entries yet. Click &quot;New Education&quot; above.
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
