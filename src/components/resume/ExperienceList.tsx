import type { Experience, Project } from '@/types';

type ExperienceListProps = {
  items: Experience[];
  projects: Project[];
};

export function ExperienceList({ items, projects }: ExperienceListProps) {
  return (
    <div className="space-y-10">
      {items.map((item) => {
        const linkedProjects = item.related_projects
          ? projects.filter((p) => item.related_projects.includes(p.slug))
          : [];

        return (
          <article key={item.id} className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h3 className="text-[15px] font-medium text-[--ink]">{item.company}</h3>
              <p className="font-mono text-xs text-[--ink-muted]">
                {item.start_date}–{item.end_date ?? 'Present'}
              </p>
            </div>

            <p className="text-[14px] italic text-[--ink-muted]">
              {item.role}{item.employment_type ? ` · ${item.employment_type}` : ''}
            </p>

            {/* External links */}
            {(item.certificate_url || item.recommendation_url || item.repo_url) && (
              <div className="flex flex-wrap gap-4 font-mono text-xs pt-0.5">
                {item.repo_url && (
                  <a href={item.repo_url} target="_blank" rel="noopener noreferrer"
                    className="text-[--ink-muted] hover:text-[--ink] underline decoration-[--rule] underline-offset-4">
                    Repository ↗
                  </a>
                )}
                {item.certificate_url && (
                  <a href={item.certificate_url} target="_blank" rel="noopener noreferrer"
                    className="text-[--ink-muted] hover:text-[--ink] underline decoration-[--rule] underline-offset-4">
                    Completion Certificate ↗
                  </a>
                )}
                {item.recommendation_url && (
                  <a href={item.recommendation_url} target="_blank" rel="noopener noreferrer"
                    className="text-[--ink-muted] hover:text-[--ink] underline decoration-[--rule] underline-offset-4">
                    Letter of Recommendation ↗
                  </a>
                )}
              </div>
            )}

            {item.bullets.length > 0 && (
              <ul className="space-y-2 pl-4 text-[14px] leading-7 text-[--ink]">
                {item.bullets.map((bullet, i) => (
                  <li key={i}>· {bullet}</li>
                ))}
              </ul>
            )}

            {/* Linked portfolio projects */}
            {linkedProjects.length > 0 && (
              <div className="pt-1 space-y-1">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-[--ink-faint]">Related Projects</p>
                <div className="flex flex-wrap gap-2">
                  {linkedProjects.map((project) => (
                    <a
                      key={project.slug}
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 border border-[--tag-border] px-3 py-1 font-mono text-xs text-[--tag-text] hover:border-[--ink] hover:text-[--ink] transition-colors"
                    >
                      {project.title} ↗
                    </a>
                  ))}
                </div>
              </div>
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
        );
      })}
    </div>
  );
}
