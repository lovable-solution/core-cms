import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { THEME_FALLBACK } from '@/lib/theme';

export const runtime = 'nodejs';

const tokensSchema = z.object({
  bg: z.string(),
  surface: z.string(),
  surfaceAlt: z.string(),
  fg: z.string(),
  muted: z.string(),
  subtle: z.string(),
  faint: z.string(),
  line: z.string(),
  lineSoft: z.string(),
  signal: z.string(),
  signalSoft: z.string(),
  signalMuted: z.string(),
});

const patchSchema = z.object({
  light: tokensSchema.partial().optional(),
  dark: tokensSchema.partial().optional(),
});

export async function GET() {
  const row = await prisma.themeConfig.findFirst();
  const value = row ? row.draft : THEME_FALLBACK;
  return NextResponse.json({ theme: value });
}

export async function PATCH(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const existing = await prisma.themeConfig.findFirst();
  const baseDraft = existing ? (existing.draft as typeof THEME_FALLBACK) : THEME_FALLBACK;
  const basePublished = existing ? existing.published : THEME_FALLBACK;

  const nextDraft = {
    light: { ...baseDraft.light, ...parsed.data.light },
    dark: { ...baseDraft.dark, ...parsed.data.dark },
  };

  const row = existing
    ? await prisma.themeConfig.update({ where: { id: existing.id }, data: { draft: nextDraft } })
    : await prisma.themeConfig.create({ data: { draft: nextDraft, published: basePublished as object } });

  return NextResponse.json({ ok: true, theme: row.draft, updatedAt: row.updatedAt });
}
