import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Gifts from './Gifts'

describe('Gifts Section', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders gift instructions, alias and copy button', () => {
    render(<Gifts alias="caro.herrera.15" />)

    expect(screen.getByRole('region', { name: /regalos/i })).toBeInTheDocument()
    expect(screen.getByText('caro.herrera.15')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copiar alias/i })).toBeInTheDocument()
    expect(screen.getByText(/transferencia/i)).toBeInTheDocument()
  })

  it('copies alias to clipboard and shows temporary feedback on click', async () => {
    render(<Gifts alias="caro.herrera.15" />)

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

  it('uses default alias if none provided', () => {
    render(<Gifts />)
    expect(screen.getByText('caro.herrera.15')).toBeInTheDocument()
  })
})
