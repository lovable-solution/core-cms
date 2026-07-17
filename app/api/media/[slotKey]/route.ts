import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slotKey: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slotKey } = await params;
  const asset = await prisma.mediaAsset.findUnique({ where: { slotKey } });
  if (!asset) return NextResponse.json({ error: 'Unknown slot' }, { status: 404 });

  return NextResponse.json({ draft: asset.draft });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slotKey: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slotKey } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const existing = await prisma.mediaAsset.findUnique({ where: { slotKey } });
  if (!existing) return NextResponse.json({ error: 'Unknown slot' }, { status: 404 });

  const nextDraft = { ...(existing.draft as object), ...body };
  await prisma.mediaAsset.update({ where: { slotKey }, data: { draft: nextDraft } });
  return NextResponse.json({ ok: true });
}
