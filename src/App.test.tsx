import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App'

describe('App Integration & Sections', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
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

  it('renders all 9 sections in continuous scroll order', () => {
    render(<App />)

    // 1. StarryBackground
    expect(screen.getByTestId('starry-canvas')).toBeInTheDocument()

    // 2. Hero
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /mis xv/i })).toBeInTheDocument()
    expect(screen.getByText(/milagros carolina herrera/i)).toBeInTheDocument()

    // 3. Message
    expect(screen.getByLabelText(/mensaje de bienvenida/i)).toBeInTheDocument()

    // 4. Countdown
    expect(screen.getByLabelText(/cuenta regresiva/i)).toBeInTheDocument()

    // 5. EventDetails
    expect(screen.getByLabelText(/detalles del evento y ubicación/i)).toBeInTheDocument()

    // 6. Gallery
    expect(screen.getByLabelText(/galería de fotos/i)).toBeInTheDocument()

    // 7. RSVP
    expect(screen.getByLabelText(/confirmación de asistencia/i)).toBeInTheDocument()

    // 8. Gifts
    expect(screen.getByLabelText(/regalos y transferencias/i)).toBeInTheDocument()

    // 9. Closing
    expect(screen.getByLabelText(/despedida y agradecimiento/i)).toBeInTheDocument()
  })

  it('registers ScrollTrigger and initializes GSAP animations under standard motion', () => {
    const registerSpy = vi.spyOn(gsap, 'registerPlugin')
    const contextSpy = vi.spyOn(gsap, 'context')

    render(<App />)

    expect(registerSpy).toHaveBeenCalledWith(ScrollTrigger)
    expect(contextSpy).toHaveBeenCalled()
  })

  it('skips GSAP ScrollTrigger registration when prefers-reduced-motion is true', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const registerSpy = vi.spyOn(gsap, 'registerPlugin')
    const contextSpy = vi.spyOn(gsap, 'context')

    render(<App />)

    expect(registerSpy).not.toHaveBeenCalled()
    expect(contextSpy).not.toHaveBeenCalled()
  })
})
