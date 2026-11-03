import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RSVP from './RSVP'
import * as api from '../api'

vi.mock('../api')

describe('RSVP Component', () => {
  const originalLocation = window.location

  beforeEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        search: '',
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    })
  })

  it('renders polite fallback greeting without inputs when ?g= is missing', () => {
    window.location.search = ''

    render(<RSVP />)

    expect(screen.getByText(/no te encontramos en la lista de invitados/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/tu nombre/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /confirmar/i })).not.toBeInTheDocument()
    expect(api.validateGroup).not.toHaveBeenCalled()
  })

  it('renders polite fallback when code is invalid or not found', async () => {
    window.location.search = '?g=codigo-invalido'
    vi.mocked(api.validateGroup).mockResolvedValue({ valid: false, maxPersonas: 0 })

    render(<RSVP />)

    await waitFor(() => {
      expect(screen.getByText(/no te encontramos en la lista de invitados/i)).toBeInTheDocument()
    })
    expect(screen.queryByLabelText(/tu nombre/i)).not.toBeInTheDocument()
  })

  it('renders form with natural quantity selector up to maxPersonas (no bureaucratic quota messages)', async () => {
    window.location.search = '?g=familia-perez'
    vi.mocked(api.validateGroup).mockResolvedValue({ valid: true, maxPersonas: 4 })

    render(<RSVP />)

    await waitFor(() => {
      expect(screen.getByLabelText(/tu nombre y apellido/i)).toBeInTheDocument()
    })

    // Bureaucracy check: no "Tu cupo es 4" or similar
    expect(screen.queryByText(/tu cupo es/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/límite de personas/i)).not.toBeInTheDocument()

    // Natural quantity selector
    const quantitySelect = screen.getByLabelText(/¿cuántas personas asistirán/i) as HTMLSelectElement
    expect(quantitySelect).toBeInTheDocument()

    const options = Array.from(quantitySelect.querySelectorAll('option')).map((o) => o.value)
    expect(options).toEqual(['1', '2', '3', '4'])
  })

  it('hides companions field when cantidad = 1, shows it when cantidad > 1', async () => {
    window.location.search = '?g=familia-perez'
    vi.mocked(api.validateGroup).mockResolvedValue({ valid: true, maxPersonas: 3 })

    render(<RSVP />)

    await waitFor(() => {
      expect(screen.getByLabelText(/tu nombre y apellido/i)).toBeInTheDocument()
    })

    const quantitySelect = screen.getByLabelText(/¿cuántas personas asistirán/i)

    // Initial state: cantidad = 1 -> no companions
    expect(screen.queryByLabelText(/nombres de tus acompañantes/i)).not.toBeInTheDocument()

    // Change cantidad to 2 -> companions field appears
    fireEvent.change(quantitySelect, { target: { value: '2' } })
    expect(screen.getByLabelText(/nombres de tus acompañantes/i)).toBeInTheDocument()

    // Change cantidad back to 1 -> companions field disappears
    fireEvent.change(quantitySelect, { target: { value: '1' } })
    expect(screen.queryByLabelText(/nombres de tus acompañantes/i)).not.toBeInTheDocument()
  })

  it('hides quantity and companions fields when asiste is No', async () => {
    window.location.search = '?g=familia-perez'
    vi.mocked(api.validateGroup).mockResolvedValue({ valid: true, maxPersonas: 3 })

    render(<RSVP />)

    await waitFor(() => {
      expect(screen.getByLabelText(/tu nombre y apellido/i)).toBeInTheDocument()
    })

    const noButton = screen.getByRole('radio', { name: /no podré asistir/i })
    fireEvent.click(noButton)

    expect(screen.queryByLabelText(/¿cuántas personas asistirán/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/nombres de tus acompañantes/i)).not.toBeInTheDocument()
  })

  it('submits RSVP data and shows success confirmation with option to update', async () => {
    window.location.search = '?g=familia-perez'
    vi.mocked(api.validateGroup).mockResolvedValue({ valid: true, maxPersonas: 3 })
    vi.mocked(api.submitRSVP).mockResolvedValue({ success: true })

    render(<RSVP />)

    await waitFor(() => {
      expect(screen.getByLabelText(/tu nombre y apellido/i)).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/tu nombre y apellido/i), {
      target: { value: 'Juan Pérez' },
    })

    const quantitySelect = screen.getByLabelText(/¿cuántas personas asistirán/i)
    fireEvent.change(quantitySelect, { target: { value: '2' } })

    const companionsInput = screen.getByLabelText(/nombres de tus acompañantes/i)
    fireEvent.change(companionsInput, { target: { value: 'María Pérez' } })

    const submitBtn = screen.getByRole('button', { name: /confirmar asistencia/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(api.submitRSVP).toHaveBeenCalledWith({
        grupo_code: 'familia-perez',
        nombre: 'Juan Pérez',
        asiste: true,
        cantidad: 2,
        acompanantes: 'María Pérez',
      })
    })

    expect(screen.getByText(/¡muchas gracias por confirmar!/i)).toBeInTheDocument()

    // Option to update response
    const editBtn = screen.getByRole('button', { name: /modificar respuesta/i })
    expect(editBtn).toBeInTheDocument()
    fireEvent.click(editBtn)

    // Form reappears
    expect(screen.getByLabelText(/tu nombre y apellido/i)).toBeInTheDocument()
  })

  it('displays error message if submission fails', async () => {
    window.location.search = '?g=familia-perez'
    vi.mocked(api.validateGroup).mockResolvedValue({ valid: true, maxPersonas: 2 })
    vi.mocked(api.submitRSVP).mockResolvedValue({ success: false, error: 'Excede capacidad autorizada' })

    render(<RSVP />)

    await waitFor(() => {
      expect(screen.getByLabelText(/tu nombre y apellido/i)).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/tu nombre y apellido/i), {
      target: { value: 'Juan Pérez' },
    })

    fireEvent.click(screen.getByRole('button', { name: /confirmar asistencia/i }))

    await waitFor(() => {
      expect(screen.getByText(/excede capacidad autorizada/i)).toBeInTheDocument()
    })
  })
})
