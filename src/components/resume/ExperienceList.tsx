import type { Experience } from '@/types';

type ExperienceListProps = {
  items: Experience[];
};

export function ExperienceList({ items }: ExperienceListProps) {
  return (
    <div className="space-y-8">
      {items.map((item) => (
        <article key={item.id} className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-[15px] font-medium text-[--ink]">{item.company}</h3>
            <p className="font-mono text-xs text-[--ink-muted]">
              {item.start_date}–{item.end_date ?? 'Present'}
            </p>
          </div>
          <p className="text-[14px] italic text-[--ink-muted]">{item.role}</p>
          {item.bullets.length > 0 && (
            <ul className="space-y-2 pl-4 text-[14px] leading-7 text-[--ink]">
              {item.bullets.map((bullet, i) => (
                <li key={i}>· {bullet}</li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-[--tag-border] px-2 py-0.5 text-[--tag-text]"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
