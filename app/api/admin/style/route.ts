import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const overrideSchema = z
  .object({
    fontSize: z.number().min(8).max(160).nullable(),
    fontWeight: z.number().min(100).max(900).nullable(),
    color: z.string().max(20).nullable(),
    textAlign: z.enum(['left', 'center', 'right']).nullable(),
    offsetX: z.number().min(-200).max(200).nullable(),
    offsetY: z.number().min(-200).max(200).nullable(),
    radius: z.number().min(0).max(200).nullable(),
    buttonVariant: z.enum(['primary', 'secondary', 'ghost', 'outline']).nullable(),
    buttonSize: z.enum(['sm', 'md', 'lg']).nullable(),
    iconName: z.string().max(80).nullable(),
    iconColor: z.string().max(20).nullable(),
    iconSize: z.number().min(8).max(160).nullable(),
  })
  .partial();

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'key is required' }, { status: 400 });

  const row = await prisma.elementStyle.findUnique({ where: { cmsKey: key } });
  return NextResponse.json({ key, override: row?.draft ?? {} });
}

const patchSchema = z.object({
  key: z.string().min(1).max(500),
  patch: overrideSchema,
});

export async function PATCH(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { key, patch } = parsed.data;

  const existing = await prisma.elementStyle.findUnique({ where: { cmsKey: key } });
  const baseDraft = (existing?.draft as object) ?? {};
  const merged = { ...baseDraft, ...patch };
  // Null values in the patch mean "clear this field" — drop them from the stored bag.
  for (const [k, v] of Object.entries(merged)) if (v === null) delete (merged as Record<string, unknown>)[k];

  const row = await prisma.elementStyle.upsert({
    where: { cmsKey: key },
    update: { draft: merged },
    create: { cmsKey: key, draft: merged, published: {} },
  });

  return NextResponse.json({ ok: true, override: row.draft, updatedAt: row.updatedAt });
}
