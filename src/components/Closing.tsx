export default function Closing() {
  return (
    <footer
      role="region"
      aria-label="Despedida y agradecimiento"
      style={{
        padding: '5rem 1.5rem 4rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <span
          style={{
            fontSize: '1.25rem',
            color: 'var(--color-silver)',
          }}
          aria-hidden="true"
        >
          ✦ ✦ ✦
        </span>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            color: 'var(--color-silver-light)',
            letterSpacing: '0.05em',
          }}
        >
          ¡Te Espero!
        </h2>

        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.8,
            color: 'var(--text-muted)',
            maxWidth: '440px',
          }}
        >
          Gracias por acompañarme en este día tan especial y por ser parte de mi historia. Tu presencia es el mejor regalo.
        </p>

        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            letterSpacing: '0.15em',
            color: 'var(--color-silver)',
            marginTop: '1rem',
            textTransform: 'uppercase',
          }}
        >
          Milagros Carolina
        </p>

        <div
          style={{
            width: '40px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--color-silver), transparent)',
            marginTop: '0.5rem',
          }}
          aria-hidden="true"
        />
      </div>
    </footer>
  )
}
