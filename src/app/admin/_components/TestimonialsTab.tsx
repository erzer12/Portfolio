'use client';

import { useTransition } from 'react';
import { approveTestimonialAction, deleteTestimonialAction } from '@/app/actions';
import type { Testimonial, SiteSettings } from '@/types';
import { saveSiteSettingsAction } from '@/app/actions';

type Props = { testimonials: Testimonial[]; settings: SiteSettings };

export function TestimonialsTab({ testimonials, settings }: Props) {
  const [isPending, startTransition] = useTransition();

  const pending = testimonials.filter((t) => !t.approved);
  const approved = testimonials.filter((t) => t.approved);

  function handleToggle() {
    startTransition(() =>
      saveSiteSettingsAction({ show_testimonials: !settings.show_testimonials }),
    );
  }

  return (
    <div className="space-y-8">
      {/* Global toggle */}
      <div className="flex items-center justify-between gap-4 rounded border border-[#E4E4DF] p-4">
        <div>
          <p className="text-[14px] font-medium text-[#1A1A18]">Show Testimonials Section</p>
          <p className="font-mono text-xs text-[#6B6B66]">
            Toggle whether the testimonials section appears on the public portfolio.
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.show_testimonials ? 'bg-[#1A1A18]' : 'bg-[#D0D0CB]'
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
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-[#6B6B66]">
            Pending ({pending.length})
          </p>
          <div className="space-y-3">
            {pending.map((t) => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                onApprove={() => startTransition(() => approveTestimonialAction(t.id))}
                onDelete={() => startTransition(() => deleteTestimonialAction(t.id))}
                pending
              />
            ))}
          </div>
        </div>
      )}

      {/* Approved */}
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-[#6B6B66]">
          Published ({approved.length})
        </p>
        {approved.length === 0 ? (
          <p className="font-mono text-xs text-[#A0A09A]">No approved testimonials yet.</p>
        ) : (
          <div className="space-y-3">
            {approved.map((t) => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                onDelete={() => startTransition(() => deleteTestimonialAction(t.id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  onApprove,
  onDelete,
  pending,
}: {
  testimonial: Testimonial;
  onApprove?: () => void;
  onDelete: () => void;
  pending?: boolean;
}) {
  return (
    <div className="space-y-2 border border-[#E4E4DF] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[14px] font-medium text-[#1A1A18]">{testimonial.name}</p>
          <p className="font-mono text-xs text-[#6B6B66]">{testimonial.role}</p>
        </div>
        <div className="flex gap-2">
          {pending && onApprove && (
            <button onClick={onApprove} className="admin-btn-sm !border-green-400 !text-green-700">
              Approve
            </button>
          )}
          <button onClick={onDelete} className="admin-btn-sm !border-red-300 !text-red-600">
            Delete
          </button>
        </div>
      </div>
      <p className="text-[13px] leading-6 text-[#1A1A18]">&ldquo;{testimonial.message}&rdquo;</p>
      <p className="font-mono text-xs text-[#A0A09A]">{'★'.repeat(testimonial.rating)}</p>
    </div>
  );
}
