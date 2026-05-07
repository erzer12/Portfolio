'use client';

import { useState, useTransition } from 'react';
import { submitTestimonialAction, sendContactEmailAction } from '@/app/actions';

export function ContactSection() {
  const [activeTab, setActiveTab] = useState<'contact' | 'testimonial'>('contact');
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

  const handleTestimonialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const message = formData.get('message') as string;

    if (!name || !role || !message) {
      setMsg('Please fill out all fields.');
      return;
    }

    setMsg('');
    startTransition(async () => {
      try {
        await submitTestimonialAction({ name, role, message, rating: 5 });
        setMsg('Thanks! Your testimonial has been submitted for review.');
        (e.target as HTMLFormElement).reset();
      } catch {
        setMsg('Something went wrong. Please try again.');
      }
    });
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
      setMsg('Please fill out all fields.');
      return;
    }

    setMsg('');
    startTransition(async () => {
      try {
        await sendContactEmailAction({ name, email, message });
        setMsg('Message sent! I will get back to you soon.');
        (e.target as HTMLFormElement).reset();
      } catch (error: any) {
        setMsg(error.message || 'Something went wrong. Please try again.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-[--rule] pb-2 font-mono text-xs uppercase tracking-[0.14em]">
        <button 
          onClick={() => { setActiveTab('contact'); setMsg(''); }}
          className={`transition-colors ${activeTab === 'contact' ? 'text-[--ink]' : 'text-[--ink-faint] hover:text-[--ink-muted]'}`}
        >
          Contact me
        </button>
        <span className="text-[--ink-faint]">|</span>
        <button 
          onClick={() => { setActiveTab('testimonial'); setMsg(''); }}
          className={`transition-colors ${activeTab === 'testimonial' ? 'text-[--ink]' : 'text-[--ink-faint] hover:text-[--ink-muted]'}`}
        >
          Testimonial
        </button>
      </div>

      {activeTab === 'contact' ? (
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input name="name" disabled={isPending} className="border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Name" />
            <input name="email" type="email" disabled={isPending} className="border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Email" />
          </div>
          <textarea name="message" disabled={isPending} className="min-h-32 w-full border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Message" />
          <div className="flex items-center gap-4">
            <button type="submit" disabled={isPending} className="border border-[--ink] px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] hover:bg-[--ink] hover:text-[--bg] transition-colors disabled:opacity-50">
              {isPending ? 'Sending...' : 'Send'}
            </button>
            {msg && <p className="font-mono text-xs text-[--ink-muted]">{msg}</p>}
          </div>
        </form>
      ) : (
        <form onSubmit={handleTestimonialSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input name="name" className="border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Your Name" disabled={isPending} />
            <input name="role" className="border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Your Role / Company" disabled={isPending} />
          </div>
          <textarea name="message" className="min-h-32 w-full border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Your Testimonial" disabled={isPending} />
          <div className="flex items-center gap-4">
            <button type="submit" disabled={isPending} className="border border-[--ink] px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] hover:bg-[--ink] hover:text-[--bg] transition-colors disabled:opacity-50">
              {isPending ? 'Sending...' : 'Submit Testimonial'}
            </button>
            {msg && <p className="font-mono text-xs text-[--ink-muted]">{msg}</p>}
          </div>
        </form>
      )}
    </div>
  );
}
