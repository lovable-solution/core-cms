import type { Metadata } from 'next';
import Image from 'next/image';
import { Cpu, Globe, Handshake, Target, type LucideIcon } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { DualClock } from '@/components/ui/DualClock';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { getMediaSlot, mediaImageStyle } from '@/lib/media';

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
const founderImgs = ['/left.png', '/right.png'];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const regionsPhoto = await getMediaSlot('about.regionsPhoto', '/regions.jpeg', 'Core regional presence');
  return <AboutPageInner regionsPhoto={regionsPhoto} />;
}

function AboutPageInner({ regionsPhoto }: { regionsPhoto: Awaited<ReturnType<typeof getMediaSlot>> }) {
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
      />

      <section className="border-b border-line py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <span className="eyebrow" data-cms-key="content:about.positioning.eyebrow">
              {t('positioning.eyebrow')}
            </span>
            <p
              className="mt-6 font-display text-3xl leading-tight text-fg md:text-4xl"
              data-cms-key="content:about.positioning.statement"
            >
              {t('positioning.statement')}
            </p>
            <p
              className="mt-5 max-w-md text-base leading-relaxed text-muted"
              data-cms-key="content:about.positioning.note"
            >
              {t('positioning.note')}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="grid gap-6 md:grid-cols-2">
              {pillars.map((p, i) => {
                const Icon = icons[i] ?? Target;
                return (
                  <div key={p.title} className="rounded-2xl border border-line bg-surface/30 p-6">
                    <Icon className="h-5 w-5 text-signal" strokeWidth={1.5} />
                    <div
                      className="mt-4 font-display text-lg text-fg"
                      data-cms-key={`content:about.pillars.${i}.title`}
                    >
                      {p.title}
                    </div>
                    <p
                      className="mt-2 text-sm leading-relaxed text-muted"
                      data-cms-key={`content:about.pillars.${i}.desc`}
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
              <span className="eyebrow" data-cms-key="content:about.leadershipEyebrow">
                {t('leadershipEyebrow')}
              </span>
              <h2
                className="mt-6 font-display text-display-xs text-balance tracking-tighter text-fg"
                data-cms-key="content:about.leadershipTitle"
              >
                {t('leadershipTitle')}
              </h2>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <FounderCard
              name={darryl.name}
              role={darryl.role}
              tagline={darryl.tagline}
              bullets={darryl.bullets}
              img={founderImgs[0]}
            />
            <FounderCard
              name={will.name}
              role={will.role}
              tagline={will.tagline}
              bullets={will.bullets}
              img={founderImgs[1]}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-line py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow" data-cms-key="content:about.regional.eyebrow">
              {t('regional.eyebrow')}
            </span>
            <h2 className="mt-6 font-display text-display-xs text-balance text-fg">
              <span data-cms-key="content:about.regional.title1">{t('regional.title1')}</span>{' '}
              <span className="text-muted" data-cms-key="content:about.regional.title2">
                {t('regional.title2')}
              </span>
            </h2>
            <p
              className="mt-6 max-w-xl text-pretty leading-relaxed text-muted"
              data-cms-key="content:about.regional.desc"
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

      <FinalCTA />
    </>
  );
}

function FounderCard({
  name,
  role,
  tagline,
  bullets,
  img,
}: {
  name: string;
  role: string;
  tagline?: string;
  bullets: string[];
  img: string;
}) {
  return (
    <Reveal className="h-full">
      <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-surface/30">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={img}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
          <div className="absolute bottom-6 start-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
              {role}
            </div>
            <div className="mt-1 font-display text-3xl text-ink-50">{name}</div>
          </div>
        </div>
        {tagline && (
          <p className="px-8 pt-6 text-base leading-relaxed text-muted">{tagline}</p>
        )}
        <ul className={`divide-y divide-line p-8 ${tagline ? 'pt-3' : ''}`}>
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-4 py-3 text-fg/90">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
              <span className="text-sm leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
