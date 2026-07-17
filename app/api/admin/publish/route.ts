import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

function asInputJson(value: Prisma.JsonValue): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export async function POST() {
  const [contentDocs, themeConfigs, typographyConfigs, mediaAssets, elementStyles] = await Promise.all([
    prisma.contentDoc.findMany(),
    prisma.themeConfig.findMany(),
    prisma.typographyConfig.findMany(),
    prisma.mediaAsset.findMany(),
    prisma.elementStyle.findMany(),
  ]);

  await prisma.$transaction([
    ...contentDocs.map((row) =>
      prisma.contentDoc.update({ where: { id: row.id }, data: { published: asInputJson(row.draft) } }),
    ),
    ...themeConfigs.map((row) =>
      prisma.themeConfig.update({ where: { id: row.id }, data: { published: asInputJson(row.draft) } }),
    ),
    ...typographyConfigs.map((row) =>
      prisma.typographyConfig.update({ where: { id: row.id }, data: { published: asInputJson(row.draft) } }),
    ),
    ...mediaAssets.map((row) =>
      prisma.mediaAsset.update({ where: { id: row.id }, data: { published: asInputJson(row.draft) } }),
    ),
    ...elementStyles.map((row) =>
      prisma.elementStyle.update({ where: { id: row.id }, data: { published: asInputJson(row.draft) } }),
    ),
  ]);

  revalidatePath('/', 'layout');

  return NextResponse.json({
    ok: true,
    published: {
      content: contentDocs.length,
      theme: themeConfigs.length,
      typography: typographyConfigs.length,
      media: mediaAssets.length,
      styles: elementStyles.length,
    },
  });
}
