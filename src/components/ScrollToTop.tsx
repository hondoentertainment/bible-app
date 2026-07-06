interface ScrollToTopProps {
  visible: boolean
  onClick: () => void
}

export function ScrollToTop({ visible, onClick }: ScrollToTopProps) {
  if (!visible) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className="scroll-to-top fixed right-4 bottom-24 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-parchment-dark bg-white text-navy shadow-lg transition-all duration-300 hover:border-gold hover:text-gold hover:shadow-xl active:scale-95 safe-bottom touch-manipulation sm:right-6 md:bottom-6"
      aria-label="Scroll to top"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  )
}
