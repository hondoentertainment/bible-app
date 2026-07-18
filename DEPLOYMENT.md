# Deployment

## Vercel (production)

The app deploys to Vercel as a Vite static site with serverless API routes under `/api/`.

```bash
npx vercel deploy --prod --yes
```

Or push to `main` if Git integration is enabled on the Vercel project.

### Required environment variables

Set in **Vercel → Project → Settings → Environment Variables → Production**:

| Name | Notes |
|------|--------|
| `BIBLE_API_KEY` | Required for NIV/ESV verse text |
| `SPOTIFY_CLIENT_ID` | Optional — enables Spotify search in Lyrics mode |
| `SPOTIFY_CLIENT_SECRET` | Optional |
| `TMDB_API_KEY` | **Recommended** — enables movie and TV search in Stories mode |
| `VITE_SITE_ORIGIN` | Optional — canonical URL if using a custom domain (no trailing slash) |

**Current gap:** Production currently has `BIBLE_API_KEY` only. Add `TMDB_API_KEY` (and Spotify keys if you want Lyrics search) then redeploy.

After adding variables, redeploy production.

### Sync from local `.env` (PowerShell)

```powershell
# Run from repo root — prompts once per missing key
$vars = @('BIBLE_API_KEY','SPOTIFY_CLIENT_ID','SPOTIFY_CLIENT_SECRET','TMDB_API_KEY')
foreach ($name in $vars) {
  $line = Get-Content .env | Where-Object { $_ -match "^$name=" }
  if ($line) {
    $val = ($line -split '=', 2)[1]
    echo $val | npx vercel env add $name production
  }
}
```

## Custom domain

1. Vercel → Project → **Settings → Domains**
2. Add your domain (e.g. `scripture.example.com`)
3. Configure DNS as shown (usually `CNAME` to `cname.vercel-dns.com`)
4. Vercel provisions SSL automatically
5. Set `VITE_SITE_ORIGIN=https://your.domain.com` (Production) and redeploy
6. Update `index.html` og/twitter URLs and `public/sitemap.xml` locs to the new host

The existing `vercel.json` SPA rewrites apply to all domains.

## Production smoke checklist

After each production deploy, verify:

1. **Env** — Vercel Production has `BIBLE_API_KEY` and (for Movies/TV search) `TMDB_API_KEY`
2. **Subjects** — search a topic (e.g. love); verse text loads
3. **Stories** — Books / Movies / TV tabs; open curated *Shawshank*; try a TV search if TMDB is set
4. **Lyrics** — mode loads; Spotify or manual compare works
5. **Quote** — paste a short quote and compare
6. **Deep links** — `/?mode=stories&story=shawshank` and `/?q=hope`
7. **PWA** — install prompt or offline banner still sane on a second visit
8. **Footer** — NIV attribution + privacy note visible

## PWA updates

Production builds include a service worker (`vite-plugin-pwa`). Users get updates on next visit. Bible API responses are cached for offline favorites/passages (7-day TTL).
