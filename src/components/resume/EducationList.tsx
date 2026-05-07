import type { Education } from '@/types';

type EducationListProps = {
  items: Education[];
};

export function EducationList({ items }: EducationListProps) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.id} className="space-y-1">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-[15px] font-medium text-[--ink]">{item.school}</h3>
            <p className="font-mono text-xs text-[--ink-faint]">{item.year}</p>
          </div>
          <p className="text-[14px] text-[--ink-muted]">{item.degree}</p>
          {item.description && (
            <p className="text-[13px] text-[--ink-faint]">{item.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
