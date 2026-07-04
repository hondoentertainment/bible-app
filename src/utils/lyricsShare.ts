import type { LyricsComparisonResult } from '../types/lyrics'

export function formatComparisonText(result: LyricsComparisonResult): string {
  const { track, parallels } = result
  const lines = [
    `${track.name} — ${track.artist}`,
    'Lyrics & Scripture comparison (NIV)',
    '',
  ]

  for (const [i, parallel] of parallels.entries()) {
    lines.push(`Parallel ${i + 1}: ${parallel.theme}`)
    lines.push(`Lyric: "${parallel.lyricLine}"`)
    lines.push(parallel.connection)
    for (const verse of parallel.verses) {
      lines.push(`  ${verse.reference}: ${verse.text}`)
    }
    if (parallel.verses.length === 0 && parallel.verseIds.length > 0) {
      lines.push(`  References: ${parallel.verseIds.join(', ')}`)
    }
    lines.push('')
  }

  return lines.join('\n').trim()
}

export async function copyComparison(result: LyricsComparisonResult): Promise<void> {
  await navigator.clipboard.writeText(formatComparisonText(result))
}

export async function shareComparison(
  result: LyricsComparisonResult,
): Promise<'shared' | 'copied'> {
  const text = formatComparisonText(result)
  const title = `${result.track.name} — Lyrics & Scripture`

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err
    }
  }

  await copyComparison(result)
  return 'copied'
}
