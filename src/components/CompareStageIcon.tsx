interface CompareStageIconProps {
  status: 'done' | 'active' | 'pending'
  accentClass?: string
}

export function CompareStageIcon({ status, accentClass = 'text-gold' }: CompareStageIconProps) {
  if (status === 'done') {
    return (
      <svg
        className={`h-4 w-4 shrink-0 ${accentClass}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )
  }

  if (status === 'active') {
    return (
      <span
        className={`spinner shrink-0 ${accentClass}`}
        style={{ width: '1rem', height: '1rem' }}
        aria-hidden
      />
    )
  }

  return (
    <span className="h-4 w-4 shrink-0 rounded-full border border-parchment-dark" aria-hidden />
  )
}
