import { useState, useEffect, useCallback, useMemo } from 'react'
import DepthCarousel, { type DepthCarouselItem } from './DepthCarousel'
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
  const [currentSlide, setCurrentSlide] = useState(0)

  // Map to DepthCarousel format
  const carouselItems: DepthCarouselItem[] = useMemo(
    () =>
      photos.map((photo) => ({
        image: photo.src,
        alt: photo.alt,
      })),
    [photos]
  )

  const openLightbox = (_item: { image: string; alt?: string }, index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const nextPhoto = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev! + 1) % photos.length)
  }, [lightboxIndex, photos.length])

  const prevPhoto = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev! - 1 + photos.length) % photos.length)
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

        <h2 className={styles.title}>Constelación de Recuerdos</h2>
        <p className={styles.subtitle}>
          Un recorrido visual por instantes que marcaron mi camino hasta esta noche mágica.
        </p>

        <div className={styles.carouselWrapper}>
          <DepthCarousel
            items={carouselItems}
            cardWidth={285}
            cardHeight={380}
            radius={18}
            depth={220}
            spread={90}
            tilt={22}
            tiltDirection="right"
            perspective={1400}
            visibleCards={4}
            falloff={0.2}
            blur={6}
            duration={700}
            ease="power3.out"
            autoplay={true}
            autoplayDelay={3600}
            loop={true}
            showControls={true}
            showIndicators={false}
            tint="#050814"
            onChange={(idx) => setCurrentSlide(idx)}
            onItemClick={openLightbox}
          />
        </div>

        <div className={styles.swipePrompt} aria-live="polite">
          <span aria-hidden="true" className={styles.swipeArrow}>‹</span>
          <span>Deslizá para explorar las fotos • {currentSlide + 1} de {photos.length}</span>
          <span aria-hidden="true" className={styles.swipeArrow}>›</span>
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
