import { useState } from 'react'
import { Gift, Copy, Check } from 'lucide-react'

interface GiftsProps {
  alias?: string
}

export default function Gifts({ alias = 'caro.herrera.15' }: GiftsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      // shortcut: uses navigator.clipboard directly without textarea fallback, upgrade if insecure/legacy contexts are needed
      await navigator.clipboard.writeText(alias)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silent catch if clipboard permission is denied
    }
  }

  return (
    <section
      id="regalos"
      role="region"
      aria-label="Regalos y transferencias"
      style={{
        padding: '4rem 1.5rem',
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
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid var(--border-silver)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-silver-light)',
          }}
          aria-hidden="true"
        >
          <Gift size={24} />
        </div>

        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.8125rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-silver-dark)',
            margin: 0,
          }}
        >
          Un Detalle Especial
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            color: 'var(--color-silver-light)',
            margin: 0,
          }}
        >
          Regalos
        </h2>

        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            margin: 0,
            maxWidth: '420px',
          }}
        >
          Tu presencia es el regalo más importante para mí. Si deseás hacerme un presente,
          podés colaborar mediante una transferencia a mi cuenta:
        </p>

        <div
          style={{
            width: '100%',
            background: 'var(--bg-deep)',
            border: '1px dashed var(--border-silver)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            Alias Mercado Pago
          </span>

          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-silver-light)',
              letterSpacing: '0.05em',
            }}
          >
            {alias}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? '¡Copiado!' : 'Copiar alias'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: copied ? 'var(--color-primary-dark)' : 'var(--color-primary)',
              color: 'var(--color-silver-light)',
              border: '1px solid var(--border-silver)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s, transform 0.15s',
            }}
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copiar Alias</span>
              </>
            )}
          </button>
        </div>

        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Instrucciones: Abrí tu app bancaria o billetera virtual, seleccioná transferir y pegá el alias.
        </p>
      </div>
    </section>
  )
}
