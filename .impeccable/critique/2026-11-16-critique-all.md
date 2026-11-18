---
target: all of the project
total_score: 17
max_score: 32
na_heuristics: "7, 10"
p0_count: 1
p1_count: 1
p2_count: 1
p3_count: 1
date: 2026-11-16
method: "dual-agent (A: 9b442933-1e56-4da3-bc94-3205c7cc746c · B: c86557a5-cfaf-4e53-8ffd-d9152d44d2ca)"
---

# Impeccable Critique Snapshot: Carito XV

Method: dual-agent (A: 9b442933-1e56-4da3-bc94-3205c7cc746c · B: c86557a5-cfaf-4e53-8ffd-d9152d44d2ca)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No scroll progress indicator, no active section status during navigation, and slow network validation lacks prominent feedback. |
| 2 | Match System / Real World | 2 | Hero arrival is direct (envelope concept is permanently discarded). Needs more organic celestial materiality and depth. |
| 3 | User Control and Freedom | 3 | "Modificar respuesta" in RSVP works well; smooth scrolling is present, but guests lack one-tap section jumping. |
| 4 | Consistency and Standards | 2 | Conflicting styling approaches (inline gradients in EventDetails vs CSS module classes vs inline styles); uncoordinated type clamps. |
| 5 | Error Prevention | 3 | Form limits max companion count by group quota; required fields enforced. |
| 6 | Recognition Rather Than Recall | 2 | Crucial event date, time, and address vanish as soon as the guest scrolls to RSVP or Gifts; requires manual scrolling to review. |
| 7 | Flexibility and Efficiency | n/a | Mode: Experience. Single-event luxury invitation designed for general guests; power-user shortcuts are non-applicable. |
| 8 | Aesthetic and Minimalist Design | 2 | Clean, but falls into the generic card-stack template anti-pattern warned against in AGENTS.md. Lacks cosmic depth, celestial light caustics, and silver materiality. |
| 9 | Error Recovery | 2 | Missing manual code entry field when navigating without `?g=CODE`; error state provides no recovery path. |
| 10 | Help and Documentation | n/a | Mode: Experience. An invitation experience must be self-evident without manuals or FAQ blocks. |
| **Total** | | **17/32** | **Acceptable (53.1%)** |

## Design Specificity Verdict

- **LLM Assessment (Assessment A):** The interface is currently **unanchored and interchangeable**. If the title is changed from "Mis XV Milagros Carolina" to any generic party, nothing in the structure or art direction distinguishes it. The five identical centered cards (`520px` width, `24px` radius, dark blue glassmorphism) feel like an MVP card-stack rather than an art-directed luxury editorial experience. The entrance is direct (the physical envelope concept is completely discarded), but it needs richer celestial depth, refined typography, and organic compositions.
- **Deterministic Scan (Assessment B):** 
  - Lint: 0 errors, 1 warning (`react(set-state-in-effect)` in `RSVP.tsx:35`).
  - Tests: 9/9 test suites passing (49/49 tests).
  - TypeScript: 0 compilation errors.
  - Core Bug Uncovered: Critical CSS nested scroll container defect in `src/styles/global.css` and `src/App.module.css`. Setting `overflow-x: hidden` forces `overflow-y: auto`, creating two parallel vertical scrollbars on the right rail.
- **Visual Overlays:** Deterministic scan and CSS box calculations verified locally. Live server overlay was not injected into production markup to avoid modifying runtime assets.

## Overall Impression
The foundation is stable and performant, with clean unit tests and robust API integration. However, experientially it is a standard marketing card-stack rather than the cinematic, immersive experience outlined in the project vision. The "double bar for navigation" reported by the user is a confirmed CSS bug where two vertical scrollbars appear simultaneously, coupled with the lack of a real floating navigation bar.

## What's Working
1. **Motion Accessibility:** Strict adherence to `prefers-reduced-motion` in GSAP, CSS, and the Canvas starry loop.
2. **Color Contrast & Readability:** Text tokens (`#94a3b8` and `#f8fafc`) maintain high contrast (7.2:1 to 9.9:1) against dark backgrounds, exceeding WCAG AAA standards.
3. **RSVP Logic & Validation:** Seamless group quota enforcement and clear submit/edit states.

## Priority Issues

### [P0] Double Scrollbar & Nested Scroll Containers (The User Feedback Bug)
- **What:** Both `body` (`global.css`) and `.appContainer` (`App.module.css`) declare `min-height: 100vh; overflow-x: hidden;`. Under CSS Overflow Module Level 3 (§3.3), `overflow-x: hidden` computes `overflow-y` to `auto`. Because `.appContainer` wraps 3500px of content, both `.appContainer` and `body` act as independent scroll containers, rendering two vertical scrollbars side-by-side on desktop/WebViews and freezing mobile browser chrome.
- **Why it matters:** Directly explains the user feedback. Confuses navigation, creates layout jitter, and degrades perceived quality.
- **Fix:** Remove `overflow-x: hidden` and `min-height: 100vh` from `.appContainer`; apply `overflow-x: clip` to `html, body`; adjust canvas width from `100vw` to `100%`.
- **Suggested command:** `/impeccable polish` or `/impeccable layout`

### [P1] Missing Signature Depth & Generic Card-Stack Anti-Pattern
- **What:** The app starts directly on the Hero (as intended, envelope concept is completely discarded), but it quickly falls into 5 identical glass cards.
- **Why it matters:** Fails the core creative philosophy of Carito XV. The invitation feels like a generic template rather than an emotional, art-directed keepsake.
- **Fix:** Break up the card monotony with editorial layouts, asymmetrical breathing room, dynamic typographic scale, and authentic photography framing.
- **Suggested command:** `/impeccable overdrive` or `/impeccable craft`

### [P2] Inflexible RSVP Fallback & Rejection Copy
- **What:** Accessing the site without a `?g=CODE` parameter displays a cold rejection message ("No te encontramos en la lista de invitados...") with no input field to manually enter a code.
- **Why it matters:** Guests opening links from forwarded messages, group chats, or Instagram/WhatsApp bios are locked out and alarmed. Violates PRODUCT.md's requirement for manual pass-code input.
- **Fix:** Add a manual code input box in the fallback view, and soften the copy to be warm, hospitable, and guiding.
- **Suggested command:** `/impeccable clarify` or `/impeccable harden`

### [P3] Absence of Floating Navigation Dock & Calendar Integration
- **What:** There is no persistent navigation dock to jump between key sections (Ubicación, RSVP, Regalos), and `EventDetails` lacks an "Agendar Evento" button for Google Calendar / Apple Calendar (.ics).
- **Why it matters:** Forces guests to manually drag through 7 long screens; guests forget to save the date to their personal calendar.
- **Fix:** Add an "Agendar en Calendario" button (Google Calendar URL + `.ics` download) and a floating, minimalist celestial navigation pill.
- **Suggested command:** `/impeccable craft` or `/impeccable layout`

## Persona Red Flags
- **Alex (Power User / Teen Friend):** Trapped in long manual scrolling to find the address; double scrollbar glitch is immediately noticeable on desktop.
- **Jordan (First-Timer / Elder Aunt):** Gets forwarded a link without `?g=CODE` and panics at the rejection message, believing they are excluded from the quinceañera.
- **Sam (Accessibility-Dependent User):** Nested scroll containers disrupt keyboard navigation order; "Descubrir ↓" anchor has a touch target below 44px.
- **Riley (Edge Case Tester):** Countdown cramps on 320px screens; "Copiar Alias" lacks fallback in insecure contexts; missing query parameter has no manual recovery.

## Minor Observations
- Missing `@keyframes bounce` in `Hero.tsx:108` causes the down arrow animation to be inert.
- `src/App.tsx` lacks a `<main>` landmark.
- `Closing.tsx` overrides `<footer>` with `role="region"`.
- RSVP radio toggle lacks WAI-ARIA arrow key navigation.
