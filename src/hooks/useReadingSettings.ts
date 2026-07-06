const STORAGE_KEY = 'bible-app-reading-settings'
export const READING_SETTINGS_EVENT = 'reading-settings-changed'

export type FontScale = '0.9' | '1' | '1.1' | '1.2'
export type ColorTheme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface ReadingSettings {
  fontScale: FontScale
  colorTheme: ColorTheme
  showEsv: boolean
}

const DEFAULT: ReadingSettings = {
  fontScale: '1',
  colorTheme: 'system',
  showEsv: false,
}

function read(): ReadingSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT
    const parsed = JSON.parse(raw) as Partial<ReadingSettings>
    return { ...DEFAULT, ...parsed }
  } catch {
    return DEFAULT
  }
}

function write(settings: ReadingSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

function prefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

export function resolveTheme(theme: ColorTheme): ResolvedTheme {
  if (theme === 'system') return prefersDark() ? 'dark' : 'light'
  return theme
}

function applyToDocument(settings: ReadingSettings) {
  document.documentElement.dataset.theme = resolveTheme(settings.colorTheme)
  document.documentElement.dataset.themePref = settings.colorTheme
  document.documentElement.dataset.fontScale = settings.fontScale
}

function notifyChange(settings: ReadingSettings) {
  window.dispatchEvent(new CustomEvent(READING_SETTINGS_EVENT, { detail: settings }))
}

export function getReadingSettings(): ReadingSettings {
  return read()
}

export function saveReadingSettings(settings: ReadingSettings): ReadingSettings {
  write(settings)
  applyToDocument(settings)
  notifyChange(settings)
  return settings
}

export function initReadingSettings(): ReadingSettings {
  const settings = read()
  applyToDocument(settings)

  // Re-apply automatically when the OS theme changes while in "system" mode.
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        const current = read()
        if (current.colorTheme === 'system') applyToDocument(current)
      })
  }

  return settings
}

export function updateReadingSettings(patch: Partial<ReadingSettings>): ReadingSettings {
  return saveReadingSettings({ ...read(), ...patch })
}
