import { track } from '@vercel/analytics'

type EventProps = Record<string, string | number | boolean | null>

/**
 * Fire a custom analytics event. Safe to call anywhere: @vercel/analytics
 * only transmits in production and silently no-ops in dev / when disabled.
 */
export function trackEvent(name: string, props?: EventProps): void {
  try {
    track(name, props)
  } catch {
    // Never let analytics break the app.
  }
}

/** Report a caught error to analytics so production failures are visible. */
export function reportError(error: unknown, context?: string): void {
  const message = error instanceof Error ? error.message : String(error)
  trackEvent('client_error', {
    message: message.slice(0, 200),
    context: context ?? 'unknown',
  })
}
