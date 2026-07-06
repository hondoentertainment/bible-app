import { useEffect, useState } from 'react'
import {
  READING_SETTINGS_EVENT,
  getReadingSettings,
  updateReadingSettings,
  type ColorTheme,
} from '../hooks/useReadingSettings'

const ORDER: ColorTheme[] = ['light', 'dark', 'system']
const LABELS: Record<ColorTheme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path strokeLinecap="round" d="M8 20h8m-4-4v4" />
    </svg>
  )
}

interface ThemeToggleProps {
  className?: string
  tabIndex?: number
}

export function ThemeToggle({ className = '', tabIndex }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ColorTheme>(() => getReadingSettings().colorTheme)

  useEffect(() => {
    const sync = () => setTheme(getReadingSettings().colorTheme)
    window.addEventListener(READING_SETTINGS_EVENT, sync)
    return () => window.removeEventListener(READING_SETTINGS_EVENT, sync)
  }, [])

  function cycle() {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]
    setTheme(next)
    updateReadingSettings({ colorTheme: next })
  }

  return (
    <button
      type="button"
      onClick={cycle}
      tabIndex={tabIndex}
      className={`touch-manipulation flex h-9 w-9 items-center justify-center rounded-full border border-parchment-dark bg-white text-navy transition hover:border-gold hover:text-gold active:scale-95 ${className}`}
      aria-label={`Theme: ${LABELS[theme]}. Tap to change.`}
      title={`Theme: ${LABELS[theme]}`}
    >
      {theme === 'light' ? <SunIcon /> : theme === 'dark' ? <MoonIcon /> : <SystemIcon />}
    </button>
  )
}
