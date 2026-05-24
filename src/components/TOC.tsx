"use client";

import { useEffect, useState } from 'react';

type Item = { id: string; label: string };

export default function TOC({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    const listeners: Array<() => void> = [];
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) {
        obs.observe(el);
        const enter = () => setHover(it.id);
        const leave = () => setHover((h) => (h === it.id ? null : h));
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
        listeners.push(() => {
          el.removeEventListener('mouseenter', enter);
          el.removeEventListener('mouseleave', leave);
        });
      }
    });

    return () => {
      obs.disconnect();
      listeners.forEach((fn) => fn());
    };
  }, [items]);

  function go(id: string) {
    // Special-case: allow 'Profile' to scroll to top of the page
    if (id === 'section-profile') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <nav aria-label="Table of contents" className="hidden lg:flex fixed right-6 top-1/2 z-40 -translate-y-1/2 flex-col items-end gap-3">
      {items.map((it) => {
        const isOn = active === it.id || hover === it.id;
        return (
          <button key={it.id} onClick={() => go(it.id)} className={`group relative flex items-center`}>
            <span className={`block w-3 h-10 rounded-l-full transition-colors ${isOn ? 'bg-[--ink]' : 'bg-[--rule]'}`} />
            <span className={
              `pointer-events-none absolute right-full mr-3 w-max whitespace-nowrap rounded bg-[--bg] px-3 py-1 text-xs font-mono text-[--ink] shadow transition-all ` +
              (isOn
                ? 'block opacity-100'
                : 'hidden opacity-0 group-hover:block group-focus:block group-hover:opacity-100 group-focus:opacity-100')
            }>
              {it.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
