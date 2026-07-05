import { getPersonalRecommendations, type Recommendation } from '../utils/recommendations'

interface RecommendationsPanelProps {
  onExploreSubject: (topicName: string) => void
  onOpenStory: (storyId: string) => void
  onOpenSong: (artist: string, track: string) => void
}

export function RecommendationsPanel({
  onExploreSubject,
  onOpenStory,
  onOpenSong,
}: RecommendationsPanelProps) {
  const recs = getPersonalRecommendations(6)
  if (recs.length === 0) return null

  return (
    <section className="mb-10 w-full" aria-label="Recommended for you">
      <h2 className="mb-1 font-display text-xl font-semibold text-navy">Because you explored…</h2>
      <p className="mb-4 text-sm text-ink-muted">Picks from your recent searches and favorites</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {recs.map((rec) => (
          <li key={`${rec.kind}-${rec.label}`}>
            <RecButton rec={rec} onExploreSubject={onExploreSubject} onOpenStory={onOpenStory} onOpenSong={onOpenSong} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function RecButton({
  rec,
  onExploreSubject,
  onOpenStory,
  onOpenSong,
}: {
  rec: Recommendation
  onExploreSubject: (n: string) => void
  onOpenStory: (id: string) => void
  onOpenSong: (artist: string, track: string) => void
}) {
  function handleClick() {
    if (rec.kind === 'subject' && rec.topicName) onExploreSubject(rec.topicName)
    if (rec.kind === 'story' && rec.storyId) onOpenStory(rec.storyId)
    if (rec.kind === 'song' && rec.artist && rec.track) onOpenSong(rec.artist, rec.track)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-full w-full flex-col rounded-xl border border-parchment-dark bg-white p-4 text-left transition hover:border-gold hover:shadow-sm active:scale-[0.99]"
    >
      <span className="text-xs font-semibold uppercase text-gold">{rec.kind}</span>
      <span className="mt-1 font-semibold text-navy">{rec.label}</span>
      <span className="mt-1 line-clamp-2 text-sm text-ink-muted">{rec.detail}</span>
    </button>
  )
}
