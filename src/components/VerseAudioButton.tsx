interface VerseAudioButtonProps {
  text: string
  reference: string
  compact?: boolean
}

export function VerseAudioButton({ text, reference, compact = false }: VerseAudioButtonProps) {
  function handleSpeak() {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(`${reference}. ${text}`)
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  if (!('speechSynthesis' in window)) return null

  const cls = compact
    ? 'touch-manipulation rounded-md border border-parchment-dark px-2 py-1 text-[11px] font-semibold text-ink-muted hover:border-gold hover:text-gold'
    : 'touch-manipulation rounded-lg border border-parchment-dark px-3 py-2 text-xs font-semibold text-ink-muted hover:border-gold hover:text-gold'

  return (
    <button type="button" onClick={handleSpeak} className={cls} aria-label={`Listen to ${reference}`}>
      {compact ? '▶' : 'Listen'}
    </button>
  )
}
