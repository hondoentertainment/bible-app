import { useCallback, useEffect, useState } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { CompareOptionsPanel } from './CompareOptionsPanel'
import { FEATURED_SONGS, LYRICS_COMPARE_STEPS } from '../data/featured-songs'
import {
  addRecentSong,
  getRecentSongs,
  removeRecentSong,
  type RecentSong,
} from '../hooks/useRecentSongSearches'
import type { CompareOptions, SpotifyTrackResult } from '../types/lyrics'
import { DEFAULT_COMPARE_OPTIONS } from '../types/lyrics'
import {
  compareTrackFromSpotify,
  fetchTrackLyrics,
  compareLyricsToScripture,
  searchSpotify,
} from '../services/lyricsCompare'
import type { LyricsComparisonResult } from '../types/lyrics'
import { CompareStageIcon } from './CompareStageIcon'
import { LyricComparisonView } from './LyricComparisonView'
import { ScripturePlaceholder } from './ScripturePlaceholder'
import { ApiStatusBanner } from './ApiStatusBanner'

const COMPARE_STAGES = [
  'Fetching lyrics…',
  'Analyzing themes…',
  'Matching NIV passages…',
] as const

type InputMode = 'spotify' | 'manual'

const MIN_PARTIAL_CHARS = 2

interface SpotifyLyricsCompareProps {
  onExploreTheme?: (topicName: string) => void
}

export function SpotifyLyricsCompare({ onExploreTheme }: SpotifyLyricsCompareProps) {
  const [spotifyReady, setSpotifyReady] = useState<boolean | null>(null)
  const [inputMode, setInputMode] = useState<InputMode>('spotify')
  const [compareOptions, setCompareOptions] = useState<CompareOptions>(DEFAULT_COMPARE_OPTIONS)
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState<SpotifyTrackResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [comparing, setComparing] = useState(false)
  const [compareStage, setCompareStage] = useState(0)
  const [comparingTrack, setComparingTrack] = useState<SpotifyTrackResult | null>(null)
  const [result, setResult] = useState<LyricsComparisonResult | null>(null)
  const [recentSongs, setRecentSongs] = useState<RecentSong[]>(() => getRecentSongs())

  const [manualArtist, setManualArtist] = useState('')
  const [manualTrack, setManualTrack] = useState('')
  const debouncedQuery = useDebouncedValue(query, 400)

  useEffect(() => {
    fetch('/api/spotify/status')
      .then((r) => r.json())
      .then((d: { configured: boolean }) => {
        setSpotifyReady(d.configured)
        if (!d.configured) setInputMode('manual')
      })
      .catch(() => {
        setSpotifyReady(false)
        setInputMode('manual')
      })
  }, [])

  useEffect(() => {
    if (!comparing) {
      setCompareStage(0)
      return
    }

    setCompareStage(0)
    const t1 = window.setTimeout(() => setCompareStage(1), 900)
    const t2 = window.setTimeout(() => setCompareStage(2), 1800)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [comparing])

  const runSpotifySearch = useCallback(async (searchQuery: string) => {
    const q = searchQuery.trim()
    if (q.length < MIN_PARTIAL_CHARS) {
      setTracks([])
      setSearchError(null)
      return
    }

    setSearching(true)
    setSearchError(null)
    setTracks([])
    setResult(null)

    try {
      const found = await searchSpotify(q)
      setTracks(found)
      if (found.length === 0) setSearchError('No tracks found. Try a partial song or artist name.')
    } catch (err) {
      if (err instanceof Error && err.message === 'SPOTIFY_NOT_CONFIGURED') {
        setSpotifyReady(false)
        setInputMode('manual')
        setSearchError('Spotify search is not configured. Use manual entry below.')
      } else {
        setSearchError('Spotify search failed. Try again or use manual entry.')
      }
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (inputMode !== 'spotify' || spotifyReady === false) return
    if (debouncedQuery.trim().length >= MIN_PARTIAL_CHARS) {
      runSpotifySearch(debouncedQuery)
    } else {
      setTracks([])
      setSearchError(null)
    }
  }, [debouncedQuery, inputMode, spotifyReady, runSpotifySearch])

  function saveToRecent(artist: string, title: string) {
    setRecentSongs(addRecentSong({ artist, title }))
  }

  async function runComparison(
    track: SpotifyTrackResult,
    compareFn: () => Promise<LyricsComparisonResult>,
  ) {
    setComparing(true)
    setComparingTrack(track)
    setResult(null)
    setSearchError(null)

    try {
      const comparison = await compareFn()
      setResult(comparison)
      saveToRecent(track.artist, track.name)
    } catch (err) {
      if (err instanceof Error && err.message === 'LYRICS_NOT_FOUND') {
        setSearchError('Lyrics not found for this song. Check spelling or try a different version.')
      } else if (err instanceof Error && err.message === 'Lyrics lookup failed') {
        setSearchError('Lyrics lookup failed on the server. Please try again in a moment.')
      } else {
        setSearchError('Could not compare this track. Try again or use manual entry.')
      }
    } finally {
      setComparing(false)
      setComparingTrack(null)
    }
  }

  function handleSelectTrack(track: SpotifyTrackResult) {
    runComparison(track, () => compareTrackFromSpotify(track, compareOptions))
  }

  function compareManualSong(artist: string, title: string) {
    const manualTrackResult: SpotifyTrackResult = {
      id: `manual-${title}-${artist}`.replace(/\s+/g, '-').toLowerCase(),
      name: title,
      artist,
      album: '',
      albumArtUrl: null,
      previewUrl: null,
      spotifyUrl: '',
    }

    setManualArtist(artist)
    setManualTrack(title)

    runComparison(manualTrackResult, async () => {
      try {
        const lyrics = await fetchTrackLyrics(artist, title)
        return compareLyricsToScripture({ name: title, artist }, lyrics, compareOptions)
      } catch (err) {
        if (err instanceof Error && err.message === 'LYRICS_NOT_FOUND') {
          return {
            track: manualTrackResult,
            lyrics: '',
            parallels: [],
            matchedTopics: [],
            lyricsUnavailable: true,
          }
        }
        throw err
      }
    })
  }

  function handleManualCompare() {
    const artist = manualArtist.trim()
    const track = manualTrack.trim()
    if (!artist || !track) return
    compareManualSong(artist, track)
  }

  async function handleFeaturedSong(song: RecentSong) {
    setManualArtist(song.artist)
    setManualTrack(song.title)
    setQuery(`${song.title} ${song.artist}`)

    if (spotifyReady) {
      setSearching(true)
      setSearchError(null)
      try {
        const found = await searchSpotify(`${song.title} ${song.artist}`)
        setTracks(found)
        const match =
          found.find(
            (t) =>
              t.name.toLowerCase() === song.title.toLowerCase() ||
              t.name.toLowerCase().includes(song.title.toLowerCase()),
          ) ?? found[0]

        if (match) {
          handleSelectTrack(match)
          return
        }
      } catch {
        // fall through to manual compare
      } finally {
        setSearching(false)
      }
    }

    compareManualSong(song.artist, song.title)
  }

  function handleRecentSong(song: RecentSong) {
    compareManualSong(song.artist, song.title)
  }

  if (result) {
    return (
      <LyricComparisonView
        result={result}
        compareOptions={compareOptions}
        onCompareOptionsChange={setCompareOptions}
        onBack={() => setResult(null)}
        onExploreTheme={onExploreTheme}
        onRecompare={() => compareManualSong(result.track.artist, result.track.name)}
      />
    )
  }

  return (
    <section className="w-full animate-fade-in-up" aria-label="Compare Spotify lyrics to Scripture">
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-navy sm:text-3xl">
          Song Lyrics &amp; Scripture
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-muted">
          Search any song, then see how its lyrics echo themes in the NIV — side by side.
        </p>
      </div>

      <ol className="mx-auto mb-6 grid max-w-2xl gap-3 sm:grid-cols-3">
        {LYRICS_COMPARE_STEPS.map(({ step, label, detail }) => (
          <li
            key={step}
            className="rounded-xl border border-parchment-dark bg-white/80 px-4 py-3 text-center sm:text-left"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
              {step}
            </span>
            <p className="mt-2 text-sm font-semibold text-navy">{label}</p>
            <p className="mt-0.5 text-xs leading-snug text-ink-muted">{detail}</p>
          </li>
        ))}
      </ol>

      <div className="mx-auto mb-6 max-w-xl space-y-4">
        <CompareOptionsPanel options={compareOptions} onChange={setCompareOptions} />

        <div
          className="flex rounded-xl border border-parchment-dark bg-white p-1"
          role="tablist"
          aria-label="Search method"
        >
          <InputModeTab
            active={inputMode === 'spotify'}
            disabled={spotifyReady === false}
            onClick={() => setInputMode('spotify')}
            label="Spotify search"
            icon="spotify"
          />
          <InputModeTab
            active={inputMode === 'manual'}
            onClick={() => setInputMode('manual')}
            label="Manual entry"
            icon="manual"
          />
        </div>
      </div>

      {inputMode === 'spotify' && spotifyReady === false && (
        <ApiStatusBanner
          title="Spotify search not configured"
          detail="Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to server environment variables."
          stillWorks="Manual song entry, featured songs, and LRCLIB lyrics lookup still work."
        />
      )}

      {inputMode === 'spotify' && spotifyReady !== false && (
        <div className="mx-auto mb-6 max-w-xl">
          <form
            className="block"
            onSubmit={(e) => {
              e.preventDefault()
              runSpotifySearch(query)
            }}
          >
            <label htmlFor="spotify-search" className="mb-2 block text-sm font-medium text-navy">
              Search Spotify
            </label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <svg
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
                <input
                  id="spotify-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Partial song or artist — e.g. Hallelujah or Cohen"
                  className="w-full rounded-xl border border-parchment-dark bg-white py-3 pr-4 pl-10 text-base text-ink focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/20 focus:outline-none"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={searching || comparing || query.trim().length < MIN_PARTIAL_CHARS}
                className="touch-manipulation flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1DB954] px-5 text-sm font-semibold text-white transition hover:bg-[#1ed760] hover:shadow-md disabled:opacity-50 active:scale-95"
              >
                {searching ? (
                  <>
                    <span className="spinner text-white" aria-hidden />
                    <span className="sr-only">Searching</span>
                  </>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>

          {query.trim().length > 0 && query.trim().length < MIN_PARTIAL_CHARS && (
            <p className="mt-3 text-xs text-ink-muted">Type at least {MIN_PARTIAL_CHARS} characters to search.</p>
          )}

          {searchError && (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="alert">
              {searchError}
            </p>
          )}

          {searching && (
            <ul className="mt-4 flex flex-col gap-2" aria-busy="true" aria-label="Loading results">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl border border-parchment-dark bg-white p-3">
                  <div className="skeleton h-12 w-12 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!searching && tracks.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                {tracks.length} result{tracks.length === 1 ? '' : 's'} — select to compare
              </p>
              <ul className="flex flex-col gap-2">
                {tracks.map((track) => (
                  <li key={track.id}>
                    <TrackResult
                      track={track}
                      onSelect={() => handleSelectTrack(track)}
                      disabled={comparing}
                      isComparing={comparingTrack?.id === track.id}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {inputMode === 'manual' && (
        <div className="mx-auto mb-6 max-w-xl rounded-2xl border border-parchment-dark bg-white p-6 shadow-sm">
          <h3 className="font-display text-lg font-semibold text-navy">Enter song details</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Lyrics are looked up by artist and title, then matched to Scripture themes.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-muted">Artist</span>
                <input
                  type="text"
                  value={manualArtist}
                  onChange={(e) => setManualArtist(e.target.value)}
                  placeholder="e.g. Leonard Cohen"
                  className="w-full rounded-lg border border-parchment-dark px-3 py-2.5 text-base focus:border-gold focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-muted">Song title</span>
                <input
                  type="text"
                  value={manualTrack}
                  onChange={(e) => setManualTrack(e.target.value)}
                  placeholder="e.g. Hallelujah"
                  className="w-full rounded-lg border border-parchment-dark px-3 py-2.5 text-base focus:border-gold focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleManualCompare()}
                />
              </label>
            </div>
            <button
              type="button"
              onClick={handleManualCompare}
              disabled={comparing || !manualArtist.trim() || !manualTrack.trim()}
              className="touch-manipulation min-h-[48px] w-full rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-light hover:shadow-md disabled:opacity-50 active:scale-95 sm:w-auto sm:self-start"
            >
              {comparing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner text-white" aria-hidden />
                  Comparing to Scripture…
                </span>
              ) : (
                'Compare lyrics to Scripture'
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-xl">
        <div className="mb-4">
          <p className="mb-2 text-center text-xs font-semibold tracking-wide text-ink-muted uppercase">
            Try a popular song — tap to compare instantly
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {FEATURED_SONGS.map((song) => (
              <button
                key={`${song.artist}-${song.title}`}
                type="button"
                disabled={comparing}
                onClick={() => handleFeaturedSong(song)}
                className="touch-manipulation rounded-full border border-parchment-dark bg-white px-3 py-2 text-sm transition hover:border-[#1DB954]/50 hover:shadow-sm active:scale-95 disabled:opacity-50"
              >
                <span className="font-medium text-navy">{song.title}</span>
                {song.theme && (
                  <span className="ml-1.5 text-xs text-ink-muted">· {song.theme}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {recentSongs.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-center text-xs font-semibold tracking-wide text-ink-muted uppercase">
              Recent comparisons — tap to re-run
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {recentSongs.map((song) => (
                <div key={`${song.artist}-${song.title}`} className="flex items-center gap-0.5">
                  <button
                    type="button"
                    disabled={comparing}
                    onClick={() => handleRecentSong(song)}
                    className="touch-manipulation rounded-l-full border border-r-0 border-parchment-dark bg-white px-3 py-1.5 text-sm text-navy transition hover:border-gold/50 active:scale-95 disabled:opacity-50"
                  >
                    {song.title}
                    <span className="ml-1 text-xs text-ink-muted">{song.artist}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecentSongs(removeRecentSong(song))}
                    className="touch-manipulation rounded-r-full border border-parchment-dark bg-white px-2 py-1.5 text-ink-muted transition hover:text-navy active:scale-95"
                    aria-label={`Remove ${song.title} from recent`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {comparing && comparingTrack && (
        <div
          className="mx-auto mt-8 max-w-md animate-fade-in-up rounded-2xl border border-parchment-dark bg-white p-6 shadow-lg"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="flex items-center gap-4">
            {comparingTrack.albumArtUrl ? (
              <img
                src={comparingTrack.albumArtUrl}
                alt=""
                className="h-16 w-16 shrink-0 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <ScripturePlaceholder kind="song" size="md" className="h-16 w-16" />
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-navy">{comparingTrack.name}</p>
              <p className="truncate text-sm text-ink-muted">{comparingTrack.artist}</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {COMPARE_STAGES.map((label, i) => (
              <div
                key={label}
                className={`flex items-center gap-2 text-sm transition-opacity duration-300 ${
                  i <= compareStage ? 'text-navy opacity-100' : 'text-ink-muted/40 opacity-60'
                }`}
              >
                <CompareStageIcon
                  status={i < compareStage ? 'done' : i === compareStage ? 'active' : 'pending'}
                  accentClass={i < compareStage ? 'text-[#1DB954]' : 'text-gold'}
                />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function InputModeTab({
  active,
  disabled,
  onClick,
  label,
  icon,
}: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  label: string
  icon: 'spotify' | 'manual'
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition active:scale-[0.98] ${
        active
          ? icon === 'spotify'
            ? 'bg-[#1DB954] text-white shadow-sm'
            : 'bg-navy text-white shadow-sm'
          : 'text-ink-muted hover:text-navy disabled:opacity-40'
      }`}
    >
      {icon === 'spotify' ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )}
      {label}
    </button>
  )
}

function TrackResult({
  track,
  onSelect,
  disabled,
  isComparing,
}: {
  track: SpotifyTrackResult
  onSelect: () => void
  disabled: boolean
  isComparing?: boolean
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-parchment-dark bg-white p-2 transition-all hover:border-[#1DB954]/40 hover:shadow-sm">
      {track.albumArtUrl ? (
        <img
          src={track.albumArtUrl}
          alt=""
          className="ml-1 h-12 w-12 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <ScripturePlaceholder kind="song" size="md" className="ml-1 h-12 w-12" />
      )}
      <div className="min-w-0 flex-1 py-1">
        <p className="truncate font-semibold text-navy">{track.name}</p>
        <p className="truncate text-sm text-ink-muted">
          {track.artist}
          {track.album && <span className="text-ink-muted/70"> · {track.album}</span>}
        </p>
        {track.previewUrl && (
          <audio
            controls
            preload="none"
            src={track.previewUrl}
            className="mt-1 h-7 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            Preview
          </audio>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1.5 pr-1">
        {track.spotifyUrl && (
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-lg px-2 py-1.5 text-xs font-semibold text-[#1DB954] transition hover:bg-[#1DB954]/10 sm:inline"
          >
            Open
          </a>
        )}
        <button
          type="button"
          onClick={onSelect}
          disabled={disabled}
          className="touch-manipulation min-h-[44px] rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-navy-light disabled:opacity-50 active:scale-95 sm:text-sm"
        >
          {isComparing ? (
            <span className="spinner text-white" aria-hidden />
          ) : (
            'Compare'
          )}
        </button>
      </div>
    </div>
  )
}
