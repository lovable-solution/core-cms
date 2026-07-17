import { draftMode } from 'next/headers';
import { prisma } from '@/lib/prisma';

export type TypographyShape = {
  sans: string;
  display: string;
  mono: string;
  arabic: string;
  arabicDisplay: string;
  scale: number;
};

// Mirrors the compile-time next/font choices previously baked into layout.tsx.
export const TYPOGRAPHY_FALLBACK: TypographyShape = {
  sans: 'Inter',
  display: 'Space Grotesk',
  mono: 'JetBrains Mono',
  arabic: 'Noto Sans Arabic',
  arabicDisplay: 'Noto Kufi Arabic',
  scale: 1,
};

export async function getTypography(): Promise<TypographyShape> {
  try {
    const { isEnabled: isPreview } = await draftMode();
    const row = await prisma.typographyConfig.findFirst();
    if (row) {
      const data = (isPreview ? row.draft : row.published) as unknown as TypographyShape;
      if (data?.sans) return data;
    }
  } catch {
    // fall through to fallback
  }
  return TYPOGRAPHY_FALLBACK;
}

export function typographyToCss(t: TypographyShape): string {
  return [
    `--font-inter: '${t.sans}', system-ui, sans-serif;`,
    `--font-display: '${t.display}', system-ui, sans-serif;`,
    `--font-mono: '${t.mono}', ui-monospace, monospace;`,
    `--font-arabic: '${t.arabic}', sans-serif;`,
    `--font-arabic-display: '${t.arabicDisplay}', sans-serif;`,
  ].join(' ');
}
