type MinimalNavProps = {
  name: string;
  email: string;
  github: string;
  resume?: string;
  linkedin?: string;
};

export function MinimalNav({ name, email, github, resume, linkedin }: MinimalNavProps) {
  return (
    <nav className="flex items-center justify-between py-3 font-mono text-xs uppercase tracking-[0.18em] text-[--ink-faint]">
      <a href="/" className="font-serif text-lg italic tracking-normal text-[--ink] normal-case">
        {name}
      </a>
      <div className="flex items-center gap-4">
        <a href={`mailto:${email}`} aria-label="Email" className="text-[--ink-muted] hover:text-[--ink]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        </a>
        {github && (
          <a href={github} aria-label="GitHub" className="text-[--ink-muted] hover:text-[--ink]" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.76.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.59.23 2.76.11 3.05.73.8 1.18 1.82 1.18 3.07 0 4.4-2.71 5.38-5.29 5.66.41.35.77 1.04.77 2.1 0 1.52-.014 2.74-.014 3.11 0 .3.2.66.79.55A11.52 11.52 0 0 0 23.5 12.02C23.5 5.73 18.27.5 12 .5z" />
            </svg>
          </a>
        )}
        {linkedin && (
          <a href={linkedin} aria-label="LinkedIn" className="text-[--ink-muted] hover:text-[--ink]" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M4.98 3.5C4.98 5 3.9 6 2.5 6S0 5 0 3.5 1.1 1 2.5 1 4.98 2 4.98 3.5zM0 8h5v14H0zM8.5 8h4.6v2h.1c.6-1.1 2-2.3 4.2-2.3 4.5 0 5.4 3 5.4 6.9V22H18v-6.5c0-1.6 0-3.6-2.3-3.6-2.3 0-2.6 1.8-2.6 3.4V22H8.5V8z" />
            </svg>
          </a>
        )}
        {resume && (
          <a href={resume} aria-label="Resume" target="_blank" rel="noopener noreferrer" className="text-[--ink-muted] hover:text-[--ink]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <rect x="8" y="12" width="8" height="1" rx="0.5" />
              <rect x="8" y="15" width="8" height="1" rx="0.5" />
            </svg>
          </a>
        )}
      </div>
    </nav>
  );
}
