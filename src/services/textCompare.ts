/** Extract the best lines/sentences from source text for theme matching. */
export function extractCompareLines(
  text: string,
  kind: 'book' | 'movie' | 'song' | 'generic',
): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []

  if (kind === 'song') {
    return extractLyricLines(trimmed)
  }

  const sentences = splitSentences(trimmed)

  if (kind === 'movie') {
    const taglines = sentences.filter((s) => s.length >= 12 && s.length <= 120)
    const rest = sentences.filter((s) => s.length > 120)
    return [...taglines, ...rest]
  }

  if (kind === 'book') {
    const first = sentences[0]
    const rest = sentences.slice(1)
    return first ? [first, ...rest] : sentences
  }

  return sentences
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 12)
}

function extractLyricLines(text: string): string[] {
  const rawLines = text.split(/\n/).map((l) => l.trim()).filter(Boolean)
  if (rawLines.length === 0) return splitSentences(text)

  const counts = new Map<string, number>()
  for (const line of rawLines) {
    const key = line.toLowerCase()
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const chorus = rawLines.filter((line) => (counts.get(line.toLowerCase()) ?? 0) >= 2)
  const uniqueChorus = [...new Set(chorus.map((l) => l.toLowerCase()))].map(
    (key) => rawLines.find((l) => l.toLowerCase() === key)!,
  )
  const other = rawLines.filter((line) => (counts.get(line.toLowerCase()) ?? 0) < 2 && line.length >= 12)

  return [...uniqueChorus, ...other, ...splitSentences(text)]
}
