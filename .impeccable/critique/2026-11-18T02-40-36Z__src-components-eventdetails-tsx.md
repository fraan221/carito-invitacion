---
target: src/components/EventDetails.tsx
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/home/fraan/Documents/Projects/carito-invitacion/src/components/EventDetails.tsx"
target_fingerprint: "sha256:d068c894f50deb8a4a49a427d1092b7e0ea7fc8467c325996893535ea077911f"
target_path: /home/fraan/Documents/Projects/carito-invitacion/src/components/EventDetails.tsx
timestamp: 2026-11-18T02-40-36Z
slug: src-components-eventdetails-tsx
---
# Design Critique: src/components/EventDetails.tsx

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|:---:|---|
| 1 | Visibility of System Status | 3/4 | Immediate copy feedback with `aria-live`, but `.ics` via `data:` URI on mobile risks silent failure in in-app browsers. |
| 2 | Match System / Real World | 2/4 | Jargon-heavy terminology (`Apple / iCal (.ics)`) exposes file extensions instead of intuitive mental models ("iPhone / Calendario"). |
| 3 | User Control and Freedom | 3/4 | Clipboard auto-reverts cleanly; however, navigation is strictly funneled to Google Maps without alternate deep links (Waze/Cabify). |
| 4 | Consistency and Standards | 2/4 | Inconsistent token usage across sibling components and an alien neon green feedback state unaligned with celestial midnight tokens. |
| 5 | Error Prevention | 3/4 | Defensively sanitizes URLs and falls back on legacy copy methods, but lacks handling for unsupported `.ics` file handlers on Android devices. |
| 6 | Recognition Rather Than Recall | 2/4 | Physical arrival cues (facade visual, cross-streets, parking availability) are omitted, forcing guests to recall or research the venue externally. |
| 7 | Flexibility and Efficiency of Use | 3/4 | Dual "Cómo llegar" and "Copiar dirección" is functional, but lacks quick deep links for local commuter habits (Waze) and creates button clutter on mobile. |
| 8 | Aesthetic and Minimalist Design | 1/4 | 4 competing buttons/pills crammed into a 520px container with generic icon bullets creates visual noise and destroys editorial elegance. |
| 9 | Help Users Recognize, Diagnose, Recover | 2/4 | Silent catch blocks on clipboard denial leave the user stranded with no diagnostic feedback if both APIs fail. |
| 10 | Help and Documentation | 2/4 | Provides a polite punctuality note, but omits essential arrival guidance (dress code hint, parking entrance, gate details). |
| **Total** | | **23/40** | **Acceptable (57.5%)** |

---

### Design Specificity Verdict

**LLM Assessment**:
The component suffers from acute "SaaS Card Syndrome". Despite impeccable TypeScript hygiene and defensive programming, the visual and experiential presentation is category-interchangeable. The title "Cuándo y Dónde" reads like an administrative corporate calendar invite rather than the emotional crescendo of a 15th birthday celebration. The repetitive 520px glassmorphic card directly contradicts the `AGENTS.md` mandate for asymmetric editorial layouts, while the circular Lucide icon bullets evoke a generic UI kit rather than a bespoke celestial celebration. Furthermore, flashing an abrasive emerald green on copy violently disrupts the midnight navy and liquid silver palette.

**Deterministic Scan**:
- Direct scan on `src/components/EventDetails.tsx`: 0 errors, 0 warnings (Exit Code 0).
- Paired CSS bundle scan (`EventDetails.module.css`): 1 warning (`dark-glow` detected in compiled CSS at line 99 on `.detailItem:hover .itemIcon`: radial box-shadow `0 0 14px rgba(59, 130, 246, 0.25)`).
- Touch target sizes (48px primary button, 44px calendar pill) and font sizes fully comply with WCAG standards.
- Reduced motion (`prefers-reduced-motion: reduce`) and high contrast (`forced-colors: active`) are cleanly supported.

**Visual Overlays**:
No user-visible overlay is available in this environment (`BROWSER_MUTATION_UNAVAILABLE`). Interactive browser automation and CDP injection tools were not exposed by the harness.

---

### Overall Impression
`EventDetails` is technically robust and defensively engineered, but artistically timid. It reduces an 8-hour Argentine quinceañera celebration under the stars into an administrative corporate memo. The biggest opportunity is deconstructing the boxed card into an illuminated celestial charter or ticket with clear, high-contrast hierarchy for physical arrival.

---

### What's Working
1. **Defensive Clipboard & URL Sanitization**: The two-tier copy mechanism (`navigator.clipboard` with hidden textarea + `document.execCommand('copy')` fallback) and robust URL protocol sanitization ensure rock-solid stability in WhatsApp in-app webviews.
2. **Accessible Touch Targets & Reduced Motion**: Every CTA strictly adheres to the 44px–48px ergonomic touch floor, backed by complete `prefers-reduced-motion` and `forced-colors` stylesheets.
3. **Screen Reader Status Announcements**: Dynamic `aria-live="polite"` region alerts screen reader users when the venue address has been copied.

---

### Priority Issues

#### [P1] The "SaaS Card Syndrome" & Administrative Tone
- **Why it matters**: Violates the creative direction (`AGENTS.md`) by stacking yet another boxed 520px container. "Cuándo y Dónde" flattens the anticipation of a once-in-a-lifetime night.
- **Fix**: Break out of the box into an asymmetric editorial layout. Elevate the date with monumental Roman/Cinzel typography ("06 · FEBRERO · 2027"), frame with liquid silver hairline rules, and adopt an evocative title like "La Cita Bajo las Estrellas".
- **Suggested command**: `/impeccable shape`

#### [P1] Four-CTA Action Overload & Calendar Jargon
- **Why it matters**: 4 competing buttons create mobile cognitive friction. Exposing file extensions like `.ics` and "iCal" confuses non-technical guests (grandparents, younger cousins).
- **Fix**: Streamline into a unified hero CTA ("Cómo llegar") with an inline quick-copy icon for the address. Consolidate calendar options into an elegant single trigger or plain-language pills ("Google Calendar" / "Apple Calendar") without technical file extensions.
- **Suggested command**: `/impeccable distill`

#### [P2] Discordant Neon Green Copy Feedback
- **Why it matters**: When copied, the button flashes bright emerald green (`#86efac`, `rgba(34, 197, 94, 0.35)`), creating a jarring chromatic clash with the midnight blue and liquid silver aesthetic.
- **Fix**: Harmonize the success state into the celestial palette: deep starlight sapphire background, liquid silver border glow (`var(--border-silver)`), and a starlight checkmark.
- **Suggested command**: `/impeccable colorize`

#### [P2] Buried Address & Lack of Physical Arrival Cues
- **Why it matters**: For a guest riding in an Uber or car down Camino General Belgrano on a dark Saturday night, the venue name and street address are the most vital data points. Currently, the address is relegated to secondary muted text (`0.875rem`, `var(--text-muted)`).
- **Fix**: Elevate the venue name ("Salón BIM") and address ("Cno. Gral. Belgrano 5599") to prominent display hierarchy. Add arrival badges (e.g., "Estacionamiento privado", "Recepción 21:00 hs").
- **Suggested command**: `/impeccable typeset`

---

### Persona Red Flags
- **Jordan (Elderly Relative via WhatsApp)**: Taps `Apple / iCal (.ics)` from an Android phone, downloading an unhandled `.ics` file that triggers a "No app found to open file" error. Taps "Copiar dirección" and is bewildered when no map opens, unsure where the copied text went.
- **Sam (Accessibility-Dependent / User under Daylight)**: Outdoors under daylight, secondary muted text (`#94a3b8` on dark navy) washes out. Screen reader reads a cryptic raw data URI when downloading the calendar file.
- **Alex (Impatient Guest in a Moving Car)**: Needs the address instantly while en route. The street address is small and muted beneath the venue name, and there is no direct one-tap deep link for Waze or ridesharing.

---

### Minor Observations
- **Competing Animations**: `EventDetails` wraps its card in `<FadeContent blur={10}>`, while `App.tsx` simultaneously wraps it in `<div data-reveal>` with GSAP ScrollTrigger, causing redundant animation passes.
- **AI-Template Glow Tell**: `.itemIcon:hover` uses a zero-offset radial blue blur (`box-shadow: 0 0 14px rgba(59, 130, 246, 0.25)`), triggering the detector's `dark-glow` antipattern.
- **Timezone Safety in ICS**: The generated `.ics` specifies UTC timestamps (`20270207T000000Z`) without an explicit `VTIMEZONE` block for `America/Argentina/Buenos_Aires`.

---

### Questions to Consider
1. What if this section discarded the "card" entirely and became an illuminated Celestial Charter or Invitation Ticket with silver guilloche borders and Roman date numerals?
2. Can the component feature an "En Camino" (Night-of-Event) mode that elevates the address, Waze link, and parking instructions when accessed on the day of the party?
3. How might we visually represent Salón BIM through an elegant architectural line sketch or celestial coordinates rather than a generic Google Maps pin?
