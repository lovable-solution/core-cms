import Link from 'next/link';
import { FileText, Palette, Type, Image as ImageIcon, Wand2, ArrowUpRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [en, theme, typography, media] = await Promise.all([
    prisma.contentDoc.findUnique({ where: { locale: 'en' } }),
    prisma.themeConfig.findFirst(),
    prisma.typographyConfig.findFirst(),
    prisma.mediaAsset.findMany(),
  ]);

  const cards = [
    { href: '/admin/content/en', label: 'Content', icon: FileText, detail: en ? `Updated ${en.updatedAt.toLocaleString()}` : 'Not seeded yet' },
    { href: '/admin/theme', label: 'Colors', icon: Palette, detail: theme ? `Updated ${theme.updatedAt.toLocaleString()}` : 'Not seeded yet' },
    { href: '/admin/typography', label: 'Fonts', icon: Type, detail: typography ? `Updated ${typography.updatedAt.toLocaleString()}` : 'Not seeded yet' },
    { href: '/admin/media', label: 'Images', icon: ImageIcon, detail: `${media.length} slot${media.length === 1 ? '' : 's'}` },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-fg">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        Edit content, then hit <span className="text-fg">Publish changes</span> to make it live on the site.
      </p>

      <Link
        href="/admin/editor"
        className="group mt-6 flex items-center justify-between rounded-2xl border border-signal/40 bg-signal/10 p-6 transition-colors hover:border-signal"
      >
        <div className="flex items-center gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-signal text-ink-950">
            <Wand2 className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-lg font-medium text-fg">Open Visual Editor</div>
            <div className="text-sm text-muted">See the real site and click anything to edit it directly.</div>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-signal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>

      <div className="mt-4 text-[11px] font-medium uppercase tracking-wider text-faint">Advanced</div>
      <div className="mt-2 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ href, label, icon: Icon, detail }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-line bg-surface/50 p-5 transition-colors hover:border-signal"
          >
            <Icon className="h-5 w-5 text-signal" />
            <div className="mt-3 font-display text-base font-medium text-fg">{label}</div>
            <div className="mt-1 text-xs text-subtle">{detail}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
