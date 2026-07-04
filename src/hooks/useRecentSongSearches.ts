export interface RecentSong {
  artist: string
  title: string
}

const STORAGE_KEY = 'bible-app-recent-songs'
const MAX_RECENT = 5

function readRecent(): RecentSong[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (v): v is RecentSong =>
        typeof v === 'object' &&
        v !== null &&
        typeof v.artist === 'string' &&
        typeof v.title === 'string',
    )
  } catch {
    return []
  }
}

function writeRecent(songs: RecentSong[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(songs))
}

function songKey(s: RecentSong) {
  return `${s.artist.toLowerCase()}|${s.title.toLowerCase()}`
}

export function getRecentSongs(): RecentSong[] {
  return readRecent()
}

export function addRecentSong(song: RecentSong): RecentSong[] {
  const trimmed = { artist: song.artist.trim(), title: song.title.trim() }
  if (!trimmed.artist || !trimmed.title) return readRecent()

  const next = [
    trimmed,
    ...readRecent().filter((s) => songKey(s) !== songKey(trimmed)),
  ].slice(0, MAX_RECENT)

  writeRecent(next)
  return next
}

export function removeRecentSong(song: RecentSong): RecentSong[] {
  const next = readRecent().filter((s) => songKey(s) !== songKey(song))
  writeRecent(next)
  return next
}
