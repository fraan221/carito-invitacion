import { useState, useEffect } from 'react'

export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

// oxlint-disable-next-line react/only-export-components
export function calculateTimeRemaining(targetDate: string | Date, now: Date = new Date()): TimeRemaining {
  const targetMs = typeof targetDate === 'string' ? new Date(targetDate).getTime() : targetDate.getTime()
  const diff = targetMs - now.getTime()

  if (diff <= 0 || isNaN(diff)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  const seconds = Math.floor((diff / 1000) % 60)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  return { days, hours, minutes, seconds, isExpired: false }
}

interface CountdownProps {
  targetDate?: string
}

export default function Countdown({ targetDate = '2027-02-06T21:00:00' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => calculateTimeRemaining(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const units = [
    { label: 'DÍAS', value: timeLeft.days },
    { label: 'HORAS', value: timeLeft.hours },
    { label: 'MINUTOS', value: timeLeft.minutes },
    { label: 'SEGUNDOS', value: timeLeft.seconds },
  ]

  return (
    <section
      aria-label="Cuenta regresiva"
      style={{
        padding: '3rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-silver-dark)',
          fontSize: '0.875rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: '1.25rem',
        }}
      >
        Cada segundo nos acerca más
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        {units.map((unit) => (
          <div
            key={unit.label}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 0.5rem',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                lineHeight: 1.1,
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.625rem',
                letterSpacing: '0.15em',
                color: 'var(--text-muted)',
                marginTop: '0.35rem',
              }}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
