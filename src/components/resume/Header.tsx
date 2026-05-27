import { displayText, imageCropFrameStyle } from '@/lib/utils';

type HeaderProps = {
  name: string;
  tagline: string;
  location: string;
  status: string;
  image?: string;
  imageMeta?: { x?: number; y?: number; scale?: number } | null;
  imageCrop?: { left: number; top: number; size: number } | null;
};

export function Header({ name, tagline, location, status, image, imageMeta, imageCrop }: HeaderProps) {
  return (
    <section className="grid gap-6 md:grid-cols-[1fr_120px] md:items-start">
      <div className="space-y-4">
        <div>
          <p className="font-serif text-5xl italic text-[--ink-bright] md:text-6xl">{displayText(name)}</p>
          <p className="mt-3 max-w-xl text-base leading-7 text-[--ink]">{displayText(tagline)}</p>
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[--ink-muted]">
          {displayText(location)} · {displayText(status)}
        </p>

        {/* social links moved to top navigation to avoid duplicates */}
      </div>

      {image ? (
        <div className="relative h-[120px] w-[120px] aspect-square overflow-hidden border border-[--rule]">
          <div className="absolute" style={imageCropFrameStyle(imageCrop)}>
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
              style={{
                objectPosition: imageCrop ? '50% 50%' : `${imageMeta?.x ?? 50}% ${imageMeta?.y ?? 50}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="h-[120px] w-[120px] aspect-square border border-[--rule] bg-[--bg] flex items-center justify-center" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[--ink-faint]">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" opacity="0.08" />
            <path d="M12 12c1.656 0 3-1.344 3-3s-1.344-3-3-3-3 1.344-3 3 1.344 3 3 3z" stroke="currentColor" opacity="0.12" />
          </svg>
        </div>
      )}
    </section>
  );
}
