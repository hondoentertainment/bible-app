# Scripture Search — Bible App

Search the **NIV**, compare culture with Scripture, and build daily habits — subjects, stories, songs, and quotes in one PWA.

**Production:** https://bible-app-bice-ten.vercel.app

## Features

### Subjects
- **36 curated topics** with keyword matching (love, faith, hope, grief, and more)
- **Full-text NIV search** via [API.Bible](https://scripture.api.bible)
- **Direct reference lookup** — e.g. `John 3:16`, `Romans 8:28`
- **Filters** — Old/New Testament, curated vs. full-text results
- **ESV side-by-side** (optional, in reading settings)
- **Verse of the day**, **7-day reading plans**, **saved favorites**
- **Cross-references**, **full-chapter context**, **listen** (text-to-speech)

### Stories & Scripture
- Curated book, song, and film comparisons with NIV parallels
- Search **Goodreads** (Open Library) and **Letterboxd** (TMDB) for any title
- **Discussion prompts**, **theme trails**, **share as image**

### Spotify Lyrics
- Search Spotify (or manual entry) and compare lyrics to NIV themes via LRCLIB

### Quote
- Paste any quote, poem, or speech — matched to Scripture themes

### App-wide
- **Shareable deep links** (`?mode=stories&story=shawshank`, `?mode=lyrics&artist=…&track=…`, etc.)
- **PWA** with offline Bible passage cache for favorites
- **Daily verse notifications** (opt-in, reading settings)
- **Dark mode** and **font size** controls

## Setup

```bash
npm install
copy .env.example .env   # Windows
npm run dev
```

### Environment variables (server-side only)

| Variable | Required | Purpose |
|----------|----------|---------|
| `BIBLE_API_KEY` | Yes (for verse text) | [API.Bible signup](https://scripture.api.bible/signup) |
| `SPOTIFY_CLIENT_ID` | No | Spotify track search |
| `SPOTIFY_CLIENT_SECRET` | No | Spotify track search |
| `TMDB_API_KEY` | No | Movie search & synopses |

Books use **Open Library** (no key). Lyrics use **LRCLIB** (no key).

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel production setup and custom domains.

## Share URL examples

| URL | Opens |
|-----|--------|
| `/?q=love` | Subject search |
| `/?mode=stories&story=shawshank` | Curated story |
| `/?mode=lyrics&artist=Leonard%20Cohen&track=Hallelujah` | Song comparison |
| `/?mode=quote&quoteTitle=…&quote=…` | Quote comparison (base64 text) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run test` | Unit tests |
| `npm run preview` | Preview production build |

## License note

NIV and ESV text are copyrighted and accessed through API.Bible under their terms. This app does not bundle Bible text locally.
