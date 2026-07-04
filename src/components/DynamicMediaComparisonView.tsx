import { useEffect, useMemo, useState } from 'react'
import type { ExternalMediaComparisonResult } from '../types/externalMedia'
import { hapticLight } from '../utils/haptics'
import { copyExternalComparison, shareExternalComparison } from '../utils/externalMediaShare'
import { scrollToTop } from '../utils/scroll'
import { useToast } from '../hooks/useToast'
import { ComparisonJumpNav } from './ComparisonJumpNav'
import { ComparisonThemeFilter } from './ComparisonThemeFilter'
import { ComparisonToolbar } from './ComparisonToolbar'
import { ScriptureParallelCard } from './ScriptureParallelCard'
import { ScripturePlaceholder } from './ScripturePlaceholder'

interface DynamicMediaComparisonViewProps {
  result: ExternalMediaComparisonResult
  onBack: () => void
  onExploreTheme?: (topicName: string) => void
}

export function DynamicMediaComparisonView({
  result,
  onBack,
  onExploreTheme,
}: DynamicMediaComparisonViewProps) {
  const { showToast } = useToast()
  const [activeTheme, setActiveTheme] = useState<string | null>(null)

  useEffect(() => {
    scrollToTop(true)
  }, [result.title, result.type])

  const themes = useMemo(
    () => [...new Set(result.parallels.map((p) => p.theme))],
    [result.parallels],
  )

  const visibleParallels = useMemo(
    () =>
      activeTheme
        ? result.parallels.filter((p) => p.theme === activeTheme)
        : result.parallels,
    [result.parallels, activeTheme],
  )

  async function handleCopyAll() {
    await copyExternalComparison(result)
    hapticLight()
    showToast('Comparison copied to clipboard')
  }

  async function handleShareAll() {
    try {
      const outcome = await shareExternalComparison(result)
      hapticLight()
      showToast(outcome === 'shared' ? 'Comparison shared' : 'Comparison copied to clipboard')
    } catch {
      // User dismissed share sheet
    }
  }

  const typeLabel = result.type === 'book' ? 'Book' : 'Movie'
  const accentClass =
    result.type === 'book'
      ? 'border-[#553b08]/40 bg-[#553b08]/10 text-[#553b08]'
      : 'border-[#00c030]/40 bg-[#00c030]/10 text-[#007a1e]'

  return (
    <div className="w-full animate-fade-in-up">
      <ComparisonToolbar
        backLabel={`Search another ${result.type}`}
        onBack={onBack}
        onCopy={result.parallels.length > 0 ? handleCopyAll : undefined}
        onShare={result.parallels.length > 0 ? handleShareAll : undefined}
        showActions={result.parallels.length > 0}
      />

      <header className="mb-6 overflow-hidden rounded-2xl border border-parchment-dark bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:p-6">
          {result.coverUrl ? (
            <img
              src={result.coverUrl}
              alt=""
              className="mx-auto h-36 w-auto max-w-[120px] shrink-0 rounded-xl object-cover shadow-md sm:mx-0"
            />
          ) : (
            <ScripturePlaceholder
              kind={result.type === 'book' ? 'book' : 'movie'}
              size="lg"
              className="mx-auto h-36 w-24 sm:mx-0"
            />
          )}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase ${accentClass}`}
            >
              {typeLabel} ↔ Scripture
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-navy">{result.title}</h2>
            {result.creator && <p className="text-ink-muted">{result.creator}</p>}
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{result.summary}</p>
            <a
              href={result.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-gold hover:underline"
            >
              View on {result.externalLabel} →
            </a>
          </div>
        </div>
        {result.parallels.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-parchment-dark bg-parchment/30 px-5 py-3 text-sm sm:justify-start sm:px-6">
            <span className="font-semibold text-navy">
              {result.parallels.length} parallel{result.parallels.length === 1 ? '' : 's'}
            </span>
            <span className="hidden text-ink-muted sm:inline" aria-hidden>
              ·
            </span>
            <span className="text-ink-muted">
              {themes.length} theme{themes.length === 1 ? '' : 's'} detected
            </span>
          </div>
        )}
      </header>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {result.descriptionUnavailable
          ? `Limited description for ${result.title}`
          : result.parallels.length > 0
            ? `Found ${result.parallels.length} parallels for ${result.title}`
            : `No parallels found for ${result.title}`}
      </div>

      {result.descriptionUnavailable && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          {result.type === 'book'
            ? 'No plot summary was available from Open Library. Try a well-known edition or browse curated stories below.'
            : 'No synopsis was available for this film. Try another title or browse curated stories below.'}
        </div>
      )}

      {result.apiUnavailable && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          NIV text could not be loaded — passage references are shown instead.
        </div>
      )}

      <ComparisonThemeFilter
        themes={themes}
        activeTheme={activeTheme}
        onThemeChange={setActiveTheme}
        label={`Themes in this ${result.type}`}
        onExploreTheme={onExploreTheme}
      />

      <ComparisonJumpNav parallels={visibleParallels} />

      {visibleParallels.length > 0 ? (
        <div className="stagger-children flex flex-col gap-6">
          {visibleParallels.map((parallel, i) => (
            <ScriptureParallelCard
              key={parallel.id}
              parallel={parallel}
              index={i}
              mediaTitle={result.title}
              mediaType={result.type}
            />
          ))}
        </div>
      ) : !result.descriptionUnavailable ? (
        <div className="rounded-2xl border border-dashed border-parchment-dark bg-white/60 p-10 text-center">
          <p className="text-ink-muted">No strong thematic parallels found.</p>
          <p className="mt-2 text-sm text-ink-muted/80">
            Try a title with clearer spiritual or moral themes, or browse curated stories below.
          </p>
        </div>
      ) : null}
    </div>
  )
}
