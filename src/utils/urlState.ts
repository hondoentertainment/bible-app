import type { AppMode } from '../types/media'

const VALID_MODES: AppMode[] = ['subjects', 'stories', 'lyrics']

export interface AppUrlState {
  mode: AppMode
  q: string
}

export function readAppUrlState(): AppUrlState {
  const params = new URLSearchParams(window.location.search)
  const modeParam = params.get('mode')
  const mode = VALID_MODES.includes(modeParam as AppMode) ? (modeParam as AppMode) : 'subjects'
  const q = params.get('q')?.trim() ?? ''
  return { mode, q }
}

export function writeAppUrlState(mode: AppMode, q?: string) {
  const params = new URLSearchParams()
  if (mode !== 'subjects') params.set('mode', mode)
  if (q?.trim()) params.set('q', q.trim())
  const next = params.toString() ? `?${params.toString()}` : window.location.pathname
  window.history.replaceState(null, '', next)
}
