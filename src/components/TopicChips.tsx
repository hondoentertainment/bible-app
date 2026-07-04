import { FEATURED_TOPICS } from '../data/topics'

interface TopicChipsProps {
  onSelect: (topicName: string) => void
  activeQuery?: string
}

export function TopicChips({ onSelect, activeQuery }: TopicChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {FEATURED_TOPICS.map((topic) => {
        const isActive = activeQuery?.toLowerCase() === topic.name.toLowerCase()

        return (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelect(topic.name)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'border-gold bg-gold text-white shadow-sm'
                : 'border-parchment-dark bg-white text-ink-muted hover:border-gold hover:text-ink'
            }`}
          >
            {topic.name}
          </button>
        )
      })}
    </div>
  )
}
