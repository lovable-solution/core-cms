import { cache } from 'react';
import { draftMode } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { ElementStyleOverride, CmsStyleMap } from '@/lib/styleOverride';

export type { ElementStyleOverride, CmsStyleMap } from '@/lib/styleOverride';
export { styleFromOverride, iconStyleFromOverride } from '@/lib/styleOverride';

// Wrapped in React's request-scoped cache() so the whole page tree can call
// this from multiple components (or fetch once in a page/layout and thread
// it down as a prop, the preferred pattern here) without N duplicate queries.
export const getElementStyles = cache(async (): Promise<CmsStyleMap> => {
  try {
    const { isEnabled: isPreview } = await draftMode();
    const rows = await prisma.elementStyle.findMany();
    const map: CmsStyleMap = {};
    for (const row of rows) {
      const value = (isPreview ? row.draft : row.published) as unknown as ElementStyleOverride;
      if (value && typeof value === 'object') map[row.cmsKey] = value;
    }
    return map;
  } catch {
    return {};
  }
});
