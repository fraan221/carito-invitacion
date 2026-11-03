import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StarryBackground from './components/StarryBackground'
import Hero from './components/Hero'
import Message from './components/Message'
import Countdown from './components/Countdown'
import EventDetails from './components/EventDetails'
import Gallery from './components/Gallery'
import RSVP from './components/RSVP'
import Gifts from './components/Gifts'
import Closing from './components/Closing'
import styles from './App.module.css'

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // shortcut: GSAP ScrollTrigger skips animations when prefers-reduced-motion is active, upgrade if fallback fades are needed
    if (typeof window === 'undefined') return
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const sections = containerRef.current?.querySelectorAll<HTMLElement>('[data-reveal]')
      sections?.forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 28,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      })
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.appContainer}>
      <StarryBackground />
      <Hero />
      <div data-reveal>
        <Message />
      </div>
      <div data-reveal>
        <Countdown />
      </div>
      <div data-reveal>
        <EventDetails />
      </div>
      <div data-reveal>
        <Gallery />
      </div>
      <div data-reveal>
        <RSVP />
      </div>
      <div data-reveal>
        <Gifts />
      </div>
      <div data-reveal>
        <Closing />
      </div>
    </div>
  )
}
