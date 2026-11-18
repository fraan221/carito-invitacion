import { useState, useRef, useEffect, useMemo } from "react";
import {
  MapPin,
  Clock,
  ExternalLink,
  CalendarPlus,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Compass,
} from "lucide-react";
import FadeContent from "./FadeContent";
import styles from "./EventDetails.module.css";

export interface EventDetailsProps {
  venue?: string;
  address?: string;
  date?: string;
  time?: string;
  mapsUrl?: string;
  googleCalendarUrl?: string;
}

const DEFAULT_VENUE = "Salón Royal Night";
const DEFAULT_ADDRESS =
  "Cno. Gral. Belgrano 5599, B1888 Florencio Varela, Provincia de Buenos Aires";
const DEFAULT_DATE = "Sábado 6 de Febrero de 2027";
const DEFAULT_TIME = "21:00 a 05:00 hs";
const DEFAULT_MAPS_URL =
  "https://maps.google.com/?q=BIM+Cno+Gral+Belgrano+5599+Florencio+Varela";
const DEFAULT_GCAL_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mis+15+%E2%80%94+Milagros+Carolina+Herrera&dates=20270207T000000Z/20270207T080000Z&details=Celebraci%C3%B3n+de+Mis+15+A%C3%B1os+-+Milagros+Carolina+Herrera.+Sal%C3%B3n+BIM.&location=Sal%C3%B3n+BIM%2C+Cno.+Gral.+Belgrano+5599%2C+B1888+Florencio+Varela";

function sanitizeExternalUrl(
  url: string | undefined,
  fallback: string,
): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  if (/^(?:javascript|vbscript|data):/i.test(trimmed)) {
    return fallback;
  }
  return trimmed;
}

export default function EventDetails({
  venue = DEFAULT_VENUE,
  address = DEFAULT_ADDRESS,
  date = DEFAULT_DATE,
  time = DEFAULT_TIME,
  mapsUrl = DEFAULT_MAPS_URL,
  googleCalendarUrl = DEFAULT_GCAL_URL,
}: EventDetailsProps) {
  // Defensive input normalization: prevent blank/whitespace-only values from breaking layout
  const cleanVenue = venue?.trim() || DEFAULT_VENUE;
  const cleanAddress = address?.trim() || DEFAULT_ADDRESS;
  const cleanDate = date?.trim() || DEFAULT_DATE;
  const cleanTime = time?.trim() || DEFAULT_TIME;

  // Safe external URLs with automatic query fallback if blank
  const safeMapsUrl = useMemo(() => {
    if (mapsUrl && mapsUrl.trim()) {
      return sanitizeExternalUrl(mapsUrl, DEFAULT_MAPS_URL);
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${cleanVenue}, ${cleanAddress}`,
    )}`;
  }, [mapsUrl, cleanVenue, cleanAddress]);

  const safeGoogleCalendarUrl = useMemo(() => {
    if (googleCalendarUrl && googleCalendarUrl.trim()) {
      return sanitizeExternalUrl(googleCalendarUrl, DEFAULT_GCAL_URL);
    }
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      "Mis 15 — Milagros Carolina Herrera",
    )}&dates=20270207T000000Z/20270207T080000Z&details=${encodeURIComponent(
      `Celebración de Mis 15 Años - Milagros Carolina Herrera. ${cleanVenue}.`,
    )}&location=${encodeURIComponent(`${cleanVenue}, ${cleanAddress}`)}`;
  }, [googleCalendarUrl, cleanVenue, cleanAddress]);

  // RFC 5545 compliant iCalendar (.ics) generation for Apple Calendar & Outlook
  const icsDataUri = useMemo(() => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Carito XV//Invitacion Digital//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:carito-xv-20270206@caritoxv.com",
      "DTSTAMP:20270207T000000Z",
      "DTSTART:20270207T000000Z",
      "DTEND:20270207T080000Z",
      `SUMMARY:${`Mis 15 — Milagros Carolina Herrera (${cleanVenue})`}`,
      `DESCRIPTION:${cleanDate} · ${cleanTime}\\nCelebración de Mis 15 Años - Milagros Carolina Herrera.\\nLugar: ${cleanVenue}\\nDirección: ${cleanAddress}`,
      `LOCATION:${cleanVenue}, ${cleanAddress}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
  }, [cleanVenue, cleanAddress, cleanDate, cleanTime]);

  // Resilient clipboard copy with execCommand fallback for legacy/in-app webviews
  const [copiedAddress, setCopiedAddress] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyAddress = async () => {
    let copied = false;

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      (window.isSecureContext === undefined || window.isSecureContext === true)
    ) {
      try {
        await navigator.clipboard.writeText(cleanAddress);
        copied = true;
      } catch {
        // Fallback to execCommand below
      }
    }

    if (!copied && typeof document !== "undefined") {
      const textArea = document.createElement("textarea");
      try {
        textArea.value = cleanAddress;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        textArea.setAttribute("readonly", "");
        document.body.appendChild(textArea);
        textArea.select();
        copied = document.execCommand("copy");
      } catch {
        // Ignore if entirely disallowed
      } finally {
        if (textArea.parentNode) {
          textArea.parentNode.removeChild(textArea);
        }
      }
    }

    if (copied) {
      setCopiedAddress(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopiedAddress(false);
      }, 2500);
    }
  };

  return (
    <section
      id="detalles"
      role="region"
      aria-label="Detalles del evento y ubicación"
      className={styles.section}
    >
      <FadeContent
        duration={0.8}
        blur={false}
        trigger="mount"
        ease="power2.out"
      >
        <div className={styles.charter}>
          {/* Subtle celestial corner accents */}
          <span
            className={`${styles.cornerMark} ${styles.cornerTopLeft}`}
            aria-hidden="true"
          >
            ✦
          </span>
          <span
            className={`${styles.cornerMark} ${styles.cornerTopRight}`}
            aria-hidden="true"
          >
            ✦
          </span>
          <span
            className={`${styles.cornerMark} ${styles.cornerBottomLeft}`}
            aria-hidden="true"
          >
            ✦
          </span>
          <span
            className={`${styles.cornerMark} ${styles.cornerBottomRight}`}
            aria-hidden="true"
          >
            ✦
          </span>

          {/* Section Heading */}
          <div className={styles.header}>
            <h2 id="detalles-heading" className={styles.title}>
              Cuándo y Dónde
            </h2>
          </div>

          {/* Date & Time Monumental Display */}
          <div
            className={styles.dateHerald}
            aria-label="Fecha y horario del evento"
          >
            <div className={styles.dateStarLine} aria-hidden="true">
              <span className={styles.heraldHairline} />
              <span className={styles.heraldSymbol}>✦</span>
              <span className={styles.heraldHairline} />
            </div>

            <p className={styles.dateText}>{cleanDate}</p>

            <div className={styles.timeRow}>
              <Clock size={16} aria-hidden="true" className={styles.timeIcon} />
              <span className={styles.timePrimary}>{cleanTime}</span>
              <span className={styles.dotSeparator} aria-hidden="true">
                ·
              </span>
              <span className={styles.timePunctuality}>
                Recepción y fiesta · Agradecemos puntualidad
              </span>
            </div>
          </div>

          <div className={styles.divider} role="separator" aria-hidden="true" />

          {/* Venue & Physical Arrival Information */}
          <div className={styles.venueSection} aria-label="Lugar y dirección">
            <div className={styles.venueHeader}>
              <span className={styles.venueIconWrapper} aria-hidden="true">
                <MapPin size={22} />
              </span>
              <div className={styles.venueMeta}>
                <h3 className={styles.venueName}>{cleanVenue}</h3>
                <p className={styles.venueAddress}>{cleanAddress}</p>
              </div>
            </div>

            {/* Arrival Badges */}
            <div
              className={styles.badgesList}
              aria-label="Detalles prácticos de llegada"
            >
              <span className={styles.arrivalBadge}>
                <ShieldCheck size={13} aria-hidden="true" />
                <span>Estacionamiento privado</span>
              </span>
              <span className={styles.arrivalBadge}>
                <Compass size={13} aria-hidden="true" />
                <span>Zona Sur · Buenos Aires</span>
              </span>
            </div>
          </div>

          <div className={styles.divider} role="separator" aria-hidden="true" />

          {/* Actions & Calendar Utilities */}
          <div className={styles.actions}>
            <div className={styles.mainActions}>
              <a
                href={safeMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Cómo llegar a ${cleanVenue} en Google Maps (se abre en nueva pestaña)`}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                <MapPin size={18} aria-hidden="true" />
                <span>Cómo llegar</span>
                <ExternalLink
                  size={15}
                  aria-hidden="true"
                  className={styles.externalIcon}
                />
              </a>

              <button
                type="button"
                onClick={handleCopyAddress}
                aria-label={
                  copiedAddress
                    ? "Dirección copiada al portapapeles"
                    : "Copiar dirección para Uber, Cabify o Waze"
                }
                className={`${styles.btn} ${styles.btnSecondary} ${
                  copiedAddress ? styles.btnCopied : ""
                }`}
              >
                {copiedAddress ? (
                  <Check size={18} aria-hidden="true" />
                ) : (
                  <Copy size={18} aria-hidden="true" />
                )}
                <span>
                  {copiedAddress ? "¡Dirección copiada!" : "Copiar dirección"}
                </span>
              </button>
            </div>

            {/* Streamlined Calendar Options (no technical .ics in human visual label) */}
            <div className={styles.calendarStrip}>
              <span className={styles.calendarPrompt}>Agendar fecha:</span>
              <div className={styles.calendarOptions}>
                <a
                  href={safeGoogleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Agendar fiesta en Google Calendar (se abre en nueva pestaña)"
                  className={styles.calendarPill}
                >
                  <CalendarPlus size={15} aria-hidden="true" />
                  <span>Google Calendar</span>
                  <ExternalLink
                    size={12}
                    aria-hidden="true"
                    className={styles.externalIcon}
                  />
                </a>

                <a
                  href={icsDataUri}
                  download="fiesta-carito-xv.ics"
                  aria-label="Descargar recordatorio Apple / iCal (.ics) para Apple Calendar y Outlook"
                  className={styles.calendarPill}
                >
                  <Download size={15} aria-hidden="true" />
                  <span>Apple / iCal</span>
                </a>
              </div>
            </div>
          </div>

          {/* Accessible live region for screen reader feedback */}
          <span role="status" aria-live="polite" className={styles.srOnly}>
            {copiedAddress ? "Dirección copiada al portapapeles" : ""}
          </span>
        </div>
      </FadeContent>
    </section>
  );
}
