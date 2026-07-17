import { createClient } from '@supabase/supabase-js';

const MEDIA_BUCKET = 'cms-media';

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars are not configured');
  return createClient(url, key);
}

export async function uploadMediaFile(file: File): Promise<{ url: string; path: string }> {
  const supabase = getClient();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}
