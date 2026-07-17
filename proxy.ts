import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next.js 16 renamed the `middleware` file convention to `proxy`.
// next-intl's handler works unchanged as the default export.
export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all paths except api, Next internals, static files, and metadata files
    '/((?!api|_next|_vercel|opengraph-image|twitter-image|icon|apple-icon|favicon|sitemap|robots|.*\\..*).*)',
  ],
};
