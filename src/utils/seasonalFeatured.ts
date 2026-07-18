import { getTopicsByCategory, TOPICS, type Topic } from '../data/topics'

function prefer(ids: string[]): Topic[] {
  return ids.map((id) => TOPICS.find((t) => t.id === id)).filter((t): t is Topic => t !== undefined)
}

/** Seasonal subject highlights for the Subjects home browse. */
export function getSeasonalTopics(date: Date = new Date()): Topic[] {
  const month = date.getMonth()

  // Advent / Christmas
  if (month === 11 || month === 0) {
    return prefer(['hope', 'peace', 'joy', 'love', 'jesus'])
  }
  // Lent / Easter window
  if (month >= 1 && month <= 3) {
    return prefer(['forgiveness', 'repentance', 'redemption', 'resurrection', 'grace'])
  }
  // November gratitude
  if (month === 10) {
    return prefer(['thanksgiving', 'community', 'faith', 'hope', 'blessing'])
  }

  const foundations = getTopicsByCategory('foundations')
  if (foundations.length >= 5) return foundations.slice(0, 5)
  return TOPICS.slice(0, 5)
}

export function getSeasonalLabel(date: Date = new Date()): string {
  const month = date.getMonth()
  if (month === 11 || month === 0) return 'Seasonal picks · Advent & Christmas'
  if (month >= 1 && month <= 3) return 'Seasonal picks · Lent & Easter'
  if (month === 10) return 'Seasonal picks · Thanksgiving'
  return 'Featured subjects to start with'
}
