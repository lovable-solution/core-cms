import { prisma } from '@/lib/prisma';
import { ThemeEditor, type ThemeShape } from './ThemeEditor';

export default async function ThemePage() {
  const theme = await prisma.themeConfig.findFirst();

  if (!theme) {
    return (
      <div>
        <h1 className="font-display text-2xl font-medium text-fg">Colors</h1>
        <p className="mt-4 text-sm text-muted">No theme has been seeded yet. Run the seed script first.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-fg">Colors</h1>
      <p className="mt-1 text-sm text-muted">
        Background and foreground colors for light and dark mode. Changes save as draft; use Publish to go live.
      </p>
      <div className="mt-6">
        <ThemeEditor initialValue={theme.draft as ThemeShape} />
      </div>
    </div>
  );
}
