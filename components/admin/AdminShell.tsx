'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Palette, Type, Images, LogOut } from 'lucide-react';
import { ADMIN_PAGES } from './types';
import { PublishButton } from './PublishButton';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') ?? 'en';
  const activePath = searchParams.get('path') ?? '/';

  function setLocale(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('locale', next);
    router.push(`${pathname}?${params.toString()}`);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-black/30 px-4">
        <div className="flex items-center gap-6">
          <div className="font-display text-sm tracking-tight text-fg">
            core<span className="text-signal">+</span> CMS
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
            {(['en', 'ar'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={`rounded-md px-2.5 py-1 text-xs uppercase transition-colors ${
                  locale === l ? 'bg-white/10 text-fg' : 'text-subtle hover:text-fg'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PublishButton />
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs text-subtle transition-colors hover:text-fg"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="flex w-52 shrink-0 flex-col gap-6 overflow-y-auto border-r border-white/10 bg-black/20 p-4">
          <div>
            <div className="mb-2 px-1 text-[11px] uppercase tracking-wider text-faint">Pages</div>
            <div className="flex flex-col gap-0.5">
              {ADMIN_PAGES.map((p) => {
                const isActive = pathname === '/admin/edit' && activePath === p.path;
                return (
                  <Link
                    key={p.path}
                    href={`/admin/edit?locale=${locale}&path=${encodeURIComponent(p.path)}`}
                    className={`rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                      isActive ? 'bg-white/10 text-fg' : 'text-muted hover:bg-white/5 hover:text-fg'
                    }`}
                  >
                    {p.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 px-1 text-[11px] uppercase tracking-wider text-faint">Site-wide</div>
            <div className="flex flex-col gap-0.5">
              <ShellNavLink href={`/admin/theme?locale=${locale}`} active={pathname === '/admin/theme'} icon={Palette}>
                Theme &amp; colors
              </ShellNavLink>
              <ShellNavLink href={`/admin/typography?locale=${locale}`} active={pathname === '/admin/typography'} icon={Type}>
                Typography
              </ShellNavLink>
              <ShellNavLink href={`/admin/media?locale=${locale}`} active={pathname === '/admin/media'} icon={Images}>
                Media library
              </ShellNavLink>
            </div>
          </div>
        </nav>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}

function ShellNavLink({
  href,
  active,
  icon: Icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
        active ? 'bg-white/10 text-fg' : 'text-muted hover:bg-white/5 hover:text-fg'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </Link>
  );
}
