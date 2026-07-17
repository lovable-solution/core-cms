import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.$transaction(async (tx) => {
    const docs = await tx.contentDoc.findMany();
    for (const doc of docs) {
      await tx.contentDoc.update({
        where: { id: doc.id },
        data: { published: doc.draft as Prisma.InputJsonValue },
      });
    }

    const theme = await tx.themeConfig.findFirst();
    if (theme) {
      await tx.themeConfig.update({
        where: { id: theme.id },
        data: { published: theme.draft as Prisma.InputJsonValue },
      });
    }

    const typography = await tx.typographyConfig.findFirst();
    if (typography) {
      await tx.typographyConfig.update({
        where: { id: typography.id },
        data: { published: typography.draft as Prisma.InputJsonValue },
      });
    }

    const media = await tx.mediaAsset.findMany();
    for (const asset of media) {
      await tx.mediaAsset.update({
        where: { id: asset.id },
        data: { published: asset.draft as Prisma.InputJsonValue },
      });
    }
  });

  return NextResponse.json({ ok: true, publishedAt: new Date().toISOString() });
}
