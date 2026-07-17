import type { Metadata } from 'next';
import Image from 'next/image';
import {
  Cpu,
  Wind,
  Monitor,
  FileText,
  Wrench,
  BatteryLow,
  GraduationCap,
  CalendarClock,
  LineChart,
  FileCog,
  FolderOpen,
  Archive,
  ShieldCheck,
  Upload,
  UserCheck,
  Gauge,
  ShieldAlert,
  Lightbulb,
  BarChart3,
  Waves,
  CloudLightning,
  Siren,
  Cctv,
  Radar,
  CloudSun,
  TriangleAlert,
  LogIn,
  Fingerprint,
  BellRing,
  MessageSquare,
  LayoutDashboard,
  Target,
  LifeBuoy,
  Database,
  Clock,
  FileCheck,
  Timer,
  Lock,
  Workflow,
  Users,
  Leaf,
  Boxes,
  Sparkles,
  Blocks,
  PieChart,
  AppWindow,
  type LucideIcon,
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { GridLines, RadialGlow } from '@/components/ui/GridLines';
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
  const t = await getTranslations({ locale, namespace: 'meta.products' });
  return { title: t('title'), description: t('description') };
}

/** Brand red for the core+ plus mark. */
const RED = '#E4002B';

/** core+ wordmark, lowercase c with the red plus. */
function Cp() {
  return (
    <span className="whitespace-nowrap">
      core<span style={{ color: RED }}>+</span>
    </span>
  );
}

/** Render body copy, styling every "core+" with the red plus. */
function withCorePlus(text: string): React.ReactNode {
  const parts = text.split('core+');
  if (parts.length === 1) return text;
  return parts.flatMap((part, i) => (i === 0 ? [part] : [<Cp key={i} />, part]));
}

function DotList({
  items,
  hollow = false,
  keyPrefix,
  styles,
}: {
  items: string[];
  hollow?: boolean;
  keyPrefix: string;
  styles: CmsStyleMap;
}) {
  return (
    <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {items.map((item, i) => {
        const key = `content:${keyPrefix}.${i}`;
        return (
          <li key={item} className="grid grid-cols-[auto_1fr] gap-3 text-sm text-fg/90">
            <span
              className={
                hollow
                  ? 'mt-1.5 h-2 w-2 rounded-full border border-faint'
                  : 'mt-1.5 h-2 w-2 rounded-full bg-signal'
              }
            />
            <span className="leading-relaxed" data-cms-key={key} style={styleFromOverride(styles[key])}>
              {item}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// Meaningful icons per module, in list order.
const CORE_MODULE_ICONS = [BatteryLow, GraduationCap, CalendarClock, LineChart];
const FUTURE_MODULE_ICONS = [FileCog, FolderOpen, Archive, ShieldCheck];
const CAPABILITY_ICONS = [
  Upload, // Work Plan / Work Order import
  UserCheck, // Workforce Recommendation Engine
  GraduationCap, // Competency Assurance
  Gauge, // Fatigue & Fit for Duty Index (FFDI)
  ShieldAlert, // Task Risk Assessment
  Lightbulb, // Operational Recommendation Engine
  BarChart3, // Workforce Readiness Analytics
  FileCog, // Future Document Production Engine (DPE)
];
const ENVIRONMENTAL_ICONS = [
  Wind, // Wind speed and direction monitoring
  Waves, // Sand movement forecasting
  CloudLightning, // Weather disruption intelligence
  TriangleAlert, // Infrastructure risk alerts
  Siren, // Early warning operational triggers
  Cctv, // CCTV and weather station integration
  Radar, // Infrastructure condition monitoring
  CloudSun, // Advanced environmental forecasting
];
const STATION_ICONS = [
  LogIn, // Workforce sign-in and attendance
  Fingerprint, // Biometric authentication
  BellRing, // Safety alerts and notifications
  MessageSquare, // Live operational messaging
  FileText, // Digital document access
  LayoutDashboard, // Workforce visibility dashboards
  Target, // KPI performance monitoring
  LifeBuoy, // Depot and site induction and emergency planning
];
const DPE_FEATURE_ICONS = [FileCog, ShieldCheck, Database, Clock];
const DPE_BENEFIT_ICONS = [FileCheck, ShieldCheck, Timer, Lock];
const BESPOKE_ICONS = [
  Workflow, // Bespoke operational planning systems
  Users, // Workforce management solutions
  Leaf, // Environmental monitoring platforms
  Boxes, // Asset intelligence systems
  Sparkles, // AI-enabled operational tools
  Blocks, // Systems integration
  PieChart, // Executive dashboards
  AppWindow, // Custom operational applications
];

function ModuleList({
  items,
  icons,
  keyPrefix,
  styles,
  muted = false,
}: {
  items: string[];
  icons: LucideIcon[];
  keyPrefix: string;
  styles: CmsStyleMap;
  muted?: boolean;
}) {
  return (
    <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {items.map((item, i) => {
        const Icon = icons[i] ?? icons[icons.length - 1];
        const textKey = `content:${keyPrefix}.${i}`;
        const iconKey = `icon:${keyPrefix}.${i}`;
        return (
          <li key={item} className="grid grid-cols-[auto_1fr] items-start gap-3 text-sm text-fg/90">
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${
                muted
                  ? 'border-line bg-surface/60 text-subtle'
                  : 'border-signal/30 bg-signal/10 text-signal'
              }`}
            >
              <CmsIcon cmsKey={iconKey} icon={Icon} styles={styles} className="h-4 w-4" strokeWidth={1.6} />
            </span>
            <span className="pt-1.5 leading-relaxed" data-cms-key={textKey} style={styleFromOverride(styles[textKey])}>
              {item}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'products' });
  const list = (key: string) => t.raw(key) as string[];
  const [hpeDashboard, documentEngine, environmentalImage, stationImage, bespokeImage, styles] = await Promise.all([
    getMediaSlot('products.hpeDashboard', '/products/hpe-dashboard.jpeg', 'HPE dashboard'),
    getMediaSlot('products.documentEngine', '/products/document-engine.jpeg', 'core+ Document Production Engine'),
    getMediaSlot('products.environmental', '/products/environmental-intelligence.jpeg', ''),
    getMediaSlot('products.station', '/products/safety-station.webp', ''),
    getMediaSlot('products.bespoke', '/products/bespoke-systems.jpeg', ''),
    getElementStyles(),
  ]);

  const introParagraphs = list('intro.paragraphs');
  const hpeDesc = list('hpe.desc');
  const hpeDetailParagraphs = list('hpeDetail.paragraphs');
  const dpeFeatures = t.raw('dpe.features') as { title: string; desc: string }[];
  const dpeBenefits = t.raw('dpe.benefits') as string[];

  return (
    <>
      {/* Intro */}
      <section className="relative overflow-hidden border-b border-line pt-36 pb-20 md:pt-44">
        <GridLines className="opacity-40" />
        <RadialGlow from="rgba(230,47,77,0.08)" className="top-0 h-[520px]" />
        <div className="container-wide relative">
          <span
            className="eyebrow"
            data-cms-key="content:products.intro.eyebrow"
            style={styleFromOverride(styles['content:products.intro.eyebrow'])}
          >
            {t('intro.eyebrow')}
          </span>
          <h1
            className="mt-6 font-display text-display-sm tracking-tighter text-fg"
            data-cms-key="content:products.intro.title"
            style={styleFromOverride(styles['content:products.intro.title'])}
          >
            {t('intro.title')}
          </h1>
          <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-muted">
            {introParagraphs.map((p, i) => {
              const key = `content:products.intro.paragraphs.${i}`;
              return (
                <p key={p} data-cms-key={key} style={styleFromOverride(styles[key])}>
                  {withCorePlus(p)}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product index */}
      <section className="border-b border-line bg-surface/20 py-10">
        <div className="container-wide">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {(['hpe', 'environmental', 'station', 'dpe', 'bespoke'] as const).map((id, i) => {
              const key = `content:products.${id}.name`;
              return (
                <Link
                  key={id}
                  href={`/products#${id}` as never}
                  className="group inline-flex items-center gap-2 transition-colors hover:text-signal"
                >
                  <span className="text-signal">0{i + 1}</span>
                  <span data-cms-key={key} style={styleFromOverride(styles[key])}>
                    {t(`${id}.name`)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flagship — Human Performance Engine */}
      <section id="hpe" className="scroll-mt-28 border-b border-line py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-signal">
              <CmsIcon cmsKey="icon:products.hpe.flag" icon={Cpu} styles={styles} className="h-3.5 w-3.5" />
              <span data-cms-key="content:products.hpe.flag" style={styleFromOverride(styles['content:products.hpe.flag'])}>
                {t('hpe.flag')}
              </span>
            </span>
            <h2 className="mt-6 font-display text-display-xs tracking-tighter text-fg">
              <Cp />{' '}
              <span data-cms-key="content:products.hpe.name" style={styleFromOverride(styles['content:products.hpe.name'])}>
                {t('hpe.name')}
              </span>
            </h2>
            <p
              className="mt-5 text-pretty text-xl leading-relaxed text-fg/90"
              data-cms-key="content:products.hpe.tagline"
              style={styleFromOverride(styles['content:products.hpe.tagline'])}
            >
              {t('hpe.tagline')}
            </p>
            <div className="mt-6 max-w-xl space-y-5 text-lg leading-relaxed text-muted">
              {hpeDesc.map((p, i) => {
                const key = `content:products.hpe.desc.${i}`;
                return (
                  <p key={p} data-cms-key={key} style={styleFromOverride(styles[key])}>
                    {withCorePlus(p)}
                  </p>
                );
              })}
            </div>
            <p
              className="mt-8 font-display text-lg font-medium text-signal"
              data-cms-key="content:products.hpe.pitch"
              style={styleFromOverride(styles['content:products.hpe.pitch'])}
            >
              {t('hpe.pitch')}
            </p>
            <div className="mt-8">
              <Button href="/contact?type=product" size="lg" withArrow cmsKey="button:products.hpe.cta" styles={styles}>
                {t('hpe.cta')}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col gap-6">
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-line bg-ink-950">
                <Image
                  src={hpeDashboard.src}
                  alt={hpeDashboard.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                  style={mediaImageStyle(hpeDashboard)}
                  data-cms-key="media:products.hpeDashboard"
                />
              </div>
              <div className="rounded-2xl border border-line bg-surface/40 p-6 md:p-8">
                <div
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal"
                  data-cms-key="content:products.hpe.coreModulesLabel"
                  style={styleFromOverride(styles['content:products.hpe.coreModulesLabel'])}
                >
                  {t('hpe.coreModulesLabel')}
                </div>
                <div className="mt-5">
                  <ModuleList
                    items={list('hpe.coreModules')}
                    icons={CORE_MODULE_ICONS}
                    keyPrefix="products.hpe.coreModules"
                    styles={styles}
                  />
                </div>
                <p
                  className="mt-5 text-xs leading-relaxed text-subtle"
                  data-cms-key="content:products.hpe.coreModulesNote"
                  style={styleFromOverride(styles['content:products.hpe.coreModulesNote'])}
                >
                  {t('hpe.coreModulesNote')}
                </p>
                <div
                  className="mt-8 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-subtle"
                  data-cms-key="content:products.hpe.plannedLabel"
                  style={styleFromOverride(styles['content:products.hpe.plannedLabel'])}
                >
                  {t('hpe.plannedLabel')}
                </div>
                <div className="mt-5">
                  <ModuleList
                    items={list('hpe.plannedModules')}
                    icons={FUTURE_MODULE_ICONS}
                    keyPrefix="products.hpe.plannedModules"
                    styles={styles}
                    muted
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HPE — how it works */}
      <section className="scroll-mt-28 border-b border-line bg-surface/20 py-24">
        <div className="container-wide">
          <Reveal>
            <span
              className="eyebrow"
              data-cms-key="content:products.hpeDetail.eyebrow"
              style={styleFromOverride(styles['content:products.hpeDetail.eyebrow'])}
            >
              {t('hpeDetail.eyebrow')}
            </span>
            <h3
              className="mt-4 font-display text-display-xs text-balance tracking-tighter text-fg"
              data-cms-key="content:products.hpeDetail.title"
              style={styleFromOverride(styles['content:products.hpeDetail.title'])}
            >
              {t('hpeDetail.title')}
            </h3>
          </Reveal>
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <Reveal>
              <div className="max-w-xl space-y-5 text-lg leading-relaxed text-muted">
                {hpeDetailParagraphs.map((p, i) => {
                  const key = `content:products.hpeDetail.paragraphs.${i}`;
                  return (
                    <p key={p} data-cms-key={key} style={styleFromOverride(styles[key])}>
                      {withCorePlus(p)}
                    </p>
                  );
                })}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal"
                data-cms-key="content:products.hpeDetail.capabilitiesLabel"
                style={styleFromOverride(styles['content:products.hpeDetail.capabilitiesLabel'])}
              >
                {t('hpeDetail.capabilitiesLabel')}
              </div>
              <div className="mt-5">
                <ModuleList
                  items={list('hpeDetail.capabilities')}
                  icons={CAPABILITY_ICONS}
                  keyPrefix="products.hpeDetail.capabilities"
                  styles={styles}
                />
              </div>
              <p
                className="mt-4 text-xs leading-relaxed text-subtle"
                data-cms-key="content:products.hpeDetail.modulesNote"
                style={styleFromOverride(styles['content:products.hpeDetail.modulesNote'])}
              >
                {t('hpeDetail.modulesNote')}
              </p>
              <div className="mt-6">
                <Button href="/contact?type=product" variant="outline" withArrow cmsKey="button:products.hpeDetail.cta" styles={styles}>
                  {t('hpeDetail.cta')}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Product 02 — Environmental Intelligence */}
      <MediaProduct
        id="environmental"
        icon={Wind}
        number={t('environmental.number')}
        name={t('environmental.name')}
        tagline={t('environmental.tagline')}
        desc={list('environmental.desc')}
        listLabel={t('environmental.capabilitiesLabel')}
        list={list('environmental.capabilities')}
        icons={ENVIRONMENTAL_ICONS}
        cta={t('environmental.cta')}
        image={environmentalImage}
        aspectClass="aspect-[3/2]"
        imageFit="object-contain"
        imageRight
        styles={styles}
      />

      {/* Product 03 — Smart Safety & Performance Station */}
      <MediaProduct
        id="station"
        icon={Monitor}
        number={t('station.number')}
        name={t('station.name')}
        tagline={t('station.tagline')}
        desc={list('station.desc')}
        listLabel={t('station.capabilitiesLabel')}
        list={list('station.capabilities')}
        icons={STATION_ICONS}
        cta={t('station.cta')}
        image={stationImage}
        styles={styles}
      />

      {/* Product 04 — Document Production Engine */}
      <section id="dpe" className="scroll-mt-28 border-b border-line py-24">
        <div className="container-wide">
          <Reveal>
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle"
                data-cms-key="content:products.dpe.number"
                style={styleFromOverride(styles['content:products.dpe.number'])}
              >
                {t('dpe.number')}
              </span>
              <CmsIcon cmsKey="icon:products.dpe" icon={FileText} styles={styles} className="h-4 w-4 text-signal" strokeWidth={1.6} />
            </div>
            <h3 className="mt-5 font-display text-display-xs text-balance tracking-tighter text-fg">
              <Cp />{' '}
              <span data-cms-key="content:products.dpe.name" style={styleFromOverride(styles['content:products.dpe.name'])}>
                {t('dpe.name')}
              </span>
            </h3>
            <p
              className="mt-5 max-w-2xl text-pretty text-xl leading-relaxed text-fg/90"
              data-cms-key="content:products.dpe.tagline"
              style={styleFromOverride(styles['content:products.dpe.tagline'])}
            >
              {t('dpe.tagline')}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: information extracted from the graphic */}
            <Reveal>
              <p
                className="max-w-xl text-lg leading-relaxed text-muted"
                data-cms-key="content:products.dpe.intro"
                style={styleFromOverride(styles['content:products.dpe.intro'])}
              >
                {t('dpe.intro')}
              </p>
              <div className="mt-8 flex flex-col gap-6">
                {dpeFeatures.map((f, i) => {
                  const Icon = DPE_FEATURE_ICONS[i] ?? DPE_FEATURE_ICONS[0];
                  const titleKey = `content:products.dpe.features.${i}.title`;
                  const descKey = `content:products.dpe.features.${i}.desc`;
                  const iconKey = `icon:products.dpe.features.${i}`;
                  return (
                    <div key={f.title} className="grid grid-cols-[auto_1fr] gap-4">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-signal/30 bg-signal/10 text-signal">
                        <CmsIcon cmsKey={iconKey} icon={Icon} styles={styles} className="h-4 w-4" strokeWidth={1.7} />
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-fg" data-cms-key={titleKey} style={styleFromOverride(styles[titleKey])}>
                          {f.title}
                        </div>
                        <div className="mt-1 text-sm leading-relaxed text-muted" data-cms-key={descKey} style={styleFromOverride(styles[descKey])}>
                          {f.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {dpeBenefits.map((b, i) => {
                  const Icon = DPE_BENEFIT_ICONS[i] ?? DPE_BENEFIT_ICONS[0];
                  const key = `content:products.dpe.benefits.${i}`;
                  const iconKey = `icon:products.dpe.benefits.${i}`;
                  return (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/40 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted"
                    >
                      <CmsIcon cmsKey={iconKey} icon={Icon} styles={styles} className="h-3.5 w-3.5 text-signal" strokeWidth={1.7} />
                      <span data-cms-key={key} style={styleFromOverride(styles[key])}>
                        {b}
                      </span>
                    </span>
                  );
                })}
              </div>
            </Reveal>

            {/* Right: the source graphic */}
            <Reveal delay={0.1}>
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-line bg-ink-950">
                <Image
                  src={documentEngine.src}
                  alt={documentEngine.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                  style={mediaImageStyle(documentEngine)}
                  data-cms-key="media:products.documentEngine"
                />
              </div>
            </Reveal>
          </div>

          <Reveal>
            <p
              className="mt-10 font-display text-lg font-medium text-signal"
              data-cms-key="content:products.dpe.pitch"
              style={styleFromOverride(styles['content:products.dpe.pitch'])}
            >
              {t('dpe.pitch')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Product 05 — Bespoke Systems */}
      <MediaProduct
        id="bespoke"
        icon={Wrench}
        number={t('bespoke.number')}
        name={t('bespoke.name')}
        tagline={t('bespoke.tagline')}
        desc={list('bespoke.desc')}
        listLabel={t('bespoke.solutionsLabel')}
        list={list('bespoke.solutions')}
        icons={BESPOKE_ICONS}
        pitch={t('bespoke.pitch')}
        cta={t('bespoke.cta')}
        image={bespokeImage}
        aspectClass="aspect-[3/2]"
        imageFit="object-contain"
        priority
        imageRight
        styles={styles}
      />

      <FinalCTA styles={styles} />
    </>
  );
}

function MediaProduct({
  id,
  icon,
  number,
  name,
  tagline,
  desc,
  listLabel,
  list,
  pitch,
  cta,
  image,
  imageRight = false,
  icons,
  aspectClass = 'aspect-[4/3]',
  imageFit = 'object-cover',
  priority = false,
  styles,
}: {
  id: string;
  icon: LucideIcon;
  number: string;
  name: string;
  tagline: string;
  desc: string[];
  listLabel: string;
  list: string[];
  pitch?: string;
  cta: string;
  image: MediaSlotValue;
  imageRight?: boolean;
  icons?: LucideIcon[];
  aspectClass?: string;
  imageFit?: string;
  priority?: boolean;
  styles: CmsStyleMap;
}) {
  const numberKey = `content:products.${id}.number`;
  const nameKey = `content:products.${id}.name`;
  const taglineKey = `content:products.${id}.tagline`;
  const listLabelKey = `content:products.${id}.listLabel`;
  const pitchKey = `content:products.${id}.pitch`;
  const iconKey = `icon:products.${id}`;
  const mediaKey = `media:products.${id}`;

  const media = (
    <Reveal delay={0.1}>
      <div className={`relative ${aspectClass} overflow-hidden rounded-2xl border border-line bg-ink-950`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={imageFit}
          style={mediaImageStyle(image)}
          data-cms-key={mediaKey}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
        <CmsIcon cmsKey={iconKey} icon={icon} styles={styles} className="absolute start-5 top-5 h-6 w-6 text-ink-50" strokeWidth={1.5} />
      </div>
    </Reveal>
  );

  const content = (
    <Reveal>
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle" data-cms-key={numberKey} style={styleFromOverride(styles[numberKey])}>
        {number}
      </span>
      <h3 className="mt-5 font-display text-display-xs text-balance tracking-tighter text-fg">
        <Cp />{' '}
        <span data-cms-key={nameKey} style={styleFromOverride(styles[nameKey])}>
          {name}
        </span>
      </h3>
      <p className="mt-5 text-pretty text-xl leading-relaxed text-fg/90" data-cms-key={taglineKey} style={styleFromOverride(styles[taglineKey])}>
        {tagline}
      </p>
      <div className="mt-5 max-w-xl space-y-4 text-base leading-relaxed text-muted">
        {desc.map((p, i) => {
          const key = `content:products.${id}.desc.${i}`;
          return (
            <p key={p} data-cms-key={key} style={styleFromOverride(styles[key])}>
              {withCorePlus(p)}
            </p>
          );
        })}
      </div>
      <div className="mt-7 font-mono text-[11px] uppercase tracking-[0.2em] text-signal" data-cms-key={listLabelKey} style={styleFromOverride(styles[listLabelKey])}>
        {listLabel}
      </div>
      <div className="mt-4">
        {icons ? (
          <ModuleList items={list} icons={icons} keyPrefix={`products.${id}.list`} styles={styles} />
        ) : (
          <DotList items={list} keyPrefix={`products.${id}.list`} styles={styles} />
        )}
      </div>
      {pitch && (
        <p className="mt-7 font-display text-lg font-medium text-signal" data-cms-key={pitchKey} style={styleFromOverride(styles[pitchKey])}>
          {pitch}
        </p>
      )}
      <div className="mt-7">
        <Button href="/contact?type=product" variant="outline" withArrow cmsKey={`button:products.${id}.cta`} styles={styles}>
          {cta}
        </Button>
      </div>
    </Reveal>
  );

  return (
    <section id={id} className="scroll-mt-28 border-b border-line py-24">
      <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-center">
        {imageRight ? (
          <>
            {content}
            {media}
          </>
        ) : (
          <>
            {media}
            {content}
          </>
        )}
      </div>
    </section>
  );
}
