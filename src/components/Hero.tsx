import CountUp from './CountUp'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <header id="hero" role="banner" className={styles.hero}>
      <div className={styles.content}>
        <span className={styles.pretitle}>
          Te invito a celebrar
        </span>

        <h1 aria-label="Mis XV" className={styles.title}>
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

        <div className={styles.divider} aria-hidden="true" />

        <p className={styles.name}>
          Milagros Carolina Herrera
        </p>

        <p className={styles.date}>
          06 . 02 . 2027
        </p>
      </div>

      <a
        href="#mensaje"
        aria-label="Desplazarse hacia abajo al mensaje"
        className={styles.scrollIndicator}
      >
        <span>Descubrir</span>
        <span aria-hidden="true" className={styles.scrollArrow}>
          ↓
        </span>
      </a>
    </header>
  )
}
