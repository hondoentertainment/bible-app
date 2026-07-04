import type { RecentExternalMedia } from '../types/externalMedia'

const STORAGE_KEY = 'bible-app-recent-external-media'
const MAX_RECENT = 5

export function getRecentExternalMedia(): RecentExternalMedia[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as RecentExternalMedia[]
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : []
  } catch {
    return []
  }
}

export function addRecentExternalMedia(item: RecentExternalMedia): RecentExternalMedia[] {
  const key = `${item.type}-${item.id}`
  const next = [item, ...getRecentExternalMedia().filter((r) => `${r.type}-${r.id}` !== key)].slice(
    0,
    MAX_RECENT,
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function removeRecentExternalMedia(item: RecentExternalMedia): RecentExternalMedia[] {
  const key = `${item.type}-${item.id}`
  const next = getRecentExternalMedia().filter((r) => `${r.type}-${r.id}` !== key)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}
