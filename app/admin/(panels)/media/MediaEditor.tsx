'use client';

import { MediaSlotCard, type MediaDraft } from '@/components/admin/MediaSlotCard';

export function MediaEditor({ initialAssets }: { initialAssets: { slotKey: string; draft: MediaDraft }[] }) {
  if (initialAssets.length === 0) {
    return <p className="text-sm text-muted">No media slots have been seeded yet. Run the seed script first.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {initialAssets.map((asset) => (
        <MediaSlotCard key={asset.slotKey} slotKey={asset.slotKey} draft={asset.draft} />
      ))}
    </div>
  );
}
