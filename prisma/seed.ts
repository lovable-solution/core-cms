import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CORE_DIR = path.join(__dirname, '../../core');
const MEDIA_BUCKET = 'core-media';

function rgbLineToHex(css: string, varName: string): string {
  const match = css.match(new RegExp(`--${varName}:\\s*([0-9]+)\\s+([0-9]+)\\s+([0-9]+)`));
  if (!match) throw new Error(`Missing --${varName} in globals.css`);
  const [, r, g, b] = match;
  return `#${[r, g, b].map((n) => Number(n).toString(16).padStart(2, '0')).join('')}`;
}

function extractBlock(css: string, selector: string): string {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Missing ${selector} block in globals.css`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  return css.slice(open, close);
}

function parseThemeMode(css: string, selector: string) {
  const block = extractBlock(css, selector);
  return {
    bg: rgbLineToHex(block, 'bg'),
    surface: rgbLineToHex(block, 'surface'),
    surfaceAlt: rgbLineToHex(block, 'surface-alt'),
    fg: rgbLineToHex(block, 'fg'),
    muted: rgbLineToHex(block, 'muted'),
    subtle: rgbLineToHex(block, 'subtle'),
    faint: rgbLineToHex(block, 'faint'),
    line: rgbLineToHex(block, 'line'),
    lineSoft: rgbLineToHex(block, 'line-soft'),
    signal: rgbLineToHex(block, 'signal'),
    signalSoft: rgbLineToHex(block, 'signal-soft'),
    signalMuted: rgbLineToHex(block, 'signal-muted'),
  };
}

async function seedContent() {
  for (const locale of ['en', 'ar'] as const) {
    const filePath = path.join(CORE_DIR, 'messages', `${locale}.json`);
    const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await prisma.contentDoc.upsert({
      where: { locale },
      update: {},
      create: { locale, draft: json, published: json },
    });
    console.log(`  content: ${locale} seeded (${Object.keys(json).length} sections)`);
  }
}

async function seedTheme() {
  const cssPath = path.join(CORE_DIR, 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');
  const light = parseThemeMode(css, ':root {');
  const dark = parseThemeMode(css, '.dark {');
  const value = { light, dark };

  const existing = await prisma.themeConfig.findFirst();
  if (existing) {
    await prisma.themeConfig.update({ where: { id: existing.id }, data: { draft: value, published: value } });
  } else {
    await prisma.themeConfig.create({ data: { draft: value, published: value } });
  }
  console.log('  theme: seeded from globals.css');
}

async function seedTypography() {
  const value = {
    sans: 'Inter',
    display: 'Space Grotesk',
    mono: 'JetBrains Mono',
    arabic: 'Noto Sans Arabic',
    arabicDisplay: 'Noto Kufi Arabic',
    scale: 1,
  };
  const existing = await prisma.typographyConfig.findFirst();
  if (existing) {
    await prisma.typographyConfig.update({ where: { id: existing.id }, data: { draft: value, published: value } });
  } else {
    await prisma.typographyConfig.create({ data: { draft: value, published: value } });
  }
  console.log('  typography: seeded');
}

async function setupStorage() {
  await prisma.$executeRawUnsafe(`
    insert into storage.buckets (id, name, public)
    values ('${MEDIA_BUCKET}', '${MEDIA_BUCKET}', true)
    on conflict (id) do nothing;
  `);
  const policies: [string, string, string][] = [
    ['core-media public read', 'select', `bucket_id = '${MEDIA_BUCKET}'`],
    ['core-media public insert', 'insert', `bucket_id = '${MEDIA_BUCKET}'`],
    ['core-media public update', 'update', `bucket_id = '${MEDIA_BUCKET}'`],
    ['core-media public delete', 'delete', `bucket_id = '${MEDIA_BUCKET}'`],
  ];
  for (const [name, command, using] of policies) {
    await prisma.$executeRawUnsafe(`drop policy if exists "${name}" on storage.objects;`);
    const clause = command === 'insert' ? `with check (${using})` : `using (${using})`;
    await prisma.$executeRawUnsafe(
      `create policy "${name}" on storage.objects for ${command} ${clause};`,
    );
  }
  console.log('  storage: bucket + RLS policies ready');
}

const MEDIA_SLOTS: { slotKey: string; file: string; alt: string }[] = [
  { slotKey: 'brand.logoDark', file: 'logo-core.png', alt: 'core+ logo' },
  { slotKey: 'brand.logoLight', file: 'logo-core-white.png', alt: 'core+ logo' },
  { slotKey: 'brand.logoPlus', file: 'logo-plus.png', alt: '' },
  { slotKey: 'hero.bgImage', file: 'hero_bg.png', alt: '' },
  { slotKey: 'about.regionsPhoto', file: 'regions.jpeg', alt: 'Core regional presence' },
  { slotKey: 'howCoreWorks.image', file: 'images/section3/1.webp', alt: '' },
  { slotKey: 'pilotPartners.image', file: 'images/section5/1.webp', alt: '' },
  { slotKey: 'coreSystems.image', file: 'images/section4/1.webp', alt: '' },
  { slotKey: 'products.hpeDashboard', file: 'products/hpe-dashboard.jpeg', alt: 'HPE dashboard' },
  { slotKey: 'products.documentEngine', file: 'products/document-engine.jpeg', alt: 'Document Production Engine' },
];

async function seedMedia() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  for (const slot of MEDIA_SLOTS) {
    const existing = await prisma.mediaAsset.findUnique({ where: { slotKey: slot.slotKey } });
    if (existing) {
      console.log(`  media: ${slot.slotKey} already seeded, skipping upload`);
      continue;
    }

    const filePath = path.join(CORE_DIR, 'public', slot.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`  media: skipping ${slot.slotKey}, file not found at ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `${slot.slotKey}/${path.basename(slot.file)}`;
    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/${MEDIA_BUCKET}/${storagePath}?upsert=true`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          apikey: apiKey,
          'Content-Type': guessContentType(slot.file),
        },
        body: fileBuffer,
      },
    );
    if (!uploadRes.ok) {
      console.error(`  media: upload failed for ${slot.slotKey}:`, await uploadRes.text());
      continue;
    }

    const url = `${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/${storagePath}`;
    const value = { url, alt: slot.alt, focalX: 0.5, focalY: 0.5, scale: 1 };
    await prisma.mediaAsset.create({ data: { slotKey: slot.slotKey, draft: value, published: value } });
    console.log(`  media: ${slot.slotKey} uploaded and seeded`);
  }
}

function guessContentType(file: string): string {
  const ext = file.split('.').pop()?.toLowerCase();
  return { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', svg: 'image/svg+xml' }[ext ?? ''] ?? 'application/octet-stream';
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'darryl.gwilliam47@outlook.com').toLowerCase();
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`  admin: ${email} already exists, skipping`);
    return;
  }

  const password = process.env.ADMIN_PASSWORD || randomPassword();
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.create({ data: { email, passwordHash } });

  console.log(`  admin: created ${email}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log(`  admin: generated password -> ${password}`);
    console.log('  admin: save this now, it will not be shown again.');
  }
}

function randomPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function main() {
  console.log('Seeding content...');
  await seedContent();
  console.log('Seeding theme...');
  await seedTheme();
  console.log('Seeding typography...');
  await seedTypography();
  console.log('Setting up storage bucket...');
  await setupStorage();
  console.log('Seeding media...');
  await seedMedia();
  console.log('Seeding admin user...');
  await seedAdmin();
  console.log('Done.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
