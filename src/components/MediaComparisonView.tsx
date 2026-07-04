import { useEffect, useState } from 'react'
import { MEDIA_TYPE_LABELS } from '../data/media-comparisons'
import { loadMediaComparison } from '../services/mediaCompare'
import type { LoadedMediaComparison, MediaComparison } from '../types/media'
import { ScriptureParallelCard } from './ScriptureParallelCard'

interface MediaComparisonViewProps {
  comparison: MediaComparison
  onBack: () => void
}

export function MediaComparisonView({ comparison, onBack }: MediaComparisonViewProps) {
  const [loaded, setLoaded] = useState<LoadedMediaComparison | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    loadMediaComparison(comparison)
      .then((result) => {
        if (!cancelled) setLoaded(result)
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

  const typeLabel = MEDIA_TYPE_LABELS[comparison.type]

  return (
    <div className="w-full animate-fade-in-up">
      <button type="button" onClick={onBack} className="back-link mb-6">
        <span aria-hidden>←</span> All stories
      </button>

      <header className="mb-8 text-center">
        <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold tracking-wide text-gold uppercase">
          {typeLabel}
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
          {comparison.title}
        </h2>
        {comparison.creator && (
          <p className="mt-1 text-sm text-ink-muted">{comparison.creator}</p>
        )}
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          {comparison.summary}
        </p>
      </header>

      {loading && (
        <div className="flex flex-col items-center gap-4 py-20 text-ink-muted" aria-busy="true">
          <div className="spinner text-gold" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }} />
          <p className="text-sm">Loading NIV passages…</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
          {error}
        </div>
      )}

      {loaded && !loading && (
        <>
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

          <div className="stagger-children flex flex-col gap-6">
            {loaded.parallels.map((parallel, i) => (
              <ScriptureParallelCard
                key={parallel.id}
                parallel={parallel}
                index={i}
                mediaTitle={comparison.title}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
