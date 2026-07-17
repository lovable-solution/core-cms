import { draftMode } from 'next/headers';
import { prisma } from '@/lib/prisma';

export type ThemeTokens = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  fg: string;
  muted: string;
  subtle: string;
  faint: string;
  line: string;
  lineSoft: string;
  signal: string;
  signalSoft: string;
  signalMuted: string;
};

export type ThemeShape = { light: ThemeTokens; dark: ThemeTokens };

// Mirrors the static values in app/globals.css — used if the DB is unreachable or unseeded.
const FALLBACK: ThemeShape = {
  light: {
    bg: '#faf9f6', surface: '#ffffff', surfaceAlt: '#f7f5f0', fg: '#0f0f10', muted: '#3c3c3a',
    subtle: '#70706c', faint: '#aaaaa6', line: '#e2e0da', lineSoft: '#efede7',
    signal: '#e4002b', signalSoft: '#f04d64', signalMuted: '#940e28',
  },
  dark: {
    bg: '#08080a', surface: '#0f0f10', surfaceAlt: '#141416', fg: '#f6f6f5', muted: '#cccccc',
    subtle: '#8c8c88', faint: '#52524f', line: '#2a2a24', lineSoft: '#201f1c',
    signal: '#e62f4d', signalSoft: '#f5697d', signalMuted: '#940e28',
  },
};

function hexToRgbSpace(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

const CSS_VAR_NAMES: (keyof ThemeTokens)[] = [
  'bg', 'surface', 'surfaceAlt', 'fg', 'muted', 'subtle', 'faint', 'line', 'lineSoft', 'signal', 'signalSoft', 'signalMuted',
];

function toKebab(key: string): string {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function tokensToCss(tokens: ThemeTokens): string {
  return CSS_VAR_NAMES.map((key) => `--${toKebab(key)}: ${hexToRgbSpace(tokens[key])};`).join(' ');
}

export async function getThemeCss(): Promise<string> {
  let value: ThemeShape = FALLBACK;
  try {
    const { isEnabled: isPreview } = await draftMode();
    const row = await prisma.themeConfig.findFirst();
    if (row) {
      const data = (isPreview ? row.draft : row.published) as unknown as ThemeShape;
      if (data?.light && data?.dark) value = data;
    }
  } catch {
    value = FALLBACK;
  }

  return `:root { ${tokensToCss(value.light)} } .dark { ${tokensToCss(value.dark)} }`;
}
