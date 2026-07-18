import { FEATURED_SONGS } from '../data/featured-songs'
import { getTopicById, searchTopics } from '../data/topics'
import { getComparisonsByType, searchCuratedComparisons } from '../data/media-comparisons'
import type { MediaComparison, MediaType } from '../types/media'

export interface ThemeTrailItem {
  kind: 'story' | 'subject' | 'song'
  label: string
  detail: string
  storyId?: string
  topicName?: string
  artist?: string
  track?: string
}

const THEME_STORY_BOOST: Record<string, string[]> = {
  hope: ['shawshank', 'its-a-wonderful-life', 'ted-lasso', 'lotr-fellowship'],
  faith: ['star-wars', 'the-bible-miniseries', 'narnia'],
  love: ['ted-lasso', 'les-miserables', 'where-is-the-love'],
  'mercy & forgiveness': ['les-miserables', 'the-chosen'],
  forgiveness: ['les-miserables', 'the-chosen'],
  redemption: ['shawshank', 'star-wars', 'les-miserables'],
  sacrifice: ['hacksaw-ridge', 'the-bible-miniseries', 'les-miserables'],
  friendship: ['lotr-fellowship', 'its-a-wonderful-life', 'ted-lasso'],
  obedience: ['chariots', 'hacksaw-ridge'],
  discipleship: ['the-chosen', 'pilgrims-progress'],
  'spiritual warfare': ['screwtape', 'star-wars'],
  justice: ['i-have-a-dream', 'where-is-the-love'],
  freedom: ['prince-of-egypt', 'shawshank'],
  salvation: ['pilgrims-progress', 'the-bible-miniseries'],
}

function pushStory(trail: ThemeTrailItem[], story: MediaComparison, themeName: string) {
  if (trail.some((t) => t.storyId === story.id)) return
  trail.push({
    kind: 'story',
    label: story.title,
    detail: `Curated ${story.type} on ${themeName}`,
    storyId: story.id,
  })
}

export function getThemeTrail(themeName: string): ThemeTrailItem[] {
  const topic = searchTopics(themeName)[0] ?? getTopicById(themeName.toLowerCase())
  const name = topic?.name ?? themeName
  const trail: ThemeTrailItem[] = []
  const key = name.toLowerCase()

  const boostIds = THEME_STORY_BOOST[key] ?? []
  for (const id of boostIds) {
    const story = getComparisonsByType('all').find((s) => s.id === id)
    if (story) pushStory(trail, story, name)
    if (trail.length >= 2) break
  }

  const searched = searchCuratedComparisons(name).slice(0, 3)
  for (const story of searched) {
    pushStory(trail, story, name)
    if (trail.filter((t) => t.kind === 'story').length >= 3) break
  }

  // Prefer diversity of media types when possible
  const typesSeen = new Set(trail.map((t) => {
    const s = getComparisonsByType('all').find((c) => c.id === t.storyId)
    return s?.type
  }).filter(Boolean) as MediaType[])
  for (const type of ['book', 'movie', 'tv'] as MediaType[]) {
    if (typesSeen.has(type)) continue
    const match = getComparisonsByType(type).find((s) =>
      s.parallels.some((p) => p.theme.toLowerCase().includes(key.split(' ')[0] ?? '')),
    )
    if (match) {
      pushStory(trail, match, name)
      typesSeen.add(type)
    }
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
    (s) =>
      s.theme?.toLowerCase() === key ||
      s.theme?.toLowerCase().includes(key.split(' ')[0] ?? ''),
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
      .filter((s) => s.parallels.some((p) => p.theme.toLowerCase().includes(key)))
      .slice(0, 3 - trail.length)
    for (const story of fallbackStories) {
      pushStory(trail, story, name)
    }
  }

  return trail.slice(0, 6)
}

export function getStoryById(id: string): MediaComparison | undefined {
  return getComparisonsByType('all').find((s) => s.id === id)
}
