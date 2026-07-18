import { useState } from 'react'
import { dismissShareTip, isShareTipDismissed } from '../hooks/useOnboarding'
import { trackEvent } from '../utils/analytics'

interface SharePromptProps {
  title: string
  onShare: () => void | Promise<void>
  context: string
}

export function SharePrompt({ title, onShare, context }: SharePromptProps) {
  const [visible, setVisible] = useState(() => !isShareTipDismissed())
  const [busy, setBusy] = useState(false)

  if (!visible) return null

  async function handleShare() {
    setBusy(true)
    try {
      trackEvent('share_prompt_click', { context, title: title.slice(0, 80) })
      await onShare()
    } finally {
      setBusy(false)
    }
  }

  function handleDismiss() {
    dismissShareTip()
    setVisible(false)
    trackEvent('share_prompt_dismiss', { context })
  }

  return (
    <div
      className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 px-5 py-4"
      role="region"
      aria-label="Share this comparison"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-navy">Worth sharing?</p>
          <p className="text-sm text-ink-muted">
            Pass along the parallels from <span className="font-medium text-navy">{title}</span>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleShare}
            disabled={busy}
            className="touch-manipulation rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light disabled:opacity-60 active:scale-95"
          >
            {busy ? 'Sharing…' : 'Share comparison'}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="touch-manipulation rounded-xl border border-parchment-dark px-4 py-2.5 text-sm font-medium text-ink-muted transition hover:text-navy active:scale-95"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
