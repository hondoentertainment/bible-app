function getStickyHeaderOffset(): number {
  const header = document.querySelector('.site-header')
  if (header instanceof HTMLElement) {
    return header.offsetHeight + 16
  }
  return 96
}

export function scrollToTop(instant = false) {
  window.scrollTo({
    top: 0,
    behavior: instant ? 'auto' : 'smooth',
  })
}

export function scrollToElementId(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const top = el.getBoundingClientRect().top + window.scrollY - getStickyHeaderOffset()
  window.scrollTo({ top, behavior: 'smooth' })
}
