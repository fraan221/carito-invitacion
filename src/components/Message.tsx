import FadeContent from './FadeContent'

export default function Message() {
  return (
    <section
      id="mensaje"
      aria-label="Mensaje de bienvenida"
      style={{
        padding: "5rem 1.5rem",
        textAlign: "center",
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
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "1.25rem",
              color: "var(--color-silver)",
              marginBottom: "1rem",
            }}
            aria-hidden="true"
          >
            ✦
          </span>

          <blockquote
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.0625rem, 2.5vw, 1.25rem)",
              fontStyle: "italic",
              lineHeight: 1.8,
              color: "var(--color-silver-light)",
              marginBottom: "1.5rem",
            }}
          >
            &ldquo;Hay noches que se vuelven eternas en el corazón, y esta será una
            de ellas.&rdquo;
          </blockquote>

          <p
            style={{
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              color: "var(--text-muted)",
            }}
          >
            Hoy comienza uno de los capítulos más lindos de mi historia, y quiero
            compartirlo con las personas que hacen brillar mi vida. Te invito a ser
            parte de mis 15 años, una noche llena de magia, sueños y momentos que
            quedarán para siempre en mi memoria.
          </p>
        </div>
      </FadeContent>
    </section>
  );
}
