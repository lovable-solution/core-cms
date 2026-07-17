import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminEditor } from '@/components/admin/AdminEditor';

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  if (!(await getAdminSession())) redirect('/admin/login');
  const { locale = 'en' } = await searchParams;
  return (
    <AdminShell>
      <AdminEditor mode="media" locale={locale} path="/" />
    </AdminShell>
  );
}
