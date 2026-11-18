import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  CalendarPlus,
} from "lucide-react";
import FadeContent from "./FadeContent";
import ClickSpark from "./ClickSpark";

interface EventDetailsProps {
  venue?: string;
  address?: string;
  date?: string;
  time?: string;
  mapsUrl?: string;
  googleCalendarUrl?: string;
}

export default function EventDetails({
  venue = "BIM",
  address = "Cno. Gral. Belgrano 5599, B1888 Florencio Varela, Provincia de Buenos Aires",
  date = "Sábado 6 de Febrero de 2027",
  time = "21:00 a 05:00 hs",
  mapsUrl = "https://maps.google.com/?q=BIM+Cno+Gral+Belgrano+5599+Florencio+Varela",
  googleCalendarUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mis+15+%E2%80%94+Milagros+Carolina+Herrera&dates=20270207T000000Z/20270207T080000Z&details=Celebraci%C3%B3n+de+Mis+15+A%C3%B1os+-+Milagros+Carolina+Herrera.+Sal%C3%B3n+BIM.&location=Sal%C3%B3n+BIM%2C+Cno.+Gral.+Belgrano+5599%2C+B1888+Florencio+Varela",
}: EventDetailsProps) {
  return (
    <section
      id="detalles"
      aria-label="Detalles del evento y ubicación"
      style={{
        padding: "4rem 1.5rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      <FadeContent
        duration={1.2}
        blur={10}
        ease="sine.in"
        staggerFrom="center"
        disappearEase="expo.in"
      >
        <div
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "2.5rem 1.75rem",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.8125rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-silver-dark)",
              marginBottom: "0.5rem",
            }}
          >
            Dónde &amp; Cuándo
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              color: "var(--color-silver-light)",
              marginBottom: "2rem",
              letterSpacing: "0.04em",
            }}
          >
            Detalles de la Fiesta
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              marginBottom: "2.5rem",
              textAlign: "left",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
            >
              <Calendar
                size={22}
                style={{
                  color: "var(--color-primary-light)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    color: "var(--text-main)",
                    fontSize: "1rem",
                  }}
                >
                  {date}
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Recepción
                </p>
              </div>
            </div>

            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
            >
              <Clock
                size={22}
                style={{
                  color: "var(--color-primary-light)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    color: "var(--text-main)",
                    fontSize: "1rem",
                  }}
                >
                  {time}
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Puntualidad agradecida
                </p>
              </div>
            </div>

            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
            >
              <MapPin
                size={22}
                style={{
                  color: "var(--color-primary-light)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    color: "var(--text-main)",
                    fontSize: "1rem",
                  }}
                >
                  {venue}
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  {address}
                </p>
              </div>
            </div>
          </div>

          <ClickSpark
            sparkColor={["#e2e8f0", "#93c5fd", "#ffffff"]}
            shape="star"
            sparkSize={12}
            sparkCount={6}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.875rem",
                width: "100%",
              }}
            >
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver ubicación en Google Maps"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 1.25rem",
                  background:
                    "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                  border: "1px solid var(--border-silver)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-main)",
                  fontWeight: 500,
                  fontSize: "0.9375rem",
                  letterSpacing: "0.05em",
                  transition:
                    "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease",
                  boxShadow: "0 4px 16px var(--color-primary-glow)",
                  minHeight: "44px",
                }}
              >
                <MapPin size={18} />
                <span>Cómo llegar</span>
                <ExternalLink size={16} style={{ opacity: 0.7 }} />
              </a>

              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Agendar fiesta en Google Calendar"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 1.25rem",
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-silver)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--color-silver-light)",
                  fontWeight: 500,
                  fontSize: "0.9375rem",
                  letterSpacing: "0.05em",
                  transition:
                    "background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                  minHeight: "44px",
                }}
              >
                <CalendarPlus
                  size={18}
                  style={{ color: "var(--color-primary-light)" }}
                />
                <span>Agendar Fiesta</span>
              </a>
            </div>
          </ClickSpark>
        </div>
      </FadeContent>
    </section>
  );
}
