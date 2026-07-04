import type { ExternalMediaComparisonResult } from '../types/externalMedia'

export function formatExternalComparisonText(result: ExternalMediaComparisonResult): string {
  const lines = [
    `${result.title}${result.creator ? ` — ${result.creator}` : ''}`,
    `${result.externalLabel} & Scripture comparison (NIV)`,
    result.summary,
    '',
  ]

  for (const [i, parallel] of result.parallels.entries()) {
    lines.push(`Parallel ${i + 1}: ${parallel.theme}`)
    lines.push(`"${parallel.mediaLine.text}"`)
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

export async function copyExternalComparison(result: ExternalMediaComparisonResult): Promise<void> {
  await navigator.clipboard.writeText(formatExternalComparisonText(result))
}

export async function shareExternalComparison(
  result: ExternalMediaComparisonResult,
): Promise<'shared' | 'copied'> {
  const text = formatExternalComparisonText(result)
  const title = `${result.title} — ${result.externalLabel} & Scripture`

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err
    }
  }

  await copyExternalComparison(result)
  return 'copied'
}
