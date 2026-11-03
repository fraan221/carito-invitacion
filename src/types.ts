export interface GroupValidation {
  valid: boolean
  maxPersonas: number
  error?: string
}

export interface RSVPData {
  grupo_code: string
  nombre: string
  asiste: boolean
  cantidad: number
  acompanantes: string
}
