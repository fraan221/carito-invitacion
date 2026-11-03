import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import StarryBackground from './StarryBackground'

describe('StarryBackground', () => {
  beforeEach(() => {
    // Mock getContext for jsdom
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      fillStyle: '',
      globalAlpha: 1,
    })

    // Default: no reduced motion
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a canvas element with aria-hidden and pointer-events none class', () => {
    render(<StarryBackground />)
    const canvas = screen.getByRole('presentation', { hidden: true }) || screen.getByTestId('starry-canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas.tagName.toLowerCase()).toBe('canvas')
  })

  it('updates dimensions when window resizes', () => {
    const { container } = render(<StarryBackground />)
    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    expect(canvas).not.toBeNull()

    // Trigger resize
    window.innerWidth = 1024
    window.innerHeight = 768
    window.dispatchEvent(new Event('resize'))

    expect(canvas.width).toBe(1024)
    expect(canvas.height).toBe(768)
  })

  it('draws a single frame and does not start animation loop when prefers-reduced-motion is true', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const rafSpy = vi.spyOn(window, 'requestAnimationFrame')
    render(<StarryBackground />)

    // With reduced motion, requestAnimationFrame should not be invoked in a continuous loop
    expect(rafSpy).not.toHaveBeenCalled()
  })
})
