const MEDIA_BUCKET = 'cms-media';

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars are not configured');
  return { url, key };
}

// Calls the Storage REST API directly instead of going through
// @supabase/supabase-js: createClient() unconditionally spins up a Realtime
// (WebSocket) client we never use for a plain upload, which is unstable in
// serverless Node runtimes without native WebSocket support. A raw fetch()
// avoids that entire surface for what's just one HTTP call.
export async function uploadMediaFile(file: File): Promise<{ url: string; path: string }> {
  const { url, key } = getConfig();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const res = await fetch(`${url}/storage/v1/object/${MEDIA_BUCKET}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    // Include the target URL (not a secret — it's the NEXT_PUBLIC_ Supabase
    // project URL) since this only ever reaches server logs (the API route
    // returns a generic message to the client) and has already been the key
    // clue for diagnosing which deployment/env was actually being hit.
    throw new Error(`Supabase upload failed (${res.status}) url=${url} : ${text}`);
  }

  return { url: `${url}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`, path };
}
