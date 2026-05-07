'use client';

import { useState, useTransition, useEffect } from 'react';
import { approveTestimonialAction, deleteTestimonialAction, updateTestimonialsOrderAction, saveSiteSettingsAction } from '@/app/actions';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Testimonial, SiteSettings } from '@/types';

type Props = { testimonials: Testimonial[]; settings: SiteSettings };

function SortableTestimonialCard({
  testimonial,
  onDelete,
}: {
  testimonial: Testimonial;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: testimonial.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-4 border border-[--rule] p-4 bg-[--bg]">
      <div {...attributes} {...listeners} className="cursor-grab text-[--ink-faint] hover:text-[--ink] active:cursor-grabbing pt-1">
        ☰
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[14px] font-medium text-[--ink]">{testimonial.name}</p>
            <p className="font-mono text-xs text-[--ink-muted]">{testimonial.role}</p>
          </div>
          <button onClick={onDelete} className="admin-btn-sm !border-red-300 !text-red-600">
            Delete
          </button>
        </div>
        <p className="text-[13px] leading-6 text-[--ink]">&ldquo;{testimonial.message}&rdquo;</p>
      </div>
    </div>
  );
}

export function TestimonialsTab({ testimonials, settings }: Props) {
  const [isPending, startTransition] = useTransition();

  const pending = testimonials.filter((t) => !t.approved);
  const initialApproved = testimonials.filter((t) => t.approved);

  const [approvedItems, setApprovedItems] = useState(initialApproved);

  useEffect(() => { setApprovedItems(initialApproved); }, [testimonials]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = approvedItems.findIndex((i) => i.id === active.id);
      const newIndex = approvedItems.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(approvedItems, oldIndex, newIndex);
      setApprovedItems(newItems);

      const updates = newItems.map((item, index) => ({ id: item.id, order: index }));
      startTransition(() => { updateTestimonialsOrderAction(updates); });
    }
  }

  function handleToggle() {
    startTransition(() => saveSiteSettingsAction({ show_testimonials: !settings.show_testimonials }));
  }

  return (
    <div className="space-y-8">
      {/* Global toggle */}
      <div className="flex items-center justify-between gap-4 rounded border border-[--rule] p-4">
        <div>
          <p className="text-[14px] font-medium text-[--ink]">Show Testimonials Section</p>
          <p className="font-mono text-xs text-[--ink-muted]">
            Toggle whether the testimonials section appears on the public portfolio.
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.show_testimonials ? 'bg-[--ink]' : 'bg-[--tag-border]'
          }`}
          aria-label="Toggle testimonials"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.show_testimonials ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Pending approvals */}
      {pending.length > 0 && (
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">
            Pending ({pending.length})
          </p>
          <div className="space-y-3">
            {pending.map((t) => (
              <div key={t.id} className="space-y-2 border border-[--rule] p-4 bg-[--bg]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[14px] font-medium text-[--ink]">{t.name}</p>
                    <p className="font-mono text-xs text-[--ink-muted]">{t.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startTransition(() => approveTestimonialAction(t.id))} className="admin-btn-sm !border-green-400 !text-green-700">
                      Approve
                    </button>
                    <button onClick={() => startTransition(() => deleteTestimonialAction(t.id))} className="admin-btn-sm !border-red-300 !text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-[13px] leading-6 text-[--ink]">&ldquo;{t.message}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved */}
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">
          Published ({approvedItems.length})
        </p>
        {approvedItems.length === 0 ? (
          <p className="font-mono text-xs text-[#A0A09A]">No approved testimonials yet.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={approvedItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {approvedItems.map((t) => (
                  <SortableTestimonialCard
                    key={t.id}
                    testimonial={t}
                    onDelete={() => startTransition(() => deleteTestimonialAction(t.id))}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
