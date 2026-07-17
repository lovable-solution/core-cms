import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminEditor } from '@/components/admin/AdminEditor';

export default async function AdminEditPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string; path?: string }>;
}) {
  if (!(await getAdminSession())) redirect('/admin/login');
  const { locale = 'en', path = '/' } = await searchParams;
  return (
    <AdminShell>
      <AdminEditor mode="edit" locale={locale} path={path} />
    </AdminShell>
  );
}
