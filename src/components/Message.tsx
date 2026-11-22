import styles from "./Message.module.css";

export default function Message() {
  return (
    <section
      id="mensaje"
      role="region"
      aria-label="Mensaje de bienvenida"
      className={styles.section}
    >
      <div className={styles.editorialFlow}>
          <h2 className={styles.srOnly}>Mensaje de bienvenida de Carito</h2>

          {/* Celestial heraldic divider */}
          <div className={styles.herald} aria-hidden="true">
            <span className={styles.heraldLine} />
            <span className={styles.heraldSymbol}>✦</span>
            <span className={styles.heraldLine} />
          </div>

          {/* Monumental poetic quotation */}
          <blockquote className={styles.quote}>
            <span
              className={`${styles.quoteMark} ${styles.quoteMarkStart}`}
              aria-hidden="true"
            >
              &ldquo;
            </span>
            Hay noches que se vuelven eternas en el corazón, y esta será una de
            ellas.
            <span
              className={`${styles.quoteMark} ${styles.quoteMarkEnd}`}
              aria-hidden="true"
            >
              &rdquo;
            </span>
          </blockquote>

          <div
            className={styles.quoteDivider}
            role="separator"
            aria-hidden="true"
          />

          {/* Intimate invitation letter */}
          <p className={styles.bodyText}>
            Hoy comienza uno de los capítulos más lindos de mi historia, y
            quiero compartirlo con las personas que hacen brillar mi vida. Te
            invito a ser parte de mis 15 años, una noche llena de magia, sueños
            y momentos que quedarán para siempre en mi memoria.
          </p>

          {/* Personal signature and authorship */}
          <footer className={styles.signatureBlock}>
            <p className={styles.signOff}>Con todo mi amor,</p>
            <div className={styles.signatureIdentity}>
              <span className={styles.signatureMark} aria-hidden="true">
                ✦
              </span>
              <span className={styles.signatureName}>Carito</span>
              <span className={styles.signatureMark} aria-hidden="true">
                ✦
              </span>
            </div>
          </footer>
        </div>
    </section>
  );
}
