type ExperienceListProps = {
  items: Array<{
    company: string;
    role: string;
    dateRange: string;
    bullets: string[];
    tags: string[];
  }>;
};

export function ExperienceList({ items }: ExperienceListProps) {
  return (
    <div className="space-y-8">
      {items.map((item) => (
        <article key={`${item.company}-${item.role}`} className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-[15px] font-medium text-neutral-900">{item.company}</h3>
            <p className="font-mono text-xs text-neutral-500">{item.dateRange}</p>
          </div>
          <p className="text-[14px] italic text-neutral-600">{item.role}</p>
          <ul className="space-y-2 pl-4 text-[14px] leading-7 text-neutral-800">
            {item.bullets.map((bullet) => (
              <li key={bullet}>· {bullet}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs text-neutral-500">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded border border-neutral-300 px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
