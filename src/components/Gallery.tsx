interface Photo {
  src: string
  alt: string
  caption?: string
}

interface GalleryProps {
  photos?: Photo[]
}

const DEFAULT_PHOTOS: Photo[] = [
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    alt: 'Milagros Carolina en su sesión de fotos de quince',
  },
  {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    alt: 'Retrato de Carolina con detalles celestiales',
  },
  {
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    alt: 'Momento especial previo a la celebración',
  },
  {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    alt: 'Sonrisa y preparativos para los quince',
  },
]

export default function Gallery({ photos = DEFAULT_PHOTOS }: GalleryProps) {
  return (
    <section
      id="galeria"
      aria-label="Galería de fotos"
      style={{
        padding: '4rem 1.5rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width-container)',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.8125rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-silver-dark)',
            marginBottom: '0.5rem',
          }}
        >
          Recuerdos
        </p>

        <h2
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            color: 'var(--color-silver-light)',
            marginBottom: '2.5rem',
          }}
        >
          Galería de Fotos
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {photos.map((photo, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                aspectRatio: '3 / 4',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.4s ease',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
