import { describe, expect, it } from 'vitest'
import { normalizePassageId } from './bibleApi'

describe('normalizePassageId', () => {
  it('leaves single verses unchanged', () => {
    expect(normalizePassageId('JHN.3.16')).toBe('JHN.3.16')
  })

  it('expands shorthand verse ranges to full ids', () => {
    expect(normalizePassageId('1CO.13.4-7')).toBe('1CO.13.4-1CO.13.7')
    expect(normalizePassageId('MAT.22.37-39')).toBe('MAT.22.37-MAT.22.39')
  })

  it('fixes non-standard book codes', () => {
    expect(normalizePassageId('PHI.4.6')).toBe('PHP.4.6')
    expect(normalizePassageId('MAR.11.22')).toBe('MRK.11.22')
    expect(normalizePassageId('NAH.1.7')).toBe('NAM.1.7')
  })

  it('fixes book code and expands range together', () => {
    expect(normalizePassageId('PHI.4.6-7')).toBe('PHP.4.6-PHP.4.7')
  })

  it('handles chapter-only ids', () => {
    expect(normalizePassageId('PHI.4')).toBe('PHP.4')
  })

  it('preserves already fully-qualified ranges', () => {
    expect(normalizePassageId('PHP.4.6-PHP.4.7')).toBe('PHP.4.6-PHP.4.7')
  })
})
