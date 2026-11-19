import { useState, useRef, useEffect } from "react";
import { Copy, Check, Sparkles, HeartHandshake, Gift, Heart } from "lucide-react";
import FadeContent from "./FadeContent";
import ClickSpark from "./ClickSpark";
import { submitGiftPreference } from "../api";
import type { GiftPreferenceType } from "../types";
import styles from "./Gifts.module.css";

export interface GiftsProps {
  alias?: string;
  groupCode?: string;
}

interface GiftOption {
  id: GiftPreferenceType;
  label: string;
  icon: typeof Sparkles;
}

const CELESTIAL_SPARK_COLORS: string[] = ["#f8fafc", "#e2e8f0", "#93c5fd", "#3b82f6"];

const GIFT_OPTIONS: GiftOption[] = [
  { id: "transferencia", label: "Transferencia MP", icon: Sparkles },
  { id: "efectivo", label: "Efectivo en fiesta", icon: HeartHandshake },
  { id: "fisico", label: "Regalo físico", icon: Gift },
];

export default function Gifts({
  alias = "caro.herrera.15",
  groupCode,
}: GiftsProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rawCode =
    groupCode !== undefined && groupCode !== null && groupCode !== ""
      ? groupCode
      : typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("g") ?? ""
      : "";
  const effectiveGroupCode = rawCode.trim().toLowerCase();

  const storageKey = effectiveGroupCode
    ? `carito_gift_pref_${effectiveGroupCode}`
    : "carito_gift_pref";

  const [selectedGift, setSelectedGift] = useState<GiftPreferenceType | null>(
    () => {
      if (typeof window === "undefined") return null;
      try {
        const saved = sessionStorage.getItem(storageKey);
        if (
          saved === "transferencia" ||
          saved === "efectivo" ||
          saved === "fisico"
        ) {
          return saved;
        }
      } catch {
        // Silently ignore storage access errors
      }
      return null;
    }
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleSelectOption = (option: GiftPreferenceType) => {
    if (option === selectedGift) return;

    setSelectedGift(option);
    try {
      sessionStorage.setItem(storageKey, option);
    } catch {
      // Silently ignore storage access errors
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (effectiveGroupCode) {
      debounceTimerRef.current = setTimeout(() => {
        submitGiftPreference(effectiveGroupCode, option).catch(() => {
          // Silently swallow network errors so UI remains uninterrupted
        });
      }, 300);
    }
  };

  const handleCopy = async () => {
    let success = false;
    setCopyFailed(false);

    // Modern asynchronous clipboard API
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(alias);
        success = true;
      }
    } catch {
      // Modern clipboard API blocked (common in restricted in-app mobile webviews)
      success = false;
    }

    // Resilient fallback for restricted webviews or environments
    if (!success && typeof document !== "undefined") {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = alias;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } else {
      setCopyFailed(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopyFailed(false), 3000);
    }
  };

  return (
    <section
      id="regalos"
      role="region"
      aria-label="Regalos y transferencias"
      className={styles.section}
    >
      <FadeContent
        duration={1.0}
        blur={false}
        trigger="mount"
        ease="power2.out"
      >
        <div className={styles.editorialFlow}>
          {/* Celestial heraldic divider */}
          <div className={styles.herald} aria-hidden="true">
            <span className={styles.heraldLine} />
            <span className={styles.heraldSymbol}>✦</span>
            <span className={styles.heraldLine} />
          </div>

          <h2 className={styles.title}>Regalos</h2>

          <p className={styles.description}>
            Tu presencia es mi mayor alegría y el mejor regalo para esta noche mágica.
            Si deseás hacerme un presente para acompañar mis sueños en esta nueva etapa, podés elegir la opción que prefieras:
          </p>

          {/* 3-Pill Interactive Celestial Selector */}
          <div
            className={styles.pillGroup}
            role="group"
            aria-label="Modalidad de regalo"
          >
            {GIFT_OPTIONS.map((opt) => {
              const isSelected = selectedGift === opt.id;
              const OptionIcon = opt.icon;
              return (
                <ClickSpark
                  key={opt.id}
                  sparkColor={CELESTIAL_SPARK_COLORS}
                  shape="star"
                  sparkSize={12}
                  sparkCount={6}
                  sparkRadius={28}
                  className={styles.sparkInline}
                >
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`${styles.pill} ${
                      isSelected ? styles.pillActive : ""
                    }`}
                  >
                    <span className={styles.pillContent}>
                      <OptionIcon
                        size={15}
                        className={styles.pillIcon}
                        aria-hidden="true"
                      />
                      <span className={styles.pillText}>{opt.label}</span>
                    </span>
                  </button>
                </ClickSpark>
              );
            })}
          </div>

          {/* Initial state: Guidance note */}
          {!selectedGift && (
            <p className={styles.guidanceNote}>
              Seleccioná una opción para conocer los datos de transferencia o recepción.
            </p>
          )}

          {/* Option: Transferencia MP (Reveals alias constellation) */}
          {selectedGift === "transferencia" && (
            <div className={styles.revealWrapper}>
              <div className={styles.aliasBlock}>
                <span className={styles.aliasLabel}>Alias Mercado Pago</span>

                {/* Direct touchable alias for instant mobile copying */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className={styles.aliasValueButton}
                  title="Tocar para copiar alias"
                  aria-label={`Alias: ${alias}. Tocar para copiar al portapapeles`}
                >
                  <span className={styles.aliasValue}>{alias}</span>
                </button>

                <div className={styles.reassurance}>
                  <span>Titular: Carolina Herrera</span>
                  <span className={styles.reassuranceDot} aria-hidden="true">
                    ·
                  </span>
                  <span className={styles.reassuranceEntity}>Mercado Pago</span>
                </div>

                <div className={styles.sparkWrapper}>
                  <ClickSpark
                    sparkColor={CELESTIAL_SPARK_COLORS}
                    shape="star"
                    sparkSize={14}
                    sparkCount={8}
                    sparkRadius={35}
                    className={styles.sparkInline}
                  >
                    <button
                      type="button"
                      onClick={handleCopy}
                      aria-label={copied ? "¡Alias copiado!" : "Copiar alias"}
                      className={`${styles.copyButton} ${
                        copied ? styles.copyButtonCopied : ""
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check
                            size={16}
                            className={styles.buttonIcon}
                            aria-hidden="true"
                          />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy
                            size={16}
                            className={styles.buttonIcon}
                            aria-hidden="true"
                          />
                          <span>Copiar Alias</span>
                        </>
                      )}
                    </button>
                  </ClickSpark>
                </div>

                {copyFailed && (
                  <p className={styles.copyFallbackHint} role="alert">
                    No pudimos copiar automáticamente. Mantené presionado el alias arriba para seleccionarlo.
                  </p>
                )}
              </div>

              <p className={styles.instructions}>
                Podés transferir desde cualquier banco o billetera virtual (Mercado Pago, Cuenta DNI, BNA, Santander, etc.) pegando este alias.
              </p>
            </div>
          )}

          {/* Options: Efectivo o Regalo Físico (Warm personalized message) */}
          {(selectedGift === "efectivo" || selectedGift === "fisico") && (
            <div className={styles.revealWrapper}>
              <div className={styles.confirmationNote} role="status">
                <Heart
                  size={18}
                  className={styles.confirmationIcon}
                  aria-hidden="true"
                />
                <span className={styles.confirmationText}>
                  ¡Muchas gracias por tu cariño!
                </span>
              </div>

              {selectedGift === "efectivo" ? (
                <p className={styles.instructions}>
                  Habrá un espacio especial en la recepción del salón para recibir tus
                  presentes, dedicatorias y buenos deseos.
                </p>
              ) : (
                <p className={styles.instructions}>
                  Habrá un rincón reservado en la recepción del salón para recibir
                  presentes y obsequios con mucho amor.
                </p>
              )}
            </div>
          )}

          <span className="sr-only" aria-live="polite">
            {copied
              ? `Alias ${alias} copiado al portapapeles`
              : copyFailed
              ? `No se pudo copiar automáticamente el alias ${alias}`
              : ""}
          </span>
        </div>
      </FadeContent>
    </section>
  );
}
