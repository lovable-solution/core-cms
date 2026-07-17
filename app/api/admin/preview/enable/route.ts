import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

// Gated by proxy.ts (all /api/admin/** requires a valid admin session).
// Flips Next's draft-mode cookie on so every server component (theme,
// typography, media, content, element styles) starts reading `draft`
// instead of `published` for this browser session.
export async function GET(req: NextRequest) {
  (await draftMode()).enable();
  const path = req.nextUrl.searchParams.get('path') || '/admin';
  return NextResponse.redirect(new URL(path, req.url));
}
