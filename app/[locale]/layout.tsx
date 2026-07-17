import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/providers/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { EditOverlay } from '@/components/cms/EditOverlay';
import { PreviewBanner } from '@/components/cms/PreviewBanner';
import { siteConfig } from '@/lib/utils';
import { getThemeCss } from '@/lib/theme';
import { getTypography, typographyToCss } from '@/lib/typography';
import { getMediaSlot } from '@/lib/media';
import { googleFontsHref } from '@/lib/fonts';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t('title'),
      template: '%s · Core',
    },
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        ar: '/ar',
      },
    },
    keywords: [
      'human performance',
      'safety-critical',
      'consulting',
      'ISO 45001',
      'fatigue management',
      'rail operations',
      'UK',
      'Dubai',
      'Middle East',
    ],
    openGraph: {
      type: 'website',
      locale: locale === 'ar' ? 'ar_AE' : 'en_GB',
      url: `${siteConfig.url}/${locale}`,
      title: t('title'),
      description: t('description'),
      siteName: 'Core',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f6' },
    { media: '(prefers-color-scheme: dark)', color: '#08080a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const t = await getTranslations({ locale, namespace: 'nav' });
  const { isEnabled: isPreview } = await draftMode();

  const [themeCss, typography, logoDark, logoLight, logoPlus] = await Promise.all([
    getThemeCss(),
    getTypography(),
    getMediaSlot('brand.logoDark', '/logo-core.png', 'core+'),
    getMediaSlot('brand.logoLight', '/logo-core-white.png', 'core+'),
    getMediaSlot('brand.logoPlus', '/logo-plus.png', ''),
  ]);
  const typographyCss = `:root { ${typographyToCss(typography)} --text-scale: ${typography.scale}; }`;
  const logos = { dark: logoDark, light: logoLight, plus: logoPlus };

  return (
    <html lang={locale} dir={dir} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href={googleFontsHref()} />
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <style dangerouslySetInnerHTML={{ __html: typographyCss }} />
        <style dangerouslySetInnerHTML={{ __html: 'html { font-size: calc(100% * var(--text-scale, 1)); }' }} />
      </head>
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        {isPreview && <PreviewBanner />}
        {/* Structured data — rendered outside the client provider so it stays server-only */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Core',
              url: siteConfig.url,
              description: siteConfig.description,
              address: [
                { '@type': 'PostalAddress', addressLocality: 'London', addressCountry: 'GB' },
                { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
              ],
              sameAs: [siteConfig.linkedin],
              logo: `${siteConfig.url}/logo.png`,
              areaServed: ['United Kingdom', 'United Arab Emirates', 'Middle East'],
              knowsAbout: [
                'Human Performance',
                'Safety-Critical Operations',
                'Fatigue Risk Management',
                'ISO 45001',
              ],
            }),
          }}
        />
        <NextIntlClientProvider>
          <Providers>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[999] focus:rounded focus:bg-signal focus:px-4 focus:py-2 focus:text-ink-950"
            >
              {t('skipToContent')}
            </a>
            <Navbar logos={logos} />
            <main id="main" className="relative">
              {children}
            </main>
            <Footer logos={logos} />
            <CookieBanner />
            <CommandPalette />
          </Providers>
        </NextIntlClientProvider>
        <EditOverlay enabled={isPreview} />
      </body>
    </html>
  );
}
