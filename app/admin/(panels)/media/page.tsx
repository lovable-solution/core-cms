import { prisma } from '@/lib/prisma';
import { MediaEditor } from './MediaEditor';

export default async function MediaPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { slotKey: 'asc' } });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-fg">Images</h1>
      <p className="mt-1 text-sm text-muted">
        Upload a replacement image, click on the preview to set the focal point, and adjust the scale. Each slot saves
        independently as a draft; use Publish to make changes live.
      </p>
      <div className="mt-6">
        <MediaEditor
          initialAssets={assets.map((a) => ({
            slotKey: a.slotKey,
            draft: a.draft as { url: string; alt: string; focalX: number; focalY: number; scale: number },
          }))}
        />
      </div>
    </div>
  );
}
