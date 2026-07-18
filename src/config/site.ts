/**
 * Canonical public origin (no trailing slash).
 * When you attach a custom domain, set VITE_SITE_ORIGIN in Vercel and rebuild,
 * and update public/sitemap.xml + index.html og:url to match.
 */
export const SITE_ORIGIN =
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined)?.replace(/\/$/, '') ||
  'https://bible-app-bice-ten.vercel.app'

export const SITE_NAME = 'Scripture Search'
