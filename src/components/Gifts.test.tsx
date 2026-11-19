import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Gifts from './Gifts'
import { submitGiftPreference } from '../api'

vi.mock('../api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api')>()
  return {
    ...actual,
    submitGiftPreference: vi.fn().mockResolvedValue({ success: true }),
  }
})

describe('Gifts Section', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.clear()
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders 3 gift options unselected initially with alias hidden', () => {
    render(<Gifts groupCode="casa" />)

    expect(screen.getByRole('button', { name: /transferencia/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /efectivo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /regalo físico/i })).toBeInTheDocument()
    expect(screen.queryByText('caro.herrera.15')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /copiar alias/i })).not.toBeInTheDocument()
  })

  it('reveals alias when Transferencia MP is clicked and submits preference', async () => {
    render(<Gifts groupCode="casa" />)

    const mpButton = screen.getByRole('button', { name: /transferencia/i })
    await act(async () => {
      fireEvent.click(mpButton)
      vi.advanceTimersByTime(350)
    })

    expect(submitGiftPreference).toHaveBeenCalledWith('casa', 'transferencia')
    expect(screen.getByText('caro.herrera.15')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copiar alias/i })).toBeInTheDocument()
  })

  it('hides alias and shows confirmation when Efectivo is clicked', async () => {
    render(<Gifts groupCode="casa" />)

    const cashButton = screen.getByRole('button', { name: /efectivo/i })
    await act(async () => {
      fireEvent.click(cashButton)
      vi.advanceTimersByTime(350)
    })

    expect(submitGiftPreference).toHaveBeenCalledWith('casa', 'efectivo')
    expect(screen.queryByText('caro.herrera.15')).not.toBeInTheDocument()
    expect(screen.getByText(/preferencia registrada/i)).toBeInTheDocument()
  })

  it('hides alias and shows confirmation when Regalo físico is clicked', async () => {
    render(<Gifts groupCode="casa" />)

    const physicalButton = screen.getByRole('button', { name: /regalo físico/i })
    await act(async () => {
      fireEvent.click(physicalButton)
      vi.advanceTimersByTime(350)
    })

    expect(submitGiftPreference).toHaveBeenCalledWith('casa', 'fisico')
    expect(screen.queryByText('caro.herrera.15')).not.toBeInTheDocument()
    expect(screen.getByText(/preferencia registrada/i)).toBeInTheDocument()
  })

  it('restores selection from sessionStorage if present', () => {
    sessionStorage.setItem('carito_gift_pref_casa', 'transferencia')
    render(<Gifts groupCode="casa" />)

    expect(screen.getByText('caro.herrera.15')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copiar alias/i })).toBeInTheDocument()
  })

  it('works gracefully without groupCode without submitting network call', async () => {
    render(<Gifts />)

    const mpButton = screen.getByRole('button', { name: /transferencia/i })
    await act(async () => {
      fireEvent.click(mpButton)
      vi.advanceTimersByTime(350)
    })

    expect(submitGiftPreference).not.toHaveBeenCalled()
    expect(screen.getByText('caro.herrera.15')).toBeInTheDocument()
  })

  it('copies alias to clipboard and shows temporary feedback on click', async () => {
    render(<Gifts groupCode="casa" />)

    // First select Transferencia so alias appears
    const mpButton = screen.getByRole('button', { name: /transferencia/i })
    await act(async () => {
      fireEvent.click(mpButton)
      vi.advanceTimersByTime(350)
    })

    const copyBtn = screen.getByRole('button', { name: /copiar alias/i })
    await act(async () => {
      fireEvent.click(copyBtn)
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('caro.herrera.15')
    expect(screen.getByText(/¡copiado!/i)).toBeInTheDocument()

    // After 2 seconds, feedback resets
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByRole('button', { name: /copiar alias/i })).toBeInTheDocument()
    expect(screen.queryByText(/¡copiado!/i)).not.toBeInTheDocument()
  })

  it('does not submit duplicate network request when clicking the already selected option', async () => {
    render(<Gifts groupCode="casa" />)

    const mpButton = screen.getByRole('button', { name: /transferencia/i })
    await act(async () => {
      fireEvent.click(mpButton)
      vi.advanceTimersByTime(350)
    })

    expect(submitGiftPreference).toHaveBeenCalledTimes(1)

    // Click it again
    await act(async () => {
      fireEvent.click(mpButton)
      vi.advanceTimersByTime(350)
    })

    // Still called only once
    expect(submitGiftPreference).toHaveBeenCalledTimes(1)
  })

  it('debounces rapid clicks between options and submits only the final choice', async () => {
    render(<Gifts groupCode="casa" />)

    const mpButton = screen.getByRole('button', { name: /transferencia/i })
    const cashButton = screen.getByRole('button', { name: /efectivo/i })

    await act(async () => {
      fireEvent.click(mpButton)
      // Rapid toggle before debounce window expires
      fireEvent.click(cashButton)
      vi.advanceTimersByTime(350)
    })

    expect(submitGiftPreference).toHaveBeenCalledTimes(1)
    expect(submitGiftPreference).toHaveBeenCalledWith('casa', 'efectivo')
  })
})
