function getStickyHeaderOffset(): number {
  const header = document.querySelector('.site-header--fixed.is-visible')
  if (header instanceof HTMLElement) {
    return header.offsetHeight + 12
  }
  return 72
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'auto' })
}

export function scrollToElementId(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const top = el.getBoundingClientRect().top + window.scrollY - getStickyHeaderOffset()
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}
