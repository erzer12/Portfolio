type HeaderProps = {
  name: string;
  tagline: string;
  location: string;
  status: string;
  socialLinks: Array<{ label: string; href: string }>;
};

export function Header({ name, tagline, location, status, socialLinks }: HeaderProps) {
  return (
    <section className="grid gap-6 md:grid-cols-[1fr_120px] md:items-start">
      <div className="space-y-4">
        <div>
          <p className="font-serif text-5xl italic text-neutral-900 md:text-6xl">{name}</p>
          <p className="mt-3 max-w-xl text-base leading-7 text-neutral-700">{tagline}</p>
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">
          {location} · {status}
        </p>

        <div className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.14em] text-neutral-600">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} className="underline decoration-neutral-300 underline-offset-4">
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>

      <div className="h-[120px] w-[120px] border border-neutral-300 bg-neutral-100" aria-hidden="true" />
    </section>
  );
}
