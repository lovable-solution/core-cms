import { getSupabaseBrowserClient, MEDIA_BUCKET } from '@/lib/supabaseClient';

export async function uploadImage(file: File, slotKey: string): Promise<string> {
  const supabase = getSupabaseBrowserClient();
  const ext = file.name.split('.').pop() || 'bin';
  const path = `${slotKey}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
