import { useEffect, useMemo, useRef, useState } from 'react'
import { CompareOptionsPanel } from './CompareOptionsPanel'
import { ComparisonJumpNav } from './ComparisonJumpNav'
import { ComparisonThemeFilter } from './ComparisonThemeFilter'
import { ComparisonToolbar } from './ComparisonToolbar'
import { ScriptureParallelCard } from './ScriptureParallelCard'
import { compareQuoteToScripture } from '../services/externalMediaCompare'
import type { QuoteComparisonResult } from '../types/externalMedia'
import { DEFAULT_EXTERNAL_COMPARE_OPTIONS } from '../types/externalMedia'
import type { ExternalMediaCompareOptions } from '../types/externalMedia'
import { hapticLight } from '../utils/haptics'
import { scrollToTop } from '../utils/scroll'
import { useToast } from '../hooks/useToast'
import {
  isComparisonFavorite,
  quoteComparisonKey,
  toggleFavoriteComparison,
  type SavedComparison,
} from '../hooks/useFavorites'
import { copyShareUrl } from '../utils/shareUrl'
import type { AppUrlState } from '../utils/urlState'

interface QuoteCompareViewProps {
  onExploreTheme?: (topicName: string) => void
  initialQuote?: string
  initialTitle?: string
  onUrlChange?: (quote: string, title: string) => void
}

export function QuoteCompareView({
  onExploreTheme,
  initialQuote = '',
  initialTitle = '',
  onUrlChange,
}: QuoteCompareViewProps) {
  const { showToast } = useToast()
  const [title, setTitle] = useState(initialTitle)
  const [quoteText, setQuoteText] = useState(initialQuote)
  const [compareOptions, setCompareOptions] = useState<ExternalMediaCompareOptions>(
    DEFAULT_EXTERNAL_COMPARE_OPTIONS,
  )
  const [comparing, setComparing] = useState(false)
  const [result, setResult] = useState<QuoteComparisonResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [favSaved, setFavSaved] = useState(false)
  const didInitRef = useRef(false)

  const favKey = result ? quoteComparisonKey(result.title, result.quoteText) : ''

  useEffect(() => {
    if (result) setFavSaved(isComparisonFavorite(favKey))
  }, [result, favKey])

  useEffect(() => {
    if (didInitRef.current || !initialQuote.trim()) return
    didInitRef.current = true
    runCompare(initialQuote, initialTitle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runCompare(text: string, quoteTitle: string) {
    const trimmed = text.trim()
    if (trimmed.length < 12) {
      setError('Enter at least a sentence or two to compare with Scripture.')
      return
    }

    setComparing(true)
    setError(null)
    setResult(null)
    scrollToTop()

    try {
      const comparison = await compareQuoteToScripture(trimmed, quoteTitle, compareOptions)
      setResult(comparison)
      onUrlChange?.(trimmed, quoteTitle.trim() || 'Your quote')
    } catch {
      setError('Comparison failed. Please try again.')
    } finally {
      setComparing(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    runCompare(quoteText, title)
  }

  function handleBack() {
    setResult(null)
    onUrlChange?.('', '')
  }

  async function handleCopyLink() {
    if (!result) return
    const state: AppUrlState = {
      mode: 'quote',
      q: '',
      storyId: '',
      artist: '',
      track: '',
      quoteTitle: result.title,
      quoteText: result.quoteText,
    }
    await copyShareUrl(state)
    hapticLight()
    showToast('Link copied to clipboard')
  }

  function handleFavorite() {
    if (!result) return
    const saved: SavedComparison = {
      key: favKey,
      kind: 'quote',
      title: result.title,
      subtitle: result.quoteText.slice(0, 80) + (result.quoteText.length > 80 ? '…' : ''),
      quoteText: result.quoteText,
      savedAt: Date.now(),
    }
    const { saved: isSaved } = toggleFavoriteComparison(saved)
    setFavSaved(isSaved)
    hapticLight()
    showToast(isSaved ? 'Comparison saved to favorites' : 'Removed from favorites')
  }

  if (result) {
    return (
      <QuoteResultView
        result={result}
        compareOptions={compareOptions}
        onCompareOptionsChange={setCompareOptions}
        onBack={handleBack}
        onExploreTheme={onExploreTheme}
        onRecompare={() => runCompare(result.quoteText, result.title)}
        onCopyLink={handleCopyLink}
        onFavorite={handleFavorite}
        isFavorite={favSaved}
      />
    )
  }

  return (
    <section className="w-full animate-fade-in-up" aria-label="Compare any quote to Scripture">
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-navy sm:text-3xl">
          Quote &amp; Scripture
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-muted">
          Paste any quote, poem, speech, or post — see how its themes connect to NIV passages.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
        <CompareOptionsPanel
          options={compareOptions}
          onChange={(opts) => setCompareOptions({ ...compareOptions, ...opts })}
        />

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy">Title (optional)</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. MLK speech, friend's note, poem title…"
            className="w-full rounded-xl border border-parchment-dark bg-white px-4 py-3 text-base text-ink placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy">Your text</span>
          <textarea
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            rows={8}
            required
            placeholder="Paste a quote, lyric snippet, poem, sermon excerpt, or any text you'd like to compare with Scripture…"
            className="w-full resize-y rounded-xl border border-parchment-dark bg-white px-4 py-3 text-base leading-relaxed text-ink placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
          />
        </label>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={comparing || quoteText.trim().length < 12}
          className="touch-manipulation w-full rounded-xl bg-navy px-6 py-3.5 text-base font-semibold text-white transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
        >
          {comparing ? 'Comparing with Scripture…' : 'Compare with Scripture'}
        </button>
      </form>
    </section>
  )
}

function QuoteResultView({
  result,
  compareOptions,
  onCompareOptionsChange,
  onBack,
  onExploreTheme,
  onRecompare,
  onCopyLink,
  onFavorite,
  isFavorite,
}: {
  result: QuoteComparisonResult
  compareOptions: ExternalMediaCompareOptions
  onCompareOptionsChange: (opts: ExternalMediaCompareOptions) => void
  onBack: () => void
  onExploreTheme?: (topicName: string) => void
  onRecompare?: () => void
  onCopyLink?: () => void
  onFavorite?: () => void
  isFavorite?: boolean
}) {
  const { showToast } = useToast()
  const [activeTheme, setActiveTheme] = useState<string | null>(null)

  const themes = useMemo(
    () => [...new Set(result.parallels.map((p) => p.theme))],
    [result.parallels],
  )

  const visibleParallels = useMemo(
    () =>
      activeTheme ? result.parallels.filter((p) => p.theme === activeTheme) : result.parallels,
    [result.parallels, activeTheme],
  )

  useEffect(() => {
    scrollToTop()
  }, [result.title])

  async function handleCopyAll() {
    const lines = [
      `"${result.quoteText}"`,
      result.title !== 'Your quote' ? `— ${result.title}` : '',
      '',
      ...result.parallels.flatMap((p, i) => [
        `Parallel ${i + 1}: ${p.theme}`,
        p.connection,
        ...p.verses.map((v) => `${v.reference}: ${v.text}`),
        '',
      ]),
    ]
    await navigator.clipboard.writeText(lines.filter(Boolean).join('\n'))
    hapticLight()
    showToast('Comparison copied to clipboard')
  }

  return (
    <div className="w-full animate-fade-in-up">
      <ComparisonToolbar
        backLabel="Compare another quote"
        onBack={onBack}
        onRecompare={onRecompare}
        onCopy={handleCopyAll}
        onCopyLink={onCopyLink}
        onFavorite={onFavorite}
        isFavorite={isFavorite}
        showActions
      />

      <header className="mb-6 overflow-hidden rounded-2xl border border-parchment-dark bg-white shadow-sm">
        <div className="p-5 sm:p-6">
          <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold tracking-wide text-gold uppercase">
            Quote
          </span>
          {result.title !== 'Your quote' && (
            <h2 className="mt-3 font-display text-2xl font-bold text-navy sm:text-3xl">
              {result.title}
            </h2>
          )}
          <blockquote className="mt-4 font-display text-xl leading-relaxed text-navy italic sm:text-2xl">
            &ldquo;{result.quoteText.length > 400 ? `${result.quoteText.slice(0, 400)}…` : result.quoteText}&rdquo;
          </blockquote>
        </div>
      </header>

      {onCompareOptionsChange && (
        <div className="mb-6">
          <CompareOptionsPanel options={compareOptions} onChange={onCompareOptionsChange} />
        </div>
      )}

      {result.apiUnavailable && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          NIV text could not be loaded — passage references are shown instead.
        </div>
      )}

      {result.parallels.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-parchment-dark bg-white/60 p-10 text-center text-ink-muted">
          No strong theme matches found. Try adding more text or a descriptive title.
        </div>
      ) : (
        <>
          <ComparisonThemeFilter
            themes={themes}
            activeTheme={activeTheme}
            onThemeChange={setActiveTheme}
            label="Themes in this quote"
            onExploreTheme={onExploreTheme}
          />

          <ComparisonJumpNav parallels={visibleParallels} />

          <div className="stagger-children flex flex-col gap-6">
            {visibleParallels.map((parallel, i) => (
              <ScriptureParallelCard
                key={parallel.id}
                parallel={parallel}
                index={i}
                mediaTitle={result.title}
                mediaType="book"
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
