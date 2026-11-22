import { useState, useEffect } from 'react'
import { ArrowUp, Check } from 'lucide-react'
import FadeContent from './FadeContent'
import styles from './Closing.module.css'

export default function Closing() {
  const [rsvpStatus, setRsvpStatus] = useState<{ submitted: boolean; asiste: boolean } | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('carito_rsvp_submitted')
        if (stored) {
          const parsed = JSON.parse(stored)
          return {
            submitted: true,
            asiste: parsed.asiste !== false,
          }
        }
      }
    } catch {
      // Ignore storage read error
    }
    return null
  })

  useEffect(() => {
    const handleRsvpSubmitted = (e: Event) => {
      const customEvent = e as CustomEvent<{ asiste?: boolean }>
      setRsvpStatus({
        submitted: true,
        asiste: customEvent.detail?.asiste !== false,
      })
    }

    const handleRsvpReset = () => {
      setRsvpStatus(null)
    }

    window.addEventListener('rsvp:submitted', handleRsvpSubmitted)
    window.addEventListener('rsvp:reset', handleRsvpReset)
    return () => {
      window.removeEventListener('rsvp:submitted', handleRsvpSubmitted)
      window.removeEventListener('rsvp:reset', handleRsvpReset)
    }
  }, [])

  return (
    <footer
      id="despedida"
      role="region"
      aria-label="Despedida y agradecimiento"
      className={styles.closing}
    >
      <div className={styles.aura} aria-hidden="true" />

      <FadeContent
        duration={0.8}
        blur={false}
        trigger="mount"
        ease="power2.out"
      >
        <div className={styles.container}>
          <div className={styles.herald} aria-hidden="true">
            <span className={styles.heraldLine} />
            <span className={styles.heraldMonogram}>XV</span>
            <span className={styles.heraldLine} />
          </div>

          <h2 className={styles.title}>¡Te Espero!</h2>

          <p className={styles.message}>
            Deseo de corazón que puedas acompañarme en esta velada tan especial,
            donde los sueños se transforman en recuerdos y las estrellas son
            testigos de mi felicidad. Tu presencia hará que este momento
            resplandezca aún más en una noche mágica e inolvidable.
          </p>

          <div className={styles.signatureGroup}>
            <p className={styles.signature}>Milagros Carolina</p>
            <span className={styles.signatureDate}>06 · FEBRERO · 2027</span>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.actions}>
            {rsvpStatus?.submitted ? (
              <a
                href="#rsvp"
                className={`${styles.rsvpButton} ${styles.rsvpButtonConfirmed}`}
                aria-label="Ver estado de confirmación de asistencia"
              >
                <Check size={16} aria-hidden="true" />
                {rsvpStatus.asiste ? 'Asistencia Confirmada' : 'Respuesta Registrada'}
              </a>
            ) : (
              <a href="#rsvp" className={styles.rsvpButton}>
                Confirmar Asistencia
              </a>
            )}
            <a href="#hero" className={styles.returnLink}>
              Volver al inicio <ArrowUp size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </FadeContent>
    </footer>
  )
}
