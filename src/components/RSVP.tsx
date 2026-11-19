import { useState, useEffect } from "react";
import {
  CheckCircle2,
  UserCheck,
  Send,
  AlertCircle,
} from "lucide-react";
import { validateGroup, submitRSVP } from "../api";
import type { RSVPData } from "../types";
import StarBorder from "./StarBorder";
import FadeContent from "./FadeContent";
import styles from "./RSVP.module.css";

interface RSVPProps {
  groupCode?: string;
}

export default function RSVP({ groupCode }: RSVPProps) {
  // Read ?g= from window.location.search if not passed as prop
  const code = (
    groupCode ??
    (typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("g") ?? "")
      : "")
  ).trim();

  const [loadingValidation, setLoadingValidation] = useState(Boolean(code));
  const [isValidGroup, setIsValidGroup] = useState(false);
  const [maxPersonas, setMaxPersonas] = useState(1);

  // Form states
  const [nombre, setNombre] = useState("");
  const [asiste, setAsiste] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("carito_rsvp_submitted");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (typeof parsed.asiste === "boolean") {
            return parsed.asiste;
          }
        }
      }
    } catch {
      // Ignore storage read error
    }
    return true;
  });
  const [cantidad, setCantidad] = useState(1);
  const [acompanantes, setAcompanantes] = useState("");

  // Submit states
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("carito_rsvp_submitted");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!code || parsed.code === code) {
            return true;
          }
        }
      }
    } catch {
      // Ignore storage read error
    }
    return false;
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    let isMounted = true;

    validateGroup(code)
      .then((res) => {
        if (!isMounted) return;
        if (res.valid) {
          setIsValidGroup(true);
          setMaxPersonas(Math.max(1, res.maxPersonas));
          setCantidad(1);
        } else {
          setIsValidGroup(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsValidGroup(false);
      })
      .finally(() => {
        if (isMounted) setLoadingValidation(false);
      });

    return () => {
      isMounted = false;
    };
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    const payload: RSVPData = {
      grupo_code: code,
      nombre: nombre.trim(),
      asiste,
      cantidad: asiste ? cantidad : 0,
      acompanantes: asiste && cantidad > 1 ? acompanantes.trim() : "",
    };

    const res = await submitRSVP(payload);
    setSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
      try {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "carito_rsvp_submitted",
            JSON.stringify({ code, asiste, nombre: nombre.trim() }),
          );
          window.dispatchEvent(
            new CustomEvent("rsvp:submitted", {
              detail: { code, asiste, nombre: nombre.trim() },
            }),
          );
        }
      } catch {
        // Ignore storage write error
      }
    } else {
      setErrorMessage(
        res.error ||
          "Ocurrió un error al enviar tu respuesta. Por favor intentá nuevamente.",
      );
    }
  };

  return (
    <section
      id="rsvp"
      role="region"
      aria-label="Confirmación de asistencia"
      className={styles.section}
    >
      <FadeContent
        duration={1.2}
        blur={10}
        ease="sine.in"
        staggerFrom="center"
        disappearEase="expo.in"
      >
        <div className={styles.editorialFlow}>
          {/* Celestial herald header */}
          <div className={styles.herald} aria-hidden="true">
            <span className={styles.heraldLine} />
            <span className={styles.heraldSymbol}>✦</span>
            <span className={styles.heraldLine} />
          </div>

          <h2 className={styles.title}>Confirmar Asistencia</h2>

          {/* Loading validation */}
          {loadingValidation && (
            <div className={styles.loadingBox}>
              <div className={styles.spinner} aria-hidden="true" />
              <p className={styles.subtitle}>Cargando tu invitación...</p>
            </div>
          )}

          {/* Hospitable fallback for missing or invalid code */}
          {!loadingValidation && !isValidGroup && (
            <div className={styles.fallbackBox}>
              <p className={styles.fallbackPrimary}>
                No te encontramos en la lista de invitados con este enlace.
              </p>
              <p className={styles.fallbackSecondary}>
                Este rincón de confirmación está reservado para los invitados que
                recibieron su enlace personalizado. Si recibiste la invitación por
                WhatsApp, por favor abrí el enlace directo que te enviamos para
                reservar tu lugar.
              </p>
            </div>
          )}

          {/* Successfully validated: show confirmation feedback or active form */}
          {!loadingValidation && isValidGroup && (
            <>
              {isSubmitted ? (
                <div className={styles.successBox}>
                  <div className={styles.successIcon} aria-hidden="true">
                    <CheckCircle2 size={34} />
                  </div>
                  <h3 className={styles.successTitle}>
                    ¡Muchas gracias por confirmar!
                  </h3>
                  <p className={styles.subtitle}>
                    {asiste
                      ? "Tu respuesta ha sido registrada exitosamente. ¡Nos emociona mucho compartir esta noche con vos!"
                      : "Lamentamos que no puedas venir, pero valoramos mucho que nos hayas avisado."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      try {
                        if (typeof window !== "undefined") {
                          sessionStorage.removeItem("carito_rsvp_submitted");
                          window.dispatchEvent(new CustomEvent("rsvp:reset"));
                        }
                      } catch {
                        // Ignore storage error
                      }
                    }}
                    className={styles.editBtn}
                    aria-label="Modificar respuesta"
                  >
                    Modificar respuesta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <p className={styles.formPrompt}>
                    Por favor confirmá si vas a poder acompañarme en mis 15
                    años.
                  </p>

                  {errorMessage && (
                    <div className={styles.errorAlert} role="alert">
                      <AlertCircle
                        size={18}
                        aria-hidden="true"
                        className={styles.alertIcon}
                      />
                      <span>{errorMessage}</span>
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
                    <div
                      className={styles.toggleContainer}
                      role="radiogroup"
                      aria-label="Asistencia"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={asiste}
                        onClick={() => setAsiste(true)}
                        className={`${styles.toggleBtn} ${asiste ? styles.toggleBtnActive : ""}`}
                      >
                        <UserCheck size={18} aria-hidden="true" />
                        <span>Sí, asistiré</span>
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={!asiste}
                        onClick={() => setAsiste(false)}
                        className={`${styles.toggleBtn} ${!asiste ? styles.toggleBtnActive : ""}`}
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
                        {Array.from(
                          { length: maxPersonas },
                          (_, i) => i + 1,
                        ).map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "persona" : "personas"}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Companions field when cantidad > 1 */}
                  {asiste && cantidad > 1 && (
                    <div className={styles.fieldGroup}>
                      <label
                        htmlFor="rsvp-acompanantes"
                        className={styles.label}
                      >
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

                  <div className={styles.submitWrapper}>
                    <StarBorder
                      as="button"
                      type="submit"
                      disabled={submitting}
                      className={styles.submitBtn}
                      color="var(--color-silver-light)"
                      trailColor="var(--color-primary-light)"
                      backgroundColor="rgba(15, 23, 42, 0.65)"
                      textColor="var(--color-silver-light)"
                      borderColor="var(--border-silver)"
                      thickness={2}
                      radius={8}
                    >
                      {submitting ? (
                        <span>Enviando confirmación...</span>
                      ) : (
                        <>
                          <Send size={18} aria-hidden="true" />
                          <span>Confirmar Asistencia</span>
                        </>
                      )}
                    </StarBorder>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </FadeContent>
    </section>
  );
}
