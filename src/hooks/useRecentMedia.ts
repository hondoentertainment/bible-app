const STORAGE_KEY = 'bible-app-recent-stories'
const MAX_RECENT = 5

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : []
  } catch {
    return []
  }
}

function writeRecent(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function getRecentStories(): string[] {
  return readRecent()
}

export function addRecentStory(id: string): string[] {
  const next = [id, ...readRecent().filter((s) => s !== id)].slice(0, MAX_RECENT)
  writeRecent(next)
  return next
}

export function removeRecentStory(id: string): string[] {
  const next = readRecent().filter((s) => s !== id)
  writeRecent(next)
  return next
}
