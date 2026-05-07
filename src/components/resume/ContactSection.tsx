'use client';

import { useState } from 'react';

type ContactSectionProps = {
  email: string;
  github: string;
  linkedin: string;
};

export function ContactSection({ email, github, linkedin }: ContactSectionProps) {
  const [activeTab, setActiveTab] = useState<'contact' | 'links'>('contact');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-[--rule] pb-2 font-mono text-xs uppercase tracking-[0.14em]">
        <button 
          onClick={() => setActiveTab('contact')}
          className={`transition-colors ${activeTab === 'contact' ? 'text-[--ink]' : 'text-[--ink-faint] hover:text-[--ink-muted]'}`}
        >
          Contact me
        </button>
        <span className="text-[--ink-faint]">|</span>
        <button 
          onClick={() => setActiveTab('links')}
          className={`transition-colors ${activeTab === 'links' ? 'text-[--ink]' : 'text-[--ink-faint] hover:text-[--ink-muted]'}`}
        >
          My Links
        </button>
      </div>

      {activeTab === 'contact' ? (
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Name" />
            <input className="border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Email" />
          </div>
          <textarea className="min-h-32 w-full border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Message" />
          <button type="submit" className="border border-[--ink] px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] hover:bg-[--ink] hover:text-[--bg] transition-colors">
            Send
          </button>
        </form>
      ) : (
        <div className="space-y-2 font-mono text-[13px] text-[--ink]">
          <a href={`mailto:${email}`} className="block underline decoration-[--rule] underline-offset-4 hover:text-[--ink-muted]">
            {email}
          </a>
          <a href={github} className="block underline decoration-[--rule] underline-offset-4 hover:text-[--ink-muted]">
            github.com/erzer12
          </a>
          <a href={linkedin} className="block underline decoration-[--rule] underline-offset-4 hover:text-[--ink-muted]">
            linkedin.com/in/harshil-p
          </a>
        </div>
      )}
    </div>
  );
}
