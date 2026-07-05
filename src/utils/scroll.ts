export interface ScrollOptions {
  smooth?: boolean
}

/** True when the user has requested reduced motion. Safe in non-DOM environments. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Resolves the effective scroll behavior, forcing instant scroll under reduced motion. */
export function resolveScrollBehavior(smooth: boolean, reducedMotion: boolean): ScrollBehavior {
  return smooth && !reducedMotion ? 'smooth' : 'auto'
}

/** Computes the target scrollY for an element, offset by a sticky header, clamped to >= 0. */
export function computeElementScrollTop(
  elementTop: number,
  scrollY: number,
  headerOffset: number,
): number {
  return Math.max(0, elementTop + scrollY - headerOffset)
}

function getStickyHeaderOffset(): number {
  if (typeof document === 'undefined') return 72
  const header = document.querySelector('.site-header--fixed.is-visible')
  if (header instanceof HTMLElement) {
    return header.offsetHeight + 12
  }
  return 72
}

export function scrollToTop(options: ScrollOptions = {}): void {
  if (typeof window === 'undefined') return
  const behavior = resolveScrollBehavior(options.smooth ?? false, prefersReducedMotion())
  window.scrollTo({ top: 0, behavior })
}

export function scrollToElementId(id: string, options: ScrollOptions = {}): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  const el = document.getElementById(id)
  if (!el) return

  const top = computeElementScrollTop(
    el.getBoundingClientRect().top,
    window.scrollY,
    getStickyHeaderOffset(),
  )
  const behavior = resolveScrollBehavior(options.smooth ?? true, prefersReducedMotion())
  window.scrollTo({ top, behavior })
}
