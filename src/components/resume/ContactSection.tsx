type ContactSectionProps = {
  email: string;
  github: string;
  linkedin: string;
};

export function ContactSection({ email, github, linkedin }: ContactSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 font-mono text-[13px] text-neutral-800">
        <a href={`mailto:${email}`} className="block underline decoration-neutral-300 underline-offset-4">
          {email}
        </a>
        <a href={github} className="block underline decoration-neutral-300 underline-offset-4">
          github.com/erzer12
        </a>
        <a href={linkedin} className="block underline decoration-neutral-300 underline-offset-4">
          linkedin.com/in/harshil-p
        </a>
      </div>

      <form className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <input className="border-b border-neutral-300 bg-transparent py-2 outline-none" placeholder="Name" />
          <input className="border-b border-neutral-300 bg-transparent py-2 outline-none" placeholder="Email" />
        </div>
        <textarea className="min-h-32 w-full border-b border-neutral-300 bg-transparent py-2 outline-none" placeholder="Message" />
        <button type="submit" className="border border-neutral-900 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em]">
          Send
        </button>
      </form>
    </div>
  );
}
