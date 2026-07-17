import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { Mail, ArrowUpRight } from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/LinkedinIcon';
import { DualClock } from '@/components/ui/DualClock';
import { Link } from '@/i18n/routing';
import { siteConfig } from '@/lib/utils';
import { styleFromOverride, type CmsStyleMap } from '@/lib/styleOverride';
import type { BrandLogos } from '@/components/layout/Navbar';

const SERVICE_HASHES = [
  '#human-factors',
  '#operational-excellence',
  '#compliance-assurance',
  '#digital-ai',
  '#competency-training',
  '#commercial-strategy',
  '#legacy-modernisation',
  '#bespoke-collaboration',
];
const PRODUCT_HASHES = ['#hpe', '#environmental', '#station', '#dpe', '#bespoke'];

export async function Footer({ logos, styles }: { logos: BrandLogos; styles: CmsStyleMap }) {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const locale = await getLocale();

  const serviceLinks = (t.raw('links.services') as string[]).map((label, i) => ({
    label,
    href: '/services' as const,
    hash: SERVICE_HASHES[i] ?? '',
    key: `content:footer.links.services.${i}`,
  }));
  const productLinks = (t.raw('links.products') as string[]).map((label, i) => ({
    label,
    href: '/products' as const,
    hash: PRODUCT_HASHES[i] ?? '',
    key: `content:footer.links.products.${i}`,
  }));

  const cols = [
    { title: t('sections.services'), titleKey: 'content:footer.sections.services', links: serviceLinks },
    { title: t('sections.products'), titleKey: 'content:footer.sections.products', links: productLinks },
    {
      title: t('sections.company'),
      titleKey: 'content:footer.sections.company',
      links: [
        { label: nav('about'), href: '/about' as const, hash: '', key: 'content:nav.about' },
        { label: nav('contact'), href: '/contact' as const, hash: '', key: 'content:nav.contact' },
      ],
    },
  ];

  return (
    <footer className="relative mt-24 border-t border-line bg-bg">
      <div className="container-wide py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label="core+ home">
              <span className="relative inline-block">
                <Image
                  src={logos.dark.src}
                  alt="core+"
                  width={2472}
                  height={740}
                  className="h-9 w-auto dark:hidden"
                  style={logos.dark.scale !== 1 ? { transform: `scale(${logos.dark.scale})` } : undefined}
                  data-cms-key="media:brand.logoDark"
                />
                <Image
                  src={logos.light.src}
                  alt="core+"
                  width={2472}
                  height={740}
                  className="hidden h-9 w-auto dark:block"
                  style={logos.light.scale !== 1 ? { transform: `scale(${logos.light.scale})` } : undefined}
                  data-cms-key="media:brand.logoLight"
                />
                {/* Brand red plus, kept out of the dark-mode invert filter */}
                <Image
                  src={logos.plus.src}
                  alt=""
                  aria-hidden
                  width={2472}
                  height={740}
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  style={logos.plus.scale !== 1 ? { transform: `scale(${logos.plus.scale})` } : undefined}
                />
              </span>
            </Link>
            <div className="mt-8 flex flex-col gap-4">
              <DualClock />
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
                >
                  <Mail className="h-4 w-4" />
                  {siteConfig.email}
                </a>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-signal hover:text-signal"
                >
                  <LinkedinIcon className="h-3.5 w-3.5" />
                  <span data-cms-key="content:footer.linkedinLabel" style={styleFromOverride(styles['content:footer.linkedinLabel'])}>
                    {t('linkedinLabel')}
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
            {cols.map((col) => (
              <div key={col.title}>
                <h4
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle"
                  data-cms-key={col.titleKey}
                  style={styleFromOverride(styles[col.titleKey])}
                >
                  {col.title}
                </h4>
                <ul className="mt-5 flex flex-col gap-3">
                  {col.links.map((l, i) => (
                    <li key={`${l.href}${l.hash}${i}`}>
                      <Link
                        href={`${l.href}${l.hash}` as never}
                        className="group inline-flex items-center gap-1 text-sm text-fg/90 transition-colors hover:text-signal"
                      >
                        <span data-cms-key={l.key} style={styleFromOverride(styles[l.key])}>
                          {l.label}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 flip-rtl" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-subtle">
            <span>© {new Date().getFullYear()} Core.</span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-faint" />
              London · Dubai
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-faint" />
              <span
                data-cms-key="content:footer.legal.registered"
                style={styleFromOverride(styles['content:footer.legal.registered'])}
              >
                {t('legal.registered')}
              </span>
            </span>
          </div>
          <div
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint"
            data-cms-key="content:footer.legal.version"
            style={styleFromOverride(styles['content:footer.legal.version'])}
          >
            {t('legal.version')}
          </div>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none">
        <div className="container-wide pb-4">
          <div
            className={`font-display text-[20vw] font-semibold leading-none tracking-tightest text-faint/30 ${
              locale === 'ar' ? 'font-arabic-display' : ''
            }`}
          >
            {locale === 'ar' ? 'كور' : 'CORE'}
          </div>
        </div>
      </div>
    </footer>
  );
}
