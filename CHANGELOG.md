# Changelog

All notable changes to Scripture Search are documented here.

## [1.3.0] — 2026-07-18

### Added
- Playwright e2e smoke tests in CI (Subjects, Stories sections, deep link, Lyrics, Quote)
- Maskable PWA icon and favicon assets
- Richer sitemap (featured stories + subject deep links)
- Focus trap in reading settings dialog
- Version bump to 1.3.0

### Changed
- Open Graph / Twitter cards use `og-image.png` (`summary_large_image`)

## [1.2.0] — 2026-07-18

### Added
- Expanded curated Stories: books (Pilgrim’s Progress, Screwtape), movies (Prince of Egypt, Wonderful Life, Hacksaw Ridge), TV (The Chosen, The Bible, Ted Lasso)
- Seasonal featured stories + subject chips
- Story-themed reading plans (Chosen, Les Mis, Shawshank)
- Stronger theme trails across media types
- Search “Try” example chips and empty-state tips in Stories

## [1.1.0] — 2026-07-18

### Added
- Stories broken into Books / Movies / TV sections with TMDB TV search
- Expanded NIV/API.Bible attribution + privacy note in footer
- Production smoke checklist in DEPLOYMENT.md

### Fixed
- Docs for TMDB (movies + TV); songs clarified as Lyrics-mode
- Featured Stories no longer highlight curated songs
- Lint issues in CrossReferences, Spotify search API, AppNav exports

## [1.0.0] — 2026-07

Initial public production release: Subjects, Stories, Lyrics, Quote, PWA, favorites/collections.
