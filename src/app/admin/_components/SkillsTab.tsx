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
import { Check, Code2, Edit3, GripVertical, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { deleteSkillAction, saveSkillAction, updateSkillsOrderAction } from '@/app/actions';
import type { Skill } from '@/types';

type Props = { skills: Skill[] };

const EMPTY: Partial<Skill> = {
	category: '',
	skills: [],
	order: 0,
};

function SortableSkillItem({
	s,
	onEdit,
	onDelete,
}: {
	s: Skill;
	onEdit: (s: Skill) => void;
	onDelete: (id: string) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: s.id });
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
					<Code2 className="w-5 h-5" />
				</div>

				<div className="flex-1 min-w-0 space-y-2">
					<div className="flex items-center gap-2">
						<h4 className="text-sm font-bold text-text truncate">{s.category}</h4>
						<span className="text-[10px] text-subtext0 bg-surface0 px-2 py-0.5 rounded-full font-mono">
							{s.skills?.length || 0} skills
						</span>
					</div>

					<div className="flex flex-wrap gap-1.5">
						{(s.skills || []).map((skill) => (
							<span
								key={skill}
								className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-surface0/90 border border-surface1/60 text-text"
							>
								{skill}
							</span>
						))}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-2 self-end sm:self-center shrink-0">
				<button
					type="button"
					onClick={() => onEdit(s)}
					className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface1 bg-surface0/60 text-xs font-bold text-text hover:text-accent hover:border-accent transition-all"
				>
					<Edit3 className="w-3.5 h-3.5" />
					<span>Edit</span>
				</button>
				<button
					type="button"
					onClick={() => onDelete(s.id)}
					className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red/30 bg-red/10 text-xs font-bold text-red hover:bg-red/20 transition-all"
				>
					<Trash2 className="w-3.5 h-3.5" />
					<span>Delete</span>
				</button>
			</div>
		</div>
	);
}

export function SkillsTab({ skills }: Props) {
	const [items, setItems] = useState(skills);
	const [editing, setEditing] = useState<Partial<Skill> | null>(null);
	const [isPending, startTransition] = useTransition();
	const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
	const [newSkillInput, setNewSkillInput] = useState('');

	useEffect(() => {
		setItems(skills);
	}, [skills]);

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
				updateSkillsOrderAction(updates);
			});
		}
	}

	function handleAddSkill() {
		const clean = newSkillInput.trim();
		if (!clean || !editing) return;
		const current = editing.skills || [];
		if (!current.includes(clean)) {
			setEditing({ ...editing, skills: [...current, clean] });
		}
		setNewSkillInput('');
	}

	function handleRemoveSkill(skillToRemove: string) {
		if (!editing) return;
		setEditing({
			...editing,
			skills: (editing.skills || []).filter((s) => s !== skillToRemove),
		});
	}

	function handleSave(e: React.FormEvent) {
		e.preventDefault();
		if (!editing) return;
		setMsg(null);
		startTransition(async () => {
			try {
				await saveSkillAction(editing);
				setMsg({ text: 'Skills category saved and published.', type: 'success' });
				setEditing(null);
			} catch {
				setMsg({ text: 'Error saving skills.', type: 'error' });
			}
		});
	}

	function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this skills category?')) return;
		startTransition(async () => {
			await deleteSkillAction(id);
			setMsg({ text: 'Category deleted.', type: 'success' });
		});
	}

	return (
		<div className="space-y-8 font-mono">
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
						<span>New Category</span>
					</button>

					<span className="text-xs text-subtext0">
						{items.length} {items.length === 1 ? 'category' : 'categories'} configured
					</span>
				</div>
			</div>

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

			{editing && (
				<form
					onSubmit={handleSave}
					className="rounded-2xl border border-accent/40 bg-base/80 p-6 space-y-6 shadow-2xl relative"
				>
					<div className="flex items-center justify-between border-b border-surface0/80 pb-4">
						<div className="flex items-center gap-2">
							<Code2 className="w-5 h-5 text-accent" />
							<h3 className="text-sm font-bold text-text uppercase tracking-wider">
								{editing.id ? 'Edit Skill Category' : 'Create Skill Category'}
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

					<div className="space-y-4">
						<div>
							<label
								htmlFor="skill-category"
								className="block text-[11px] font-bold uppercase tracking-wider text-subtext0 mb-1.5"
							>
								Category Title *
							</label>
							<input
								id="skill-category"
								name="category"
								required
								value={editing.category ?? ''}
								onChange={(e) => setEditing({ ...editing, category: e.target.value })}
								placeholder="e.g. Languages & Frameworks, AI & Machine Learning, DevOps"
								className="admin-input-modern"
							/>
						</div>

						<div>
							<label
								htmlFor="new-skill-input"
								className="block text-[11px] font-bold uppercase tracking-wider text-subtext0 mb-1.5"
							>
								Skills in this category (Type and press Enter)
							</label>
							<div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-surface1 bg-base/60">
								{(editing.skills || []).map((skill) => (
									<span
										key={skill}
										className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface0 border border-surface1 text-xs font-mono text-text"
									>
										<span>{skill}</span>
										<button
											type="button"
											onClick={() => handleRemoveSkill(skill)}
											className="text-subtext0 hover:text-red transition-colors"
										>
											<X className="w-3 h-3" />
										</button>
									</span>
								))}

								<div className="flex items-center gap-2 flex-1 min-w-[150px]">
									<input
										id="new-skill-input"
										value={newSkillInput}
										onChange={(e) => setNewSkillInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												handleAddSkill();
											}
										}}
										placeholder="Add skill..."
										className="bg-transparent text-xs text-text placeholder:text-surface2 outline-none w-full font-mono"
									/>
									<button
										type="button"
										onClick={handleAddSkill}
										className="text-[10px] uppercase font-bold text-accent hover:underline shrink-0"
									>
										Add
									</button>
								</div>
							</div>
						</div>
					</div>

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
							<span>Save Category</span>
						</button>
					</div>
				</form>
			)}

			<div className="space-y-3">
				<p className="text-[11px] uppercase tracking-widest text-subtext0 font-semibold">
					Drag categories to reorder on live site
				</p>
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
						<div className="space-y-2.5">
							{items.map((s) => (
								<SortableSkillItem
									key={s.id}
									s={s}
									onEdit={(s) => {
										setEditing(s);
										setMsg(null);
									}}
									onDelete={handleDelete}
								/>
							))}
							{items.length === 0 && (
								<div className="text-center p-8 rounded-xl border border-dashed border-surface1 text-subtext0 text-xs">
									No skill categories configured yet. Click &quot;New Category&quot; above.
								</div>
							)}
						</div>
					</SortableContext>
				</DndContext>
			</div>
		</div>
	);
}
