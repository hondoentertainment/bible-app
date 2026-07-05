import { HorizontalChipRow } from './HorizontalChipRow'

interface ComparisonThemeFilterProps {
  themes: string[]
  activeTheme: string | null
  onThemeChange: (theme: string | null) => void
  label?: string
  onExploreTheme?: (topicName: string) => void
}

export function ComparisonThemeFilter({
  themes,
  activeTheme,
  onThemeChange,
  label = 'Themes',
  onExploreTheme,
}: ComparisonThemeFilterProps) {
  if (themes.length === 0) return null

  return (
    <section className="mb-6" aria-label={label}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold tracking-wide text-ink-muted uppercase">
          {label} <span className="font-normal normal-case text-ink-muted/80">({themes.length})</span>
        </h3>
        {activeTheme && (
          <button
            type="button"
            onClick={() => onThemeChange(null)}
            className="shrink-0 text-xs font-medium text-gold hover:underline"
          >
            Show all
          </button>
        )}
      </div>
      <HorizontalChipRow ariaLabel={label} className="pb-1">
        <button
          type="button"
          aria-pressed={activeTheme === null}
          onClick={() => onThemeChange(null)}
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
            onClick={() => onThemeChange(activeTheme === theme ? null : theme)}
            className={`touch-manipulation rounded-full border px-3.5 py-1.5 text-sm transition active:scale-95 ${
              activeTheme === theme
                ? 'border-gold bg-gold text-white'
                : 'border-navy/10 bg-navy/5 text-navy hover:border-gold/40'
            }`}
          >
            {theme}
          </button>
        ))}
      </HorizontalChipRow>
      {onExploreTheme && (
        <HorizontalChipRow className="mt-3 pb-0.5" ariaLabel="Explore themes">
          <span className="self-center pr-1 text-xs text-ink-muted">Explore:</span>
          {themes.map((theme) => (
            <button
              key={`explore-${theme}`}
              type="button"
              onClick={() => onExploreTheme(theme.split('&')[0].trim())}
              className="touch-manipulation rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs font-semibold text-gold hover:bg-gold/15"
            >
              {theme} →
            </button>
          ))}
        </HorizontalChipRow>
      )}
    </section>
  )
}
