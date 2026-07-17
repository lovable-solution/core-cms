'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from './Button';

const typeKeys = ['consulting', 'iso', 'human-factors', 'pilot', 'product', 'general'] as const;
type TypeKey = (typeof typeKeys)[number];

type State =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export function ContactForm() {
  const search = useSearchParams();
  const t = useTranslations('contact.form');

  const initial = search.get('type') ?? 'consulting';
  const [selected, setSelected] = useState<TypeKey>(
    (typeKeys as readonly string[]).includes(initial) ? (initial as TypeKey) : 'consulting',
  );
  const [state, setState] = useState<State>({ status: 'idle' });

  useEffect(() => {
    const v = search.get('type');
    if (v && (typeKeys as readonly string[]).includes(v)) setSelected(v as TypeKey);
  }, [search]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      company: String(fd.get('company') ?? ''),
      role: String(fd.get('role') ?? ''),
      enquiryType: selected,
      message: String(fd.get('message') ?? ''),
      website: String(fd.get('website') ?? ''),
    };

    setState({ status: 'submitting' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) throw new Error(t('errorRateLimit'));
        if (res.status === 400) throw new Error(t('errorInvalid'));
        throw new Error(data?.error ?? t('errorGeneric'));
      }
      setState({ status: 'success' });
      form.reset();
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : t('errorGeneric'),
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <div>
        <Label>{t('enquiryType')}</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {typeKeys.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setSelected(k)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                selected === k
                  ? 'border-signal bg-signal/10 text-signal'
                  : 'border-line bg-surface/40 text-fg/90 hover:border-subtle'
              }`}
              aria-pressed={selected === k}
            >
              {t(`types.${k}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field name="name" label={t('name')} required autoComplete="name" />
        <Field name="email" type="email" label={t('email')} required autoComplete="email" />
        <Field name="company" label={t('company')} autoComplete="organization" />
        <Field name="role" label={t('role')} autoComplete="organization-title" />
      </div>

      <div>
        <Label>{t('message')}</Label>
        <textarea
          name="message"
          required
          rows={6}
          placeholder={t('messagePlaceholder')}
          className="mt-2 w-full resize-none rounded-2xl border border-line bg-surface/40 px-4 py-3 text-fg placeholder:text-subtle focus:border-signal focus:outline-none"
        />
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-subtle">{t('privacy')}</p>
        <Button
          type="submit"
          size="lg"
          withArrow={state.status === 'idle'}
          disabled={state.status === 'submitting' || state.status === 'success'}
        >
          {state.status === 'idle' && (
            <span className="inline-flex items-center gap-2">
              <Send className="h-4 w-4" /> {t('submit')}
            </span>
          )}
          {state.status === 'submitting' && (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> {t('sending')}
            </span>
          )}
          {state.status === 'success' && (
            <span className="inline-flex items-center gap-2">
              <Check className="h-4 w-4" /> {t('sent')}
            </span>
          )}
          {state.status === 'error' && t('retry')}
        </Button>
      </div>

      <AnimatePresence>
        {state.status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-signal/30 bg-signal/5 p-5 text-sm text-signal"
          >
            {t('successBanner')}
          </motion.div>
        )}
        {state.status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-red-500/40 bg-red-500/5 p-5 text-sm text-red-500 dark:text-red-400"
          >
            {state.message}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
      {children}
    </span>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col">
      <Label>
        {label}
        {required ? <span className="text-signal"> *</span> : null}
      </Label>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 h-12 rounded-2xl border border-line bg-surface/40 px-4 text-fg placeholder:text-subtle focus:border-signal focus:outline-none"
      />
    </label>
  );
}
