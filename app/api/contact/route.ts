import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  company: z.string().max(200).optional().default(''),
  role: z.string().max(200).optional().default(''),
  enquiryType: z.enum([
    'consulting',
    'iso',
    'human-factors',
    'pilot',
    'product',
    'general',
  ]),
  message: z.string().min(10).max(5000),
  website: z.string().max(0).optional().default(''), // honeypot
});

const typeLabels: Record<string, string> = {
  consulting: 'Consulting / Advisory',
  iso: 'ISO / Audit',
  'human-factors': 'Human Factors',
  pilot: 'Pilot Partner',
  product: 'Product Enquiry',
  general: 'General',
};

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // Rate limit — 5 req / 10 min per IP
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous';
    const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Too many requests.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        },
      );
    }

    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid submission.' },
        { status: 400 },
      );
    }

    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
    const toEmail = process.env.RESEND_TO_EMAIL;

    if (!apiKey || !toEmail) {
      console.warn(
        '[contact] Resend not configured — logging submission instead.\n',
        parsed.data,
      );
      return NextResponse.json({ ok: true, mode: 'logged' });
    }

    const resend = new Resend(apiKey);
    const { name, email, company, role, enquiryType, message } = parsed.data;
    const label = typeLabels[enquiryType] ?? enquiryType;

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, sans-serif; color:#111; max-width:640px; margin:0 auto; padding:24px;">
        <div style="font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#E4002B;">Core · Enquiry</div>
        <h1 style="font-size:22px; margin:12px 0 24px;">${label} enquiry from ${escape(name)}</h1>
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <tr><td style="padding:8px 0; color:#666;">Name</td><td>${escape(name)}</td></tr>
          <tr><td style="padding:8px 0; color:#666;">Email</td><td>${escape(email)}</td></tr>
          <tr><td style="padding:8px 0; color:#666;">Organisation</td><td>${escape(company)}</td></tr>
          <tr><td style="padding:8px 0; color:#666;">Role</td><td>${escape(role)}</td></tr>
          <tr><td style="padding:8px 0; color:#666;">Enquiry type</td><td>${escape(label)}</td></tr>
        </table>
        <h2 style="font-size:14px; color:#666; margin:24px 0 8px; letter-spacing:0.12em; text-transform:uppercase;">Message</h2>
        <div style="white-space:pre-wrap; background:#fafafa; border:1px solid #eee; padding:16px; border-radius:12px; font-size:14px; line-height:1.6;">${escape(
          message,
        )}</div>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `[Core] ${label} enquiry from ${name}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] error', err);
    return NextResponse.json(
      { error: 'Unable to process enquiry at this time.' },
      { status: 500 },
    );
  }
}

function escape(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
