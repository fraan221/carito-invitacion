import Galaxy from './Galaxy'
import styles from './StarryBackground.module.css'

export default function StarryBackground() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <Galaxy
        density={2.75}
        glowIntensity={0.35}
        flareIntensity={1}
        starSpeed={0.5}
        mouseRepulsion={false}
        clickWarp={false}
        starColors={['#f8fafc', '#e2e8f0', '#cbd5e1', '#60a5fa']}
        hueShift={100}
        direction="backward"
        mouseInteraction={false}
        repulsionStrength={0}
        transparent={true}
        className={styles.galaxy}
      />
    </div>
  )
}
