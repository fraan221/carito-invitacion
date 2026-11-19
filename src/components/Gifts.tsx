import { useState } from "react";
import { Copy, Check } from "lucide-react";
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
}

const GIFT_OPTIONS: GiftOption[] = [
  { id: "transferencia", label: "✦ Transferencia MP" },
  { id: "efectivo", label: "✉️ Efectivo en fiesta" },
  { id: "fisico", label: "🎁 Regalo físico" },
];

export default function Gifts({
  alias = "caro.herrera.15",
  groupCode,
}: GiftsProps) {
  const [copied, setCopied] = useState(false);

  const effectiveGroupCode =
    groupCode !== undefined && groupCode !== null && groupCode !== ""
      ? groupCode
      : typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("g") ?? ""
      : "";

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

  const handleSelectOption = (option: GiftPreferenceType) => {
    setSelectedGift(option);
    try {
      sessionStorage.setItem(storageKey, option);
    } catch {
      // Silently ignore storage access errors
    }

    if (effectiveGroupCode.trim()) {
      submitGiftPreference(effectiveGroupCode, option).catch(() => {
        // Silently swallow network errors so UI remains uninterrupted
      });
    }
  };

  const handleCopy = async () => {
    let success = false;

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
      setTimeout(() => setCopied(false), 2000);
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
            Tu presencia es el regalo más importante para mí. Si deseás hacerme
            un presente, podés elegir la modalidad que prefieras:
          </p>

          {/* 3-Pill Interactive Celestial Selector */}
          <div
            className={styles.pillGroup}
            role="group"
            aria-label="Modalidad de regalo"
          >
            {GIFT_OPTIONS.map((opt) => {
              const isSelected = selectedGift === opt.id;
              return (
                <ClickSpark
                  key={opt.id}
                  sparkColor={["#f8fafc", "#e2e8f0", "#93c5fd", "#3b82f6"]}
                  shape="star"
                  sparkSize={12}
                  sparkCount={6}
                  sparkRadius={28}
                  style={{ display: "inline-flex" }}
                >
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`${styles.pill} ${
                      isSelected ? styles.pillActive : ""
                    }`}
                  >
                    <span className={styles.pillText}>{opt.label}</span>
                  </button>
                </ClickSpark>
              );
            })}
          </div>

          {/* Initial state: Guidance note */}
          {!selectedGift && (
            <p className={styles.guidanceNote}>
              Seleccioná una opción para conocer los detalles.
            </p>
          )}

          {/* Option: Transferencia MP (Reveals alias constellation) */}
          {selectedGift === "transferencia" && (
            <div className={styles.revealWrapper}>
              <div className={styles.aliasBlock}>
                <span className={styles.aliasLabel}>Alias Mercado Pago</span>

                <span className={styles.aliasValue}>{alias}</span>

                <div className={styles.reassurance}>
                  <span>Titular: Carolina Herrera</span>
                  <span className={styles.reassuranceDot} aria-hidden="true">
                    ·
                  </span>
                  <span className={styles.reassuranceEntity}>Mercado Pago</span>
                </div>

                <div className={styles.sparkWrapper}>
                  <ClickSpark
                    sparkColor={["#f8fafc", "#e2e8f0", "#93c5fd", "#3b82f6"]}
                    shape="star"
                    sparkSize={14}
                    sparkCount={8}
                    sparkRadius={35}
                    style={{
                      display: "inline-flex",
                      width: "auto",
                      height: "auto",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleCopy}
                      aria-label={copied ? "¡Copiado!" : "Copiar alias"}
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
              </div>

              <p className={styles.instructions}>
                Podés transferir desde cualquier app bancaria o billetera virtual
                pegando este alias.
              </p>
            </div>
          )}

          {/* Options: Efectivo o Regalo Físico (Confirmation message) */}
          {(selectedGift === "efectivo" || selectedGift === "fisico") && (
            <div className={styles.revealWrapper}>
              <div className={styles.confirmationNote} role="status">
                <span className={styles.confirmationIcon} aria-hidden="true">
                  ✓
                </span>
                <span className={styles.confirmationText}>
                  Preferencia registrada. ¡Muchas gracias!
                </span>
              </div>

              {selectedGift === "efectivo" ? (
                <p className={styles.instructions}>
                  Habrá un buzón especial en la recepción del salón para sobres y
                  buenos deseos.
                </p>
              ) : (
                <p className={styles.instructions}>
                  Habrá un espacio reservado en la recepción del salón para
                  recibir presentes y obsequios.
                </p>
              )}
            </div>
          )}

          <span className="sr-only" aria-live="polite">
            {copied ? `Alias ${alias} copiado al portapapeles` : ""}
          </span>
        </div>
      </FadeContent>
    </section>
  );
}
