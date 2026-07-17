import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const row = await prisma.typographyConfig.findFirst();
  if (!row) return NextResponse.json({ error: 'Not seeded' }, { status: 404 });
  return NextResponse.json({ draft: row.draft });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const row = await prisma.typographyConfig.findFirst();
  if (!row) return NextResponse.json({ error: 'Not seeded' }, { status: 404 });

  await prisma.typographyConfig.update({ where: { id: row.id }, data: { draft: body } });
  return NextResponse.json({ ok: true });
}
