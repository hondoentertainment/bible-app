import { getMediaComparison } from './media-comparisons'
import { getTopicById } from './topics'

export interface ReadingPlanDay {
  day: number
  verseId: string
  prompt: string
}

export interface ReadingPlan {
  id: string
  topicId: string
  title: string
  description: string
  days: ReadingPlanDay[]
  /** Optional curated story that inspired this plan */
  storyId?: string
}

const DEFAULT_PROMPTS = [
  'Read slowly. What word or phrase stands out?',
  'How does this passage speak to your life today?',
  'What does this reveal about God\'s character?',
  'Is there a promise or command to receive or obey?',
  'Who could you share this verse with today?',
  'Pray using your own words based on this passage.',
  'Review the week. Which day\'s verse stays with you most?',
]

function buildPlan(topicId: string, title: string, description: string): ReadingPlan | undefined {
  const topic = getTopicById(topicId)
  if (!topic) return undefined

  const verseIds = topic.verseIds.slice(0, 7)
  while (verseIds.length < 7) {
    verseIds.push(topic.verseIds[verseIds.length % topic.verseIds.length])
  }

  return {
    id: `7-day-${topicId}`,
    topicId,
    title,
    description,
    days: verseIds.map((verseId, i) => ({
      day: i + 1,
      verseId,
      prompt: i === 6
        ? DEFAULT_PROMPTS[6]
        : `${DEFAULT_PROMPTS[i]} Theme: ${topic.name}.`,
    })),
  }
}

function buildStoryPlan(
  storyId: string,
  title: string,
  description: string,
  fallbackTopicId: string,
): ReadingPlan | undefined {
  const story = getMediaComparison(storyId)
  if (!story) return buildPlan(fallbackTopicId, title, description)

  const verseIds = [...new Set(story.parallels.flatMap((p) => p.verseIds))].slice(0, 7)
  while (verseIds.length < 7) {
    const topic = getTopicById(fallbackTopicId)
    if (!topic?.verseIds.length) break
    verseIds.push(topic.verseIds[verseIds.length % topic.verseIds.length])
  }
  if (verseIds.length === 0) return buildPlan(fallbackTopicId, title, description)

  return {
    id: `7-day-story-${storyId}`,
    topicId: fallbackTopicId,
    storyId,
    title,
    description,
    days: verseIds.map((verseId, i) => ({
      day: i + 1,
      verseId,
      prompt:
        i === 6
          ? DEFAULT_PROMPTS[6]
          : `${DEFAULT_PROMPTS[i]} Reflect with themes from ${story.title}.`,
    })),
  }
}

export const READING_PLANS: ReadingPlan[] = [
  buildPlan('anxiety', '7 Days of Peace', 'Cast anxiety on God — one verse each day.'),
  buildPlan('forgiveness', '7 Days of Forgiveness', 'Receive and extend mercy through Scripture.'),
  buildPlan('hope', '7 Days of Hope', 'Confident expectation in God\'s promises.'),
  buildPlan('love', '7 Days of Love', 'God\'s love and loving others.'),
  buildPlan('strength', '7 Days of Strength', 'Drawing power from God in weakness.'),
  buildStoryPlan(
    'the-chosen',
    '7 Days with The Chosen',
    'Discipleship and mercy themes drawn from the series\' Scripture parallels.',
    'discipleship',
  ),
  buildStoryPlan(
    'les-miserables',
    '7 Days of Mercy',
    'Grace and redemption through Les Misérables and Scripture.',
    'mercy',
  ),
  buildStoryPlan(
    'shawshank',
    '7 Days of Hope in Hard Places',
    'Endurance and hope through The Shawshank Redemption.',
    'hope',
  ),
].filter((p): p is ReadingPlan => p !== undefined)

export function getReadingPlan(id: string): ReadingPlan | undefined {
  return READING_PLANS.find((p) => p.id === id)
}

export function getPlanProgress(planId: string): number {
  try {
    const raw = localStorage.getItem(`reading-plan-${planId}`)
    return raw ? Math.min(7, parseInt(raw, 10) || 0) : 0
  } catch {
    return 0
  }
}

export function setPlanProgress(planId: string, day: number): void {
  localStorage.setItem(`reading-plan-${planId}`, String(Math.min(7, Math.max(0, day))))
}
