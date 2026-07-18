import { useEffect, useState } from 'react'
import { dismissInstallPrompt, isInstallPromptDismissed } from '../hooks/useOnboarding'
import { trackEvent } from '../utils/analytics'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isInstallPromptDismissed()) return

    function onBeforeInstall(e: Event) {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setVisible(true)
      trackEvent('pwa_install_available')
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  if (!visible || !deferred) return null

  async function handleInstall() {
    if (!deferred) return
    trackEvent('pwa_install_click')
    await deferred.prompt()
    const choice = await deferred.userChoice
    trackEvent('pwa_install_outcome', { outcome: choice.outcome })
    setDeferred(null)
    setVisible(false)
    if (choice.outcome === 'dismissed') dismissInstallPrompt()
  }

  function handleDismiss() {
    dismissInstallPrompt()
    setVisible(false)
    trackEvent('pwa_install_dismiss')
  }

  return (
    <div
      className="fixed inset-x-0 bottom-20 z-40 px-4 md:bottom-6"
      role="dialog"
      aria-label="Install app"
    >
      <div className="mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-parchment-dark bg-white p-4 shadow-xl">
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-semibold text-navy">Install Scripture Search</p>
          <p className="text-xs text-ink-muted">Add to your home screen for quick offline access to favorites.</p>
        </div>
        <button
          type="button"
          onClick={handleInstall}
          className="touch-manipulation shrink-0 rounded-xl bg-navy px-3 py-2 text-xs font-semibold text-white active:scale-95"
        >
          Install
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="touch-manipulation shrink-0 rounded-lg px-2 py-2 text-xs text-ink-muted hover:text-navy"
          aria-label="Dismiss install prompt"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
