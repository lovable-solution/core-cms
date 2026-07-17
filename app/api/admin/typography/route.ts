import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { TYPOGRAPHY_FALLBACK } from '@/lib/typography';

export const runtime = 'nodejs';

const patchSchema = z
  .object({
    sans: z.string().min(1).max(80),
    display: z.string().min(1).max(80),
    mono: z.string().min(1).max(80),
    arabic: z.string().min(1).max(80),
    arabicDisplay: z.string().min(1).max(80),
    scale: z.number().min(0.85).max(1.25),
  })
  .partial();

export async function GET() {
  const row = await prisma.typographyConfig.findFirst();
  const value = row ? row.draft : TYPOGRAPHY_FALLBACK;
  return NextResponse.json({ typography: value });
}

export async function PATCH(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const existing = await prisma.typographyConfig.findFirst();
  const baseDraft = existing ? (existing.draft as typeof TYPOGRAPHY_FALLBACK) : TYPOGRAPHY_FALLBACK;
  const basePublished = existing ? existing.published : TYPOGRAPHY_FALLBACK;

  const nextDraft = { ...baseDraft, ...parsed.data };

  const row = existing
    ? await prisma.typographyConfig.update({ where: { id: existing.id }, data: { draft: nextDraft } })
    : await prisma.typographyConfig.create({ data: { draft: nextDraft, published: basePublished as object } });

  return NextResponse.json({ ok: true, typography: row.draft, updatedAt: row.updatedAt });
}
