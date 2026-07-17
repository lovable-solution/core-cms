import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { Mail, ArrowUpRight } from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/LinkedinIcon';
import { DualClock } from '@/components/ui/DualClock';
import { Link } from '@/i18n/routing';
import { siteConfig } from '@/lib/utils';
import type { BrandLogos } from '@/components/layout/Navbar';

export async function Footer({ logos }: { logos: BrandLogos }) {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const locale = await getLocale();

  const cols = [
    {
      title: t('sections.services'),
      links: [
        { label: 'Human Factors & Performance', href: '/services' as const, hash: '#human-factors' },
        { label: 'Operational Excellence', href: '/services' as const, hash: '#operational-excellence' },
        { label: 'Compliance & Assurance', href: '/services' as const, hash: '#compliance-assurance' },
        { label: 'Digital Transformation & AI', href: '/services' as const, hash: '#digital-ai' },
        { label: 'Competency & Training', href: '/services' as const, hash: '#competency-training' },
        { label: 'Commercial & Bid Support', href: '/services' as const, hash: '#commercial-strategy' },
        { label: 'Legacy Modernisation', href: '/services' as const, hash: '#legacy-modernisation' },
        { label: 'Bespoke Systems', href: '/services' as const, hash: '#bespoke-collaboration' },
      ],
    },
    {
      title: t('sections.products'),
      links: [
        { label: 'Human Performance Engine', href: '/products' as const, hash: '#hpe' },
        { label: 'Environmental Intelligence', href: '/products' as const, hash: '#environmental' },
        { label: 'Smart Safety & Performance Station', href: '/products' as const, hash: '#station' },
        { label: 'Document Production Engine', href: '/products' as const, hash: '#dpe' },
        { label: 'Bespoke Systems', href: '/products' as const, hash: '#bespoke' },
      ],
    },
    {
      title: t('sections.company'),
      links: [
        { label: nav('about'), href: '/about' as const, hash: '' },
        { label: nav('contact'), href: '/contact' as const, hash: '' },
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
                />
                <Image
                  src={logos.light.src}
                  alt="core+"
                  width={2472}
                  height={740}
                  className="hidden h-9 w-auto dark:block"
                  style={logos.light.scale !== 1 ? { transform: `scale(${logos.light.scale})` } : undefined}
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
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
            {cols.map((col) => (
              <div key={col.title}>
                <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
                  {col.title}
                </h4>
                <ul className="mt-5 flex flex-col gap-3">
                  {col.links.map((l, i) => (
                    <li key={`${l.href}${l.hash}${i}`}>
                      <Link
                        href={`${l.href}${l.hash}` as never}
                        className="group inline-flex items-center gap-1 text-sm text-fg/90 transition-colors hover:text-signal"
                      >
                        {l.label}
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
              {t('legal.registered')}
            </span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
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
