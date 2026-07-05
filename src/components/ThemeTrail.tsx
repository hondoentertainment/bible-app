import { getThemeTrail, type ThemeTrailItem } from '../utils/themeTrails'

interface ThemeTrailProps {
  theme: string
  onExploreSubject: (topicName: string) => void
  onOpenStory: (storyId: string) => void
  onOpenSong: (artist: string, track: string) => void
}

export function ThemeTrail({ theme, onExploreSubject, onOpenStory, onOpenSong }: ThemeTrailProps) {
  const items = getThemeTrail(theme)
  if (items.length === 0) return null

  return (
    <section className="mt-8 rounded-2xl border border-gold/30 bg-gold/[0.05] p-5" aria-label="Continue exploring">
      <h3 className="font-display text-xl font-semibold text-navy">Continue exploring &ldquo;{theme}&rdquo;</h3>
      <p className="mt-1 text-sm text-ink-muted">Stories, subjects, and songs on this theme</p>
      <ul className="mt-4 flex flex-col gap-2">
        {items.map((item) => (
          <li key={`${item.kind}-${item.label}`}>
            <TrailButton
              item={item}
              onExploreSubject={onExploreSubject}
              onOpenStory={onOpenStory}
              onOpenSong={onOpenSong}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

function TrailButton({
  item,
  onExploreSubject,
  onOpenStory,
  onOpenSong,
}: {
  item: ThemeTrailItem
  onExploreSubject: (n: string) => void
  onOpenStory: (id: string) => void
  onOpenSong: (artist: string, track: string) => void
}) {
  function handleClick() {
    if (item.kind === 'subject' && item.topicName) onExploreSubject(item.topicName)
    if (item.kind === 'story' && item.storyId) onOpenStory(item.storyId)
    if (item.kind === 'song' && item.artist && item.track) onOpenSong(item.artist, item.track)
  }

  const badge = item.kind === 'story' ? 'Story' : item.kind === 'song' ? 'Song' : 'Subject'

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-start gap-3 rounded-xl border border-parchment-dark bg-white px-4 py-3 text-left transition hover:border-gold active:scale-[0.99]"
    >
      <span className="mt-0.5 shrink-0 rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-white uppercase">
        {badge}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-navy">{item.label}</span>
        <span className="block text-sm text-ink-muted">{item.detail}</span>
      </span>
    </button>
  )
}
