export function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

export function scorePartialMatch(text: string, query: string): number {
  const t = normalizeSearchText(text)
  const q = normalizeSearchText(query)
  if (!q) return 0
  if (t === q) return 100
  if (t.startsWith(q)) return 90
  if (t.includes(q)) return 75

  const qWords = q.split(' ').filter((w) => w.length >= 2)
  if (qWords.length === 0) return 0

  let wordScore = 0
  for (const word of qWords) {
    if (t.includes(word)) wordScore += 20
    else if (t.split(' ').some((part) => part.startsWith(word))) wordScore += 15
  }

  return qWords.every((w) => t.includes(w) || t.split(' ').some((p) => p.startsWith(w)))
    ? wordScore
    : 0
}
