export default function Message() {
  return (
    <section
      id="mensaje"
      aria-label="Mensaje de bienvenida"
      style={{
        padding: '5rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          margin: '0 auto',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 1.75rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '1.25rem',
            color: 'var(--color-silver)',
            marginBottom: '1rem',
          }}
          aria-hidden="true"
        >
          ✦
        </span>

        <blockquote
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.0625rem, 2.5vw, 1.25rem)',
            fontStyle: 'italic',
            lineHeight: 1.8,
            color: 'var(--color-silver-light)',
            marginBottom: '1.5rem',
          }}
        >
          &ldquo;Hay momentos en la vida que son irrepetibles, pero compartirlos con las personas que más quiero los hace inolvidables.&rdquo;
        </blockquote>

        <p
          style={{
            fontSize: '0.9375rem',
            lineHeight: 1.7,
            color: 'var(--text-muted)',
          }}
        >
          Te espero para compartir una noche llena de magia, risas y recuerdos que guardaremos para siempre.
        </p>
      </div>
    </section>
  )
}
