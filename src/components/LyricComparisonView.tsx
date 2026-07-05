import { useEffect, useMemo, useState } from 'react'
import type { CompareOptions, LyricsComparisonResult } from '../types/lyrics'
import { DEFAULT_COMPARE_OPTIONS } from '../types/lyrics'
import { hapticLight } from '../utils/haptics'
import { copyComparison, shareComparison } from '../utils/lyricsShare'
import { useToast } from '../hooks/useToast'
import { scrollToTop } from '../utils/scroll'
import { copyShareUrl } from '../utils/shareUrl'
import type { AppUrlState } from '../utils/urlState'
import {
  isComparisonFavorite,
  lyricsComparisonKey,
  toggleFavoriteComparison,
  type SavedComparison,
} from '../hooks/useFavorites'
import { CompareOptionsPanel } from './CompareOptionsPanel'
import { ComparisonJumpNav } from './ComparisonJumpNav'
import { ComparisonThemeFilter } from './ComparisonThemeFilter'
import { ComparisonToolbar } from './ComparisonToolbar'
import { LyricParallelCard } from './LyricParallelCard'
import { ScripturePlaceholder } from './ScripturePlaceholder'

interface LyricComparisonViewProps {
  result: LyricsComparisonResult
  compareOptions?: CompareOptions
  onCompareOptionsChange?: (options: CompareOptions) => void
  onBack: () => void
  onExploreTheme?: (topicName: string) => void
  onRecompare?: () => void
  onLyricsUrlChange?: (artist: string | null, track: string | null) => void
}

export function LyricComparisonView({
  result,
  compareOptions = DEFAULT_COMPARE_OPTIONS,
  onCompareOptionsChange,
  onBack,
  onExploreTheme,
  onRecompare,
  onLyricsUrlChange,
}: LyricComparisonViewProps) {
  const { showToast } = useToast()
  const { track, lyrics, parallels, matchedTopics, lyricsUnavailable, apiUnavailable } = result
  const [lyricsOpen, setLyricsOpen] = useState(false)
  const [activeTheme, setActiveTheme] = useState<string | null>(null)
  const [favSaved, setFavSaved] = useState(false)

  const favKey = lyricsComparisonKey(track.artist, track.name)

  const lyricLines = lyrics.split(/\n/).filter((l) => l.trim()).length
  const themes = useMemo(() => matchedTopics.map((t) => t.topicName), [matchedTopics])

  const visibleParallels = useMemo(
    () => (activeTheme ? parallels.filter((p) => p.theme === activeTheme) : parallels),
    [parallels, activeTheme],
  )

  useEffect(() => {
    scrollToTop()
    onLyricsUrlChange?.(track.artist, track.name)
    setFavSaved(isComparisonFavorite(favKey))
  }, [track.id, track.name, track.artist, favKey, onLyricsUrlChange])

  async function handleCopyAll() {
    await copyComparison(result)
    hapticLight()
    showToast('Comparison copied to clipboard')
  }

  async function handleShareAll() {
    try {
      const outcome = await shareComparison(result)
      hapticLight()
      showToast(outcome === 'shared' ? 'Comparison shared' : 'Comparison copied to clipboard')
    } catch {
      // User dismissed share sheet
    }
  }

  async function handleCopyLink() {
    const state: AppUrlState = {
      mode: 'lyrics',
      q: '',
      storyId: '',
      artist: track.artist,
      track: track.name,
      quoteTitle: '',
      quoteText: '',
    }
    await copyShareUrl(state)
    hapticLight()
    showToast('Link copied to clipboard')
  }

  function handleFavorite() {
    const saved: SavedComparison = {
      key: favKey,
      kind: 'lyrics',
      title: track.name,
      subtitle: track.artist,
      artist: track.artist,
      track: track.name,
      savedAt: Date.now(),
    }
    const { saved: isSaved } = toggleFavoriteComparison(saved)
    setFavSaved(isSaved)
    hapticLight()
    showToast(isSaved ? 'Comparison saved to favorites' : 'Removed from favorites')
  }

  function handleBack() {
    onLyricsUrlChange?.(null, null)
    onBack()
  }

  return (
    <div className="w-full animate-fade-in-up">
      <ComparisonToolbar
        backLabel="Search another song"
        onBack={handleBack}
        onRecompare={onRecompare}
        onCopy={handleCopyAll}
        onShare={handleShareAll}
        onCopyLink={handleCopyLink}
        onFavorite={handleFavorite}
        isFavorite={favSaved}
      />

      <header className="mb-6 overflow-hidden rounded-2xl border border-parchment-dark bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
          {track.albumArtUrl ? (
            <img
              src={track.albumArtUrl}
              alt=""
              className="mx-auto h-28 w-28 shrink-0 rounded-xl object-cover shadow-md sm:mx-0"
            />
          ) : (
            <ScripturePlaceholder kind="song" size="lg" className="mx-auto h-28 w-28 sm:mx-0" />
          )}
          <div className="flex-1 text-center sm:text-left">
            <span className="inline-block rounded-full border border-[#1DB954]/40 bg-[#1DB954]/10 px-3 py-1 text-xs font-semibold text-[#1a7a3a] uppercase">
              Lyrics ↔ Scripture
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-navy">{track.name}</h2>
            <p className="text-ink-muted">{track.artist}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              {track.spotifyUrl && (
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-[#1DB954] hover:underline"
                >
                  Listen on Spotify →
                </a>
              )}
              {track.previewUrl && (
                <audio controls preload="none" src={track.previewUrl} className="h-8 max-w-[220px]">
                  Preview
                </audio>
              )}
            </div>
          </div>
        </div>

        {!lyricsUnavailable && parallels.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-parchment-dark bg-parchment/30 px-5 py-3 text-sm sm:justify-start sm:px-6">
            <span className="font-semibold text-navy">
              {parallels.length} parallel{parallels.length === 1 ? '' : 's'}
            </span>
            <span className="hidden text-ink-muted sm:inline" aria-hidden>·</span>
            <span className="text-ink-muted">
              {matchedTopics.length} theme{matchedTopics.length === 1 ? '' : 's'} detected
            </span>
            {lyricLines > 0 && (
              <>
                <span className="hidden text-ink-muted sm:inline" aria-hidden>·</span>
                <span className="text-ink-muted">{lyricLines} lyric lines analyzed</span>
              </>
            )}
          </div>
        )}
      </header>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {lyricsUnavailable
          ? `Lyrics not found for ${track.name}`
          : parallels.length > 0
            ? `Found ${parallels.length} parallels for ${track.name}`
            : `No parallels found for ${track.name}`}
      </div>

      {lyricsUnavailable && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <p className="font-semibold">Lyrics not found</p>
          <p className="mt-2 text-sm leading-relaxed">
            We couldn&apos;t find lyrics for this track on LRCLIB. Try checking the spelling of the artist and title, or search for a well-known version of the song.
          </p>
        </div>
      )}

      {apiUnavailable && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          NIV text could not be loaded — passage references are shown instead.
        </div>
      )}

      {onCompareOptionsChange && (
        <div className="mb-6">
          <CompareOptionsPanel options={compareOptions} onChange={onCompareOptionsChange} />
          {onRecompare && (
            <p className="mt-2 text-xs text-ink-muted">
              Adjust options above, then tap &ldquo;Re-run comparison&rdquo; to apply.
            </p>
          )}
        </div>
      )}

      <ComparisonThemeFilter
        themes={themes}
        activeTheme={activeTheme}
        onThemeChange={setActiveTheme}
        label="Themes in these lyrics"
        onExploreTheme={onExploreTheme}
      />

      <ComparisonJumpNav parallels={visibleParallels} />

      {lyrics && !lyricsUnavailable && (
        <details
          className="mb-6 rounded-xl border border-parchment-dark bg-white"
          open={lyricsOpen}
          onToggle={(e) => setLyricsOpen((e.target as HTMLDetailsElement).open)}
        >
          <summary className="cursor-pointer rounded-xl px-5 py-3 text-sm font-semibold text-navy transition hover:bg-parchment/40">
            View full lyrics
          </summary>
          <div className="border-t border-parchment-dark bg-gradient-to-br from-[#1DB954]/[0.04] to-white px-5 py-4">
            <div className="lyrics-scroll">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">{lyrics}</pre>
            </div>
          </div>
        </details>
      )}

      {visibleParallels.length > 0 ? (
        <div className="stagger-children flex flex-col gap-6">
          {visibleParallels.map((parallel, i) => (
            <LyricParallelCard
              key={parallel.id}
              parallel={parallel}
              index={i}
              track={track}
            />
          ))}
        </div>
      ) : parallels.length > 0 && activeTheme ? (
        <p className="text-center text-ink-muted">No parallels for &ldquo;{activeTheme}&rdquo;.</p>
      ) : !lyricsUnavailable ? (
        <div className="rounded-2xl border border-dashed border-parchment-dark bg-white/60 p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-parchment">
            <svg className="h-6 w-6 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-ink-muted">No strong thematic parallels found in these lyrics.</p>
          <p className="mt-2 text-sm text-ink-muted/80">
            Try a song with clearer spiritual or emotional themes, or browse by subject instead.
          </p>
          {onExploreTheme && matchedTopics[0] && (
            <button
              type="button"
              onClick={() => onExploreTheme(matchedTopics[0].topicName)}
              className="mt-4 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-light"
            >
              Explore {matchedTopics[0].topicName} in Scripture
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
