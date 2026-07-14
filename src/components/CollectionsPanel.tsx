import { useEffect, useState } from 'react'
import type { Verse } from '../types'
import {
  COLLECTIONS_EVENT,
  deleteCollection,
  getCollections,
  removeVerseFromCollection,
  renameCollection,
  type Collection,
} from '../hooks/useCollections'
import { VerseCard } from './VerseCard'

export function CollectionsPanel() {
  const [open, setOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')

  useEffect(() => {
    const sync = () => setCollections(getCollections())
    sync()
    window.addEventListener(COLLECTIONS_EVENT, sync)
    return () => window.removeEventListener(COLLECTIONS_EVENT, sync)
  }, [])

  if (collections.length === 0) return null

  const totalVerses = collections.reduce((sum, c) => sum + c.verses.length, 0)

  function startRename(collection: Collection) {
    setEditingId(collection.id)
    setDraftName(collection.name)
  }

  function commitRename(id: string) {
    renameCollection(id, draftName)
    setEditingId(null)
    setDraftName('')
  }

  function handleDelete(collection: Collection) {
    if (window.confirm(`Delete the collection “${collection.name}”? This can't be undone.`)) {
      deleteCollection(collection.id)
      if (expandedId === collection.id) setExpandedId(null)
    }
  }

  return (
    <section className="mb-10 w-full" aria-label="Collections">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-xl border border-parchment-dark bg-white px-4 py-3 text-left transition hover:border-gold/50"
      >
        <span className="font-display text-lg font-semibold text-navy">
          Collections
          <span className="ml-2 text-sm font-normal text-ink-muted">
            ({collections.length} · {totalVerses} verse{totalVerses === 1 ? '' : 's'})
          </span>
        </span>
        <span className="text-gold" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-3 rounded-xl border border-parchment-dark bg-white/80 p-4">
          {collections.map((collection) => {
            const isExpanded = expandedId === collection.id
            return (
              <div key={collection.id} className="rounded-xl border border-parchment-dark bg-white">
                <div className="flex items-center gap-2 px-3 py-2.5">
                  {editingId === collection.id ? (
                    <form
                      className="flex min-w-0 flex-1 items-center gap-1"
                      onSubmit={(e) => {
                        e.preventDefault()
                        commitRename(collection.id)
                      }}
                    >
                      <input
                        type="text"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        maxLength={60}
                        autoFocus
                        className="min-w-0 flex-1 rounded-lg border border-parchment-dark bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus:border-gold"
                      />
                      <button type="submit" className="shrink-0 rounded-lg bg-navy px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-navy-light">
                        Save
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : collection.id)}
                      aria-expanded={isExpanded}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block truncate font-semibold text-navy">{collection.name}</span>
                      <span className="text-xs text-ink-muted">
                        {collection.verses.length} verse{collection.verses.length === 1 ? '' : 's'}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => startRename(collection)}
                    className="shrink-0 rounded-lg border border-parchment-dark px-2 py-1.5 text-xs text-ink-muted transition hover:border-gold hover:text-gold"
                    aria-label={`Rename ${collection.name}`}
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(collection)}
                    className="shrink-0 rounded-lg border border-parchment-dark px-2 py-1.5 text-xs text-ink-muted transition hover:border-red-400 hover:text-red-600"
                    aria-label={`Delete ${collection.name}`}
                  >
                    Delete
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-parchment-dark/60 p-3">
                    {collection.verses.length === 0 ? (
                      <p className="text-sm text-ink-muted">
                        No verses yet. Use “Collect” on any verse to add it here.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {collection.verses.map((verse) => (
                          <CollectionVerseRow
                            key={verse.id}
                            verse={verse}
                            onRemove={() => removeVerseFromCollection(collection.id, verse.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function CollectionVerseRow({
  verse,
  onRemove,
}: {
  verse: Verse
  onRemove: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  if (expanded) {
    return (
      <div>
        <button type="button" onClick={() => setExpanded(false)} className="back-link mb-2 text-sm">
          ← Collapse
        </button>
        <VerseCard verse={verse} />
        <button
          type="button"
          onClick={onRemove}
          className="mt-2 text-xs text-ink-muted underline hover:text-navy"
        >
          Remove from collection
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-parchment-dark bg-white px-3 py-2.5">
      <button type="button" onClick={() => setExpanded(true)} className="min-w-0 flex-1 text-left">
        <span className="block font-semibold text-navy">{verse.reference}</span>
        <span className="line-clamp-1 text-sm text-ink-muted">{verse.text}</span>
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 text-ink-muted hover:text-navy"
        aria-label={`Remove ${verse.reference} from collection`}
      >
        ×
      </button>
    </div>
  )
}
