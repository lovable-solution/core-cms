import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { setDeep } from '@/lib/deepPath';
import { routing } from '@/i18n/routing';

export const runtime = 'nodejs';

async function loadFallback(locale: string) {
  return (await import(`@/messages/${locale}.json`)).default;
}

export async function GET(req: NextRequest) {
  const locale = req.nextUrl.searchParams.get('locale') ?? routing.defaultLocale;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return NextResponse.json({ error: 'Unknown locale' }, { status: 400 });
  }

  const doc = await prisma.contentDoc.findUnique({ where: { locale } });
  const messages = doc ? doc.draft : await loadFallback(locale);
  return NextResponse.json({ locale, messages });
}

const patchSchema = z.object({
  locale: z.string().min(2).max(5),
  key: z.string().min(1).max(500),
  value: z.union([z.string(), z.array(z.string())]),
});

export async function PATCH(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { locale, key, value } = parsed.data;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return NextResponse.json({ error: 'Unknown locale' }, { status: 400 });
  }

  const existing = await prisma.contentDoc.findUnique({ where: { locale } });
  const fallback = await loadFallback(locale);
  const baseDraft = existing ? existing.draft : fallback;
  const basePublished = existing ? existing.published : fallback;

  const nextDraft = setDeep(baseDraft as Record<string, unknown>, key, value) as Prisma.InputJsonValue;

  const doc = await prisma.contentDoc.upsert({
    where: { locale },
    update: { draft: nextDraft },
    create: { locale, draft: nextDraft, published: basePublished as Prisma.InputJsonValue },
  });

  return NextResponse.json({ ok: true, updatedAt: doc.updatedAt });
}
