import { describe, it, expect, beforeEach, vi } from 'vitest'

let mockGuestValues: any[][] = []
let mockResponsesAppended: any[][] = []
let mockGiftPreferencesAppended: any[][] = []

const mockGuestSheet = {
  getDataRange: () => ({
    getValues: () => mockGuestValues,
  }),
}

const mockResponsesSheet = {
  appendRow: (row: any[]) => {
    mockResponsesAppended.push(row)
  },
}

const mockGiftSheet = {
  appendRow: (row: any[]) => {
    mockGiftPreferencesAppended.push(row)
  },
}

const mockSpreadsheet = {
  getSheetByName: (name: string) => {
    if (name === 'Lista de invitados') return mockGuestSheet
    if (name === 'Respuestas') return mockResponsesSheet
    if (name === 'Preferencias Regalos') return mockGiftSheet
    return null
  },
}

;(globalThis as any).SpreadsheetApp = {
  getActiveSpreadsheet: () => mockSpreadsheet,
}

;(globalThis as any).ContentService = {
  MimeType: { JSON: 'application/json' },
  createTextOutput: (content: string) => ({
    setMimeType: () => ({
      getContent: () => content,
      getParsed: () => JSON.parse(content),
    }),
  }),
}

const waitLockMock = vi.fn()
const releaseLockMock = vi.fn()

;(globalThis as any).LockService = {
  getScriptLock: () => ({
    waitLock: waitLockMock,
    releaseLock: releaseLockMock,
  }),
}

// Import code under test
import * as gas from './Code.gs'

describe('Google Apps Script Backend (Code.gs)', () => {
  beforeEach(() => {
    mockGuestValues = [
      ['grupo_code', 'nombre_grupo', 'max_personas', 'estado', 'personas_confirmadas', 'ultima_actualizacion', 'link_invitacion'],
      ['casa', 'Casa', 4, '', '', '', ''],
      ['albia', 'Familia Albia', 2, '', '', '', ''],
      ['acuno-kler', 'Acuño / Kler', 5, '', '', '', ''],
    ]
    mockResponsesAppended = []
    mockGiftPreferencesAppended = []
    vi.clearAllMocks()
  })

  describe('doGet (Validación de código)', () => {
    it('retorna valid: true y maxPersonas para un código existente', () => {
      const res = gas.doGet({ parameter: { g: 'casa' } })
      const body = (res as any).getParsed()

      expect(body.valid).toBe(true)
      expect(body.maxPersonas).toBe(4)
      expect(body.max_personas).toBe(4)
    })

    it('es insensible a mayúsculas y espacios en el código', () => {
      const res = gas.doGet({ parameter: { g: '  AlBiA  ' } })
      const body = (res as any).getParsed()

      expect(body.valid).toBe(true)
      expect(body.maxPersonas).toBe(2)
    })

    it('retorna valid: false para un código inexistente', () => {
      const res = gas.doGet({ parameter: { g: 'codigo_inexistente' } })
      const body = (res as any).getParsed()

      expect(body.valid).toBe(false)
      expect(body.maxPersonas).toBe(0)
    })

    it('retorna valid: false si el parámetro g está vacío o ausente', () => {
      const res = gas.doGet({ parameter: {} })
      const body = (res as any).getParsed()

      expect(body.valid).toBe(false)
      expect(body.maxPersonas).toBe(0)
    })
  })

  describe('doPost (Registro de RSVP)', () => {
    it('registra confirmación válida dentro del cupo', () => {
      const payload = {
        grupo_code: 'casa',
        nombre: 'Carolina',
        asiste: true,
        cantidad: 3,
        acompanantes: 'Mamá, Papá',
      }

      const res = gas.doPost({ postData: { contents: JSON.stringify(payload) } })
      const body = (res as any).getParsed()

      expect(body.success).toBe(true)
      expect(mockResponsesAppended.length).toBe(1)
      const appended = mockResponsesAppended[0]
      expect(appended[1]).toBe('casa')
      expect(appended[2]).toBe('Carolina')
      expect(appended[3]).toBe('Sí')
      expect(appended[4]).toBe(3)
      expect(appended[5]).toBe('Mamá, Papá')
      expect(waitLockMock).toHaveBeenCalled()
      expect(releaseLockMock).toHaveBeenCalled()
    })

    it('rechaza si cantidad excede max_personas', () => {
      const payload = {
        grupo_code: 'casa', // max is 4
        nombre: 'Intento Exceso',
        asiste: true,
        cantidad: 5,
        acompanantes: 'Demasiada gente',
      }

      const res = gas.doPost({ postData: { contents: JSON.stringify(payload) } })
      const body = (res as any).getParsed()

      expect(body.success).toBe(false)
      expect(body.error).toContain('Excede capacidad autorizada')
      expect(mockResponsesAppended.length).toBe(0)
      expect(releaseLockMock).toHaveBeenCalled()
    })

    it('rechaza si el código de grupo no existe en la Lista maestra', () => {
      const payload = {
        grupo_code: 'falso_123',
        nombre: 'Desconocido',
        asiste: true,
        cantidad: 1,
        acompanantes: '',
      }

      const res = gas.doPost({ postData: { contents: JSON.stringify(payload) } })
      const body = (res as any).getParsed()

      expect(body.success).toBe(false)
      expect(body.error).toContain('Código de invitación no encontrado')
      expect(mockResponsesAppended.length).toBe(0)
    })

    it('permite registrar asiste: false con cantidad 0', () => {
      const payload = {
        grupo_code: 'albia',
        nombre: 'Tía Albia',
        asiste: false,
        cantidad: 2,
        acompanantes: '',
      }

      const res = gas.doPost({ postData: { contents: JSON.stringify(payload) } })
      const body = (res as any).getParsed()

      expect(body.success).toBe(true)
      expect(mockResponsesAppended.length).toBe(1)
      const appended = mockResponsesAppended[0]
      expect(appended[1]).toBe('albia')
      expect(appended[3]).toBe('No')
      expect(appended[4]).toBe(0)
    })

    it('maneja payload vacío devolviendo success: false', () => {
      const res = gas.doPost({ postData: { contents: '' } })
      const body = (res as any).getParsed()

      expect(body.success).toBe(false)
      expect(body.error).toBe('Payload vacío')
    })
  })

  describe('doPost (Preferencias de Regalos)', () => {
    it('handles gift_preference action by appending to Preferencias Regalos sheet', () => {
      const payload = {
        action: 'gift_preference',
        grupo_code: 'casa',
        tipo_regalo: 'transferencia',
      }

      const res = gas.doPost({ postData: { contents: JSON.stringify(payload) } })
      const body = (res as any).getParsed()

      expect(body.success).toBe(true)
      expect(mockGiftPreferencesAppended.length).toBe(1)
      const appended = mockGiftPreferencesAppended[0]
      expect(appended[0]).toBeInstanceOf(Date)
      expect(appended[1]).toBe('casa')
      expect(appended[2]).toBe('Casa')
      expect(appended[3]).toBe('transferencia')
      expect(waitLockMock).toHaveBeenCalled()
      expect(releaseLockMock).toHaveBeenCalled()
    })

    it('rejects gift_preference if group code is not found', () => {
      const payload = {
        action: 'gift_preference',
        grupo_code: 'inexistente',
        tipo_regalo: 'efectivo',
      }

      const res = gas.doPost({ postData: { contents: JSON.stringify(payload) } })
      const body = (res as any).getParsed()

      expect(body.success).toBe(false)
      expect(body.error).toContain('Código de invitación no encontrado')
      expect(mockGiftPreferencesAppended.length).toBe(0)
    })

    it('rejects gift_preference if tipo_regalo is invalid or empty', () => {
      const payload = {
        action: 'gift_preference',
        grupo_code: 'casa',
        tipo_regalo: 'oro_en_lingotes',
      }

      const res = gas.doPost({ postData: { contents: JSON.stringify(payload) } })
      const body = (res as any).getParsed()

      expect(body.success).toBe(false)
      expect(body.error).toContain('Tipo de regalo inválido')
      expect(mockGiftPreferencesAppended.length).toBe(0)
    })

    it('normalizes group code with trim and lowercase when appending to sheet', () => {
      // Set guest code with uppercase and untrimmed spaces
      mockGuestValues.push(['  FAMILIA-TEST  ', 'Familia Test', 2, '', '', '', ''])

      const payload = {
        action: 'gift_preference',
        grupo_code: 'familia-test',
        tipo_regalo: 'transferencia',
      }

      const res = gas.doPost({ postData: { contents: JSON.stringify(payload) } })
      const body = (res as any).getParsed()

      expect(body.success).toBe(true)
      expect(mockGiftPreferencesAppended.length).toBe(1)
      const appended = mockGiftPreferencesAppended[0]
      expect(appended[1]).toBe('familia-test')
    })
  })
})
