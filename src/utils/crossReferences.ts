import { TOPICS } from '../data/topics'

/** Find up to 3 related verse ids from topic mappings that share themes with this verse. */
export function getCrossReferences(verseId: string, limit = 3): string[] {
  const relatedTopics = TOPICS.filter((t) => t.verseIds.some((id) => id === verseId || id.startsWith(verseId.split('.').slice(0, 2).join('.'))))
  if (relatedTopics.length === 0) {
    relatedTopics.push(...TOPICS.filter((t) => t.verseIds.includes(verseId)))
  }

  const refs: string[] = []
  for (const topic of relatedTopics) {
    for (const id of topic.verseIds) {
      if (id !== verseId && !refs.includes(id)) {
        refs.push(id)
        if (refs.length >= limit) return refs
      }
    }
  }
  return refs
}
