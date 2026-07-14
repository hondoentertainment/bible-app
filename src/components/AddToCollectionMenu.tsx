import { useEffect, useRef, useState } from 'react'
import type { Verse } from '../types'
import {
  COLLECTIONS_EVENT,
  createCollection,
  getCollections,
  getCollectionsForVerse,
  toggleVerseInCollection,
  type Collection,
} from '../hooks/useCollections'
import { hapticLight } from '../utils/haptics'
import { useToast } from '../hooks/useToast'

interface AddToCollectionMenuProps {
  verse: Verse
  compact?: boolean
}

export function AddToCollectionMenu({ verse, compact = false }: AddToCollectionMenuProps) {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [newName, setNewName] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const inCount = memberIds.length

  useEffect(() => {
    const sync = () => {
      setCollections(getCollections())
      setMemberIds(getCollectionsForVerse(verse.id))
    }
    sync()
    window.addEventListener(COLLECTIONS_EVENT, sync)
    return () => window.removeEventListener(COLLECTIONS_EVENT, sync)
  }, [verse.id])

  useEffect(() => {
    if (!open) return
    function onPointer(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function handleToggle(collection: Collection) {
    const { inCollection } = toggleVerseInCollection(collection.id, verse)
    hapticLight()
    showToast(
      inCollection
        ? `Added to “${collection.name}”`
        : `Removed from “${collection.name}”`,
    )
  }

  function handleCreate() {
    const created = createCollection(newName)
    if (!created) return
    toggleVerseInCollection(created.id, verse)
    hapticLight()
    showToast(`Added to “${created.name}”`)
    setNewName('')
  }

  const btnClass = compact
    ? 'touch-manipulation flex min-h-[36px] items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition-all duration-200 active:scale-95'
    : 'touch-manipulation flex min-h-[44px] items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-200 active:scale-95'

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Add ${verse.reference} to a collection`}
        className={`${btnClass} ${
          inCount > 0
            ? 'border-gold/50 bg-gold/10 text-gold'
            : 'border-parchment-dark text-ink-muted hover:border-gold hover:text-gold'
        }`}
      >
        <BookmarkIcon filled={inCount > 0} />
        {compact ? null : inCount > 0 ? `In ${inCount}` : 'Collect'}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-parchment-dark bg-white p-2 text-left shadow-lg"
        >
          <p className="px-2 py-1 text-xs font-semibold tracking-wide text-ink-muted uppercase">
            Add to collection
          </p>

          {collections.length > 0 ? (
            <ul className="max-h-56 overflow-y-auto">
              {collections.map((collection) => {
                const active = memberIds.includes(collection.id)
                return (
                  <li key={collection.id}>
                    <button
                      type="button"
                      role="menuitemcheckbox"
                      aria-checked={active}
                      onClick={() => handleToggle(collection)}
                      className="flex min-h-[40px] w-full items-center gap-2 rounded-lg px-2 text-left text-sm text-navy transition hover:bg-parchment"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          active ? 'border-gold bg-gold text-white' : 'border-parchment-dark'
                        }`}
                        aria-hidden
                      >
                        {active && (
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{collection.name}</span>
                      <span className="shrink-0 text-xs text-ink-muted">{collection.verses.length}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="px-2 py-1 text-xs text-ink-muted">No collections yet — create one below.</p>
          )}

          <form
            className="mt-2 flex items-center gap-1 border-t border-parchment-dark pt-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleCreate()
            }}
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New collection…"
              maxLength={60}
              className="min-w-0 flex-1 rounded-lg border border-parchment-dark bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="shrink-0 rounded-lg bg-navy px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-light disabled:opacity-50"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  )
}
