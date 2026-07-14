import type { Verse } from '../types'
import { formatVerseText } from './verseShare'

const SIZE = 1080
const MARGIN = 120

/**
 * Greedy word-wrap. `measure` returns the rendered width of a string, letting
 * this stay pure and unit-testable without a real canvas context.
 */
export function wrapText(
  measure: (text: string) => number,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (measure(candidate) <= maxWidth || !current) {
      current = candidate
    } else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

/**
 * Picks the largest font size (from `sizes`, high→low) whose wrapped lines fit
 * within `maxHeight`. Returns the chosen size and its wrapped lines.
 */
export function fitVerseText(
  measureAt: (fontSize: number, text: string) => number,
  text: string,
  maxWidth: number,
  maxHeight: number,
  sizes: number[],
  lineHeightRatio = 1.35,
): { fontSize: number; lines: string[] } {
  let result = { fontSize: sizes[sizes.length - 1], lines: [] as string[] }
  for (const size of sizes) {
    const lines = wrapText((t) => measureAt(size, t), text, maxWidth)
    const height = lines.length * size * lineHeightRatio
    result = { fontSize: size, lines }
    if (height <= maxHeight) break
  }
  return result
}

async function ensureFonts(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) return
  try {
    await Promise.all([
      document.fonts.load('700 72px "Cormorant Garamond"'),
      document.fonts.load('600 30px "Source Sans 3"'),
    ])
    await document.fonts.ready
  } catch {
    // Fall back to system fonts if the web fonts fail to load.
  }
}

/** Renders a shareable, branded square image of a verse. */
export async function renderVerseImage(verse: Verse): Promise<Blob> {
  await ensureFonts()

  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  // Warm parchment background.
  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE)
  bg.addColorStop(0, '#fff9ee')
  bg.addColorStop(1, '#f2e9d6')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, SIZE, SIZE)

  // Gold hairline frame.
  ctx.strokeStyle = 'rgba(184, 134, 11, 0.55)'
  ctx.lineWidth = 4
  ctx.strokeRect(56, 56, SIZE - 112, SIZE - 112)

  // Top label.
  ctx.fillStyle = '#b8860b'
  ctx.textAlign = 'center'
  ctx.font = '600 26px "Source Sans 3", system-ui, sans-serif'
  ctx.fillText('HOLY SCRIPTURE', SIZE / 2, 150)

  const maxWidth = SIZE - MARGIN * 2

  // Verse body — fit within the middle band.
  const measureAt = (size: number, text: string) => {
    ctx.font = `600 ${size}px "Cormorant Garamond", Georgia, serif`
    return ctx.measureText(text).width
  }
  const { fontSize, lines } = fitVerseText(
    measureAt,
    `\u201C${verse.text}\u201D`,
    maxWidth,
    560,
    [76, 68, 60, 54, 48, 42, 38, 34],
  )

  const lineHeight = fontSize * 1.35
  const blockHeight = lines.length * lineHeight
  let y = SIZE / 2 - blockHeight / 2 + fontSize / 2

  ctx.fillStyle = '#1c2430'
  ctx.font = `600 ${fontSize}px "Cormorant Garamond", Georgia, serif`
  for (const line of lines) {
    ctx.fillText(line, SIZE / 2, y)
    y += lineHeight
  }

  // Reference.
  ctx.fillStyle = '#1a2744'
  ctx.font = '700 44px "Cormorant Garamond", Georgia, serif'
  ctx.fillText(verse.reference, SIZE / 2, Math.min(y + 60, SIZE - 180))

  // Footer.
  ctx.fillStyle = '#5c6570'
  ctx.font = '600 24px "Source Sans 3", system-ui, sans-serif'
  ctx.fillText('New International Version · Scripture Search', SIZE / 2, SIZE - 110)

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to render image'))
    }, 'image/png')
  })
}

function fileName(reference: string): string {
  return `${reference.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'verse'}.png`
}

/** Shares the rendered image via the Web Share API, or downloads it as a fallback. */
export async function shareOrDownloadVerseImage(verse: Verse): Promise<'shared' | 'downloaded'> {
  const blob = await renderVerseImage(verse)
  const file = new File([blob], fileName(verse.reference), { type: 'image/png' })

  const canShareFiles =
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    typeof navigator.share === 'function' &&
    navigator.canShare({ files: [file] })

  if (canShareFiles) {
    try {
      await navigator.share({ files: [file], title: verse.reference, text: formatVerseText(verse) })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err
      // Otherwise fall through to download.
    }
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  return 'downloaded'
}
