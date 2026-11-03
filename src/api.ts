import type { GroupValidation, RSVPData } from './types'

export const getApiUrl = (): string => {
  return import.meta.env.VITE_APPS_SCRIPT_URL || ''
}

export async function validateGroup(
  code: string,
  baseUrl: string = getApiUrl()
): Promise<GroupValidation> {
  const cleanCode = code ? code.trim() : ''
  if (!cleanCode) {
    return { valid: false, maxPersonas: 0 }
  }

  try {
    // shortcut: uses window.location.origin as fallback base when baseUrl is empty/relative, upgrade if SSR is used
    const url = new URL(baseUrl || window.location.origin)
    url.searchParams.set('g', cleanCode)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      return {
        valid: false,
        maxPersonas: 0,
        error: 'Error de conexión con el servidor',
      }
    }

    const data = await response.json()
    const max = Number(data.maxPersonas ?? data.max_personas ?? 0)

    return {
      valid: Boolean(data.valid),
      maxPersonas: isNaN(max) ? 0 : max,
      error: data.error,
    }
  } catch {
    return {
      valid: false,
      maxPersonas: 0,
      error: 'Error de red al validar la invitación',
    }
  }
}

export async function submitRSVP(
  data: RSVPData,
  baseUrl: string = getApiUrl()
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = baseUrl || window.location.origin
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      return {
        success: false,
        error: 'Error de respuesta del servidor',
      }
    }

    const json = await response.json()
    return {
      success: Boolean(json.success),
      error: json.error,
    }
  } catch {
    return {
      success: false,
      error: 'Error de conexión al enviar tu confirmación',
    }
  }
}
