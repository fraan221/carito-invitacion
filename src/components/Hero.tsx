import CountUp from './CountUp'

export default function Hero() {
  return (
    <header
      id="hero"
      role="banner"
      style={{
        minHeight: '100vh',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 'var(--max-width-mobile)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.8125rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--color-silver-dark)',
          }}
        >
          Te invito a celebrar
        </span>

        <h1
          aria-label="Mis XV"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.75rem, 8vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '0.08em',
            background: 'linear-gradient(180deg, var(--color-silver-light) 0%, var(--color-silver) 60%, var(--color-silver-dark) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 35px var(--color-silver-glow)',
          }}
        >
          <span className="sr-only">Mis XV</span>
          <span aria-hidden="true">
            Mis{' '}
            <CountUp
              from={1}
              to={15}
              format="roman"
              easing="expo"
              duration={2.2}
              trigger="load"
            />
          </span>
        </h1>

        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--color-silver), transparent)',
            margin: '0.25rem 0',
          }}
          aria-hidden="true"
        />

        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)',
            letterSpacing: '0.12em',
            color: 'var(--color-silver-light)',
            textTransform: 'uppercase',
          }}
        >
          Milagros Carolina Herrera
        </p>

        <p
          style={{
            fontSize: '0.9375rem',
            letterSpacing: '0.25em',
            color: 'var(--text-muted)',
            marginTop: '0.5rem',
          }}
        >
          06 . 02 . 2027
        </p>
      </div>

      <a
        href="#mensaje"
        aria-label="Desplazarse hacia abajo al mensaje"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          color: 'var(--color-silver-dark)',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '44px',
          minHeight: '44px',
          padding: '0.5rem 1rem',
          gap: '0.35rem',
          opacity: 0.85,
          borderRadius: 'var(--radius-sm)',
          transition: 'color 0.25s ease, opacity 0.25s ease',
        }}
      >
        <span>Descubrir</span>
        <span aria-hidden="true" style={{ fontSize: '1.125rem', animation: 'bounce 2s infinite ease-in-out' }}>
          ↓
        </span>
      </a>
    </header>
  )
}
