'use client';

import { AlertCircle, CheckCircle2, Loader2, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { uploadMediaAction } from '@/app/actions';

interface FileUploadProps {
	onUploadSuccess: (url: string) => void;
	accept?: string;
	label?: string;
	helperText?: string;
}

export function FileUpload({
	onUploadSuccess,
	accept = 'image/*',
	label = 'Upload File',
	helperText = 'Click to browse or drop file here',
}: FileUploadProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadedName, setUploadedName] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		setError(null);
		setUploadedName(file.name);

		const formData = new FormData();
		formData.append('file', file);

		try {
			const url = await uploadMediaAction(formData);
			onUploadSuccess(url);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Upload failed';
			setError(errorMessage);
			setUploadedName(null);
		} finally {
			setIsUploading(false);
			e.target.value = '';
		}
	};

	return (
		<div className="flex flex-col gap-2 font-mono">
			<label
				className={`relative flex flex-col items-center justify-center border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
					isUploading
						? 'border-accent bg-accent/5 cursor-wait'
						: 'border-surface1 hover:border-accent bg-base/60 hover:bg-surface0/40'
				}`}
			>
				{isUploading ? (
					<div className="flex flex-col items-center gap-2 py-2 text-accent">
						<Loader2 className="w-5 h-5 animate-spin" />
						<span className="text-xs font-semibold tracking-wider uppercase">
							Uploading to Supabase Storage…
						</span>
					</div>
				) : uploadedName ? (
					<div className="flex items-center gap-2 py-1 text-green text-xs">
						<CheckCircle2 className="w-4 h-4" />
						<span className="truncate max-w-[220px] font-semibold">{uploadedName}</span>
						<span className="text-[10px] text-subtext0 font-normal">(Uploaded)</span>
					</div>
				) : (
					<div className="flex flex-col items-center gap-1.5 py-1 text-subtext0 group-hover:text-text">
						<UploadCloud className="w-5 h-5 text-accent transition-transform group-hover:-translate-y-0.5" />
						<span className="text-xs font-bold uppercase tracking-wider text-text">{label}</span>
						<span className="text-[11px] text-subtext0/80 font-sans">{helperText}</span>
					</div>
				)}

				<input
					type="file"
					accept={accept}
					className="hidden"
					onChange={handleFileChange}
					disabled={isUploading}
				/>
			</label>

			{error && (
				<div className="flex items-center gap-1.5 rounded-lg border border-red/30 bg-red/10 px-3 py-1.5 text-xs text-red">
					<AlertCircle className="w-3.5 h-3.5 shrink-0" />
					<span className="truncate">{error}</span>
				</div>
			)}
		</div>
	);
}
