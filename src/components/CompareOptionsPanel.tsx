import type { CompareOptions } from '../types/lyrics'
import { DEFAULT_COMPARE_OPTIONS } from '../types/lyrics'

interface CompareOptionsPanelProps {
  options: CompareOptions
  onChange: (options: CompareOptions) => void
}

const PARALLEL_COUNTS = [3, 5, 10] as const
const VERSE_COUNTS = [1, 2, 3] as const

export function CompareOptionsPanel({ options, onChange }: CompareOptionsPanelProps) {
  const maxParallels = options.maxParallels ?? DEFAULT_COMPARE_OPTIONS.maxParallels
  const versesPerParallel = options.versesPerParallel ?? DEFAULT_COMPARE_OPTIONS.versesPerParallel

  return (
    <details className="rounded-xl border border-parchment-dark bg-white/80">
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-navy transition hover:bg-parchment/40">
        Comparison options
      </summary>
      <div className="space-y-4 border-t border-parchment-dark px-4 py-4">
        <fieldset>
          <legend className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
            Max parallels
          </legend>
          <div className="flex flex-wrap gap-2">
            {PARALLEL_COUNTS.map((count) => (
              <button
                key={count}
                type="button"
                aria-pressed={maxParallels === count}
                onClick={() => onChange({ ...options, maxParallels: count })}
                className={`touch-manipulation min-h-[40px] rounded-full border px-4 py-1.5 text-sm font-medium transition active:scale-95 ${
                  maxParallels === count
                    ? 'border-navy bg-navy text-white'
                    : 'border-parchment-dark bg-white text-ink-muted hover:border-gold'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
            Verses per parallel
          </legend>
          <div className="flex flex-wrap gap-2">
            {VERSE_COUNTS.map((count) => (
              <button
                key={count}
                type="button"
                aria-pressed={versesPerParallel === count}
                onClick={() => onChange({ ...options, versesPerParallel: count })}
                className={`touch-manipulation min-h-[40px] rounded-full border px-4 py-1.5 text-sm font-medium transition active:scale-95 ${
                  versesPerParallel === count
                    ? 'border-gold bg-gold text-white'
                    : 'border-parchment-dark bg-white text-ink-muted hover:border-gold'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </details>
  )
}
