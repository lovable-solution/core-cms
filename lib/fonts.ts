export const SANS_FONTS = ['Inter', 'Manrope', 'Sora', 'Plus Jakarta Sans', 'Outfit', 'Poppins', 'Work Sans'];
export const DISPLAY_FONTS = ['Space Grotesk', 'Manrope', 'Sora', 'Clash Display', 'Outfit', 'Bricolage Grotesque', 'Poppins'];
export const MONO_FONTS = ['JetBrains Mono', 'Roboto Mono', 'Fira Code', 'IBM Plex Mono', 'Space Mono'];
export const ARABIC_FONTS = ['Noto Sans Arabic', 'Cairo', 'Tajawal', 'IBM Plex Sans Arabic'];
export const ARABIC_DISPLAY_FONTS = ['Noto Kufi Arabic', 'Cairo', 'Tajawal', 'Almarai'];

export type TypographyTokens = {
  sans: string;
  display: string;
  mono: string;
  arabic: string;
  arabicDisplay: string;
  scale: number;
};

const ALL_FAMILIES = Array.from(
  new Set([...SANS_FONTS, ...DISPLAY_FONTS, ...MONO_FONTS, ...ARABIC_FONTS, ...ARABIC_DISPLAY_FONTS]),
);

export function googleFontsHref(weights = '400;500;600;700') {
  const families = ALL_FAMILIES.map((f) => `family=${encodeURIComponent(f)}:wght@${weights}`).join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
