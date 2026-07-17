import type { Metadata } from 'next';
import Image from 'next/image';
import { Cpu, Globe, Handshake, Target, type LucideIcon } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { DualClock } from '@/components/ui/DualClock';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { getMediaSlot, mediaImageStyle, type MediaSlotValue } from '@/lib/media';
import { getElementStyles } from '@/lib/styles';
import { styleFromOverride, type CmsStyleMap } from '@/lib/styleOverride';
import { CmsIcon } from '@/components/cms/CmsIcon';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.about' });
  return { title: t('title'), description: t('description') };
}

const icons: LucideIcon[] = [Cpu, Target, Handshake, Globe];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [regionsPhoto, darrylPhoto, willPhoto, styles] = await Promise.all([
    getMediaSlot('about.regionsPhoto', '/regions.jpeg', 'Core regional presence'),
    getMediaSlot('about.founders.darryl', '/left.png', 'Darryl'),
    getMediaSlot('about.founders.will', '/right.png', 'Will'),
    getElementStyles(),
  ]);
  return (
    <AboutPageInner
      regionsPhoto={regionsPhoto}
      darrylPhoto={darrylPhoto}
      willPhoto={willPhoto}
      styles={styles}
    />
  );
}

function AboutPageInner({
  regionsPhoto,
  darrylPhoto,
  willPhoto,
  styles,
}: {
  regionsPhoto: MediaSlotValue;
  darrylPhoto: MediaSlotValue;
  willPhoto: MediaSlotValue;
  styles: CmsStyleMap;
}) {
  const hero = useTranslations('pageHero.about');
  const t = useTranslations('about');
  const pillars = t.raw('pillars') as { title: string; desc: string }[];
  const darryl = t.raw('founders.darryl') as {
    name: string;
    role: string;
    tagline: string;
    bullets: string[];
  };
  const will = t.raw('founders.will') as {
    name: string;
    role: string;
    tagline: string;
    bullets: string[];
  };

  return (
    <>
      <PageHero
        eyebrow={hero('eyebrow')}
        index={hero('index')}
        title={hero('title')}
        description={hero('description')}
        keyPrefix="pageHero.about"
        styles={styles}
      />

      <section className="border-b border-line py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <span
              className="eyebrow"
              data-cms-key="content:about.positioning.eyebrow"
              style={styleFromOverride(styles['content:about.positioning.eyebrow'])}
            >
              {t('positioning.eyebrow')}
            </span>
            <p
              className="mt-6 font-display text-3xl leading-tight text-fg md:text-4xl"
              data-cms-key="content:about.positioning.statement"
              style={styleFromOverride(styles['content:about.positioning.statement'])}
            >
              {t('positioning.statement')}
            </p>
            <p
              className="mt-5 max-w-md text-base leading-relaxed text-muted"
              data-cms-key="content:about.positioning.note"
              style={styleFromOverride(styles['content:about.positioning.note'])}
            >
              {t('positioning.note')}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="grid gap-6 md:grid-cols-2">
              {pillars.map((p, i) => {
                const titleKey = `content:about.pillars.${i}.title`;
                const descKey = `content:about.pillars.${i}.desc`;
                const iconKey = `icon:about.pillars.${i}`;
                return (
                  <div key={p.title} className="rounded-2xl border border-line bg-surface/30 p-6">
                    <CmsIcon
                      cmsKey={iconKey}
                      icon={icons[i] ?? Target}
                      styles={styles}
                      className="h-5 w-5 text-signal"
                      strokeWidth={1.5}
                    />
                    <div
                      className="mt-4 font-display text-lg text-fg"
                      data-cms-key={titleKey}
                      style={styleFromOverride(styles[titleKey])}
                    >
                      {p.title}
                    </div>
                    <p
                      className="mt-2 text-sm leading-relaxed text-muted"
                      data-cms-key={descKey}
                      style={styleFromOverride(styles[descKey])}
                    >
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line py-24">
        <div className="container-wide">
          <div className="flex items-end justify-between gap-6">
            <Reveal>
              <span
                className="eyebrow"
                data-cms-key="content:about.leadershipEyebrow"
                style={styleFromOverride(styles['content:about.leadershipEyebrow'])}
              >
                {t('leadershipEyebrow')}
              </span>
              <h2
                className="mt-6 font-display text-display-xs text-balance tracking-tighter text-fg"
                data-cms-key="content:about.leadershipTitle"
                style={styleFromOverride(styles['content:about.leadershipTitle'])}
              >
                {t('leadershipTitle')}
              </h2>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <FounderCard {...darryl} photo={darrylPhoto} keyPrefix="about.founders.darryl" styles={styles} />
            <FounderCard {...will} photo={willPhoto} keyPrefix="about.founders.will" styles={styles} />
          </div>
        </div>
      </section>

      <section className="border-b border-line py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-2">
          <Reveal>
            <span
              className="eyebrow"
              data-cms-key="content:about.regional.eyebrow"
              style={styleFromOverride(styles['content:about.regional.eyebrow'])}
            >
              {t('regional.eyebrow')}
            </span>
            <h2 className="mt-6 font-display text-display-xs text-balance text-fg">
              <span
                data-cms-key="content:about.regional.title1"
                style={styleFromOverride(styles['content:about.regional.title1'])}
              >
                {t('regional.title1')}
              </span>{' '}
              <span
                className="text-muted"
                data-cms-key="content:about.regional.title2"
                style={styleFromOverride(styles['content:about.regional.title2'])}
              >
                {t('regional.title2')}
              </span>
            </h2>
            <p
              className="mt-6 max-w-xl text-pretty leading-relaxed text-muted"
              data-cms-key="content:about.regional.desc"
              style={styleFromOverride(styles['content:about.regional.desc'])}
            >
              {t('regional.desc')}
            </p>
            <div className="mt-8">
              <DualClock />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
              <Image
                src={regionsPhoto.src}
                alt={regionsPhoto.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={mediaImageStyle(regionsPhoto)}
                data-cms-key="media:about.regionsPhoto"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTA styles={styles} />
    </>
  );
}

function FounderCard({
  name,
  role,
  tagline,
  bullets,
  photo,
  keyPrefix,
  styles,
}: {
  name: string;
  role: string;
  tagline?: string;
  bullets: string[];
  photo: MediaSlotValue;
  keyPrefix: string;
  styles: CmsStyleMap;
}) {
  const nameKey = `content:${keyPrefix}.name`;
  const roleKey = `content:${keyPrefix}.role`;
  const taglineKey = `content:${keyPrefix}.tagline`;

  return (
    <Reveal className="h-full">
      <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-surface/30">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={photo.src}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
            style={mediaImageStyle(photo)}
            data-cms-key={`media:${keyPrefix}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
          <div className="absolute bottom-6 start-6">
            <div
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal"
              data-cms-key={roleKey}
              style={styleFromOverride(styles[roleKey])}
            >
              {role}
            </div>
            <div
              className="mt-1 font-display text-3xl text-ink-50"
              data-cms-key={nameKey}
              style={styleFromOverride(styles[nameKey])}
            >
              {name}
            </div>
          </div>
        </div>
        {tagline && (
          <p
            className="px-8 pt-6 text-base leading-relaxed text-muted"
            data-cms-key={taglineKey}
            style={styleFromOverride(styles[taglineKey])}
          >
            {tagline}
          </p>
        )}
        <ul className={`divide-y divide-line p-8 ${tagline ? 'pt-3' : ''}`}>
          {bullets.map((b, i) => {
            const bulletKey = `content:${keyPrefix}.bullets.${i}`;
            return (
              <li key={i} className="flex items-start gap-4 py-3 text-fg/90">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                <span className="text-sm leading-relaxed" data-cms-key={bulletKey} style={styleFromOverride(styles[bulletKey])}>
                  {b}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}
