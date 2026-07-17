export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function setPath(obj: JsonValue, path: (string | number)[], value: JsonValue): JsonValue {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  if (typeof key === 'number') {
    const arr = Array.isArray(obj) ? [...obj] : [];
    arr[key] = setPath(arr[key] ?? null, rest, value);
    return arr;
  }
  const record = obj && typeof obj === 'object' && !Array.isArray(obj) ? { ...obj } : {};
  record[key] = setPath(record[key] ?? null, rest, value);
  return record;
}

export function humanize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase());
}
