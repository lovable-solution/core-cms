// Dotted-path helpers for reading/writing into the nested JSON that backs
// ContentDoc (next-intl message trees). Numeric path segments address array
// indices (e.g. "whatYouCanGet.items.2.title").

function isIndex(segment: string): boolean {
  return /^\d+$/.test(segment);
}

export function getDeep(obj: unknown, path: string): unknown {
  const segments = path.split('.');
  let cur: unknown = obj;
  for (const segment of segments) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[segment];
  }
  return cur;
}

export function setDeep<T extends Record<string, unknown>>(obj: T, path: string, value: unknown): T {
  const segments = path.split('.');
  const root: Record<string, unknown> = { ...obj };
  let cur: Record<string, unknown> = root;

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    const nextSegment = segments[i + 1];
    const existing = cur[segment];
    const container = isIndex(nextSegment)
      ? (Array.isArray(existing) ? [...existing] : [])
      : { ...(typeof existing === 'object' && existing !== null ? existing : {}) };
    cur[segment] = container;
    cur = container as Record<string, unknown>;
  }

  cur[segments[segments.length - 1]] = value;
  return root as T;
}
