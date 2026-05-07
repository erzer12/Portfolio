'use client';

import { useState, useTransition } from 'react';
import { saveProfileAction } from '@/app/actions';
import { FileUpload } from '@/components/ui/FileUpload';
import type { Profile } from '@/types';

type Props = { profile: Profile | null };

export function ProfileTab({ profile }: Props) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState('');

    const [form, setForm] = useState({
    name: profile?.name ?? '',
    tagline: profile?.tagline ?? '',
    summary: profile?.summary ?? '',
    location: profile?.location ?? '',
    email: profile?.email ?? '',
    resume: profile?.resume ?? '',
    image: profile?.image ?? '',
    github: profile?.social?.github ?? '',
    linkedin: profile?.social?.linkedin ?? '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleResumeUploadSuccess(url: string) {
    setForm((prev) => ({ ...prev, resume: url }));
  }

  function handleImageUploadSuccess(url: string) {
    setForm((prev) => ({ ...prev, image: url }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    startTransition(async () => {
      try {
        await saveProfileAction({
          name: form.name,
          tagline: form.tagline,
          summary: form.summary,
          location: form.location,
          email: form.email,
          resume: form.resume,
          image: form.image,
          social: { github: form.github, linkedin: form.linkedin },
        });
        setMsg('Saved.');
      } catch {
        setMsg('Error saving.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {[
        { label: 'Name', name: 'name', type: 'input' },
        { label: 'Tagline', name: 'tagline', type: 'input' },
        { label: 'Location', name: 'location', type: 'input' },
        { label: 'Email', name: 'email', type: 'input' },
        { label: 'GitHub URL', name: 'github', type: 'input' },
        { label: 'LinkedIn URL', name: 'linkedin', type: 'input' },
      ].map(({ label, name }) => (
        <Field key={name} label={label}>
          <input
            name={name}
            value={form[name as keyof typeof form]}
            onChange={handleChange}
            className="admin-input"
          />
        </Field>
      ))}

      <Field label="Profile Image Link">
        <div className="flex gap-4 items-start">
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
            className="admin-input flex-1"
          />
          <div className="w-48 shrink-0">
            <FileUpload 
              onUploadSuccess={handleImageUploadSuccess} 
              accept="image/*" 
              label="Upload Image" 
            />
          </div>
        </div>
      </Field>

      <Field label="Resume Link or PDF">
        <div className="flex gap-4 items-start">
          <input
            name="resume"
            value={form.resume}
            onChange={handleChange}
            placeholder="https://..."
            className="admin-input flex-1"
          />
          <div className="w-48 shrink-0">
            <FileUpload 
              onUploadSuccess={handleResumeUploadSuccess} 
              accept="application/pdf,image/*" 
              label="Upload PDF" 
            />
          </div>
        </div>
      </Field>

      <Field label="Summary">
        <textarea
          name="summary"
          value={form.summary}
          onChange={handleChange}
          rows={4}
          className="admin-input"
        />
      </Field>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={isPending} className="admin-btn">
          {isPending ? 'Saving…' : 'Save Profile'}
        </button>
        {msg && <p className="font-mono text-xs text-[--ink-muted]">{msg}</p>}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block font-mono text-xs uppercase tracking-[0.12em] text-[--ink-muted]">
        {label}
      </label>
      {children}
    </div>
  );
}
