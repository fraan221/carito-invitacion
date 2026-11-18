---
target: src/components/Countdown.tsx
total_score: 15
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 1
target_identity: "file:/home/fraan/Documents/Projects/carito-invitacion/src/components/Countdown.tsx"
target_fingerprint: "sha256:32bb1a05fd5aee969e5c8370afa3ccca7f5648be2b86bd297787baaa6ab32652"
target_path: /home/fraan/Documents/Projects/carito-invitacion/src/components/Countdown.tsx
timestamp: 2026-11-18T03-48-50Z
slug: src-components-countdown-tsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Ticking seconds show it runs, but status is misleading and broken once expired (`diff <= 0`). |
| 2 | Match System / Real World | 2 | Default `targetDate = "2027-02-06T21:00:00"` lacks explicit `-03:00` timezone offset, desyncing for users outside Argentina. |
| 3 | User Control and Freedom | 3 | Informational component with passive observation; no trapped states or modal blockers. |
| 4 | Consistency and Standards | 2 | Contradicts project architecture (inline styles instead of CSS Modules) and AGENTS.md anti-SaaS rules against boxed cards. |
| 5 | Error Prevention | 2 | Silent zeroes on invalid string inputs; lack of timezone offset allows cross-timezone scheduling confusion. |
| 6 | Recognition Rather Than Recall | 2 | Omits the date ("6 de Febrero") and milestone ("Mis 15"), forcing users to recall what is being counted down to. |
| 7 | Flexibility and Efficiency | n/a | Experiential invitation countdown; shortcuts and power accelerators do not apply. |
| 8 | Aesthetic and Minimalist Design | 2 | Generic e-commerce/SaaS card grid rather than celestial editorial poetry; redundant animation layering. |
| 9 | Error Recovery | 2 | Silent zero fallback on invalid dates without graceful visual feedback. |
| 10 | Help and Documentation | n/a | Experiential invitation; contextual help documentation is not applicable. |
| **Total** | | **15/32** | **Poor (47% — Major UX/UI Overhaul Required)** |

#### Design Specificity Verdict

**LLM Assessment:**
`Countdown.tsx` currently functions as a generic e-commerce urgency timer or SaaS trial countdown masquerading behind a Cinzel serif font token. It fails the fundamental premise of `AGENTS.md` ("Thoughtful use of space and asymmetry rather than repetitive boxed cards. Do not default to generic SaaS layouts, dashboard patterns, rounded-card grids..."). The 4 identical rounded boxes with faint hairline borders (`var(--border-subtle)`) and generic drop shadows sever the visual flow of the invitation. There is no celestial storytelling, no liquid silver radiance, no starlight particle integration, and no poetic link to Carito's milestone.

**Deterministic Scan:**
The static CLI scan (`impeccable detect --json src/components/Countdown.tsx`) returned 0 direct syntax-level flags via regex. However, rendered analysis identifies clear anti-pattern signatures:
- Micro-labels set to `0.625rem` (10px), violating mobile legibility rules (rule catalog candidate: `tiny-text`).
- Symmetrical 4-box card layout with hairline borders and wide shadows (`gpt-thin-border-wide-shadow`).
- Hardcoded inline styles (`style={{ ... }}`) bypassing CSS Modules and preventing responsive breakpoint management.

**Visual Overlays & Browser Inspection:**
Full Puppeteer automated URL scanning encountered a 30-second navigation timeout on `http://localhost:4173/` due to the continuous WebGL render loop (`GalaxyCanvas` `requestAnimationFrame`) keeping the browser execution loop active. Headless Chromium DOM inspection confirmed that `<section aria-label="Cuenta regresiva">` renders properly inside `FadeContent`, but suffers from severe spatial crowding on mobile viewports.

#### Overall Impression
`Countdown.tsx` possesses solid mathematical foundations and clean lifecycle management, but aesthetically and experientially it acts as a foreign SaaS widget dropped into an otherwise celestial midnight experience. Its single biggest failure is existential: when the clock reaches zero on the night of the party, it stays frozen at `00:00:00:00` under the phrase *"Cada segundo nos acerca más"*, offering zero celebration.

#### What's Working
1. **Accurate Delta Math:** `calculateTimeRemaining()` cleanly computes time deltas using pure millisecond math, isolates modulo operations, and has clean unit test coverage in `src/components/Countdown.test.ts`.
2. **Selective Animation Control:** Setting `animate: false` on the seconds unit was a deliberate, smart choice that prevents `CountUp` from re-triggering a chaotic 2-second roll every single second.
3. **Clean Lifecycle Cleanup:** The `useEffect` timer correctly implements `clearInterval(timer)` on unmount, avoiding memory leaks and orphan background intervals.

#### Priority Issues

- **[P0] Expired State Completely Ignored in UI**
  - **Why it matters:** On the actual night of the party (the peak traffic moment when guests check their phones outside Salón BIM), the countdown renders `00 DÍAS 00 HORAS 00 MINUTOS 00 SEGUNDOS` under the phrase *"Cada segundo nos acerca más"*, creating an abandoned, broken impression.
  - **Fix:** Conditionally render an ethereal celebration state when `timeLeft.isExpired` is true (e.g. *"¡Llegó la noche soñada! Te esperamos en Salón BIM para celebrar juntos"* with a luminous silver glow).
  - **Suggested command:** `/impeccable delight`

- **[P1] Timezone Naivety in Target Date Prop**
  - **Why it matters:** The default prop `targetDate = "2027-02-06T21:00:00"` omits an explicit timezone offset (`-03:00` for ART / Buenos Aires). When parsed by browser `Date`, it defaults to local client time. Relatives viewing the invitation from Europe, the US, or neighboring countries will see a countdown that is hours ahead or behind actual event time.
  - **Fix:** Set the default prop to `"2027-02-06T21:00:00-03:00"` and enforce Argentina Standard Time offset.
  - **Suggested command:** `/impeccable harden`

- **[P2] Generic SaaS Boxed-Card Grid Violates Celestial Art Direction**
  - **Why it matters:** 4 isolated dark boxes with subtle grey borders in a rigid grid look like a checkout timer, breaking the celestial immersion established in the Hero and Message sections.
  - **Fix:** Eliminate the card containers. Transition to an editorial typographic layout with elegant liquid silver numerals, ethereal star-dust colons (`:` or celestial star markers `✦`), and a soft radial cosmic glow.
  - **Suggested command:** `/impeccable craft`

- **[P3] Mobile Layout Squeeze (375px) & Illegible 10px Micro-Labels**
  - **Why it matters:** On 375px viewports (iPhone SE/13 mini), 4 columns leave only ~56px of content width per card, cramming 3-digit numbers and shrinking unit labels to `0.625rem` (10px), which fails mobile legibility standards.
  - **Fix:** Move styles to `Countdown.module.css`. Use fluid typography (`clamp()`), ensure labels are at least `0.75rem` (12px), and provide responsive breathing room.
  - **Suggested command:** `/impeccable layout`

- **[P3] Screen Reader & Semantic Heading Omission**
  - **Why it matters:** The section header uses an unranked `<p>` tag, making it invisible to screen reader heading navigation, and presents numbers without an integrated, readable sentence.
  - **Fix:** Add a semantic heading (`<h2 className="sr-only">Cuenta regresiva</h2>`) and an off-screen descriptive string: `<p className="sr-only">Faltan {days} días, {hours} horas y {minutes} minutos para la fiesta de Carito</p>`.
  - **Suggested command:** `/impeccable clarify`

#### Persona Red Flags

- **Casey (Distracted mobile user on iPhone 13 mini, 375px):** Glances at the screen on 4G. 4 squeezed cards with 10px labels make it impossible to tell at a glance whether the third digit is minutes or seconds.
- **Jordan (Older relative / Abuela on mobile):** Cannot read the 10px uppercase labels (`SEGUNDOS`). Asks family members what the numbers mean because the section does not state the date ("6 de Febrero") anywhere.
- **Riley (Timezone / Edge-case tester in Madrid or Miami):** Opens the link from abroad; the countdown finishes hours early/late due to lack of the `-03:00` offset. Tests the link at 22:00 hs on event night and finds a frozen clock saying *"Cada segundo nos acerca más: 00 00 00 00"*.
- **Sam (Accessibility-dependent screen reader user):** Jumps from heading to heading; misses the countdown entirely because it uses an unranked `<p>` tag. When focused, the screen reader reads disconnected fragmented numbers without narrative cohesion.

#### Minor Observations
- **Triple Animation Stacking:** The component is triple-wrapped in animations: GSAP scroll reveal from `App.tsx` (`data-reveal`), GSAP blur-fade in `Countdown.tsx` (`FadeContent`), and motion-driven digit rolling in `CountUp`. This creates unnecessary rendering overhead and potential stutter on mid-tier mobile hardware.
- **2-Second Roll Lag on Minute Turnover:** When a minute turns over, `CountUp` animates over a full 2-second duration with `expo` easing, causing the number to take 2 seconds to settle down.
- **Inline Styling Inconsistency:** Every style is written inline, in stark contrast to `EventDetails.module.css` and `RSVP.module.css`.

#### Questions to Consider
1. *Why are we locking Carito's milestone into four corporate SaaS boxes when her theme is an infinite midnight sky?*
2. *When Carito and her friends open this invitation at 21:15 hs on February 6th during the party, why should the screen show a dead row of zeroes and say "Cada segundo nos acerca más"?*
3. *What if, instead of ticking numbers in cards, the countdown was an ethereal celestial alignment — silver starlight numerals floating in deep midnight with delicate astronomical markers?*
