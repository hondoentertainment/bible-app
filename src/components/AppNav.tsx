import type { AppMode } from '../types/media'

interface AppNavProps {
  mode: AppMode
  onModeChange: (mode: AppMode) => void
}

export function AppNav({ mode, onModeChange }: AppNavProps) {
  return (
    <nav
      className="flex flex-wrap justify-center gap-1 rounded-full border border-parchment-dark bg-white p-1 shadow-sm"
      aria-label="App sections"
    >
      <NavTab
        active={mode === 'subjects'}
        onClick={() => onModeChange('subjects')}
        label="Subjects"
      />
      <NavTab
        active={mode === 'stories'}
        onClick={() => onModeChange('stories')}
        label="Stories"
      />
      <NavTab
        active={mode === 'lyrics'}
        onClick={() => onModeChange('lyrics')}
        label="Spotify Lyrics"
      />
    </nav>
  )
}

function NavTab({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
        active
          ? 'bg-navy text-white shadow-sm'
          : 'text-ink-muted hover:text-navy'
      }`}
    >
      {label}
    </button>
  )
}
