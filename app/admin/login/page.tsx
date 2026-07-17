import { LoginForm } from '@/components/admin/LoginForm';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-display text-2xl tracking-tight text-fg">
            core<span className="text-signal">+</span> CMS
          </div>
          <p className="mt-2 text-sm text-subtle">Sign in to edit the site.</p>
        </div>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
