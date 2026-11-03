import { useState, useEffect } from 'react'
import { CheckCircle2, HeartHandshake, UserCheck, Send, AlertCircle } from 'lucide-react'
import { validateGroup, submitRSVP } from '../api'
import type { RSVPData } from '../types'
import styles from './RSVP.module.css'

interface RSVPProps {
  groupCode?: string
}

export default function RSVP({ groupCode }: RSVPProps) {
  // Read ?g= from window.location.search if not passed as prop
  const code = (
    groupCode ??
    (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('g') ?? '' : '')
  ).trim()

  const [loadingValidation, setLoadingValidation] = useState(Boolean(code))
  const [isValidGroup, setIsValidGroup] = useState(false)
  const [maxPersonas, setMaxPersonas] = useState(1)

  // Form states
  const [nombre, setNombre] = useState('')
  const [asiste, setAsiste] = useState(true)
  const [cantidad, setCantidad] = useState(1)
  const [acompanantes, setAcompanantes] = useState('')

  // Submit states
  const [submitting, setSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!code) {
      setLoadingValidation(false)
      setIsValidGroup(false)
      return
    }

    let isMounted = true
    setLoadingValidation(true)

    validateGroup(code)
      .then((res) => {
        if (!isMounted) return
        if (res.valid) {
          setIsValidGroup(true)
          setMaxPersonas(Math.max(1, res.maxPersonas))
          setCantidad(1)
        } else {
          setIsValidGroup(false)
        }
      })
      .catch(() => {
        if (isMounted) setIsValidGroup(false)
      })
      .finally(() => {
        if (isMounted) setLoadingValidation(false)
      })

    return () => {
      isMounted = false
    }
  }, [code])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return

    setSubmitting(true)
    setErrorMessage(null)

    const payload: RSVPData = {
      grupo_code: code,
      nombre: nombre.trim(),
      asiste,
      cantidad: asiste ? cantidad : 0,
      acompanantes: asiste && cantidad > 1 ? acompanantes.trim() : '',
    }

    const res = await submitRSVP(payload)
    setSubmitting(false)

    if (res.success) {
      setIsSubmitted(true)
    } else {
      setErrorMessage(res.error || 'Ocurrió un error al enviar tu respuesta. Por favor intentá nuevamente.')
    }
  }

  return (
    <section id="rsvp" role="region" aria-label="Confirmación de asistencia" className={styles.section}>
      <div className={styles.card}>
        <div className={styles.headerIcon} aria-hidden="true">
          <HeartHandshake size={24} />
        </div>

        <p className={styles.eyebrow}>Tu Compañía en Mi Noche</p>
        <h2 className={styles.title}>Confirmar Asistencia</h2>

        {/* Loading validation */}
        {loadingValidation && (
          <div className={styles.loadingBox}>
            <div className={styles.spinner} />
            <p className={styles.subtitle}>Cargando tu invitación...</p>
          </div>
        )}

        {/* Fallback for missing or invalid code */}
        {!loadingValidation && !isValidGroup && (
          <div className={styles.fieldGroup} style={{ gap: '1rem', padding: '1rem 0' }}>
            <p className={styles.subtitle} style={{ fontSize: '1.05rem', color: 'var(--color-silver)' }}>
              No te encontramos en la lista de invitados, pero gracias por tu interés.
            </p>
            <p className={styles.subtitle} style={{ fontSize: '0.875rem' }}>
              Esta sección está reservada para los invitados que recibieron su enlace personalizado.
              Si recibiste la invitación por WhatsApp, por favor abrí el enlace directo que te enviamos.
            </p>
          </div>
        )}

        {/* Successfully validated: show confirmation feedback or active form */}
        {!loadingValidation && isValidGroup && (
          <>
            {isSubmitted ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 className={styles.title} style={{ fontSize: '1.35rem' }}>
                  ¡Muchas gracias por confirmar!
                </h3>
                <p className={styles.subtitle}>
                  {asiste
                    ? 'Tu respuesta ha sido registrada exitosamente. ¡Nos emociona mucho compartir esta noche con vos!'
                    : 'Lamentamos que no puedas venir, pero valoramos mucho que nos hayas avisado.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className={styles.editBtn}
                  aria-label="Modificar respuesta"
                >
                  Modificar respuesta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <p className={styles.subtitle} style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  Por favor confirmá si vas a poder acompañarme en mis 15 años.
                </p>

                {errorMessage && (
                  <div className={styles.errorAlert} role="alert">
                    <AlertCircle size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                    {errorMessage}
                  </div>
                )}

                {/* Name */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="rsvp-nombre" className={styles.label}>
                    Tu nombre y apellido
                  </label>
                  <input
                    id="rsvp-nombre"
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Carolina Herrera"
                    className={styles.input}
                  />
                </div>

                {/* Attendance toggle */}
                <div className={styles.fieldGroup}>
                  <span className={styles.label}>¿Vas a asistir?</span>
                  <div className={styles.toggleContainer} role="radiogroup" aria-label="Asistencia">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={asiste}
                      onClick={() => setAsiste(true)}
                      className={`${styles.toggleBtn} ${asiste ? styles.toggleBtnActive : ''}`}
                    >
                      <UserCheck size={18} />
                      <span>Sí, asistiré</span>
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={!asiste}
                      onClick={() => setAsiste(false)}
                      className={`${styles.toggleBtn} ${!asiste ? styles.toggleBtnActive : ''}`}
                    >
                      <span>No podré asistir</span>
                    </button>
                  </div>
                </div>

                {/* Quantity selector (natural without bureaucracy) */}
                {asiste && (
                  <div className={styles.fieldGroup}>
                    <label htmlFor="rsvp-cantidad" className={styles.label}>
                      ¿Cuántas personas asistirán en total?
                    </label>
                    <select
                      id="rsvp-cantidad"
                      value={cantidad}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                      className={styles.select}
                    >
                      {Array.from({ length: maxPersonas }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'persona' : 'personas'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Companions field when cantidad > 1 */}
                {asiste && cantidad > 1 && (
                  <div className={styles.fieldGroup}>
                    <label htmlFor="rsvp-acompanantes" className={styles.label}>
                      Nombres de tus acompañantes
                    </label>
                    <input
                      id="rsvp-acompanantes"
                      type="text"
                      value={acompanantes}
                      onChange={(e) => setAcompanantes(e.target.value)}
                      placeholder="Ej: Juan, Sofía..."
                      className={styles.input}
                    />
                  </div>
                )}

                <button type="submit" disabled={submitting} className={styles.submitBtn}>
                  {submitting ? (
                    <span>Enviando confirmación...</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Confirmar Asistencia</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </section>
  )
}
