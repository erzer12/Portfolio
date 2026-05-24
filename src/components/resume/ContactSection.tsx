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
      <div className="flex gap-4 border-b border-[--rule] pb-2 font-mono text-xs uppercase tracking-[0.14em]" role="tablist" aria-label="Contact options">
        <button 
          type="button"
          onClick={() => { setActiveTab('contact'); setMsg(''); }}
          className={`transition-colors ${activeTab === 'contact' ? 'text-[--ink]' : 'text-[--ink-muted] hover:text-[--ink]'}`}
          role="tab"
          aria-selected={activeTab === 'contact'}
          aria-controls="contact-panel"
        >
          Contact me
        </button>
        <span className="text-[--ink-muted]">|</span>
        <button 
          type="button"
          onClick={() => { setActiveTab('testimonial'); setMsg(''); }}
          className={`transition-colors ${activeTab === 'testimonial' ? 'text-[--ink]' : 'text-[--ink-muted] hover:text-[--ink]'}`}
          role="tab"
          aria-selected={activeTab === 'testimonial'}
          aria-controls="testimonial-panel"
        >
          Testimonial
        </button>
      </div>

      {activeTab === 'contact' ? (
        <form onSubmit={handleContactSubmit} className="space-y-4" id="contact-panel" role="tabpanel">
          <div className="grid gap-4 md:grid-cols-2">
            <label htmlFor="contact-name" className="sr-only">Name</label>
            <input id="contact-name" name="name" disabled={isPending} className="border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Name" />
            <label htmlFor="contact-email" className="sr-only">Email</label>
            <input id="contact-email" name="email" type="email" disabled={isPending} className="border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Email" />
          </div>
          <label htmlFor="contact-message" className="sr-only">Message</label>
          <textarea id="contact-message" name="message" disabled={isPending} className="min-h-32 w-full border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Message" />
          <div className="flex items-center gap-4">
            <button type="submit" disabled={isPending} className="border border-[--ink] px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] hover:bg-[--ink] hover:text-[--bg] transition-colors disabled:opacity-50">
              {isPending ? 'Sending...' : 'Send'}
            </button>
            {msg && <p className="font-mono text-xs text-[--ink-muted]">{msg}</p>}
          </div>
        </form>
      ) : (
        <form onSubmit={handleTestimonialSubmit} className="space-y-4" id="testimonial-panel" role="tabpanel">
          <div className="grid gap-4 md:grid-cols-2">
            <label htmlFor="testimonial-name" className="sr-only">Your Name</label>
            <input id="testimonial-name" name="name" className="border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Your Name" disabled={isPending} />
            <label htmlFor="testimonial-role" className="sr-only">Your Role / Company</label>
            <input id="testimonial-role" name="role" className="border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Your Role / Company" disabled={isPending} />
          </div>
          <label htmlFor="testimonial-message" className="sr-only">Your Testimonial</label>
          <textarea id="testimonial-message" name="message" className="min-h-32 w-full border-b border-[--rule] bg-transparent py-2 outline-none" placeholder="Your Testimonial" disabled={isPending} />
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
