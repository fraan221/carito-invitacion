import { useState, useEffect, useCallback, useMemo } from 'react'
import CircularCarousel, { type CircularCarouselItem } from './CircularCarousel'
import rawPhotos from '../data/photos.json'
import styles from './Gallery.module.css'

export interface Photo {
  id?: string
  src: string
  alt: string
  title?: string
  caption?: string
}

interface GalleryProps {
  photos?: Photo[]
}

const DEFAULT_PHOTOS: Photo[] = rawPhotos.map((p, index) => ({
  id: p.id || `photo-${index + 1}`,
  src: p.src,
  alt: p.alt || `Momento especial de Carolina - Mis XV`,
  title: `Recuerdo ${index + 1}`,
  caption: `Milagros Carolina • Celebración de Mis 15 Años`,
}))

export default function Gallery({ photos = DEFAULT_PHOTOS }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Map to CircularCarousel format
  const carouselItems: CircularCarouselItem[] = useMemo(
    () =>
      photos.map((photo, index) => ({
        src: photo.src,
        alt: photo.alt,
        title: photo.title || `Recuerdo ${index + 1}`,
        subtitle: photo.caption || 'Mis 15 Años',
      })),
    [photos]
  )

  const openLightbox = (_item: CircularCarouselItem, index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const nextPhoto = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => ((prev! + 1) % photos.length))
  }, [lightboxIndex, photos.length])

  const prevPhoto = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => ((prev! - 1 + photos.length) % photos.length))
  }, [lightboxIndex, photos.length])

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, closeLightbox, nextPhoto, prevPhoto])

  const activePhoto = lightboxIndex !== null ? photos[lightboxIndex] : null

  return (
    <section
      id="galeria"
      aria-label="Galería de fotos de Carolina"
      className={styles.section}
    >
      <div className={styles.container}>
        {/* Celestial heraldic divider */}
        <div className={styles.herald} aria-hidden="true">
          <span className={styles.heraldLine} />
          <span className={styles.heraldSymbol}>✦</span>
          <span className={styles.heraldLine} />
        </div>

        <p className={styles.eyebrow}>Momentos Inolvidables</p>
        <h2 className={styles.title}>Constelación de Recuerdos</h2>
        <p className={styles.subtitle}>
          Un recorrido visual por instantes que marcaron mi camino hasta esta noche mágica.
        </p>

        <div className={styles.carouselWrapper}>
          <CircularCarousel
            items={carouselItems}
            preset="cylinder"
            intro="rise"
            cardWidth={210}
            aspectRatio={0.75}
            gap={20}
            curve={1}
            tilt={-4}
            autoplay="drift"
            speed={9}
            direction="left"
            draggable={true}
            momentum={0.65}
            snap={true}
            pauseOnHover={true}
            focusOnClick={true}
            depthFade={0.6}
            innerShade={0.5}
            cornerRadius={16}
            fadeColor="var(--bg-deep)"
            captions={false}
            onItemClick={openLightbox}
          />
        </div>

        <div className={styles.swipeCues} aria-hidden="true">
          <span>‹</span>
          <span>Arrastrá para girar</span>
          <span className={styles.swipeCueDot}>✦</span>
          <span>Tocá para ampliar</span>
          <span>›</span>
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      {activePhoto && (
        <div
          className={styles.lightboxOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Visualizador de foto ampliada"
          onClick={closeLightbox}
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.lightboxCloseButton}
              onClick={closeLightbox}
              aria-label="Cerrar visualizador"
            >
              ✕
            </button>

            <button
              type="button"
              className={`${styles.lightboxNavButton} ${styles.lightboxPrev}`}
              onClick={prevPhoto}
              aria-label="Foto anterior"
            >
              ‹
            </button>

            <div className={styles.lightboxImageWrapper}>
              <img
                src={activePhoto.src}
                alt={activePhoto.alt}
                className={styles.lightboxImage}
              />
            </div>

            <button
              type="button"
              className={`${styles.lightboxNavButton} ${styles.lightboxNext}`}
              onClick={nextPhoto}
              aria-label="Foto siguiente"
            >
              ›
            </button>

            <p className={styles.lightboxCaption}>
              {activePhoto.caption || activePhoto.alt}
            </p>
            <span className={styles.lightboxCounter}>
              {(lightboxIndex ?? 0) + 1} / {photos.length}
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
