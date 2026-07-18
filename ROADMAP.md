# Scripture Search — Product Roadmap

**Product:** Scripture Search (Bible App)  
**Live:** https://bible-app-bice-ten.vercel.app  
**Last updated:** July 2026  
**Shipped through:** v1.3.0 (see [CHANGELOG.md](./CHANGELOG.md))

---

## Vision

Help people meet Scripture in the culture they already consume — subjects, books, movies, TV, songs, and quotes — in a fast, installable PWA that works without an account.

---

## Current product (v1 — shipped)

| Area | Status |
|------|--------|
| **Subjects** | 98 curated topics, NIV search/lookup, filters, VOTD, reading plans, favorites |
| **Stories** | Books / Movies / TV sections; curated books & films; Open Library + TMDB search |
| **Spotify Lyrics** | Track search + LRCLIB → NIV theme match |
| **Quote** | Paste any text → Scripture parallels |
| **Habits & save** | Favorites, collections, reading history, recent searches, recommendations |
| **Share** | Deep links, copy, share-as-image |
| **Reading UX** | Dark mode, font size, optional ESV, TTS, cross-refs, chapter expand |
| **PWA** | Installable; offline Bible cache for favorites; daily verse notifications (opt-in) |
| **Deploy** | Vercel production + GitHub CI (unit tests, lint, build) |

**By design (v1):** no accounts or cloud sync — all personal data is `localStorage`.

---

## Roadmap

### ✅ Done — Polish & harden (v1.1)

| Item | Status |
|------|--------|
| Production smoke checklist | ✅ in DEPLOYMENT.md |
| Env verification docs | ✅ |
| NIV / API.Bible attribution + privacy | ✅ footer |
| Curated TV | ✅ The Chosen, The Bible, Ted Lasso |
| Docs accuracy | ✅ |
| Featured Stories cleanup | ✅ songs out of Stories featured |
| Social preview (`og:image`) | ✅ |
| Lint cleanup | ✅ |

### ✅ Done — Content & discovery (v1.2)

| Item | Status |
|------|--------|
| Expanded curated Stories | ✅ more books/movies/TV |
| Theme trails enrichment | ✅ |
| Seasonal featured subjects/stories | ✅ |
| Reading plans from Stories | ✅ |
| Empty-state / Try search CTAs | ✅ |

### ✅ Done — Reliability & reach (v1.3)

| Item | Status |
|------|--------|
| E2E smoke in CI | ✅ Playwright |
| Maskable PWA icons | ✅ |
| Accessibility (settings focus trap) | ✅ |
| Versioning & changelog | ✅ 1.3.0 |
| Richer sitemap / SEO | ✅ |

### Remaining (needs you)

| Item | Notes |
|------|--------|
| Custom domain | Configure in Vercel Domains + DNS ([DEPLOYMENT.md](./DEPLOYMENT.md)) |
| Confirm prod API keys | Especially `TMDB_API_KEY` for Movies/TV search |

---

### Explore — Bigger bets (v2+)

Evaluate only after v1.1–v1.3 are stable. Not committed.

| Bet | Why it might matter | Risk / cost |
|------|---------------------|-------------|
| **Optional accounts + sync** | Favorites/collections survive device switch | Auth, privacy, migration from `localStorage` |
| **Community parallels** | User-submitted story/song ↔ verse (moderated) | Moderation, theology review, spam |
| **Group / study mode** | Shared reading plan or discussion prompts | Multiplayer UX, accounts almost required |
| **More translations** | Beyond NIV/ESV toggles | API.Bible licensing + UI complexity |
| **Offline-first topics pack** | Subjects usable fully offline | Bundle size, copyright of excerpts |
| **Native wrappers** | App Store / Play distribution | Store review, Bible text policy |

---

## Explicit non-goals (for now)

- Replacing a full study Bible or commentary library
- Bundling NIV/ESV text in the client
- Social feed, likes, or public profiles
- Paywalled content (unless product model changes later)

---

## Content targets (guidance)

| Content | Now (v1.3) | Next growth |
|---------|-------------|-------------|
| Topics | ~98 | Maintain quality; add only high-demand gaps |
| Curated books | 7 | 10–12 |
| Curated movies | 6 | 8–10 |
| Curated TV | 3 | 5+ |
| Curated songs (Lyrics / data) | 3 (+ featured list) | Keep in Lyrics; grow featured songs |
| Reading plans | 8 | Seasonal variants as needed |

---

## Measuring progress

Lightweight signals (no heavy analytics suite required):

1. **Activation** — user opens a comparison (story, lyric, or quote) in first session  
2. **Return** — favorites or collections used across days  
3. **Share** — deep link or image share used  
4. **Install** — PWA install / return visits with SW  

Track via existing client events + Vercel Analytics until a dedicated funnel is needed.

---

## Suggested sequence

```text
v1.1  Polish & harden     →  attribution, curated TV, docs, smoke
v1.2  Content & discovery →  more curated media, trails, seasonal
v1.3  Reliability & reach →  e2e, domain, a11y, icons, SEO
v2+   Explore             →  sync / community / study (decide later)
```

---

## Related docs

- [README.md](./README.md) — features & setup  
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Vercel, env vars, domains  
