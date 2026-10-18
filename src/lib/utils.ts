export function cn(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(' ');
}

export function displayText(value: string | null | undefined) {
	return value ? value.replace(/\s+/g, ' ').trim() : '';
}

type ImageCrop = { left: number; top: number; size: number } | null | undefined;

function clampPercent(value: number) {
	return Math.max(0, Math.min(100, value));
}

export function imageCropFrameStyle(imageCrop: ImageCrop) {
	const size = Math.max(1, Math.min(100, Number(imageCrop?.size) || 100));

	return {
		width: `${(100 / size) * 100}%`,
		height: `${(100 / size) * 100}%`,
		left: `-${(clampPercent(Number(imageCrop?.left) || 0) / size) * 100}%`,
	};
}

export function ensureExternalUrl(url: string | null | undefined): string {
	if (!url) return '';
	const trimmed = url.trim();
	if (!trimmed) return '';
	if (
		trimmed.startsWith('http://') ||
		trimmed.startsWith('https://') ||
		trimmed.startsWith('mailto:') ||
		trimmed.startsWith('tel:')
	) {
		return trimmed;
	}
	return `https://${trimmed}`;
}

export const VERIFIED_LINKS = {
	linkedin: 'https://www.linkedin.com/in/harshilp1/',
	github: 'https://github.com/erzer12',
	email: 'harshilp1234@gmail.com',
	resume: 'https://drive.google.com/file/d/1qAU2dxZAVSI7ytX6YRjbaDvZ4S91NsXr/view?usp=drive_link',
	siteUrl: 'https://harshilp12.vercel.app',
};
