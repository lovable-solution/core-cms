'use client';

import { useEffect, useState } from 'react';

type Slot = { key: string; label: string; group: string; url: string };

export function MediaLibraryPanel({ onSelect }: { onSelect: (cmsKey: string) => void }) {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((json) => setSlots(json.slots ?? []))
      .catch(() => {});
  }, []);

  const groups = Array.from(new Set(slots.map((s) => s.group)));

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-sm font-medium text-fg">Media library</h3>
      {groups.map((group) => (
        <div key={group}>
          <div className="mb-2 text-[11px] uppercase tracking-wider text-subtle">{group}</div>
          <div className="grid grid-cols-2 gap-3">
            {slots
              .filter((s) => s.group === group)
              .map((slot) => (
                <button
                  key={slot.key}
                  type="button"
                  onClick={() => onSelect(`media:${slot.key}`)}
                  className="group overflow-hidden rounded-lg border border-white/10 bg-black/20 text-left transition-colors hover:border-signal"
                >
                  <div className="aspect-video w-full overflow-hidden bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slot.url} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="px-2 py-1.5 text-xs text-muted group-hover:text-fg">{slot.label}</div>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
