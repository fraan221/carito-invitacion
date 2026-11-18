import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import StarryBackground from './StarryBackground'

describe('StarryBackground', () => {
  beforeEach(() => {
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

  it('renders a canvas element with aria-hidden in a fixed background wrapper', () => {
    const { container } = render(<StarryBackground />)
    const canvas = screen.getByTestId('starry-canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas.tagName.toLowerCase()).toBe('canvas')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass(/wrapper/)
  })

  it('renders Galaxy container with full width and height', () => {
    const { container } = render(<StarryBackground />)
    const galaxyContainer = container.querySelector('.galaxy-container')
    expect(galaxyContainer).toBeInTheDocument()
  })

  it('handles prefers-reduced-motion gracefully', () => {
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

    render(<StarryBackground />)
    expect(screen.getByTestId('starry-canvas')).toBeInTheDocument()
  })
})
