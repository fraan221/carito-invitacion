import { useEffect, useRef } from 'react'
import styles from './StarryBackground.module.css'

interface Star {
  x: number
  y: number
  radius: number
  baseAlpha: number
  twinkle: boolean
  twinkleSpeed: number
  twinklePhase: number
  color: string
}

const STAR_COUNT = 120
const STAR_COLORS = ['#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8']

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number | null = null
    let stars: Star[] = []

    const initStars = (width: number, height: number) => {
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.5,
        baseAlpha: Math.random() * 0.6 + 0.25,
        twinkle: Math.random() < 0.35,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }))
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars(canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const prefersReducedMotion = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        const alpha = star.twinkle
          ? Math.max(0.1, Math.min(1, star.baseAlpha + Math.sin(time * 0.002 * star.twinkleSpeed * 100 + star.twinklePhase) * 0.3))
          : star.baseAlpha

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw)
      }
    }

    draw(0)

    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      role="presentation"
      aria-hidden="true"
      data-testid="starry-canvas"
    />
  )
}
