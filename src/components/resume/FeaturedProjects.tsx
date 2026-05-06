type FeaturedProjectsProps = {
  items: Array<{
    name: string;
    year: string;
    description: string;
    tags: string[];
    href: string;
  }>;
  viewAllHref: string;
};

export function FeaturedProjects({ items, viewAllHref }: FeaturedProjectsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <a href={viewAllHref} className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">
          View all →
        </a>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <article key={item.name} className="space-y-3 border-l-2 border-neutral-200 pl-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-[15px] font-medium text-neutral-900">
                  <a href={item.href}>{item.name} ↗</a>
                </h3>
                <p className="text-[14px] leading-7 text-neutral-600">{item.description}</p>
              </div>
              <p className="font-mono text-xs text-neutral-500">{item.year}</p>
            </div>

            <div className="flex flex-wrap gap-2 font-mono text-xs text-neutral-500">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded border border-neutral-300 px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
