import { useEffect, useRef, useState } from 'react'
import {
  getReadingSettings,
  updateReadingSettings,
  type ColorTheme,
  type FontScale,
} from '../hooks/useReadingSettings'
import {
  disableDailyNotifications,
  enableDailyNotifications,
  isDailyNotificationEnabled,
} from '../hooks/useDailyNotification'
import { useToast } from '../hooks/useToast'

export function ReadingSettingsPanel() {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(getReadingSettings)
  const [dailyOn, setDailyOn] = useState(isDailyNotificationEnabled)
  const containerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    // Move focus into the panel when it opens.
    panelRef.current?.querySelector<HTMLElement>('button, input, [tabindex]')?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  function patch(p: Partial<typeof settings>) {
    const next = updateReadingSettings(p)
    setSettings(next)
  }

  async function toggleDaily() {
    if (dailyOn) {
      disableDailyNotifications()
      setDailyOn(false)
      showToast('Daily reminders turned off')
      return
    }
    const result = await enableDailyNotifications()
    if (result === 'granted') {
      setDailyOn(true)
      showToast('Daily verse reminders enabled')
    } else if (result === 'unsupported') {
      showToast('Notifications not supported in this browser')
    } else {
      showToast('Notification permission denied')
    }
  }

  return (
    <div ref={containerRef} className="fixed right-4 bottom-4 z-50 safe-bottom">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="touch-manipulation flex h-12 w-12 items-center justify-center rounded-full border border-parchment-dark bg-white text-navy shadow-lg transition hover:border-gold hover:text-gold active:scale-95"
        aria-label="Reading settings"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="reading-settings-panel"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          id="reading-settings-panel"
          role="dialog"
          aria-label="Reading settings"
          className="absolute right-0 bottom-14 w-72 rounded-2xl border border-parchment-dark bg-white p-4 shadow-xl"
        >
          <p className="mb-3 font-display text-lg font-semibold text-navy">Reading settings</p>

          <fieldset className="mb-4">
            <legend className="mb-2 text-xs font-semibold uppercase text-ink-muted">Text size</legend>
            <div className="flex flex-wrap gap-2">
              {(['0.9', '1', '1.1', '1.2'] as FontScale[]).map((scale) => (
                <button
                  key={scale}
                  type="button"
                  aria-pressed={settings.fontScale === scale}
                  onClick={() => patch({ fontScale: scale })}
                  className={`rounded-full border px-3 py-1 text-sm ${settings.fontScale === scale ? 'border-navy bg-navy text-white' : 'border-parchment-dark'}`}
                >
                  {scale === '1' ? 'Default' : `${Math.round(parseFloat(scale) * 100)}%`}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mb-4">
            <legend className="mb-2 text-xs font-semibold uppercase text-ink-muted">Theme</legend>
            <div className="flex gap-2">
              {(['light', 'dark'] as ColorTheme[]).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  aria-pressed={settings.colorTheme === theme}
                  onClick={() => patch({ colorTheme: theme })}
                  className={`flex-1 rounded-lg border py-2 text-sm capitalize ${settings.colorTheme === theme ? 'border-navy bg-navy text-white' : 'border-parchment-dark'}`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="mb-4 flex items-center justify-between gap-3 text-sm">
            <span className="text-navy">Show ESV alongside NIV</span>
            <input
              type="checkbox"
              checked={settings.showEsv}
              onChange={(e) => patch({ showEsv: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
          </label>

          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="text-navy">Daily verse reminder</span>
            <input
              type="checkbox"
              checked={dailyOn}
              onChange={() => toggleDaily()}
              className="h-4 w-4 accent-gold"
            />
          </label>
        </div>
      )}
    </div>
  )
}
