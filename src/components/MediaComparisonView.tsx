import { useEffect, useMemo, useState } from 'react'
import { MEDIA_TYPE_LABELS } from '../data/media-comparisons'
import { loadMediaComparison } from '../services/mediaCompare'
import type { LoadedMediaComparison, MediaComparison } from '../types/media'
import { hapticLight } from '../utils/haptics'
import { copyMediaComparison, shareMediaComparison } from '../utils/mediaShare'
import { useToast } from '../hooks/useToast'
import { addRecentStory } from '../hooks/useRecentMedia'
import { ScriptureParallelCard } from './ScriptureParallelCard'

interface MediaComparisonViewProps {
  comparison: MediaComparison
  onBack: () => void
  onExploreTheme?: (topicName: string) => void
}

export function MediaComparisonView({ comparison, onBack, onExploreTheme }: MediaComparisonViewProps) {
  const { showToast } = useToast()
  const [loaded, setLoaded] = useState<LoadedMediaComparison | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTheme, setActiveTheme] = useState<string | null>(null)

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

  function scrollToParallel(id: string) {
    document.getElementById(`parallel-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
      hapticLight()
      showToast(outcome === 'shared' ? 'Comparison shared' : 'Comparison copied to clipboard')
    } catch {
      // User dismissed share sheet
    }
  }

  return (
    <div className="w-full animate-fade-in-up">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="back-link">
          <span aria-hidden>←</span> All stories
        </button>
        {loaded && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyAll}
              className="touch-manipulation rounded-lg border border-parchment-dark px-3 py-2 text-xs font-semibold text-ink-muted transition hover:border-gold hover:text-gold active:scale-95"
            >
              Copy all
            </button>
            <button
              type="button"
              onClick={handleShareAll}
              className="touch-manipulation rounded-lg border border-parchment-dark px-3 py-2 text-xs font-semibold text-ink-muted transition hover:border-gold hover:text-gold active:scale-95"
            >
              Share
            </button>
          </div>
        )}
      </div>

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

          {themes.length > 0 && (
            <section className="mb-6" aria-label="Themes">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold tracking-wide text-ink-muted uppercase">
                  Themes in this story
                </h3>
                {activeTheme && (
                  <button
                    type="button"
                    onClick={() => setActiveTheme(null)}
                    className="text-xs font-medium text-gold hover:underline"
                  >
                    Show all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-pressed={activeTheme === null}
                  onClick={() => setActiveTheme(null)}
                  className={`touch-manipulation rounded-full border px-3.5 py-1.5 text-sm transition active:scale-95 ${
                    activeTheme === null
                      ? 'border-navy bg-navy text-white'
                      : 'border-parchment-dark bg-white text-ink-muted hover:border-gold'
                  }`}
                >
                  All
                </button>
                {themes.map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    aria-pressed={activeTheme === theme}
                    onClick={() => setActiveTheme(activeTheme === theme ? null : theme)}
                    className={`touch-manipulation rounded-full border px-3.5 py-1.5 text-sm transition active:scale-95 ${
                      activeTheme === theme
                        ? 'border-gold bg-gold text-white'
                        : 'border-navy/10 bg-navy/5 text-navy hover:border-gold/40'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
              {onExploreTheme && (
                <p className="mt-3 text-xs text-ink-muted">
                  Explore more verses:{' '}
                  {themes.slice(0, 3).map((theme, i) => (
                    <span key={theme}>
                      {i > 0 && ', '}
                      <button
                        type="button"
                        onClick={() => onExploreTheme(theme.split('&')[0].trim())}
                        className="font-semibold text-gold hover:underline"
                      >
                        {theme}
                      </button>
                    </span>
                  ))}
                </p>
              )}
            </section>
          )}

          {visibleParallels.length > 1 && (
            <nav className="mb-6" aria-label="Jump to parallel">
              <p className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                Jump to parallel
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {visibleParallels.map((parallel, i) => (
                  <button
                    key={parallel.id}
                    type="button"
                    onClick={() => scrollToParallel(parallel.id)}
                    className="touch-manipulation shrink-0 rounded-full border border-parchment-dark bg-white px-3.5 py-1.5 text-sm font-medium text-navy transition hover:border-gold hover:text-gold active:scale-95"
                  >
                    {i + 1}. {parallel.theme}
                  </button>
                ))}
              </div>
            </nav>
          )}

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
        </>
      )}
    </div>
  )
}
