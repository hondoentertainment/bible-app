/** Render a shareable comparison card to PNG via canvas. */
export async function shareComparisonImage(options: {
  title: string
  quote: string
  theme: string
  verseReference: string
  verseText: string
  filename?: string
}): Promise<'shared' | 'downloaded'> {
  const canvas = document.createElement('canvas')
  const width = 1080
  const height = 1350
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  ctx.fillStyle = '#f7f2e8'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = '#1a2744'
  ctx.fillRect(0, 0, width, 8)

  ctx.fillStyle = '#b8860b'
  ctx.font = '600 28px Georgia, serif'
  ctx.fillText(options.theme.toUpperCase(), 64, 80)

  ctx.fillStyle = '#1a2744'
  ctx.font = '700 44px Georgia, serif'
  wrapText(ctx, options.title, 64, 140, width - 128, 52, 2)

  ctx.fillStyle = '#1c2430'
  ctx.font = 'italic 36px Georgia, serif'
  wrapText(ctx, `"${options.quote}"`, 64, 280, width - 128, 44, 6)

  ctx.strokeStyle = '#b8860b'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(64, 680)
  ctx.lineTo(width - 64, 680)
  ctx.stroke()

  ctx.fillStyle = '#b8860b'
  ctx.font = '600 24px system-ui, sans-serif'
  ctx.fillText('SCRIPTURE', 64, 730)

  ctx.fillStyle = '#1a2744'
  ctx.font = '700 32px Georgia, serif'
  ctx.fillText(options.verseReference, 64, 780)

  ctx.fillStyle = '#1c2430'
  ctx.font = '32px Georgia, serif'
  wrapText(ctx, options.verseText, 64, 830, width - 128, 40, 8)

  ctx.fillStyle = '#5c6570'
  ctx.font = '22px system-ui, sans-serif'
  ctx.fillText('NIV · Scripture Search App', 64, height - 64)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed'))), 'image/png')
  })

  const file = new File([blob], options.filename ?? 'scripture-comparison.png', { type: 'image/png' })

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title: options.title, files: [file] })
    return 'shared'
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = options.filename ?? 'scripture-comparison.png'
  a.click()
  URL.revokeObjectURL(url)
  return 'downloaded'
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
): void {
  const words = text.split(/\s+/)
  let line = ''
  let lineCount = 0
  let currentY = y

  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY)
      line = word
      currentY += lineHeight
      lineCount++
      if (lineCount >= maxLines) return
    } else {
      line = test
    }
  }
  if (line && lineCount < maxLines) ctx.fillText(line, x, currentY)
}
