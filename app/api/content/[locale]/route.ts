import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { setPath, type JsonValue } from '@/lib/jsonPath';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { locale } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  await prisma.contentDoc.update({
    where: { locale },
    data: { draft: body },
  });

  return NextResponse.json({ ok: true });
}

// Single-field update, used by the visual (click-to-edit) editor — avoids the
// caller needing to hold the whole document and risking a stale overwrite.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { locale } = await params;
  const body = await req.json().catch(() => null);
  const path: unknown = body?.path;
  if (!Array.isArray(path) || path.length === 0 || !path.every((p) => typeof p === 'string')) {
    return NextResponse.json({ error: 'path must be a non-empty string array' }, { status: 400 });
  }
  if (typeof body.value !== 'string') {
    return NextResponse.json({ error: 'value must be a string' }, { status: 400 });
  }

  const doc = await prisma.contentDoc.findUnique({ where: { locale } });
  if (!doc) return NextResponse.json({ error: 'Locale not seeded' }, { status: 404 });

  const nextDraft = setPath(doc.draft as unknown as JsonValue, path, body.value);
  await prisma.contentDoc.update({ where: { locale }, data: { draft: nextDraft as Prisma.InputJsonValue } });

  return NextResponse.json({ ok: true });
}
