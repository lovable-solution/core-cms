import { createClient } from '@supabase/supabase-js';

export const MEDIA_BUCKET = 'core-media';

export function getSupabaseBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
