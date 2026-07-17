import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getMediaSlot, mediaImageStyle } from '@/lib/media';
import { styleFromOverride, type CmsStyleMap } from '@/lib/styleOverride';

const RED = '#E4002B';

export async function Hero({ styles }: { styles: CmsStyleMap }) {
  const [bg, logoLight, logoPlus, t, nav] = await Promise.all([
    getMediaSlot('hero.bgImage', '/hero_bg.png'),
    getMediaSlot('brand.logoLight', '/logo-core-white.png', 'core+'),
    getMediaSlot('brand.logoPlus', '/logo-plus.png', ''),
    getTranslations('hero'),
    getTranslations('nav'),
  ]);

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-[#05070d] text-white">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bg.src}
          alt={bg.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={mediaImageStyle(bg)}
          data-cms-key="media:hero.bgImage"
        />
        {/* Subtle scrim for text contrast */}
        <div className="absolute inset-0 bg-[#05070d]/40" />
      </div>

      {/* Centre content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* core+ wordmark, same assets as the navbar logo */}
        <h1 aria-label="core plus" className="relative inline-block">
          <Image
            src={logoLight.src}
            alt=""
            aria-hidden
            width={2472}
            height={740}
            priority
            className="h-16 w-auto sm:h-24 md:h-28"
            style={logoLight.scale !== 1 ? { transform: `scale(${logoLight.scale})` } : undefined}
            data-cms-key="media:brand.logoLight"
          />
          {/* Brand red plus, kept out of the invert filter */}
          <Image
            src={logoPlus.src}
            alt=""
            aria-hidden
            width={2472}
            height={740}
            priority
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={logoPlus.scale !== 1 ? { transform: `scale(${logoPlus.scale})` } : undefined}
          />
        </h1>

        {/* Tagline */}
        <p
          className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/85 md:text-lg"
          data-cms-key="content:hero.tagline"
          style={styleFromOverride(styles['content:hero.tagline'])}
        >
          {t('tagline')}
          <span style={{ color: RED }}>.</span>
        </p>

        {/* Primary links */}
        <div className="mt-12 flex items-center justify-center gap-7 sm:gap-10">
          <HeroLink href="/products" label={nav('products')} cmsKey="content:nav.products" styles={styles} />
          <span className="h-9 w-px bg-white/25" />
          <HeroLink href="/services" label={nav('services')} cmsKey="content:nav.services" styles={styles} />
        </div>
      </div>

      {/* Footer links */}
      <div className="absolute bottom-8 z-10 flex items-center gap-4 text-sm text-white/70 md:bottom-10">
        <Link href="/about" className="transition-colors hover:text-white">
          <span data-cms-key="content:nav.about" style={styleFromOverride(styles['content:nav.about'])}>
            {nav('about')}
          </span>
        </Link>
        <span className="h-4 w-px bg-white/25" />
        <Link href="/contact" className="transition-colors hover:text-white">
          <span data-cms-key="content:nav.contact" style={styleFromOverride(styles['content:nav.contact'])}>
            {nav('contact')}
          </span>
        </Link>
      </div>
    </section>
  );
}

function HeroLink({
  href,
  label,
  cmsKey,
  styles,
}: {
  href: string;
  label: string;
  cmsKey: string;
  styles: CmsStyleMap;
}) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3">
      <span
        className="relative pb-2 text-xl font-medium text-white md:text-2xl"
        data-cms-key={cmsKey}
        style={styleFromOverride(styles[cmsKey])}
      >
        {label}
        <span
          className="absolute inset-x-0 bottom-0 h-0.5"
          style={{ backgroundColor: RED }}
        />
      </span>
      <ArrowRight
        className="h-5 w-5 transition-transform group-hover:translate-x-1 flip-rtl"
        style={{ color: RED }}
      />
    </Link>
  );
}
