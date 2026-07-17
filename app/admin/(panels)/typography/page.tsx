import { prisma } from '@/lib/prisma';
import { TypographyEditor, type TypographyShape } from './TypographyEditor';

export default async function TypographyPage() {
  const typography = await prisma.typographyConfig.findFirst();

  if (!typography) {
    return (
      <div>
        <h1 className="font-display text-2xl font-medium text-fg">Fonts</h1>
        <p className="mt-4 text-sm text-muted">No typography config has been seeded yet. Run the seed script first.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-fg">Fonts</h1>
      <p className="mt-1 text-sm text-muted">
        Pick a font for each role and a size scale. Changes save as draft; use Publish to go live.
      </p>
      <div className="mt-6">
        <TypographyEditor initialValue={typography.draft as TypographyShape} />
      </div>
    </div>
  );
}
