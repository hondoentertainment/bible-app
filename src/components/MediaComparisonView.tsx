import { useEffect, useMemo, useState } from 'react'
import { addRecentStory } from '../hooks/useRecentMedia'
import { MEDIA_TYPE_LABELS } from '../data/media-comparisons'
import { loadMediaComparison } from '../services/mediaCompare'
import type { LoadedMediaComparison, MediaComparison } from '../types/media'
import { hapticLight } from '../utils/haptics'
import { copyMediaComparison, shareMediaComparison } from '../utils/mediaShare'
import { useToast } from '../hooks/useToast'
import { scrollToTop } from '../utils/scroll'
import { copyShareUrl } from '../utils/shareUrl'
import type { AppUrlState } from '../utils/urlState'
import {
  isComparisonFavorite,
  storyComparisonKey,
  toggleFavoriteComparison,
  type SavedComparison,
} from '../hooks/useFavorites'
import { ComparisonJumpNav } from './ComparisonJumpNav'
import { ComparisonThemeFilter } from './ComparisonThemeFilter'
import { ComparisonToolbar } from './ComparisonToolbar'
import { ScriptureParallelCard } from './ScriptureParallelCard'
import { SharePrompt } from './SharePrompt'
import { trackEvent } from '../utils/analytics'
import { ThemeTrail } from './ThemeTrail'

interface MediaComparisonViewProps {
  comparison: MediaComparison
  onBack: () => void
  onExploreTheme?: (topicName: string) => void
  onStoryUrlChange?: (storyId: string | null) => void
  onOpenStory?: (storyId: string) => void
  onOpenSong?: (artist: string, track: string) => void
}

export function MediaComparisonView({
  comparison,
  onBack,
  onExploreTheme,
  onStoryUrlChange,
  onOpenStory,
  onOpenSong,
}: MediaComparisonViewProps) {
  const { showToast } = useToast()
  const [loaded, setLoaded] = useState<LoadedMediaComparison | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTheme, setActiveTheme] = useState<string | null>(null)
  const [favSaved, setFavSaved] = useState(false)

  const favKey = storyComparisonKey(comparison.id)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setActiveTheme(null)

    loadMediaComparison(comparison)
      .then((result) => {
        if (!cancelled) {
          setLoaded(result)
          addRecentStory(comparison.id)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load comparison')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [comparison])

  useEffect(() => {
    scrollToTop()
    onStoryUrlChange?.(comparison.id)
    setFavSaved(isComparisonFavorite(favKey))
  }, [comparison.id, favKey, onStoryUrlChange])

  const themes = useMemo(
    () => [...new Set(comparison.parallels.map((p) => p.theme))],
    [comparison.parallels],
  )

  const visibleParallels = useMemo(() => {
    if (!loaded) return []
    return activeTheme
      ? loaded.parallels.filter((p) => p.theme === activeTheme)
      : loaded.parallels
  }, [loaded, activeTheme])

  const typeLabel = MEDIA_TYPE_LABELS[comparison.type]

  async function handleCopyAll() {
    if (!loaded) return
    await copyMediaComparison(loaded)
    hapticLight()
    showToast('Comparison copied to clipboard')
  }

  async function handleShareAll() {
    if (!loaded) return
    try {
      const outcome = await shareMediaComparison(loaded)
      trackEvent('share', { context: 'story', title: comparison.title.slice(0, 80), outcome })
      hapticLight()
      showToast(outcome === 'shared' ? 'Comparison shared' : 'Comparison copied to clipboard')
    } catch {
      // User dismissed share sheet
    }
  }

  async function handleCopyLink() {
    const state: AppUrlState = {
      mode: 'stories',
      q: '',
      storyId: comparison.id,
      artist: '',
      track: '',
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
      kind: 'story',
      title: comparison.title,
      subtitle: comparison.creator,
      storyId: comparison.id,
      savedAt: Date.now(),
    }
    const { saved: isSaved } = toggleFavoriteComparison(saved)
    setFavSaved(isSaved)
    hapticLight()
    showToast(isSaved ? 'Comparison saved to favorites' : 'Removed from favorites')
  }

  function handleBack() {
    onStoryUrlChange?.(null)
    onBack()
  }

  return (
    <div className="w-full animate-fade-in-up">
      <ComparisonToolbar
        backLabel="All stories"
        onBack={handleBack}
        onCopy={loaded ? handleCopyAll : undefined}
        onShare={loaded ? handleShareAll : undefined}
        onCopyLink={handleCopyLink}
        onFavorite={handleFavorite}
        isFavorite={favSaved}
        showActions={Boolean(loaded)}
      />

      <header className="mb-6 overflow-hidden rounded-2xl border border-parchment-dark bg-white shadow-sm">
        <div className="p-5 text-center sm:p-6 sm:text-left">
          <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold tracking-wide text-gold uppercase">
            {typeLabel}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
            {comparison.title}
          </h2>
          {comparison.creator && (
            <p className="mt-1 text-sm text-ink-muted">{comparison.creator}</p>
          )}
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted sm:mx-0">
            {comparison.summary}
          </p>
        </div>
        {loaded && (
          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-parchment-dark bg-parchment/30 px-5 py-3 text-sm sm:justify-start sm:px-6">
            <span className="font-semibold text-navy">
              {loaded.parallels.length} parallel{loaded.parallels.length === 1 ? '' : 's'}
            </span>
            <span className="hidden text-ink-muted sm:inline" aria-hidden>·</span>
            <span className="text-ink-muted">
              {themes.length} theme{themes.length === 1 ? '' : 's'}
            </span>
          </div>
        )}
      </header>

      {loading && (
        <div className="flex flex-col gap-4" aria-busy="true">
          <div className="flex flex-col items-center gap-4 py-12 text-ink-muted">
            <div className="spinner text-gold" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
            <p className="text-sm">Loading NIV passages…</p>
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-parchment-dark bg-white p-6">
              <div className="skeleton mb-4 h-5 w-40" />
              <div className="space-y-2">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
          {error}
        </div>
      )}

      {loaded && !loading && (
        <>
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            Loaded {loaded.parallels.length} parallels for {comparison.title}
          </div>

          {loaded.apiUnavailable && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              NIV text could not be loaded — passage references are shown instead.
            </div>
          )}

          {loaded.cautions && loaded.cautions.length > 0 && (
            <aside className="mb-6 rounded-2xl border border-parchment-dark bg-parchment/40 p-4 text-sm text-ink-muted">
              <strong className="text-navy">Note for reflection:</strong>{' '}
              {loaded.cautions.join(' ')}
            </aside>
          )}

          <ComparisonThemeFilter
            themes={themes}
            activeTheme={activeTheme}
            onThemeChange={setActiveTheme}
            label="Themes in this story"
            onExploreTheme={onExploreTheme}
          />

          <ComparisonJumpNav parallels={visibleParallels} />

          <div className="stagger-children flex flex-col gap-6">
            {visibleParallels.map((parallel, i) => (
              <ScriptureParallelCard
                key={parallel.id}
                parallel={parallel}
                index={i}
                mediaTitle={comparison.title}
                mediaType={comparison.type}
              />
            ))}
          </div>

          {visibleParallels.length === 0 && activeTheme && (
            <p className="text-center text-ink-muted">No parallels for &ldquo;{activeTheme}&rdquo;.</p>
          )}

          {onExploreTheme && onOpenStory && onOpenSong && (
            <ThemeTrail
              theme={activeTheme ?? themes[0] ?? comparison.parallels[0]?.theme ?? 'Faith'}
              onExploreSubject={onExploreTheme}
              onOpenStory={onOpenStory}
              onOpenSong={onOpenSong}
            />
          )}

          <SharePrompt title={comparison.title} onShare={handleShareAll} context="story" />
        </>
      )}
    </div>
  )
}
