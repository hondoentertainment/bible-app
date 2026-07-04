import type { Verse } from '../types'

export function formatVerseText(verse: Verse): string {
  return `"${verse.text}" — ${verse.reference} (NIV)`
}

export async function copyVerseText(verse: Verse): Promise<void> {
  await navigator.clipboard.writeText(formatVerseText(verse))
}

export async function shareVerseText(verse: Verse): Promise<'shared' | 'copied'> {
  const text = formatVerseText(verse)

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: verse.reference, text })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw err
      }
    }
  }

  await copyVerseText(verse)
  return 'copied'
}

export function formatVersesResult(query: string, verses: Verse[]): string {
  const lines = [`NIV verses for "${query}":`, '']
  for (const verse of verses) {
    lines.push(formatVerseText(verse))
    lines.push('')
  }
  return lines.join('\n').trim()
}

export async function copyVersesResult(query: string, verses: Verse[]): Promise<void> {
  await navigator.clipboard.writeText(formatVersesResult(query, verses))
}

export async function shareVersesResult(
  query: string,
  verses: Verse[],
): Promise<'shared' | 'copied'> {
  const text = formatVersesResult(query, verses)
  const title = `Scripture: ${query}`

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err
    }
  }

  await copyVersesResult(query, verses)
  return 'copied'
}
