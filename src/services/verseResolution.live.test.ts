import { describe, expect, it } from 'vitest'
import { NIV_BIBLE_ID, TOPICS } from '../data/topics'
import { normalizePassageId } from './bibleApi'

declare const process: { env: Record<string, string | undefined> }

/**
 * Opt-in live check that every topic verse id actually resolves against the
 * real API.Bible service. This is intentionally skipped in normal/CI runs
 * because it hits the network and needs a key.
 *
 * Run it explicitly (PowerShell):
 *   $env:RUN_LIVE_API="1"; $env:BIBLE_API_KEY="<key>"; npm run test:verses
 *
 * Or (bash):
 *   RUN_LIVE_API=1 BIBLE_API_KEY=<key> npm run test:verses
 */

const API_KEY = process.env.BIBLE_API_KEY
const ENABLED = process.env.RUN_LIVE_API === '1' && Boolean(API_KEY)
const CONCURRENCY = 5

interface CheckResult {
  passageId: string
  status: number
  ok: boolean
}

async function checkPassage(passageId: string): Promise<CheckResult> {
  const url =
    `https://api.scripture.api.bible/v1/bibles/${NIV_BIBLE_ID}/passages/` +
    `${encodeURIComponent(passageId)}?content-type=text&include-notes=false`

  try {
    const res = await fetch(url, {
      headers: { 'api-key': API_KEY as string, Accept: 'application/json' },
    })
    return { passageId, status: res.status, ok: res.ok }
  } catch {
    return { passageId, status: 0, ok: false }
  }
}

async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = []
  let index = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index++
      results[current] = await fn(items[current])
    }
  })
  await Promise.all(workers)
  return results
}

describe.skipIf(!ENABLED)('live verse resolution', () => {
  const uniqueIds = [
    ...new Set(TOPICS.flatMap((t) => t.verseIds).map((id) => normalizePassageId(id))),
  ]

  it(
    'resolves every topic verse id against API.Bible',
    async () => {
      const results = await runWithConcurrency(uniqueIds, CONCURRENCY, checkPassage)
      const failures = results.filter((r) => !r.ok)
      const report = failures.map((f) => `${f.passageId} → HTTP ${f.status}`).join('\n')
      expect(failures, `Unresolved passages:\n${report}`).toEqual([])
    },
    120_000,
  )
})

describe.skipIf(ENABLED)('live verse resolution (disabled)', () => {
  it('is skipped unless RUN_LIVE_API=1 and BIBLE_API_KEY are set', () => {
    expect(true).toBe(true)
  })
})
