import { APP_TABS } from '../navigation/appTabs'
import type { AppMode } from '../types/media'

interface BottomNavProps {
  mode: AppMode
  onModeChange: (mode: AppMode) => void
}

/** Thumb-friendly tab bar shown only on small screens. */
export function BottomNav({ mode, onModeChange }: BottomNavProps) {
  return (
    <nav
      className="bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-parchment-dark bg-white/95 backdrop-blur-md safe-bottom md:hidden"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {APP_TABS.map((tab) => {
          const active = mode === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onModeChange(tab.id)}
              aria-current={active ? 'page' : undefined}
              className={`touch-manipulation flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[10px] font-semibold transition-colors active:scale-95 ${
                active ? 'text-gold' : 'text-ink-muted'
              }`}
            >
              <span className={active ? 'text-gold' : 'text-ink-muted/80'}>{tab.icon}</span>
              <span>{tab.shortLabel}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
