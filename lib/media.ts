import { draftMode } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { MediaSlotValue } from '@/lib/mediaTypes';

export type { MediaSlotValue } from '@/lib/mediaTypes';
export { mediaImageStyle } from '@/lib/mediaTypes';

export async function getMediaSlot(slotKey: string, fallbackSrc: string, fallbackAlt = ''): Promise<MediaSlotValue> {
  const fallback: MediaSlotValue = { src: fallbackSrc, alt: fallbackAlt, focalX: 0.5, focalY: 0.5, scale: 1 };
  try {
    const { isEnabled: isPreview } = await draftMode();
    const row = await prisma.mediaAsset.findUnique({ where: { slotKey } });
    if (!row) return fallback;
    const data = (isPreview ? row.draft : row.published) as unknown as {
      url: string; alt: string; focalX: number; focalY: number; scale: number;
    };
    if (!data?.url) return fallback;
    return { src: data.url, alt: data.alt || fallbackAlt, focalX: data.focalX, focalY: data.focalY, scale: data.scale };
  } catch {
    return fallback;
  }
}
