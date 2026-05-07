import type { Testimonial } from '@/types';

type Props = {
  items: Testimonial[];
};

export function TestimonialsSection({ items }: Props) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <blockquote key={item.id} className="space-y-3 border-l-[3px] border-[--rule] pl-4">
          <p className="text-[14px] leading-7 text-[--ink]">&ldquo;{item.message}&rdquo;</p>
          <footer className="space-y-0.5">
            <p className="text-[13px] font-medium text-[--ink]">{item.name}</p>
            <p className="font-mono text-xs text-[--ink-muted]">{item.role}</p>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
