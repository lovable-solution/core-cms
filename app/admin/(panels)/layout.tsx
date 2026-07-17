import Link from 'next/link';
import { Wand2, LayoutDashboard, FileText, Palette, Type, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { PublishButton } from '@/components/admin/PublishButton';
import { LogoutButton } from '@/components/admin/LogoutButton';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/content/en', label: 'Content (EN)', icon: FileText },
  { href: '/admin/content/ar', label: 'Content (AR)', icon: FileText },
  { href: '/admin/theme', label: 'Colors', icon: Palette },
  { href: '/admin/typography', label: 'Fonts', icon: Type },
  { href: '/admin/media', label: 'Images', icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const previewSecret = process.env.PREVIEW_SECRET ?? '';
  const previewUrl = `${siteUrl}/api/preview?secret=${encodeURIComponent(previewSecret)}&path=%2Fen`;

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-surface/40 px-4 py-6">
        <Link href="/admin" className="font-display text-lg font-medium text-fg">
          Core CMS
        </Link>

        <Link
          href="/admin/editor"
          className="mt-6 flex items-center gap-2.5 rounded-lg bg-signal px-3 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-signal-soft"
        >
          <Wand2 className="h-4 w-4" />
          Visual Editor
        </Link>

        <div className="mt-6 text-[10px] font-medium uppercase tracking-wider text-faint">Advanced</div>
        <nav className="mt-2 flex flex-1 flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-fg"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-subtle hover:text-signal"
        >
          <ExternalLink className="h-4 w-4" />
          Preview site
        </a>
        <div className="mt-6 border-t border-line-soft pt-4">
          <LogoutButton />
        </div>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-end border-b border-line px-8 py-4">
          <PublishButton />
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
