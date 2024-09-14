export type ColorVariations = {
  lighter: string;
  darker: string;
  textColor: string;
};

export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

export function generateColorVariations(baseColor: string): ColorVariations {
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  const lighter = `#${Math.min(r + 40, 255)
    .toString(16)
    .padStart(2, '0')}${Math.min(g + 40, 255)
    .toString(16)
    .padStart(2, '0')}${Math.min(b + 40, 255)
    .toString(16)
    .padStart(2, '0')}`;
  const darker = `#${Math.max(r - 40, 0)
    .toString(16)
    .padStart(2, '0')}${Math.max(g - 40, 0)
    .toString(16)
    .padStart(2, '0')}${Math.max(b - 40, 0)
    .toString(16)
    .padStart(2, '0')}`;
  const textColor = getContrastColor(baseColor);
  return {
    lighter,
    darker,
    textColor,
  };
}
