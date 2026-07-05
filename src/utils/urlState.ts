import type { AppMode } from '../types/media'

const VALID_MODES: AppMode[] = ['subjects', 'stories', 'lyrics', 'quote']

export interface AppUrlState {
  mode: AppMode
  q: string
  storyId: string
  artist: string
  track: string
  quoteTitle: string
  quoteText: string
}

export function readAppUrlState(): AppUrlState {
  const params = new URLSearchParams(window.location.search)
  const modeParam = params.get('mode')
  const mode = VALID_MODES.includes(modeParam as AppMode) ? (modeParam as AppMode) : 'subjects'

  let quoteText = ''
  const quoteEncoded = params.get('quote')?.trim()
  if (quoteEncoded) {
    try {
      quoteText = decodeURIComponent(escape(atob(quoteEncoded)))
    } catch {
      quoteText = ''
    }
  }

  return {
    mode,
    q: params.get('q')?.trim() ?? '',
    storyId: params.get('story')?.trim() ?? '',
    artist: params.get('artist')?.trim() ?? '',
    track: params.get('track')?.trim() ?? '',
    quoteTitle: params.get('quoteTitle')?.trim() ?? '',
    quoteText,
  }
}

export function writeAppUrlState(state: Partial<AppUrlState>) {
  const params = new URLSearchParams()
  const mode = state.mode ?? 'subjects'

  if (mode !== 'subjects') params.set('mode', mode)
  if (state.q?.trim()) params.set('q', state.q.trim())
  if (state.storyId?.trim()) params.set('story', state.storyId.trim())
  if (state.artist?.trim()) params.set('artist', state.artist.trim())
  if (state.track?.trim()) params.set('track', state.track.trim())
  if (state.quoteTitle?.trim()) params.set('quoteTitle', state.quoteTitle.trim())
  if (state.quoteText?.trim()) {
    try {
      const encoded = btoa(unescape(encodeURIComponent(state.quoteText.trim())))
      if (encoded.length <= 1600) params.set('quote', encoded)
    } catch {
      // omit long or invalid quote from URL
    }
  }

  const next = params.toString() ? `?${params.toString()}` : window.location.pathname
  window.history.replaceState(null, '', next)
}
