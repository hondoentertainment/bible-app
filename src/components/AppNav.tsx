import type { ReactNode } from 'react'
import type { AppMode } from '../types/media'

interface AppNavProps {
  mode: AppMode
  onModeChange: (mode: AppMode) => void
  compact?: boolean
}

export const APP_TABS: Array<{ id: AppMode; label: string; shortLabel: string; icon: ReactNode }> = [
  {
    id: 'subjects',
    label: 'Subjects',
    shortLabel: 'Subjects',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
      </svg>
    ),
  },
  {
    id: 'stories',
    label: 'Stories',
    shortLabel: 'Stories',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 'lyrics',
    label: 'Spotify Lyrics',
    shortLabel: 'Lyrics',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    id: 'quote',
    label: 'Quote',
    shortLabel: 'Quote',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
]

export function AppNav({ mode, onModeChange, compact = false }: AppNavProps) {
  return (
    <nav
      className={`chip-scroll-row inline-flex max-w-full rounded-full border border-parchment-dark bg-white shadow-sm ${
        compact ? 'p-0.5' : 'p-1'
      }`}
      aria-label="App sections"
    >
      {APP_TABS.map((tab) => (
        <NavTab
          key={tab.id}
          active={mode === tab.id}
          onClick={() => onModeChange(tab.id)}
          label={tab.label}
          shortLabel={tab.shortLabel}
          icon={tab.icon}
          compact={compact}
        />
      ))}
    </nav>
  )
}

function NavTab({
  active,
  onClick,
  label,
  shortLabel,
  icon,
  compact = false,
}: {
  active: boolean
  onClick: () => void
  label: string
  shortLabel: string
  icon: ReactNode
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex shrink-0 items-center gap-1.5 rounded-full font-semibold transition-all duration-300 touch-manipulation active:scale-95 ${
        compact ? 'px-2.5 py-1.5 text-xs sm:px-3' : 'gap-2 px-3.5 py-2.5 text-sm sm:px-5'
      } ${
        active
          ? 'bg-navy text-white shadow-md'
          : 'text-ink-muted hover:bg-parchment/60 hover:text-navy'
      }`}
    >
      <span className={active ? 'text-gold-light' : 'text-ink-muted/70'}>{icon}</span>
      {compact ? (
        <span className="sr-only">{label}</span>
      ) : (
        <>
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">{shortLabel}</span>
        </>
      )}
    </button>
  )
}
