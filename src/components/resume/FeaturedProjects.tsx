import type { Project } from '@/types';

type FeaturedProjectsProps = {
  items: Project[];
  viewAllHref: string;
};

export function FeaturedProjects({ items, viewAllHref }: FeaturedProjectsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <a
          href={viewAllHref}
          className="font-mono text-xs uppercase tracking-[0.14em] text-[--ink-muted] transition-colors hover:text-[--ink]"
        >
          View all →
        </a>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <article
            key={item.id}
            className="group space-y-3 border-l-[3px] border-[--rule] pl-4 transition-[border-color,padding-left] duration-150 hover:border-[--ink] hover:pl-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-[15px] font-medium text-[--ink]">
                  <a href={`/projects/${item.slug}`} className="hover:underline underline-offset-4">
                    {item.title} ↗
                  </a>
                </h3>
                <p className="text-[14px] leading-7 text-[--ink-muted]">{item.description}</p>
              </div>
              <p className="font-mono text-xs text-[--ink-faint]">
                {item.date ?? item.created_at?.slice(0, 4)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 font-mono text-xs">
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

      {items.length === 0 && (
        <p className="font-mono text-xs text-[--ink-muted]">
          No featured projects yet. Mark projects as featured in the admin.
        </p>
      )}
    </div>
  );
}
