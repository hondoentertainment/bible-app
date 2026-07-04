import { describe, expect, it } from 'vitest'
import { scorePartialMatch } from './partialMatch'

describe('scorePartialMatch', () => {
  it('prefers exact and prefix matches', () => {
    expect(scorePartialMatch('The Shawshank Redemption', 'shawshank')).toBeGreaterThan(0)
    expect(scorePartialMatch('Hallelujah', 'hallel')).toBeGreaterThan(0)
    expect(scorePartialMatch('Les Misérables', 'les mis')).toBeGreaterThan(0)
  })

  it('returns zero for unrelated text', () => {
    expect(scorePartialMatch('Star Wars', 'shawshank')).toBe(0)
  })
})
