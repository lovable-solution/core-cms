import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Invalid preview secret' }, { status: 401 });
  }

  const path = req.nextUrl.searchParams.get('path') || '/en';
  (await draftMode()).enable();
  return NextResponse.redirect(new URL(path, req.url));
}
