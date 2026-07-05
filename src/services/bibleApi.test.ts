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

  it('fixes the book code on both ends of a fully-qualified range', () => {
    expect(normalizePassageId('MAR.11.22-MAR.11.24')).toBe('MRK.11.22-MRK.11.24')
  })

  it('trims surrounding whitespace', () => {
    expect(normalizePassageId('  JHN.3.16  ')).toBe('JHN.3.16')
  })

  it('leaves standard book codes untouched', () => {
    expect(normalizePassageId('PHP.4.13')).toBe('PHP.4.13')
    expect(normalizePassageId('MRK.1.1')).toBe('MRK.1.1')
    expect(normalizePassageId('PSA.119.105')).toBe('PSA.119.105')
  })

  it('handles all mapped book-code aliases', () => {
    expect(normalizePassageId('PHL.1.6')).toBe('PHP.1.6')
    expect(normalizePassageId('EZE.36.26')).toBe('EZK.36.26')
    expect(normalizePassageId('SON.2.1')).toBe('SNG.2.1')
    expect(normalizePassageId('SOL.2.1')).toBe('SNG.2.1')
    expect(normalizePassageId('JUDG.6.12')).toBe('JDG.6.12')
  })
})
