import type { Metadata } from 'next';
import { Brain, TrendingUp, ShieldCheck, Sparkles, GraduationCap, Briefcase, HardDrive, Blocks, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { getElementStyles } from '@/lib/styles';
import { styleFromOverride, type CmsStyleMap } from '@/lib/styleOverride';
import { CmsIcon } from '@/components/cms/CmsIcon';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.services' });
  return { title: t('title'), description: t('description') };
}

const iconMap: Record<string, LucideIcon> = {
  'human-factors': Brain,
  'operational-excellence': TrendingUp,
  'compliance-assurance': ShieldCheck,
  'digital-ai': Sparkles,
  'competency-training': GraduationCap,
  'commercial-strategy': Briefcase,
  'legacy-modernisation': HardDrive,
  'bespoke-collaboration': Blocks,
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const styles = await getElementStyles();
  return <ServicesPageInner styles={styles} />;
}

function ServicesPageInner({ styles }: { styles: CmsStyleMap }) {
  const hero = useTranslations('pageHero.services');
  const t = useTranslations('services');
  const items = t.raw('items') as {
    id: string;
    name: string;
    lead: string;
    items: string[];
  }[];

  return (
    <>
      <PageHero
        eyebrow={hero('eyebrow')}
        index={hero('index')}
        title={hero('title')}
        description={hero('description')}
        keyPrefix="pageHero.services"
        styles={styles}
      />

      <section className="border-b border-line bg-surface/20 py-10">
        <div className="container-wide">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {items.map((s, i) => {
              const nameKey = `content:services.items.${i}.name`;
              return (
                <Link
                  key={s.id}
                  href={`/services#${s.id}` as never}
                  className="group inline-flex items-center gap-2 transition-colors hover:text-signal"
                >
                  <span className="text-signal">0{i + 1}</span>
                  <span data-cms-key={nameKey} style={styleFromOverride(styles[nameKey])}>
                    {s.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container-wide">
          <div className="divide-y divide-line border-y border-line">
            {items.map((s, i) => {
              const nameKey = `content:services.items.${i}.name`;
              const leadKey = `content:services.items.${i}.lead`;
              const iconKey = `icon:services.items.${i}`;
              return (
                <Reveal key={s.id}>
                  <div
                    id={s.id}
                    className="group grid scroll-mt-28 gap-10 py-14 md:grid-cols-[auto_1fr_auto] md:items-start md:py-20"
                  >
                    <div className="flex items-start gap-6">
                      <span className="font-mono text-xs text-signal">0{i + 1}</span>
                      <CmsIcon
                        cmsKey={iconKey}
                        icon={iconMap[s.id] ?? Brain}
                        styles={styles}
                        className="h-6 w-6 text-muted"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h2
                        className="font-display text-display-xs text-balance text-fg"
                        data-cms-key={nameKey}
                        style={styleFromOverride(styles[nameKey])}
                      >
                        {s.name}
                      </h2>
                      <p
                        className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted"
                        data-cms-key={leadKey}
                        style={styleFromOverride(styles[leadKey])}
                      >
                        {s.lead}
                      </p>
                      <ul className="mt-8 flex flex-wrap gap-2">
                        {s.items.map((it, j) => {
                          const itemKey = `content:services.items.${i}.items.${j}`;
                          return (
                            <li
                              key={it}
                              className="rounded-full border border-line bg-surface/60 px-4 py-1.5 text-sm text-fg/90"
                              data-cms-key={itemKey}
                              style={styleFromOverride(styles[itemKey])}
                            >
                              {it}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="flex items-start md:justify-end">
                      <Link
                        href={`/contact?type=${encodeURIComponent(s.id)}` as never}
                        className="group/link inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-fg transition-colors hover:border-signal hover:text-signal"
                      >
                        <span
                          data-cms-key="content:services.enquire"
                          style={styleFromOverride(styles['content:services.enquire'])}
                        >
                          {t('enquire')}
                        </span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 flip-rtl" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA styles={styles} />
    </>
  );
}
