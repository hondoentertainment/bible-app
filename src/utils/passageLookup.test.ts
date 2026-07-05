import { describe, expect, it } from 'vitest'
import {
  isNewTestament,
  isOldTestament,
  looksLikePassageReference,
  parsePassageReference,
} from './passageLookup'

describe('parsePassageReference', () => {
  it('parses a simple full-name reference', () => {
    expect(parsePassageReference('John 3:16')).toBe('JHN.3.16')
  })

  it('parses an abbreviated reference', () => {
    expect(parsePassageReference('rom 8:28')).toBe('ROM.8.28')
  })

  it('parses a verse range', () => {
    expect(parsePassageReference('Romans 8:28-30')).toBe('ROM.8.28-30')
  })

  it('parses numbered books', () => {
    expect(parsePassageReference('1 Corinthians 13:4')).toBe('1CO.13.4')
  })

  it('is whitespace and case tolerant', () => {
    expect(parsePassageReference('  psalm   23 : 1 ')).toBe('PSA.23.1')
  })

  it('returns null for topical words', () => {
    expect(parsePassageReference('love')).toBeNull()
    expect(parsePassageReference('anxiety')).toBeNull()
  })

  it('returns null for unknown books', () => {
    expect(parsePassageReference('Hezekiah 2:2')).toBeNull()
  })

  it('returns null for blank input', () => {
    expect(parsePassageReference('')).toBeNull()
  })
})

describe('looksLikePassageReference', () => {
  it('is true for real references', () => {
    expect(looksLikePassageReference('John 3:16')).toBe(true)
  })

  it('is false for topics', () => {
    expect(looksLikePassageReference('forgiveness')).toBe(false)
  })
})

describe('testament helpers', () => {
  it('identifies Old Testament books', () => {
    expect(isOldTestament('PSA.23.1')).toBe(true)
    expect(isOldTestament('GEN.1.1')).toBe(true)
    expect(isNewTestament('PSA.23.1')).toBe(false)
  })

  it('identifies New Testament books', () => {
    expect(isNewTestament('JHN.3.16')).toBe(true)
    expect(isOldTestament('ROM.8.28')).toBe(false)
  })
})
