'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { humanize, setPath, type JsonValue } from '@/lib/jsonPath';
import { cn } from '@/lib/utils';

interface JsonEditorProps {
  value: Record<string, JsonValue>;
  onChange: (value: Record<string, JsonValue>) => void;
  dir?: 'ltr' | 'rtl';
}

export function JsonEditor({ value, onChange, dir = 'ltr' }: JsonEditorProps) {
  return (
    <div className="space-y-3" dir={dir}>
      {Object.entries(value).map(([key, val]) => (
        <details key={key} className="rounded-xl border border-line bg-surface/50 open:bg-surface" open>
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-display text-sm font-medium text-fg">
            {humanize(key)}
            <ChevronDown className="h-4 w-4 text-subtle transition-transform [details[open]_&]:rotate-180" />
          </summary>
          <div className="border-t border-line-soft px-4 py-4">
            <FieldNode
              value={val}
              onChange={(next) => onChange(setPath(value, [key], next) as Record<string, JsonValue>)}
              path={[key]}
            />
          </div>
        </details>
      ))}
    </div>
  );
}

function FieldNode({
  value,
  onChange,
  path,
}: {
  value: JsonValue;
  onChange: (next: JsonValue) => void;
  path: (string | number)[];
}) {
  if (value === null || value === undefined) {
    return <StringField value="" onChange={onChange} />;
  }

  if (typeof value === 'string') {
    return <StringField value={value} onChange={onChange} />;
  }

  if (typeof value === 'number') {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-32 rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-signal"
      />
    );
  }

  if (typeof value === 'boolean') {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-fg">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        {value ? 'On' : 'Off'}
      </label>
    );
  }

  if (Array.isArray(value)) {
    return <ArrayField items={value} onChange={onChange} />;
  }

  // object
  const entries = Object.entries(value);
  return (
    <div className="space-y-4">
      {entries.map(([key, val]) => (
        <div key={key}>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-subtle">
            {humanize(key)}
          </label>
          <FieldNode
            value={val}
            onChange={(next) => onChange(setPath(value, [key], next))}
            path={[...path, key]}
          />
        </div>
      ))}
    </div>
  );
}

function StringField({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const long = value.length > 70 || value.includes('\n');
  if (long) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(8, Math.max(2, Math.ceil(value.length / 60)))}
        className="w-full resize-y rounded-lg border border-line bg-bg px-3 py-2 text-sm leading-relaxed text-fg outline-none focus:border-signal"
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-signal"
    />
  );
}

function ArrayField({ items, onChange }: { items: JsonValue[]; onChange: (next: JsonValue[]) => void }) {
  const itemsAreObjects = items.length > 0 && items.every((it) => it && typeof it === 'object' && !Array.isArray(it));

  function updateAt(index: number, next: JsonValue) {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  }

  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    const template = items[0];
    const blank: JsonValue = itemsAreObjects
      ? Object.fromEntries(
          Object.entries(template as Record<string, JsonValue>).map(([k, v]) => [
            k,
            typeof v === 'string' ? '' : Array.isArray(v) ? [] : v,
          ]),
        )
      : '';
    onChange([...items, blank]);
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            'relative rounded-lg border border-line-soft p-3',
            itemsAreObjects ? 'bg-bg/60' : 'flex items-center gap-2 border-none p-0',
          )}
        >
          {itemsAreObjects ? (
            <>
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute right-2 top-2 rounded p-1 text-faint hover:text-signal"
                aria-label="Remove item"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <FieldNode value={item} onChange={(next) => updateAt(index, next)} path={[index]} />
            </>
          ) : (
            <>
              <div className="flex-1">
                <StringField value={typeof item === 'string' ? item : ''} onChange={(next) => updateAt(index, next)} />
              </div>
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="shrink-0 rounded p-2 text-faint hover:text-signal"
                aria-label="Remove item"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-subtle hover:border-signal hover:text-signal"
      >
        <Plus className="h-3.5 w-3.5" />
        Add item
      </button>
    </div>
  );
}
