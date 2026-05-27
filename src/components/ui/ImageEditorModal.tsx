"use client";

import { useEffect, useRef, useState } from 'react';
import { uploadMediaAction } from '@/app/actions';

type Meta = {
  x: number;
  y: number;
  scale: number;
  crop?: { left: number; top: number; size: number };
};

export default function ImageEditorModal({
  isOpen,
  initialUrl,
  initialMeta,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  initialUrl?: string;
  initialMeta?: Meta | null;
  onClose: () => void;
  onSave: (url: string, meta: Meta) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(initialUrl);
  const [x, setX] = useState<number>(initialMeta?.x ?? 50);
  const [y, setY] = useState<number>(initialMeta?.y ?? 50);
  const [scale, setScale] = useState<number>(initialMeta?.scale ?? 1);
  const [cropLeft, setCropLeft] = useState<number>(initialMeta?.crop?.left ?? 0);
  const [cropTop, setCropTop] = useState<number>(initialMeta?.crop?.top ?? 0);
  const [cropSize, setCropSize] = useState<number>(initialMeta?.crop?.size ?? 50);
  const [isDraggingOverlay, setIsDraggingOverlay] = useState(false);
  const [isResizingOverlay, setIsResizingOverlay] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{ x: number; y: number; left: number; top: number; size: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(initialUrl);

    if (initialMeta?.crop) {
      setCropLeft(initialMeta.crop.left);
      setCropTop(initialMeta.crop.top);
      setCropSize(initialMeta.crop.size);
      setX(initialMeta.x ?? initialMeta.crop.left + initialMeta.crop.size / 2);
      setY(initialMeta.y ?? initialMeta.crop.top + initialMeta.crop.size / 2);
      setScale(initialMeta.scale ?? Math.max(1, 100 / initialMeta.crop.size));
      return;
    }

    const derivedSize = Math.min(100, Math.max(20, 100 / (initialMeta?.scale ?? 1)));
    const derivedLeft = (initialMeta?.x ?? 50) - derivedSize / 2;
    const derivedTop = (initialMeta?.y ?? 50) - derivedSize / 2;
    setCropLeft(Math.max(0, Math.min(100 - derivedSize, derivedLeft)));
    setCropTop(Math.max(0, Math.min(100 - derivedSize, derivedTop)));
    setCropSize(derivedSize);
    setX(initialMeta?.x ?? 50);
    setY(initialMeta?.y ?? 50);
    setScale(initialMeta?.scale ?? 1);
  }, [initialUrl, initialMeta, isOpen]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!isOpen) return null;

  async function handleSave() {
    setError(null);
    setIsUploading(true);
    try {
      let url = preview ?? '';
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        // uploadMediaAction is a server action
        // @ts-ignore
        url = await uploadMediaAction(formData);
      }

      const crop = {
        left: Number(cropLeft.toFixed(2)),
        top: Number(cropTop.toFixed(2)),
        size: Number(cropSize.toFixed(2)),
      };
      const centerX = crop.left + crop.size / 2;
      const centerY = crop.top + crop.size / 2;
      const derivedScale = Math.max(1, Math.min(5, Number((100 / crop.size).toFixed(2))));

      onSave(url, { x: centerX, y: centerY, scale: derivedScale, crop });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[720px] max-w-full bg-[--bg] border border-[--rule] p-6 rounded">
        <h3 className="font-mono text-sm mb-4">Upload & Adjust Image</h3>

        <div className="flex gap-6">
          <div
            ref={containerRef}
            tabIndex={0}
            role="application"
            aria-label="Image cropper. Drag the square overlay to move it and drag the corner handle to resize"
            className="w-48 h-48 bg-white border border-[--rule] overflow-hidden relative"
            style={{ touchAction: 'none' }}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: `${x}% ${y}%`,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center',
                }}
              />
            ) : (
              <div className="text-xs text-[--ink-muted] flex items-center justify-center h-full">No image</div>
            )}

            <div
              className="absolute bg-black/20 border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.18)]"
              style={{
                left: `${cropLeft}%`,
                top: `${cropTop}%`,
                width: `${cropSize}%`,
                height: `${cropSize}%`,
                cursor: isDraggingOverlay ? 'grabbing' : 'grab',
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                setIsDraggingOverlay(true);
                dragStateRef.current = {
                  x: e.clientX,
                  y: e.clientY,
                  left: cropLeft,
                  top: cropTop,
                  size: cropSize,
                };
              }}
              onPointerMove={(e) => {
                if (!isDraggingOverlay || !dragStateRef.current) return;
                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect) return;
                const dx = e.clientX - dragStateRef.current.x;
                const dy = e.clientY - dragStateRef.current.y;
                const nextLeft = Math.max(0, Math.min(100 - dragStateRef.current.size, dragStateRef.current.left + (dx / rect.width) * 100));
                const nextTop = Math.max(0, Math.min(100 - dragStateRef.current.size, dragStateRef.current.top + (dy / rect.height) * 100));
                setCropLeft(nextLeft);
                setCropTop(nextTop);
                setX(nextLeft + dragStateRef.current.size / 2);
                setY(nextTop + dragStateRef.current.size / 2);
              }}
              onPointerUp={(e) => {
                try {
                  (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
                } catch {}
                setIsDraggingOverlay(false);
                dragStateRef.current = null;
              }}
              onPointerCancel={() => {
                setIsDraggingOverlay(false);
                dragStateRef.current = null;
              }}
            >
              <div
                className="absolute w-4 h-4 bg-white/90 border border-black/20"
                style={{ right: -8, bottom: -8, cursor: 'nwse-resize' }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                  setIsResizingOverlay(true);
                  dragStateRef.current = {
                    x: e.clientX,
                    y: e.clientY,
                    left: cropLeft,
                    top: cropTop,
                    size: cropSize,
                  };
                }}
                onPointerMove={(e) => {
                  if (!isResizingOverlay || !dragStateRef.current) return;
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const dx = e.clientX - dragStateRef.current.x;
                  const dy = e.clientY - dragStateRef.current.y;
                  const delta = (Math.max(dx, dy) / rect.width) * 100;
                  const nextSize = Math.max(20, Math.min(100, dragStateRef.current.size + delta));
                  const nextLeft = Math.max(0, Math.min(100 - nextSize, dragStateRef.current.left));
                  const nextTop = Math.max(0, Math.min(100 - nextSize, dragStateRef.current.top));
                  setCropSize(nextSize);
                  setCropLeft(nextLeft);
                  setCropTop(nextTop);
                  setX(nextLeft + nextSize / 2);
                  setY(nextTop + nextSize / 2);
                  setScale(Math.max(1, Math.min(5, Number((100 / nextSize).toFixed(2)))));
                }}
                onPointerUp={(e) => {
                  try {
                    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
                  } catch {}
                  setIsResizingOverlay(false);
                  dragStateRef.current = null;
                }}
                onPointerCancel={() => {
                  setIsResizingOverlay(false);
                  dragStateRef.current = null;
                }}
              />

              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-3">
              <label className="block text-xs font-mono mb-1">Choose file</label>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={isUploading} className="admin-btn">
                {isUploading ? 'Saving...' : 'Save Image'}
              </button>
              <button onClick={onClose} className="admin-btn-sm">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}