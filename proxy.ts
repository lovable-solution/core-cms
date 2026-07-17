import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

// Next.js 16 renamed the `middleware` file convention to `proxy`.
const intlMiddleware = createMiddleware(routing);

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login']);
const PUBLIC_ADMIN_API_PATHS = new Set(['/api/admin/login']);

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bare root ("/") lands on the CMS login rather than the public homepage.
  // Direct links to /en, /en/about, etc. are untouched — the public site
  // still loads normally for anyone who navigates straight to a page.
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (pathname.startsWith('/api/admin')) {
    if (PUBLIC_ADMIN_API_PATHS.has(pathname)) return NextResponse.next();
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();
    const session = await getSession(req);
    if (!session) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('next', pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

async function getSession(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export const config = {
  matcher: [
    // Match all paths except api, Next internals, static files, and metadata files
    '/((?!api|_next|_vercel|opengraph-image|twitter-image|icon|apple-icon|favicon|sitemap|robots|.*\\..*).*)',
    '/api/admin/:path*',
  ],
};
