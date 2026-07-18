import { useState } from 'react'
import { dismissOnboarding, isOnboardingDismissed } from '../hooks/useOnboarding'
import { trackEvent } from '../utils/analytics'
import type { AppMode } from '../types/media'

interface OnboardingTipProps {
  onNavigate: (mode: AppMode) => void
}

const STEPS: Array<{ mode: AppMode; title: string; detail: string }> = [
  { mode: 'subjects', title: 'Subjects', detail: 'Search NIV themes like love, hope, and grief' },
  { mode: 'stories', title: 'Stories', detail: 'Compare books, movies, and TV with Scripture' },
  { mode: 'lyrics', title: 'Lyrics', detail: 'Match song lyrics to biblical themes' },
]

export function OnboardingTip({ onNavigate }: OnboardingTipProps) {
  const [visible, setVisible] = useState(() => !isOnboardingDismissed())

  if (!visible) return null

  function dismiss() {
    dismissOnboarding()
    setVisible(false)
    trackEvent('onboarding_dismiss')
  }

  return (
    <aside
      className="mb-6 rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/10 via-white to-parchment/80 p-5 shadow-sm"
      aria-label="Getting started"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-gold uppercase">Getting started</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-navy">Three ways to meet Scripture</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Start with a subject, open a story parallel, or compare a song — your saves stay on this device.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="touch-manipulation shrink-0 rounded-lg px-2 py-1 text-sm text-ink-muted transition hover:text-navy active:scale-95"
          aria-label="Dismiss getting started tip"
        >
          Dismiss
        </button>
      </div>
      <ol className="mt-4 grid gap-2 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.mode}>
            <button
              type="button"
              onClick={() => {
                trackEvent('onboarding_step', { mode: step.mode, step: i + 1 })
                onNavigate(step.mode)
              }}
              className="touch-manipulation flex h-full w-full flex-col rounded-xl border border-parchment-dark bg-white px-3 py-3 text-left transition hover:border-gold/50 hover:shadow-sm active:scale-[0.99]"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="mt-2 text-sm font-semibold text-navy">{step.title}</span>
              <span className="mt-0.5 text-xs leading-snug text-ink-muted">{step.detail}</span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  )
}
