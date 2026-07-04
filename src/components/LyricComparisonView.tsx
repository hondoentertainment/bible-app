import type { LyricsComparisonResult } from '../types/lyrics'

interface LyricComparisonViewProps {
  result: LyricsComparisonResult
  onBack: () => void
}

export function LyricComparisonView({ result, onBack }: LyricComparisonViewProps) {
  const { track, parallels, matchedTopics, lyricsUnavailable, apiUnavailable } = result

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-gold"
      >
        <span aria-hidden>←</span> Search another song
      </button>

      <header className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        {track.albumArtUrl && (
          <img
            src={track.albumArtUrl}
            alt=""
            className="h-24 w-24 shrink-0 rounded-xl object-cover shadow-md"
          />
        )}
        <div>
          <span className="inline-block rounded-full border border-[#1DB954]/40 bg-[#1DB954]/10 px-3 py-1 text-xs font-semibold text-[#1DB954] uppercase">
            Spotify · Lyrics Analysis
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy">{track.name}</h2>
          <p className="text-ink-muted">{track.artist}</p>
          {track.spotifyUrl && (
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-[#1DB954] hover:underline"
            >
              Listen on Spotify →
            </a>
          )}
        </div>
      </header>

      {lyricsUnavailable && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <p className="font-semibold">Lyrics not found</p>
          <p className="mt-2 text-sm">
            We couldn&apos;t find lyrics for this track. Try a different spelling or use a well-known version of the song title.
          </p>
        </div>
      )}

      {apiUnavailable && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          NIV text could not be loaded — passage references are shown instead.
        </div>
      )}

      {matchedTopics.length > 0 && (
        <section className="mb-8" aria-label="Matched themes">
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-ink-muted uppercase">
            Themes in these lyrics
          </h3>
          <div className="flex flex-wrap gap-2">
            {matchedTopics.map((topic) => (
              <span
                key={topic.topicId}
                className="rounded-full bg-navy/5 px-3 py-1.5 text-sm text-navy"
                title={topic.description}
              >
                {topic.topicName}
              </span>
            ))}
          </div>
        </section>
      )}

      {parallels.length > 0 ? (
        <div className="flex flex-col gap-6">
          {parallels.map((parallel, i) => (
            <article
              key={parallel.id}
              className="overflow-hidden rounded-2xl border border-parchment-dark bg-white shadow-sm"
            >
              <div className="border-b border-parchment-dark bg-parchment/60 px-5 py-3">
                <span className="text-xs font-semibold tracking-[0.15em] text-gold uppercase">
                  Parallel {i + 1} · {parallel.theme}
                </span>
              </div>

              <div className="grid gap-0 lg:grid-cols-2">
                <div className="border-b border-parchment-dark p-6 lg:border-r lg:border-b-0">
                  <p className="mb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                    Lyric
                  </p>
                  <blockquote className="font-display text-xl leading-relaxed text-navy italic">
                    &ldquo;{parallel.lyricLine}&rdquo;
                  </blockquote>
                  <footer className="mt-3 text-sm text-ink-muted">— {track.name}</footer>
                </div>

                <div className="bg-gradient-to-br from-white to-parchment/30 p-6">
                  <p className="mb-3 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                    Scripture speaks
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-ink">{parallel.connection}</p>

                  {parallel.verses.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {parallel.verses.map((verse) => (
                        <div
                          key={verse.id}
                          className="rounded-xl border border-parchment-dark/80 bg-white p-4"
                        >
                          <p className="font-display text-sm font-semibold text-navy">
                            {verse.reference}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-ink">{verse.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-parchment-dark bg-white/50 p-4 text-sm text-ink-muted">
                      {parallel.verseIds.join(' · ')}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : !lyricsUnavailable ? (
        <p className="text-center text-ink-muted">No thematic parallels found in these lyrics.</p>
      ) : null}
    </div>
  )
}
