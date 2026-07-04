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
        <h3 className="text-sm font-semibold tracking-wide text-ink-muted uppercase">{label}</h3>
        {activeTheme && (
          <button
            type="button"
            onClick={() => onThemeChange(null)}
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
  )
}
