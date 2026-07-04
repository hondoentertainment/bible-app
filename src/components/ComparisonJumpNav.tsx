import { scrollToElementId } from '../utils/scroll'

interface ParallelNavItem {
  id: string
  theme: string
}

interface ComparisonJumpNavProps {
  parallels: ParallelNavItem[]
}

export function ComparisonJumpNav({ parallels }: ComparisonJumpNavProps) {
  if (parallels.length <= 1) return null

  return (
    <nav className="mb-6" aria-label="Jump to parallel">
      <p className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
        Jump to parallel
      </p>
      <div className="jump-nav-scroll flex gap-2 pb-1">
        {parallels.map((parallel, i) => (
          <button
            key={parallel.id}
            type="button"
            onClick={() => scrollToElementId(`parallel-${parallel.id}`)}
            className="touch-manipulation shrink-0 rounded-full border border-parchment-dark bg-white px-3.5 py-1.5 text-sm font-medium text-navy transition hover:border-gold hover:text-gold active:scale-95"
          >
            {i + 1}. {parallel.theme}
          </button>
        ))}
      </div>
    </nav>
  )
}
