import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { JsonValue } from '@/lib/jsonPath';
import { ContentEditor } from './ContentEditor';

export default async function ContentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'ar') notFound();

  const doc = await prisma.contentDoc.findUnique({ where: { locale } });
  if (!doc) {
    return (
      <div>
        <h1 className="font-display text-2xl font-medium text-fg">Content ({locale.toUpperCase()})</h1>
        <p className="mt-4 text-sm text-muted">
          No content has been seeded for this locale yet. Run the seed script first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-fg">Content ({locale.toUpperCase()})</h1>
      <p className="mt-1 text-sm text-muted">
        Edit page copy below, grouped by section. Changes save as draft; use Publish (top right) to make them live.
      </p>
      <div className="mt-6">
        <ContentEditor locale={locale} initialValue={doc.draft as Record<string, JsonValue>} />
      </div>
    </div>
  );
}
