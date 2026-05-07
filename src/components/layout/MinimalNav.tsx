type MinimalNavProps = {
  name: string;
  email: string;
  github: string;
};

export function MinimalNav({ name, email, github }: MinimalNavProps) {
  return (
    <nav className="flex items-center justify-between py-3 font-mono text-xs uppercase tracking-[0.18em] text-[--ink-faint]">
      <a href="/" className="font-serif text-lg italic tracking-normal text-[--ink] normal-case">
        {name}
      </a>
      <div className="flex items-center gap-4">
        <a href={`mailto:${email}`}>Email</a>
        <a href={github}>GitHub ↗</a>
      </div>
    </nav>
  );
}
