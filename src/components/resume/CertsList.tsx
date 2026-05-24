'use client';

import { useState } from 'react';
import type { Certification } from '@/types';
import { displayText } from '@/lib/utils';

type CertsListProps = {
  items: Certification[];
  maxVisible?: number;
};

export function CertsList({ items, maxVisible = 5 }: CertsListProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, maxVisible);
  const hiddenCount = items.length - maxVisible;

  return (
    <div className="divide-y divide-[--rule]">
      {visible.map((item) => (
        <a
          key={item.id}
          href={item.link ?? '#'}
          target={item.link ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-4 py-3 text-[14px] text-[--ink] transition-colors hover:bg-[--rule]/30"
        >
          <span>{displayText(item.name)}</span>
          <span className="font-mono text-xs text-[--ink-muted]">{displayText(item.issuer)}</span>
        </a>
      ))}

      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-full py-3 font-mono text-xs text-[--ink-muted] hover:text-[--ink] transition-colors"
        >
          + {hiddenCount} more
        </button>
      )}

      {expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="w-full py-3 font-mono text-xs text-[--ink-muted] hover:text-[--ink] transition-colors"
        >
          Show less
        </button>
      )}
    </div>
  );
}
