'use client';

import { useState } from 'react';
import { uploadMediaAction } from '@/app/actions';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  accept?: string;
  label?: string;
}

export function FileUpload({ onUploadSuccess, accept = 'image/*', label = 'Upload File' }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const url = await uploadMediaAction(formData);
      onUploadSuccess(url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-center justify-center border border-dashed border-[--rule] bg-transparent py-4 text-xs font-mono uppercase tracking-[0.1em] text-[--ink-faint] transition-colors hover:border-[--ink-muted] hover:text-[--ink-muted]">
        {isUploading ? 'Uploading...' : label}
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
