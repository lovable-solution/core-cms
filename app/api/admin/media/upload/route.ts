import { NextRequest, NextResponse } from 'next/server';
import { uploadMediaFile } from '@/lib/supabaseStorage';

export const runtime = 'nodejs';

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif']);

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 8MB)' }, { status: 400 });
  }

  try {
    const { url } = await uploadMediaFile(file);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('[admin/media/upload] error', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
