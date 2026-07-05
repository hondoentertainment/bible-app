import { shareComparisonImage } from '../utils/shareImage'
import { hapticLight } from '../utils/haptics'
import { useToast } from '../hooks/useToast'

interface ShareImageButtonProps {
  title: string
  quote: string
  theme: string
  verseReference: string
  verseText: string
  compact?: boolean
}

export function ShareImageButton({
  title,
  quote,
  theme,
  verseReference,
  verseText,
  compact = false,
}: ShareImageButtonProps) {
  const { showToast } = useToast()

  async function handleShare() {
    try {
      const result = await shareComparisonImage({ title, quote, theme, verseReference, verseText })
      hapticLight()
      showToast(result === 'shared' ? 'Image shared' : 'Image downloaded')
    } catch {
      showToast('Could not create image')
    }
  }

  const cls = compact
    ? 'touch-manipulation rounded-md border border-parchment-dark px-2 py-1 text-[11px] font-semibold text-ink-muted hover:border-gold hover:text-gold'
    : 'touch-manipulation rounded-lg border border-parchment-dark px-3 py-2 text-xs font-semibold text-ink-muted hover:border-gold hover:text-gold'

  return (
    <button type="button" onClick={handleShare} className={cls}>
      {compact ? 'Image' : 'Share image'}
    </button>
  )
}
