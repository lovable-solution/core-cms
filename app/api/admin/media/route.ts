import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { MEDIA_SLOTS } from '@/lib/mediaSlots';

export const runtime = 'nodejs';

export async function GET() {
  const rows = await prisma.mediaAsset.findMany();
  const bySlot = new Map(rows.map((r) => [r.slotKey, r]));

  const slots = MEDIA_SLOTS.map((def) => {
    const row = bySlot.get(def.key);
    const draft = (row?.draft as Record<string, unknown>) ?? {};
    return {
      ...def,
      url: (draft.url as string) ?? def.fallbackSrc,
      alt: (draft.alt as string) ?? def.fallbackAlt,
      focalX: (draft.focalX as number) ?? 0.5,
      focalY: (draft.focalY as number) ?? 0.5,
      scale: (draft.scale as number) ?? 1,
      filter: (draft.filter as object) ?? null,
      cropAspect: (draft.cropAspect as string) ?? 'auto',
      updatedAt: row?.updatedAt ?? null,
    };
  });

  return NextResponse.json({ slots });
}

const filterSchema = z
  .object({
    brightness: z.number().min(0).max(200),
    contrast: z.number().min(0).max(200),
    saturate: z.number().min(0).max(200),
    grayscale: z.number().min(0).max(100),
    hueRotate: z.number().min(0).max(360),
  })
  .partial()
  .nullable();

const patchSchema = z.object({
  slotKey: z.string().min(1).max(200),
  url: z.string().url().optional(),
  alt: z.string().max(300).optional(),
  focalX: z.number().min(0).max(1).optional(),
  focalY: z.number().min(0).max(1).optional(),
  scale: z.number().min(0.5).max(3).optional(),
  filter: filterSchema.optional(),
  cropAspect: z.enum(['auto', '1/1', '16/9', '4/3']).optional(),
});

export async function PATCH(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { slotKey, ...fields } = parsed.data;
  const def = MEDIA_SLOTS.find((s) => s.key === slotKey);
  if (!def) return NextResponse.json({ error: 'Unknown slot' }, { status: 400 });

  const existing = await prisma.mediaAsset.findUnique({ where: { slotKey } });
  const baseDraft = (existing?.draft as Record<string, unknown>) ?? {
    url: def.fallbackSrc,
    alt: def.fallbackAlt,
    focalX: 0.5,
    focalY: 0.5,
    scale: 1,
  };
  const basePublished = existing?.published ?? baseDraft;

  const nextDraft = { ...baseDraft, ...fields };

  const row = await prisma.mediaAsset.upsert({
    where: { slotKey },
    update: { draft: nextDraft },
    create: { slotKey, draft: nextDraft, published: basePublished as object },
  });

  return NextResponse.json({ ok: true, draft: row.draft, updatedAt: row.updatedAt });
}
