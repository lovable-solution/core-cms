'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-subtle hover:border-signal hover:text-signal"
    >
      <LogOut className="h-3.5 w-3.5" />
      Sign out
    </button>
  );
}
