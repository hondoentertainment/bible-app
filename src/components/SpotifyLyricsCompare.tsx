import { useCallback, useEffect, useState } from 'react'
import type { SpotifyTrackResult } from '../types/lyrics'
import {
  compareTrackFromSpotify,
  fetchTrackLyrics,
  compareLyricsToScripture,
  searchSpotify,
} from '../services/lyricsCompare'
import type { LyricsComparisonResult } from '../types/lyrics'
import { LyricComparisonView } from './LyricComparisonView'

export function SpotifyLyricsCompare() {
  const [spotifyReady, setSpotifyReady] = useState<boolean | null>(null)
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState<SpotifyTrackResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [comparing, setComparing] = useState(false)
  const [result, setResult] = useState<LyricsComparisonResult | null>(null)

  const [manualArtist, setManualArtist] = useState('')
  const [manualTrack, setManualTrack] = useState('')

  useEffect(() => {
    fetch('/api/spotify/status')
      .then((r) => r.json())
      .then((d: { configured: boolean }) => setSpotifyReady(d.configured))
      .catch(() => setSpotifyReady(false))
  }, [])

  const runSpotifySearch = useCallback(async () => {
    const q = query.trim()
    if (!q) return

    setSearching(true)
    setSearchError(null)
    setTracks([])
    setResult(null)

    try {
      const found = await searchSpotify(q)
      setTracks(found)
      if (found.length === 0) setSearchError('No tracks found on Spotify.')
    } catch (err) {
      if (err instanceof Error && err.message === 'SPOTIFY_NOT_CONFIGURED') {
        setSpotifyReady(false)
        setSearchError('Spotify search is not configured. Use manual entry below.')
      } else {
        setSearchError('Spotify search failed. Try again or use manual entry.')
      }
    } finally {
      setSearching(false)
    }
  }, [query])

  async function handleSelectTrack(track: SpotifyTrackResult) {
    setComparing(true)
    setResult(null)
    setSearchError(null)

    try {
      const comparison = await compareTrackFromSpotify(track)
      setResult(comparison)
    } catch {
      setSearchError('Could not compare this track. Try again.')
    } finally {
      setComparing(false)
    }
  }

  async function handleManualCompare() {
    const artist = manualArtist.trim()
    const track = manualTrack.trim()
    if (!artist || !track) return

    setComparing(true)
    setResult(null)
    setSearchError(null)

    try {
      const lyrics = await fetchTrackLyrics(artist, track)
      const comparison = await compareLyricsToScripture(
        { name: track, artist },
        lyrics,
      )
      setResult(comparison)
    } catch (err) {
      if (err instanceof Error && err.message === 'LYRICS_NOT_FOUND') {
        setResult({
          track: {
            id: 'manual',
            name: track,
            artist,
            album: '',
            albumArtUrl: null,
            previewUrl: null,
            spotifyUrl: '',
          },
          lyrics: '',
          parallels: [],
          matchedTopics: [],
          lyricsUnavailable: true,
        })
      } else {
        setSearchError('Could not load lyrics for this song.')
      }
    } finally {
      setComparing(false)
    }
  }

  if (result) {
    return (
      <LyricComparisonView
        result={result}
        onBack={() => setResult(null)}
      />
    )
  }

  return (
    <section className="w-full animate-fade-in-up" aria-label="Compare Spotify lyrics to Scripture">
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-navy sm:text-3xl">
          Spotify Lyrics &amp; Scripture
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-muted">
          Search a song on Spotify, pull its lyrics, and see which NIV verses echo the same themes.
        </p>
      </div>

      {spotifyReady !== false && (
        <div className="mx-auto mb-8 max-w-xl">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-navy">Search Spotify</span>
            <div className="flex gap-2">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runSpotifySearch()}
                placeholder="Song or artist name…"
                className="min-w-0 flex-1 rounded-xl border border-parchment-dark bg-white px-4 py-3 text-base text-ink focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/20 focus:outline-none"
              />
              <button
                type="button"
                onClick={runSpotifySearch}
                disabled={searching || !query.trim()}
                className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1DB954] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1ed760] hover:shadow-md disabled:opacity-50"
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
          </label>

          {searchError && (
            <p className="mt-3 text-sm text-amber-800" role="alert">{searchError}</p>
          )}

          {tracks.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2">
              {tracks.map((track) => (
                <li key={track.id}>
                  <TrackResult
                    track={track}
                    onSelect={() => handleSelectTrack(track)}
                    disabled={comparing}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {spotifyReady === false && (
        <p className="mx-auto mb-6 max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-950">
          Add <code className="rounded bg-white px-1">SPOTIFY_CLIENT_ID</code> and{' '}
          <code className="rounded bg-white px-1">SPOTIFY_CLIENT_SECRET</code> to enable Spotify search.
          You can still compare lyrics manually below.
        </p>
      )}

      <div className="mx-auto max-w-xl rounded-2xl border border-parchment-dark bg-white/80 p-6">
        <h3 className="font-display text-lg font-semibold text-navy">
          {spotifyReady ? 'Or enter song details' : 'Enter song details'}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">
          Lyrics are matched by artist and title from LRCLIB (Spotify does not provide lyrics via API).
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={manualArtist}
            onChange={(e) => setManualArtist(e.target.value)}
            placeholder="Artist"
            className="flex-1 rounded-lg border border-parchment-dark px-3 py-2.5 text-base focus:border-gold focus:outline-none"
          />
          <input
            type="text"
            value={manualTrack}
            onChange={(e) => setManualTrack(e.target.value)}
            placeholder="Song title"
            className="flex-1 rounded-lg border border-parchment-dark px-3 py-2.5 text-base focus:border-gold focus:outline-none"
          />
          <button
            type="button"
            onClick={handleManualCompare}
            disabled={comparing || !manualArtist.trim() || !manualTrack.trim()}
            className="min-h-[44px] rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light hover:shadow-md disabled:opacity-50"
          >
            {comparing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner text-white" aria-hidden />
                Analyzing…
              </span>
            ) : (
              'Compare'
            )}
          </button>
        </div>
      </div>

      {comparing && tracks.length === 0 && (
        <div className="mt-8 flex flex-col items-center gap-4 py-8 text-ink-muted" aria-busy="true">
          <div className="spinner text-gold" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
          <p className="text-sm">Fetching lyrics and matching Scripture…</p>
        </div>
      )}
    </section>
  )
}

function TrackResult({
  track,
  onSelect,
  disabled,
}: {
  track: SpotifyTrackResult
  onSelect: () => void
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className="flex w-full min-h-[56px] items-center gap-3 rounded-xl border border-parchment-dark bg-white p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1DB954]/50 hover:shadow-md disabled:opacity-50"
    >
      {track.albumArtUrl ? (
        <img
          src={track.albumArtUrl}
          alt=""
          className="h-12 w-12 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-parchment text-xs text-ink-muted">
          ♪
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-navy">{track.name}</p>
        <p className="truncate text-sm text-ink-muted">{track.artist}</p>
      </div>
      {track.spotifyUrl && (
        <a
          href={track.spotifyUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 text-xs font-semibold text-[#1DB954] hover:underline"
        >
          Open
        </a>
      )}
    </button>
  )
}
