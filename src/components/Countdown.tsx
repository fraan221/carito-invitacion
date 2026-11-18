import { useState, useEffect } from "react";
import CountUp from "./CountUp";
import FadeContent from "./FadeContent";
import styles from "./Countdown.module.css";

export const DEFAULT_TARGET_DATE = "2027-02-06T21:00:00-03:00";

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

// oxlint-disable-next-line react/only-export-components
export function calculateTimeRemaining(
  targetDate: string | Date = DEFAULT_TARGET_DATE,
  now: Date = new Date(),
): TimeRemaining {
  let targetMs: number;

  if (targetDate instanceof Date) {
    targetMs = targetDate.getTime();
  } else if (typeof targetDate === "string") {
    // If no timezone offset is provided, anchor to Argentina Standard Time (-03:00)
    const trimmed = targetDate.trim();
    const hasOffset = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/.test(trimmed);
    const normalized = hasOffset ? trimmed : `${trimmed}-03:00`;
    targetMs = new Date(normalized).getTime();
  } else {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const diff = targetMs - now.getTime();

  if (isNaN(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, isExpired: false };
}

interface CountdownProps {
  targetDate?: string;
}

export default function Countdown({
  targetDate = DEFAULT_TARGET_DATE,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(targetDate),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Días", value: timeLeft.days, animate: true },
    { label: "Horas", value: timeLeft.hours, animate: true },
    { label: "Minutos", value: timeLeft.minutes, animate: true },
    { label: "Segundos", value: timeLeft.seconds, animate: false },
  ];

  return (
    <section
      id="countdown"
      role="region"
      aria-label="Cuenta regresiva"
      className={styles.section}
    >
      <FadeContent
        duration={0.8}
        blur={false}
        trigger="mount"
        ease="power2.out"
      >
        <div className={styles.alignmentWrapper}>
          {timeLeft.isExpired ? (
            /* Celebration Mode: Party has started or target date reached */
            <div className={styles.celebrationWrapper}>
              <div className={styles.herald} aria-hidden="true">
                <span className={styles.heraldLine} />
                <span className={styles.heraldSymbol}>✦</span>
                <span className={styles.heraldLine} />
              </div>

              <h2 className={styles.celebrationTitle}>
                ¡La noche soñada llegó!
              </h2>

              <p className={styles.celebrationText}>
                Las estrellas ya brillan sobre Florencio Varela. Te esperamos en
                Salón BIM para celebrar juntos los 15 de Carito.
              </p>

              <div className={styles.celebrationBadge}>
                <span className={styles.celebrationDot} aria-hidden="true" />
                <span>Celebración en curso</span>
              </div>
            </div>
          ) : (
            /* Active Countdown: Celestial alignment of liquid silver numerals */
            <>
              {/* Heraldic divider */}
              <div className={styles.herald} aria-hidden="true">
                <span className={styles.heraldLine} />
                <span className={styles.heraldSymbol}>✦</span>
                <span className={styles.heraldLine} />
              </div>

              {/* Accessible and visible headings */}
              <h2 className={styles.heading} id="countdown-heading">
                Cada segundo nos acerca más
              </h2>

              {/* Screen reader narrative announcement */}
              <p className={styles.srOnly} aria-live="polite">
                Faltan {timeLeft.days} días, {timeLeft.hours} horas,{" "}
                {timeLeft.minutes} minutos y {timeLeft.seconds} segundos para
                la fiesta de 15 de Carito.
              </p>

              {/* Open celestial alignment: No boxed cards */}
              <div
                className={styles.alignmentGrid}
                role="group"
                aria-labelledby="countdown-heading"
              >
                {units.map((unit, index) => (
                  <div
                    key={unit.label}
                    style={{ display: "contents" }}
                  >
                    <div className={styles.unitCol}>
                      <span className={styles.number} aria-hidden="true">
                        {unit.animate ? (
                          <CountUp
                            from={0}
                            to={unit.value}
                            easing="expo"
                            duration={1.5}
                            trigger="view"
                            customFormatter={(val) =>
                              String(Math.round(val)).padStart(2, "0")
                            }
                          />
                        ) : (
                          String(unit.value).padStart(2, "0")
                        )}
                      </span>
                      <span className={styles.label} aria-hidden="true">
                        {unit.label}
                      </span>
                    </div>

                    {index < units.length - 1 && (
                      <span
                        className={styles.separator}
                        aria-hidden="true"
                      >
                        ✦
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </FadeContent>
    </section>
  );
}
