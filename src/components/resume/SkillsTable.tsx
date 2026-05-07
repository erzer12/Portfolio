import type { Skill } from '@/types';

type SkillsTableProps = {
  items: Skill[];
};

export function SkillsTable({ items }: SkillsTableProps) {
  return (
    <div className="space-y-0">
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-[160px_1fr] gap-4 py-[7px]">
          <span className="font-mono text-xs font-light text-[--ink-muted]">{item.category}</span>
          <span className="text-[14px] text-[--ink]">{item.skills.join(' · ')}</span>
        </div>
      ))}
    </div>
  );
}
