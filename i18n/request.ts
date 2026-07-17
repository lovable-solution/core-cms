import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { draftMode } from 'next/headers';
import { routing } from './routing';
import { prisma } from '@/lib/prisma';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const fallback = (await import(`../messages/${locale}.json`)).default;

  try {
    const { isEnabled: isPreview } = await draftMode();
    const doc = await prisma.contentDoc.findUnique({ where: { locale } });
    const messages = doc ? (isPreview ? doc.draft : doc.published) : fallback;
    return { locale, messages: messages ?? fallback };
  } catch {
    return { locale, messages: fallback };
  }
});
