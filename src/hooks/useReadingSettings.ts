const STORAGE_KEY = 'bible-app-reading-settings'

export type FontScale = '0.9' | '1' | '1.1' | '1.2'
export type ColorTheme = 'light' | 'dark'

export interface ReadingSettings {
  fontScale: FontScale
  colorTheme: ColorTheme
  showEsv: boolean
}

const DEFAULT: ReadingSettings = {
  fontScale: '1',
  colorTheme: 'light',
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

function applyToDocument(settings: ReadingSettings) {
  document.documentElement.dataset.theme = settings.colorTheme
  document.documentElement.dataset.fontScale = settings.fontScale
}

export function getReadingSettings(): ReadingSettings {
  return read()
}

export function saveReadingSettings(settings: ReadingSettings): ReadingSettings {
  write(settings)
  applyToDocument(settings)
  return settings
}

export function initReadingSettings(): ReadingSettings {
  const settings = read()
  applyToDocument(settings)
  return settings
}

export function updateReadingSettings(patch: Partial<ReadingSettings>): ReadingSettings {
  return saveReadingSettings({ ...read(), ...patch })
}
