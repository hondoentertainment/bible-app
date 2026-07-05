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
| `TMDB_API_KEY` | Optional — enables movie search in Stories mode |

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

No code changes required; the existing `vercel.json` SPA rewrites apply to all domains.

## PWA updates

Production builds include a service worker (`vite-plugin-pwa`). Users get updates on next visit. Bible API responses are cached for offline favorites/passages (7-day TTL).
