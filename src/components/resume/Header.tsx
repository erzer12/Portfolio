type HeaderProps = {
  name: string;
  tagline: string;
  location: string;
  status: string;
  image?: string;
  socialLinks: Array<{ label: string; href: string }>;
};

export function Header({ name, tagline, location, status, image, socialLinks }: HeaderProps) {
  return (
    <section className="grid gap-6 md:grid-cols-[1fr_120px] md:items-start">
      <div className="space-y-4">
        <div>
          <p className="font-serif text-5xl italic text-[--ink] md:text-6xl">{name}</p>
          <p className="mt-3 max-w-xl text-base leading-7 text-[--ink-muted]">{tagline}</p>
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[--ink-faint]">
          {location} · {status}
        </p>

        <div className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.14em] text-[--ink-muted]">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} className="underline decoration-[--rule] underline-offset-4">
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>

      {image ? (
        <img
          src={image}
          alt={name}
          className="h-[120px] w-[120px] border border-[--rule] object-cover"
        />
      ) : (
        <div className="h-[120px] w-[120px] border border-[--rule] bg-[--bg]" aria-hidden="true" />
      )}
    </section>
  );
}
