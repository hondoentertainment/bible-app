// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  computeElementScrollTop,
  prefersReducedMotion,
  resolveScrollBehavior,
  scrollToElementId,
  scrollToTop,
} from './scroll'

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('reduce') ? reduce : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
}

describe('resolveScrollBehavior', () => {
  it('is smooth only when smooth requested and motion allowed', () => {
    expect(resolveScrollBehavior(true, false)).toBe('smooth')
  })

  it('falls back to auto under reduced motion', () => {
    expect(resolveScrollBehavior(true, true)).toBe('auto')
  })

  it('is auto when smooth is not requested', () => {
    expect(resolveScrollBehavior(false, false)).toBe('auto')
    expect(resolveScrollBehavior(false, true)).toBe('auto')
  })
})

describe('computeElementScrollTop', () => {
  it('offsets the element position by the sticky header height', () => {
    expect(computeElementScrollTop(100, 50, 72)).toBe(78)
  })

  it('never returns a negative scroll position', () => {
    expect(computeElementScrollTop(10, 0, 72)).toBe(0)
    expect(computeElementScrollTop(-500, 0, 72)).toBe(0)
  })

  it('accounts for the current scroll offset', () => {
    expect(computeElementScrollTop(0, 500, 72)).toBe(428)
  })
})

describe('prefersReducedMotion', () => {
  const original = window.matchMedia

  afterEach(() => {
    window.matchMedia = original
  })

  it('returns false when matchMedia is unavailable', () => {
    window.matchMedia = undefined as unknown as typeof window.matchMedia
    expect(prefersReducedMotion()).toBe(false)
  })

  it('reflects the reduced-motion media query', () => {
    mockReducedMotion(true)
    expect(prefersReducedMotion()).toBe(true)
    mockReducedMotion(false)
    expect(prefersReducedMotion()).toBe(false)
  })
})

describe('scrollToTop', () => {
  let scrollSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    scrollSpy = vi.fn()
    window.scrollTo = scrollSpy as unknown as typeof window.scrollTo
    mockReducedMotion(false)
  })

  afterEach(() => vi.restoreAllMocks())

  it('scrolls to the top instantly by default', () => {
    scrollToTop()
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })

  it('scrolls smoothly when requested', () => {
    scrollToTop({ smooth: true })
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('forces instant scroll under reduced motion even when smooth requested', () => {
    mockReducedMotion(true)
    scrollToTop({ smooth: true })
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })
})

describe('scrollToElementId', () => {
  let scrollSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    scrollSpy = vi.fn()
    window.scrollTo = scrollSpy as unknown as typeof window.scrollTo
    mockReducedMotion(false)
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true })
    document.body.innerHTML = '<div id="target"></div>'
    const el = document.getElementById('target') as HTMLElement
    el.getBoundingClientRect = () =>
      ({ top: 300, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('scrolls to the element accounting for scroll offset and default header height', () => {
    scrollToElementId('target')
    // top(300) + scrollY(200) - defaultHeaderOffset(72) = 428
    expect(scrollSpy).toHaveBeenCalledWith({ top: 428, behavior: 'smooth' })
  })

  it('does nothing when the element does not exist', () => {
    scrollToElementId('missing')
    expect(scrollSpy).not.toHaveBeenCalled()
  })

  it('respects reduced motion', () => {
    mockReducedMotion(true)
    scrollToElementId('target')
    expect(scrollSpy).toHaveBeenCalledWith({ top: 428, behavior: 'auto' })
  })
})
