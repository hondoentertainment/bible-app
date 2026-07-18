import type { ReactNode } from 'react'
import { APP_TABS } from '../navigation/appTabs'
import type { AppMode } from '../types/media'

interface AppNavProps {
  mode: AppMode
  onModeChange: (mode: AppMode) => void
  compact?: boolean
}

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
