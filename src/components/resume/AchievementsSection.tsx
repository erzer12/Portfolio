import type { Achievement } from '@/types';

type Props = { items: Achievement[] };

export function AchievementsSection({ items }: Props) {
  return (
    <div className="divide-y divide-[--rule]">
      {items.map((item) => (
        <div key={item.id} className="flex items-start justify-between gap-4 py-3">
          <div className="space-y-0.5">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-medium text-[--ink] underline decoration-[--rule] underline-offset-4 hover:text-[--ink-muted]"
              >
                {item.title} ↗
              </a>
            ) : (
              <p className="text-[14px] font-medium text-[--ink]">{item.title}</p>
            )}
            {item.description && (
              <p className="text-[13px] text-[--ink-muted]">{item.description}</p>
            )}
          </div>
          {item.date && (
            <p className="shrink-0 font-mono text-xs text-[--ink-muted]">{item.date}</p>
          )}
        </div>
      ))}
    </div>
  );
}
