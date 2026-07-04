import type { ReactNode } from 'react'
import type { AppMode } from '../types/media'

interface AppNavProps {
  mode: AppMode
  onModeChange: (mode: AppMode) => void
}

const TABS: Array<{ id: AppMode; label: string; shortLabel: string; icon: ReactNode }> = [
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
]

export function AppNav({ mode, onModeChange }: AppNavProps) {
  return (
    <nav
      className="inline-flex max-w-full overflow-x-auto rounded-full border border-parchment-dark bg-white p-1 shadow-sm"
      aria-label="App sections"
    >
      {TABS.map((tab) => (
        <NavTab
          key={tab.id}
          active={mode === tab.id}
          onClick={() => onModeChange(tab.id)}
          label={tab.label}
          shortLabel={tab.shortLabel}
          icon={tab.icon}
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
}: {
  active: boolean
  onClick: () => void
  label: string
  shortLabel: string
  icon: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-semibold transition-all duration-300 sm:px-5 ${
        active
          ? 'bg-navy text-white shadow-md'
          : 'text-ink-muted hover:bg-parchment/60 hover:text-navy'
      }`}
    >
      <span className={active ? 'text-gold-light' : 'text-ink-muted/70'}>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{shortLabel}</span>
    </button>
  )
}
