import type { AppUrlState } from './urlState'

const MAX_QUOTE_URL_CHARS = 1200

export function buildShareUrl(state: AppUrlState): string {
  const url = new URL(window.location.origin + window.location.pathname)
  const params = url.searchParams

  if (state.mode !== 'subjects') params.set('mode', state.mode)
  if (state.q?.trim()) params.set('q', state.q.trim())
  if (state.storyId?.trim()) params.set('story', state.storyId.trim())
  if (state.artist?.trim()) params.set('artist', state.artist.trim())
  if (state.track?.trim()) params.set('track', state.track.trim())
  if (state.quoteTitle?.trim()) params.set('quoteTitle', state.quoteTitle.trim())
  if (state.quoteText?.trim()) {
    const encoded = encodeQuoteForUrl(state.quoteText.trim())
    if (encoded) params.set('quote', encoded)
  }

  const query = params.toString()
  return query ? `${url.pathname}?${query}` : url.pathname
}

export function encodeQuoteForUrl(text: string): string | null {
  if (text.length > MAX_QUOTE_URL_CHARS) return null
  try {
    return btoa(unescape(encodeURIComponent(text)))
  } catch {
    return null
  }
}

export function decodeQuoteFromUrl(encoded: string): string | null {
  try {
    return decodeURIComponent(escape(atob(encoded)))
  } catch {
    return null
  }
}

export async function copyShareUrl(state: AppUrlState): Promise<boolean> {
  const url = buildShareUrl(state)
  await navigator.clipboard.writeText(url)
  return true
}
