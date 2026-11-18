# IMPECCABLE — CARITO XV CREATIVE DIRECTION & AGENT GUIDELINES

## Default creative philosophy

Use Impeccable as the default design methodology and creative direction system for this project.

Your default design mode is **EXPERIENCE**.

You are not designing a SaaS interface or a generic wedding/quinceañera template. You are creating a personalized digital invitation that should feel like a carefully art-directed visual experience.

Think like a combination of:

- Award-winning Art Director.
- Editorial Designer.
- Motion Designer.
- Senior Product Designer.
- Creative Frontend Engineer.

---

## CRITICAL DIRECTIVE: Envelope Concept Discarded (Sobre Completamente Descartado)

> [!IMPORTANT]
> **NO ENVELOPES, CLASPS, OR UNBOXING RITUALS**: The concept of a simulated physical envelope ("sobre"), wax seal ("sello de cera"), medallion clasp, or unboxing sequence is **COMPLETELY AND PERMANENTLY DISCARDED**.
>
> - The user lands directly into the invitation experience via an immersive, cinematic Hero section.
> - Agents must **NEVER** propose, introduce, or implement an envelope component, unboxing animation, or packaging ritual.
> - The creative storytelling begins immediately with the celestial atmosphere, deep midnight cosmos, dynamic starry canvas, and refined liquid silver typography.

---

## 1. Design with artistic intention

Prioritize:

- Strong visual concepts and celestial storytelling.
- Editorial composition with generous breathing room and distinct typographic hierarchy.
- Typography with personality (`Cinzel`, `Playfair`, refined serif/sans-serif combinations).
- Thoughtful use of space and asymmetry rather than repetitive boxed cards.
- Materiality, depth, and atmospheric lighting (deep midnight blue, liquid silver, starfield particles).
- Cinematic, scroll-driven transitions orchestrated with GSAP.
- Meaningful microinteractions (haptic feedback feel, subtle hover/tap states, smooth copy-to-clipboard for bank alias).
- Distinctive visual storytelling across all sections: Hero -> Mensaje -> Cuenta Regresiva -> Detalles del Evento (Salón BIM) -> Galería -> RSVP -> Regalos -> Cierre.

Do not default to generic SaaS layouts, dashboard patterns, rounded-card grids, or standard AI-generated landing page aesthetics.

Every major visual decision should support the identity and emotional character of the event.

## 2. Freedom of visual exploration

Do not inherit Turnix-specific design rules, color systems, typography or restrictions.

Carito XV has its own visual identity.

The main event color for the dress has not been defined yet. The liquid silver accents, celestial elements, and deep midnight base are established preferences, but the final palette must remain modular and adaptable.

Explore materials, textures, lighting, and composition before committing to a final visual direction.

Do not impose artificial restrictions against shadows, gradients, depth, textures, or 3D effects. Use them only when they improve the artistic direction.

## 3. Motion is part of the storytelling

Treat motion as a design language rather than decoration.

- Use animations to establish hierarchy, reveal content, and create memorable transitions.
- Prefer deliberate sequences over excessive independent effects.
- **Hero entrance**: The entrance is a direct cinematic reveal—focus creative attention on the atmospheric emergence of the monogram, name, date, and starry background depth.
- Use GSAP and React Bits as tools, not as design substitutes. Customize components to fit the visual identity instead of copying their default appearances.
- **Performance & Accessibility**: Respect mobile performance (60fps on mid-tier mobile devices) and `prefers-reduced-motion` accessibility. Always clean up GSAP contexts (`ctx.revert()`).

## 4. Impeccable workflow

Use the available Impeccable commands intentionally:

- `shape`: explore the concept and experience before implementation.
- `craft`: build complete visual experiences with strong attention to detail.
- `overdrive`: explore ambitious art direction for selected signature moments.
- `generate`: compare visual alternatives before choosing.
- `animate`: design purposeful transitions and interactions.
- `critique`: evaluate visual hierarchy, composition, and usability.
- `polish`: refine the final visual details.
- `quieter`: reduce visual noise when necessary.

Do not execute every command mechanically. Choose the ones that fit the task.

## 5. Distinctive but usable

Artistic expression must never compromise the experience.

The invitation must remain:

- **Mobile-first**: Designed and tested primarily for mobile viewports (~375px to 430px) while scaling elegantly to desktop.
- **Easy to navigate**: Clear vertical scroll flow with anchor links or smooth navigation cues.
- **Readable & Accessible**: High contrast for functional details (dates, address, bank alias, RSVP instructions).
- **Fast to load**: Optimize assets, canvas scripts, and bundle size.
- **Simple to interact with**: Large tap targets (minimum 44x44px), instant feedback, zero friction.

The RSVP form and event logistics must prioritize clarity and reliability even when the surrounding experience is highly expressive.

## 6. Engineering & Agent Instructions

When implementing or modifying code:

1. **Tech Stack**:
   - React 19 (`react`, `react-dom`) with TypeScript.
   - Vite as bundler and dev server.
   - GSAP & ScrollTrigger for orchestrated animations.
   - CSS Modules and CSS Custom Properties (`src/styles/tokens.css`, `src/styles/global.css`).
   - Vitest + Testing Library for unit and integration testing.
   - Oxlint for linting.
   - Google Apps Script backend (`backend/Code.gs`) for RSVP validation and responses.
2. **Verification Standards**:
   - Always verify that tests pass (`pnpm test`).
   - Always run the linter (`pnpm lint`) and ensure no errors are introduced.
   - Verify that the production build succeeds (`pnpm build`).
3. **Data Integrity**:
   - Respect RSVP group code validation (`?g=CODE`) and dynamic quota enforcement.
   - Do not break existing API contracts in `src/api.ts` and `backend/Code.gs`.
