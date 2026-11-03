import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { validateGroup, submitRSVP } from './api'
import type { RSVPData } from './types'

describe('RSVP API Layer', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  describe('validateGroup', () => {
    it('returns invalid without fetching if code is empty or whitespace', async () => {
      const fetchMock = vi.fn()
      globalThis.fetch = fetchMock

      const res = await validateGroup('', 'https://script.google.com/macros/s/test/exec')
      expect(res).toEqual({ valid: false, maxPersonas: 0 })
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('returns valid and maxPersonas on successful validation', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ valid: true, maxPersonas: 4 }),
      } as Response)

      const res = await validateGroup('familia-perez', 'https://script.google.com/macros/s/test/exec')
      expect(res).toEqual({ valid: true, maxPersonas: 4 })
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://script.google.com/macros/s/test/exec?g=familia-perez',
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('handles alternative max_personas snake_case field', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ valid: true, max_personas: 3 }),
      } as Response)

      const res = await validateGroup('casa', 'https://script.google.com/macros/s/test/exec')
      expect(res).toEqual({ valid: true, maxPersonas: 3 })
    })

    it('returns invalid on negative response or non-existent group', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ valid: false, error: 'Código no encontrado' }),
      } as Response)

      const res = await validateGroup('inexistente', 'https://script.google.com/macros/s/test/exec')
      expect(res.valid).toBe(false)
      expect(res.maxPersonas).toBe(0)
    })

    it('handles network failure gracefully', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const res = await validateGroup('casa', 'https://script.google.com/macros/s/test/exec')
      expect(res.valid).toBe(false)
      expect(res.error).toMatch(/error de red/i)
    })
  })

  describe('submitRSVP', () => {
    const sampleRSVP: RSVPData = {
      grupo_code: 'familia-perez',
      nombre: 'Juan Pérez',
      asiste: true,
      cantidad: 3,
      acompanantes: 'María y Lucía',
    }

    it('submits RSVP data and returns success', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      } as Response)

      const res = await submitRSVP(sampleRSVP, 'https://script.google.com/macros/s/test/exec')
      expect(res).toEqual({ success: true })
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://script.google.com/macros/s/test/exec',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(sampleRSVP),
        })
      )
    })

    it('returns server error message when rejected', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: false, error: 'Excede capacidad autorizada' }),
      } as Response)

      const res = await submitRSVP(sampleRSVP, 'https://script.google.com/macros/s/test/exec')
      expect(res.success).toBe(false)
      expect(res.error).toBe('Excede capacidad autorizada')
    })

    it('handles fetch exception gracefully', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'))

      const res = await submitRSVP(sampleRSVP, 'https://script.google.com/macros/s/test/exec')
      expect(res.success).toBe(false)
      expect(res.error).toMatch(/error de conexión/i)
    })
  })
})
