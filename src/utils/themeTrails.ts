import { FEATURED_SONGS } from '../data/featured-songs'
import { getTopicById, searchTopics } from '../data/topics'
import { getComparisonsByType, searchCuratedComparisons } from '../data/media-comparisons'
import type { MediaComparison } from '../types/media'

export interface ThemeTrailItem {
  kind: 'story' | 'subject' | 'song'
  label: string
  detail: string
  storyId?: string
  topicName?: string
  artist?: string
  track?: string
}

export function getThemeTrail(themeName: string): ThemeTrailItem[] {
  const topic = searchTopics(themeName)[0] ?? getTopicById(themeName.toLowerCase())
  const name = topic?.name ?? themeName
  const trail: ThemeTrailItem[] = []

  const stories = searchCuratedComparisons(name).slice(0, 2)
  for (const story of stories) {
    trail.push({
      kind: 'story',
      label: story.title,
      detail: `Curated ${story.type} on ${name}`,
      storyId: story.id,
    })
  }

  if (topic) {
    trail.push({
      kind: 'subject',
      label: `Explore ${topic.name}`,
      detail: topic.description,
      topicName: topic.name,
    })
  }

  const songs = FEATURED_SONGS.filter(
    (s) => s.theme?.toLowerCase() === name.toLowerCase() || s.theme?.toLowerCase().includes(name.toLowerCase().split(' ')[0] ?? ''),
  ).slice(0, 2)

  for (const song of songs) {
    trail.push({
      kind: 'song',
      label: song.title,
      detail: `${song.artist} · ${song.theme ?? name} theme`,
      artist: song.artist,
      track: song.title,
    })
  }

  if (trail.length < 3) {
    const fallbackStories = getComparisonsByType('all')
      .filter((s) => s.parallels.some((p) => p.theme.toLowerCase().includes(name.toLowerCase())))
      .slice(0, 3 - trail.length)
    for (const story of fallbackStories) {
      if (!trail.some((t) => t.storyId === story.id)) {
        trail.push({
          kind: 'story',
          label: story.title,
          detail: story.summary.slice(0, 80) + '…',
          storyId: story.id,
        })
      }
    }
  }

  return trail.slice(0, 5)
}

export function getStoryById(id: string): MediaComparison | undefined {
  return getComparisonsByType('all').find((s) => s.id === id)
}
