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
    top: `-${(clampPercent(Number(imageCrop?.top) || 0) / size) * 100}%`,
  };
}
