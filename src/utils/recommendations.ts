import { getFavoriteComparisons, getFavoriteVerses } from '../hooks/useFavorites'
import { getRecentSearches } from '../hooks/useRecentSearches'
import { getRecentStories } from '../hooks/useRecentMedia'
import { getRecentSongs } from '../hooks/useRecentSongSearches'
import { searchTopics, TOPICS } from '../data/topics'
import { searchCuratedComparisons } from '../data/media-comparisons'
import { FEATURED_SONGS } from '../data/featured-songs'

export interface Recommendation {
  kind: 'subject' | 'story' | 'song'
  label: string
  detail: string
  topicName?: string
  storyId?: string
  artist?: string
  track?: string
}

export function getPersonalRecommendations(limit = 6): Recommendation[] {
  const recs: Recommendation[] = []
  const seen = new Set<string>()

  function add(rec: Recommendation) {
    const key = `${rec.kind}:${rec.label}`
    if (seen.has(key)) return
    seen.add(key)
    recs.push(rec)
  }

  for (const term of getRecentSearches()) {
    const topic = searchTopics(term)[0]
    if (topic) {
      add({ kind: 'subject', label: topic.name, detail: topic.description, topicName: topic.name })
    }
  }

  for (const storyId of getRecentStories()) {
    const match = searchCuratedComparisons(storyId)[0]
    if (match) {
      add({ kind: 'story', label: match.title, detail: match.summary.slice(0, 90), storyId: match.id })
    }
  }

  for (const song of getRecentSongs()) {
    add({
      kind: 'song',
      label: song.title,
      detail: song.artist,
      artist: song.artist,
      track: song.title,
    })
  }

  for (const fav of getFavoriteComparisons()) {
    if (fav.kind === 'story' && fav.storyId) {
      add({ kind: 'story', label: fav.title, detail: fav.subtitle ?? 'Saved comparison', storyId: fav.storyId })
    }
    if (fav.kind === 'lyrics' && fav.artist && fav.track) {
      add({ kind: 'song', label: fav.track, detail: fav.artist, artist: fav.artist, track: fav.track })
    }
  }

  for (const verse of getFavoriteVerses()) {
    const topic = TOPICS.find((t) => t.verseIds.includes(verse.id))
    if (topic) {
      add({ kind: 'subject', label: topic.name, detail: `Related to ${verse.reference}`, topicName: topic.name })
    }
  }

  if (recs.length < limit) {
    for (const song of FEATURED_SONGS) {
      add({
        kind: 'song',
        label: song.title,
        detail: `${song.artist} · ${song.theme ?? 'Featured'}`,
        artist: song.artist,
        track: song.title,
      })
      if (recs.length >= limit) break
    }
  }

  if (recs.length < limit) {
    for (const topic of TOPICS.slice(0, 4)) {
      add({ kind: 'subject', label: topic.name, detail: topic.description, topicName: topic.name })
      if (recs.length >= limit) break
    }
  }

  return recs.slice(0, limit)
}
