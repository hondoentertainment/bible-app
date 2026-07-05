import { getTopicById } from '../data/topics'

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

export const READING_PLANS: ReadingPlan[] = [
  buildPlan('anxiety', '7 Days of Peace', 'Cast anxiety on God — one verse each day.'),
  buildPlan('forgiveness', '7 Days of Forgiveness', 'Receive and extend mercy through Scripture.'),
  buildPlan('hope', '7 Days of Hope', 'Confident expectation in God\'s promises.'),
  buildPlan('love', '7 Days of Love', 'God\'s love and loving others.'),
  buildPlan('strength', '7 Days of Strength', 'Drawing power from God in weakness.'),
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
