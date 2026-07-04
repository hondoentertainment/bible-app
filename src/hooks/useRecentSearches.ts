const STORAGE_KEY = 'bible-app-recent-searches'
const MAX_RECENT = 6

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : []
  } catch {
    return []
  }
}

function writeRecent(searches: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
}

export function getRecentSearches(): string[] {
  return readRecent()
}

export function addRecentSearch(query: string): string[] {
  const trimmed = query.trim()
  if (!trimmed) return readRecent()

  const next = [
    trimmed,
    ...readRecent().filter((q) => q.toLowerCase() !== trimmed.toLowerCase()),
  ].slice(0, MAX_RECENT)

  writeRecent(next)
  return next
}

export function clearRecentSearches(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function removeRecentSearch(query: string): string[] {
  const next = readRecent().filter((q) => q.toLowerCase() !== query.toLowerCase())
  writeRecent(next)
  return next
}
