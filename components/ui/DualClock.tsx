'use client';

import { useEffect, useState } from 'react';

function formatTime(tz: string) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return '--:--';
  }
}

export function DualClock({ className }: { className?: string }) {
  // Start with null so SSR and initial client render match.
  // Time is only populated after mount — avoids hydration mismatch
  // when the server and client render at slightly different wall-clock times.
  const [times, setTimes] = useState<{ london: string; dubai: string } | null>(null);

  useEffect(() => {
    const tick = () => {
      setTimes({
        london: formatTime('Europe/London'),
        dubai: formatTime('Asia/Dubai'),
      });
    };
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  const london = times?.london ?? '--:--';
  const dubai = times?.dubai ?? '--:--';

  return (
    <div className={`flex items-center gap-6 font-mono text-xs text-muted ${className ?? ''}`}>
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
        <span className="text-muted">LDN</span>
        <span className="tabular-nums" suppressHydrationWarning>
          {london}
        </span>
      </div>
      <span className="h-px w-6 bg-faint" />
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse [animation-delay:1s]" />
        <span className="text-muted">DXB</span>
        <span className="tabular-nums" suppressHydrationWarning>
          {dubai}
        </span>
      </div>
    </div>
  );
}
