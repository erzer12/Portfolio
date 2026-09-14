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
	GripVertical,
	Link2,
	Loader2,
	Plus,
	Save,
	Trash2,
	X,
} from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import {
	deleteFooterLinkAction,
	saveFooterLinkAction,
	updateFooterLinksOrderAction,
} from '@/app/actions';
import type { FooterLink } from '@/types';

type Props = { links: FooterLink[] };

function SortableLinkRow({
	link,
	onEdit,
	onDelete,
}: {
	link: FooterLink;
	onEdit: (link: FooterLink) => void;
	onDelete: (id: string) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id });
	const style = { transform: CSS.Transform.toString(transform), transition };

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg hover:bg-surface0/40 transition-colors group"
		>
			<div className="flex items-center gap-3 min-w-0 flex-1">
				<div
					{...attributes}
					{...listeners}
					className="cursor-grab text-surface2 group-hover:text-accent active:cursor-grabbing text-sm shrink-0"
				>
					<GripVertical className="w-3.5 h-3.5" />
				</div>
				<div className="flex flex-wrap items-center gap-2 min-w-0">
					<span className="text-xs font-bold text-text">{link.label}</span>
					<span className="text-[11px] font-mono text-subtext0/70 truncate max-w-xs">
						{link.url}
					</span>
				</div>
			</div>

			<div className="flex items-center gap-1.5 shrink-0">
				{link.url && (
					<a
						href={link.url}
						target="_blank"
						rel="noreferrer"
						className="p-1 rounded text-subtext0 hover:text-accent"
						title="Open link"
					>
						<ExternalLink className="w-3.5 h-3.5" />
					</a>
				)}
				<button
					type="button"
					onClick={() => onEdit(link)}
					className="cursor-pointer p-1.5 rounded-md text-subtext0 hover:text-text hover:bg-surface0 transition-colors"
					title="Edit link"
				>
					<Edit3 className="w-3.5 h-3.5" />
				</button>
				<button
					type="button"
					onClick={() => onDelete(link.id)}
					className="cursor-pointer p-1.5 rounded-md text-subtext0 hover:text-red hover:bg-red/10 transition-colors"
					title="Delete link"
				>
					<Trash2 className="w-3.5 h-3.5" />
				</button>
			</div>
		</div>
	);
}

type EditingLink = Partial<FooterLink> & { _prefillCategory?: string };

export function FooterLinksTab({ links }: Props) {
	const [items, setItems] = useState(links);
	const [editing, setEditing] = useState<EditingLink | null>(null);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [showNewCategory, setShowNewCategory] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

	useEffect(() => {
		setItems(links);
	}, [links]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	const categories = Array.from(new Set(items.map((i) => i.category)));
	const grouped = categories.reduce(
		(acc, cat) => {
			acc[cat] = items.filter((i) => i.category === cat);
			return acc;
		},
		{} as Record<string, FooterLink[]>,
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
				updateFooterLinksOrderAction(updates);
			});
		}
	}

	function handleSave(e: React.FormEvent) {
		e.preventDefault();
		if (!editing) return;
		setMsg(null);
		startTransition(async () => {
			try {
				await saveFooterLinkAction(editing);
				setMsg({ text: 'Footer link saved successfully.', type: 'success' });
				setEditing(null);
			} catch {
				setMsg({ text: 'Error saving link.', type: 'error' });
			}
		});
	}

	function handleDelete(id: string) {
		if (!confirm('Delete this footer link?')) return;
		startTransition(async () => {
			await deleteFooterLinkAction(id);
			setMsg({ text: 'Link deleted.', type: 'success' });
		});
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
		const { name, value } = e.target;
		setEditing((prev) =>
			prev ? { ...prev, [name]: name === 'order' ? Number(value) : value } : prev,
		);
	}

	function openNewLink(category: string) {
		const inCat = items.filter((i) => i.category === category);
		setEditing({
			category,
			label: '',
			url: '',
			order: inCat.length,
		});
		setMsg(null);
	}

	return (
		<div className="space-y-8 font-mono">
			{/* Top Bar */}
			<div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface0/80 pb-5">
				<div className="flex items-center gap-3">
					<Link2 className="w-5 h-5 text-accent" />
					<h3 className="text-sm font-bold text-text uppercase tracking-wider">
						Footer Dock & Navigation Links ({items.length})
					</h3>
				</div>

				<button
					type="button"
					onClick={() => setShowNewCategory(true)}
					className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent-fg hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-accent/10"
				>
					<Plus className="w-4 h-4" />
					<span>New Category</span>
				</button>
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

			{/* New Category Input Row */}
			{showNewCategory && (
				<div className="flex flex-col sm:flex-row gap-3 items-stretch p-4 rounded-xl border border-accent/40 bg-base/80 shadow-lg">
					<input
						value={newCategoryName}
						onChange={(e) => setNewCategoryName(e.target.value)}
						placeholder="New Category Name (e.g. Socials, Connect, Code)"
						className="admin-input-modern flex-1"
						onKeyDown={(e) => {
							if (e.key === 'Enter' && newCategoryName.trim()) {
								openNewLink(newCategoryName.trim());
								setNewCategoryName('');
								setShowNewCategory(false);
							}
						}}
					/>
					<button
						type="button"
						onClick={() => {
							if (newCategoryName.trim()) {
								openNewLink(newCategoryName.trim());
								setNewCategoryName('');
								setShowNewCategory(false);
							}
						}}
						className="cursor-pointer px-4 py-2 rounded-xl bg-accent text-accent-fg text-xs font-bold uppercase tracking-wider hover:brightness-110"
					>
						Create & Add Link
					</button>
					<button
						type="button"
						onClick={() => {
							setShowNewCategory(false);
							setNewCategoryName('');
						}}
						className="cursor-pointer px-4 py-2 rounded-xl border border-surface1 text-xs font-bold text-subtext0 hover:text-text hover:bg-surface0"
					>
						Cancel
					</button>
				</div>
			)}

			{/* Edit / Add Modal Form */}
			{editing && (
				<form
					onSubmit={handleSave}
					className="rounded-2xl border border-accent/40 bg-base/80 p-6 space-y-6 shadow-2xl relative"
				>
					<div className="flex items-center justify-between border-b border-surface0/80 pb-4">
						<div className="flex items-center gap-2">
							<Link2 className="w-5 h-5 text-accent" />
							<h3 className="text-sm font-bold text-text uppercase tracking-wider">
								{editing.id ? 'Edit Link' : `New Link in "${editing.category}"`}
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
						<div>
							<label
								htmlFor="form-category-select"
								className="block text-[11px] font-bold uppercase tracking-wider text-subtext0 mb-1.5"
							>
								Category
							</label>
							<input
								id="form-category-select"
								name="category"
								value={editing.category ?? ''}
								onChange={handleChange}
								placeholder="Category"
								className="admin-input-modern"
							/>
						</div>

						<div>
							<label
								htmlFor="field-label"
								className="block text-[11px] font-bold uppercase tracking-wider text-subtext0 mb-1.5"
							>
								Link Text / Label *
							</label>
							<input
								id="field-label"
								name="label"
								required
								value={editing.label ?? ''}
								onChange={handleChange}
								placeholder="e.g. GitHub, LinkedIn, Resume PDF"
								className="admin-input-modern"
							/>
						</div>

						<div className="md:col-span-2">
							<label
								htmlFor="field-url"
								className="block text-[11px] font-bold uppercase tracking-wider text-subtext0 mb-1.5"
							>
								Destination URL *
							</label>
							<input
								id="field-url"
								name="url"
								required
								value={editing.url ?? ''}
								onChange={handleChange}
								placeholder="https://..."
								className="admin-input-modern"
							/>
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
							<span>Save Link</span>
						</button>
					</div>
				</form>
			)}

			{/* Category Cards with Sortable Links */}
			<div className="space-y-6">
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
						{categories.length === 0 && (
							<div className="p-8 rounded-xl border border-dashed border-surface1 text-center text-xs text-subtext0">
								No footer links configured yet. Click &quot;New Category&quot; to begin.
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							{categories.map((category) => (
								<div
									key={category}
									className="rounded-2xl border border-surface0/80 bg-base/50 p-5 space-y-3 shadow-md"
								>
									{/* Category header */}
									<div className="flex items-center justify-between border-b border-surface0/80 pb-3">
										<div className="flex items-center gap-2">
											<span className="w-2 h-2 rounded-full bg-accent" />
											<h4 className="text-xs font-bold uppercase tracking-widest text-text">
												{category}
											</h4>
										</div>

										<button
											type="button"
											onClick={() => openNewLink(category)}
											className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:underline"
										>
											<Plus className="w-3 h-3" />
											<span>Add Link</span>
										</button>
									</div>

									{/* Links list in category */}
									<div className="divide-y divide-surface0/60">
										{grouped[category].map((link) => (
											<SortableLinkRow
												key={link.id}
												link={link}
												onEdit={(link) => {
													setEditing(link);
													setMsg(null);
												}}
												onDelete={handleDelete}
											/>
										))}
									</div>
								</div>
							))}
						</div>
					</SortableContext>
				</DndContext>
			</div>
		</div>
	);
}
