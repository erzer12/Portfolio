import type { FooterLink } from '@/types';

type Props = {
  links: FooterLink[];
};

export function MinimalFooter({ links }: Props) {
  // Group links by category, preserving insertion order
  const categories: string[] = [];
  const grouped: Record<string, FooterLink[]> = {};

  for (const link of links) {
    const cat = link.category || 'Links';
    if (!grouped[cat]) {
      grouped[cat] = [];
      categories.push(cat);
    }
    grouped[cat].push(link);
  }

  const hasLinks = categories.length > 0;

  return (
    <footer className="mt-16 border-t border-[--rule]">
      {hasLinks && (
        <div className="py-12">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {categories.map((category) => (
              <div key={category} className="space-y-4">
                <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[--ink]">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {grouped[category].map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.url}
                        target={link.url.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="font-mono text-[12px] text-[--ink-muted] hover:text-[--ink] transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`border-t border-[--rule] py-6 flex items-center justify-between gap-4 flex-wrap ${!hasLinks ? 'mt-0' : ''}`}>
        <p className="font-mono text-[11px] text-[--ink-faint]">
          © {new Date().getFullYear()} Harshil P
        </p>
        <p className="font-mono text-[11px] text-[--ink-faint]">
          Built with Next.js & Supabase
        </p>
      </div>
    </footer>
  );
}
