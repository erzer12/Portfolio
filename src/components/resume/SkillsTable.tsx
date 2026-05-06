type SkillsTableProps = {
  items: Array<{ category: string; skills: string[] }>;
};

export function SkillsTable({ items }: SkillsTableProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.category} className="grid gap-2 py-1 md:grid-cols-[25%_1fr] md:items-start">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">{item.category}</div>
          <div className="text-[14px] leading-7 text-neutral-800">{item.skills.join(' · ')}</div>
        </div>
      ))}
    </div>
  );
}
