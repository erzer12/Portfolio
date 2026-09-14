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
	Clock,
	GripVertical,
	Loader2,
	MessageSquare,
	Plus,
	Quote,
	Star,
	Trash2,
	X,
} from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import {
	addTestimonialAction,
	approveTestimonialAction,
	deleteTestimonialAction,
	saveSiteSettingsAction,
	updateTestimonialsOrderAction,
} from '@/app/actions';
import type { SiteSettings, Testimonial } from '@/types';

type Props = {
	testimonials: Testimonial[];
	settings: SiteSettings;
};

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex items-center gap-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<Star
					key={star}
					className={`h-3.5 w-3.5 ${
						star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-surface1 text-surface1'
					}`}
				/>
			))}
		</div>
	);
}

function SortableTestimonialCard({
	testimonial,
	onDelete,
	isPendingAction,
}: {
	testimonial: Testimonial;
	onDelete: () => void;
	isPendingAction: boolean;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: testimonial.id,
	});
	const style = { transform: CSS.Transform.toString(transform), transition };

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="group flex items-start gap-3.5 rounded-xl border border-surface0 bg-base/50 p-4 transition-all hover:border-surface1 hover:bg-base/80"
		>
			<button
				type="button"
				{...attributes}
				{...listeners}
				className="cursor-grab text-subtext0/40 hover:text-accent active:cursor-grabbing p-1 -ml-1 mt-0.5"
				title="Drag to reorder"
			>
				<GripVertical className="h-4 w-4" />
			</button>

			<div className="flex-1 min-w-0 space-y-2">
				<div className="flex items-start justify-between gap-3">
					<div className="space-y-1">
						<div className="flex items-center gap-2 flex-wrap">
							<span className="text-sm font-semibold text-text">{testimonial.name}</span>
							<span className="rounded-md bg-surface0 px-2 py-0.5 text-xs text-subtext0 border border-surface1/60">
								{testimonial.role}
							</span>
						</div>
						<StarRating rating={testimonial.rating || 5} />
					</div>

					<button
						type="button"
						onClick={onDelete}
						disabled={isPendingAction}
						className="inline-flex items-center gap-1 text-xs text-subtext0/60 hover:text-red transition-colors p-1.5 rounded-lg hover:bg-red/10"
						title="Delete testimonial"
					>
						<Trash2 className="h-4 w-4" />
					</button>
				</div>

				<div className="relative pl-3 border-l-2 border-surface1 text-xs sm:text-sm text-subtext1 leading-relaxed italic">
					&ldquo;{testimonial.message}&rdquo;
				</div>
			</div>
		</div>
	);
}

export function TestimonialsTab({ testimonials, settings }: Props) {
	const [isPending, startTransition] = useTransition();
	const [modalOpen, setModalOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		role: '',
		message: '',
		rating: 5,
		approved: true,
	});

	const pending = testimonials.filter((t) => !t.approved);
	const initialApproved = testimonials.filter((t) => t.approved);

	const [approvedItems, setApprovedItems] = useState(initialApproved);

	useEffect(() => {
		setApprovedItems(initialApproved);
	}, [initialApproved]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			const oldIndex = approvedItems.findIndex((i) => i.id === active.id);
			const newIndex = approvedItems.findIndex((i) => i.id === over.id);
			const newItems = arrayMove(approvedItems, oldIndex, newIndex);
			setApprovedItems(newItems);

			const updates = newItems.map((item, index) => ({ id: item.id, order: index }));
			startTransition(() => {
				updateTestimonialsOrderAction(updates);
			});
		}
	}

	function handleToggleVisibility() {
		startTransition(() =>
			saveSiteSettingsAction({ show_testimonials: !settings.show_testimonials }),
		);
	}

	function handleAddSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!formData.name.trim() || !formData.message.trim()) return;

		startTransition(async () => {
			await addTestimonialAction({
				name: formData.name.trim(),
				role: formData.role.trim() || 'Client',
				message: formData.message.trim(),
				rating: Number(formData.rating) || 5,
				approved: formData.approved,
			});
			setFormData({ name: '', role: '', message: '', rating: 5, approved: true });
			setModalOpen(false);
		});
	}

	return (
		<div className="space-y-6 max-w-5xl">
			{/* Top Control Bar */}
			<div className="rounded-2xl border border-surface0 bg-mantle/70 backdrop-blur-sm p-5 space-y-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h2 className="text-base font-semibold text-text flex items-center gap-2">
							<MessageSquare className="h-4 w-4 text-accent" />
							Testimonials & Endorsements
						</h2>
						<p className="text-xs text-subtext0 mt-0.5">
							Manage client quotes, approve incoming submissions, or add direct recommendations.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => setModalOpen(true)}
							className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-xs font-semibold text-accent-fg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all"
						>
							<Plus className="h-4 w-4" />
							Add Testimonial
						</button>
					</div>
				</div>

				{/* Visibility Toggle Card */}
				<div className="flex items-center justify-between rounded-xl border border-surface0/60 bg-base/40 px-4 py-3">
					<div>
						<p className="text-xs font-medium text-text">Show Testimonials on Public Site</p>
						<p className="text-[11px] text-subtext0">
							When enabled, approved testimonials appear in the dedicated section on the public
							page.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<span
							className={`text-[11px] font-mono font-medium ${
								settings.show_testimonials ? 'text-accent' : 'text-subtext0/60'
							}`}
						>
							{settings.show_testimonials ? 'ENABLED' : 'DISABLED'}
						</span>
						<button
							type="button"
							onClick={handleToggleVisibility}
							disabled={isPending}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
								settings.show_testimonials ? 'bg-accent' : 'bg-surface1'
							}`}
							aria-label="Toggle testimonials section"
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-base shadow-sm transition-transform ${
									settings.show_testimonials ? 'translate-x-6' : 'translate-x-1'
								}`}
							/>
						</button>
					</div>
				</div>
			</div>

			{/* Pending Approval Section */}
			{pending.length > 0 && (
				<div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-amber-400" />
							<h3 className="text-sm font-semibold text-amber-300">
								Pending Approvals ({pending.length})
							</h3>
						</div>
						<span className="text-[11px] text-amber-400/80 font-mono">
							Review and publish or discard
						</span>
					</div>

					<div className="space-y-3">
						{pending.map((t) => (
							<div
								key={t.id}
								className="rounded-xl border border-amber-500/20 bg-base/70 p-4 space-y-3"
							>
								<div className="flex items-start justify-between gap-4">
									<div>
										<div className="flex items-center gap-2 flex-wrap">
											<span className="text-sm font-semibold text-text">{t.name}</span>
											<span className="rounded-md bg-surface0 px-2 py-0.5 text-xs text-subtext0 border border-surface1/60">
												{t.role}
											</span>
										</div>
										<div className="mt-1">
											<StarRating rating={t.rating || 5} />
										</div>
									</div>

									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => startTransition(() => approveTestimonialAction(t.id))}
											disabled={isPending}
											className="inline-flex items-center gap-1.5 rounded-lg bg-green/10 border border-green/30 px-3 py-1.5 text-xs font-medium text-green hover:bg-green/20 transition-all"
										>
											<Check className="h-3.5 w-3.5" />
											Approve
										</button>
										<button
											type="button"
											onClick={() => startTransition(() => deleteTestimonialAction(t.id))}
											disabled={isPending}
											className="inline-flex items-center gap-1.5 rounded-lg bg-red/10 border border-red/30 px-3 py-1.5 text-xs font-medium text-red hover:bg-red/20 transition-all"
										>
											<Trash2 className="h-3.5 w-3.5" />
											Reject
										</button>
									</div>
								</div>

								<div className="relative pl-3 border-l-2 border-amber-500/30 text-xs sm:text-sm text-subtext1 leading-relaxed italic">
									&ldquo;{t.message}&rdquo;
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Published Section */}
			<div className="rounded-2xl border border-surface0 bg-mantle/70 backdrop-blur-sm p-5 space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Quote className="h-4 w-4 text-accent" />
						<h3 className="text-sm font-semibold text-text">
							Published Testimonials ({approvedItems.length})
						</h3>
					</div>
					<span className="text-[11px] text-subtext0/60 font-mono">
						Drag handle to reorder public sequence
					</span>
				</div>

				{approvedItems.length === 0 ? (
					<div className="rounded-xl border border-dashed border-surface1/60 p-8 text-center">
						<MessageSquare className="h-8 w-8 text-subtext0/30 mx-auto mb-2" />
						<p className="text-xs text-subtext0">No approved testimonials published yet.</p>
						<button
							type="button"
							onClick={() => setModalOpen(true)}
							className="mt-3 text-xs text-accent hover:underline font-mono"
						>
							+ Add your first testimonial
						</button>
					</div>
				) : (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={approvedItems.map((i) => i.id)}
							strategy={verticalListSortingStrategy}
						>
							<div className="space-y-3">
								{approvedItems.map((t) => (
									<SortableTestimonialCard
										key={t.id}
										testimonial={t}
										onDelete={() => startTransition(() => deleteTestimonialAction(t.id))}
										isPendingAction={isPending}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>
				)}
			</div>

			{/* Add Testimonial Modal */}
			{modalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/80 backdrop-blur-sm">
					<div className="w-full max-w-lg rounded-2xl border border-surface0 bg-mantle p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
						<div className="flex items-center justify-between border-b border-surface0 pb-4">
							<div className="flex items-center gap-2.5">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
									<Plus className="h-4 w-4" />
								</div>
								<div>
									<h3 className="text-sm font-semibold text-text">Add Testimonial</h3>
									<p className="text-[11px] text-subtext0">
										Insert client feedback, colleague quotes, or endorsements
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setModalOpen(false)}
								className="rounded-lg p-1.5 text-subtext0 hover:bg-surface0 hover:text-text transition-colors"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						<form onSubmit={handleAddSubmit} className="space-y-4">
							<div className="space-y-1.5">
								<label htmlFor="test-name" className="text-xs font-medium text-subtext0">
									Client / Person Name *
								</label>
								<input
									id="test-name"
									type="text"
									required
									placeholder="e.g. Sarah Connor"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className="admin-input-modern w-full"
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div className="space-y-1.5">
									<label htmlFor="test-role" className="text-xs font-medium text-subtext0">
										Role / Company
									</label>
									<input
										id="test-role"
										type="text"
										placeholder="e.g. CTO @ Cyberdyne"
										value={formData.role}
										onChange={(e) => setFormData({ ...formData, role: e.target.value })}
										className="admin-input-modern w-full"
									/>
								</div>

								<div className="space-y-1.5">
									<label htmlFor="test-rating" className="text-xs font-medium text-subtext0">
										Star Rating
									</label>
									<select
										id="test-rating"
										value={formData.rating}
										onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
										className="admin-input-modern w-full bg-base"
									>
										<option value={5}>★★★★★ (5 Stars)</option>
										<option value={4}>★★★★☆ (4 Stars)</option>
										<option value={3}>★★★☆☆ (3 Stars)</option>
										<option value={2}>★★☆☆☆ (2 Stars)</option>
										<option value={1}>★☆☆☆☆ (1 Star)</option>
									</select>
								</div>
							</div>

							<div className="space-y-1.5">
								<label htmlFor="test-msg" className="text-xs font-medium text-subtext0">
									Testimonial Quote *
								</label>
								<textarea
									id="test-msg"
									required
									rows={4}
									placeholder="Paste the testimonial message here..."
									value={formData.message}
									onChange={(e) => setFormData({ ...formData, message: e.target.value })}
									className="admin-input-modern w-full resize-none"
								/>
							</div>

							<label className="flex items-center gap-2 cursor-pointer pt-1">
								<input
									type="checkbox"
									checked={formData.approved}
									onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
									className="rounded border-surface1 bg-base text-accent focus:ring-accent"
								/>
								<span className="text-xs text-subtext1">Publish immediately to portfolio</span>
							</label>

							<div className="flex items-center justify-end gap-3 pt-3 border-t border-surface0">
								<button
									type="button"
									onClick={() => setModalOpen(false)}
									className="rounded-xl border border-surface0 px-4 py-2 text-xs font-medium text-subtext0 hover:bg-surface0 hover:text-text transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isPending}
									className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-fg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
								>
									{isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
									Save Testimonial
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
