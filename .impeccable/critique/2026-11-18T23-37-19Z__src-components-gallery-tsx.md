---
target: src/components/Gallery.tsx
total_score: 14
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:/home/fraan/Documents/Projects/carito-invitacion/src/components/Gallery.tsx"
target_fingerprint: "sha256:77fd9273659a515b3075676d3dbba86b1ec2725566da9b314d16e402c5686348"
target_path: /home/fraan/Documents/Projects/carito-invitacion/src/components/Gallery.tsx
timestamp: 2026-11-18T23-37-19Z
slug: src-components-gallery-tsx
---
### Method: dual-agent (A: 8ec8a150-e326-42e7-b6d5-40e2f3aac5a7 · B: c00a2c50-5f47-4118-afd2-5ee6e8ab0745)

#### Design Health Score
| # | Heuristic | Score | Key Issue |
|---|-----------|:---:|-----------|
| 1 | Visibility of System Status | 1 | Sin skeletons ni estados de carga; acciones tactiles inertes sin feedback visual. Doble trigger GSAP en conflicto. |
| 2 | Match System / Real World | 2 | Términos clínicos ("Galería de Fotos"). 4 modelos de stock distintas presentadas de forma ajena a Carito. |
| 3 | User Control and Freedom | 1 | Fotos callejón sin salida: sin lightbox, zoom, swipe ni apertura a resolución completa. |
| 4 | Consistency and Standards | 2 | Rompe el estándar de CSS Modules del proyecto (Message, Countdown); usa estilos inline crudos y omite captions. |
| 5 | Error Prevention | 3 | Sin fallbacks de imagen rota ante caídas de conexión móvil. |
| 6 | Recognition Rather Than Recall | 2 | Sin anclajes cronológicos o contextuales; captions tipadas en TypeScript pero ignoradas en JSX. |
| 7 | Flexibility and Efficiency | n/a | Mode: experience — Galería contemplativa en invitación digital; aceleradores para power-users no aplican. |
| 8 | Aesthetic and Minimalist Design | 2 | Grilla rígida 2x2 de tarjetas idénticas; viola la directiva del proyecto contra cajas simétricas repetitivas. |
| 9 | Error Recovery | 1 | Sin UI de reintento ni estados de error si los assets remotos fallan en carga móvil. |
| 10 | Help and Documentation | n/a | Mode: experience — Galería visual autoexplicativa; documentación sería ruido innecesario. |
| **Total** | | **14/32** | **Poor (43.8%) — Requiere rediseño visual y funcional** |

#### Design Specificity Verdict
- **LLM Assessment**: Falla de especificidad crítica. La galería actual es un wireframe genérico intercambiable con cualquier blog o plantilla estándar. Emplea 4 fotos de stock de Unsplash con modelos adultas aleatorias atribuidas erróneamente a Carito, una grilla monótona de 4 cajas con bordes idénticos y títulos impersonales ("Recuerdos" / "Galería de Fotos") que apagan la emoción celestial de la invitación.
- **Deterministic Scan**: El detector estático de Impeccable finalizó limpio (0 violaciones, 0 advertencias primarias), validando el consumo de tokens CSS y la ausencia de patrones de sobre/cera o fuentes prohibidas. Detectó que el hover declarado en inline styles es inerte y que la prop `caption` está desaprovechada.
- **Visual Overlays**: N/A en análisis de archivo fuente aislado.

#### Overall Impression
La sección actual actúa como un valle emocional frío. Tras el Hero monumental y el emotivo mensaje de Carito, el invitado choca con una grilla estática de fotos de stock sin interacción táctil ni personalidad. Reemplazarlo por el carrusel circular 3D con las 23 fotos reales de Carito transformará esta sección en el punto culminante de la invitación.

#### What's Working
1. Estabilidad de layout (Zero Cumulative Layout Shift) gracias a `aspectRatio: '3 / 4'` y `objectFit: 'cover'`.
2. Semántica accesible base (`<section aria-label="Galería de fotos">`, `loading="lazy"`, etiquetas `alt` en español).
3. Respeto por los tokens de diseño del proyecto (`--color-silver-light`, `--bg-surface`, `--max-width-container`).

#### Priority Issues
- **[P0] Fotos de stock falsas y ruptura de identidad**: Cuatro modelos adultas de Unsplash asignadas a Carolina destruyen la intimidad y autenticidad del evento. (Comando: `/impeccable craft`)
- **[P1] Grilla monótona de tarjetas que viola la dirección celestial**: Distribución simétrica en cajas rígidas que contradice la directiva de arte de `AGENTS.md`. (Comando: `/impeccable layout`)
- **[P1] Cero interactividad táctil (sin lightbox ni gestos)**: En móviles (WhatsApp), los invitados esperan tocar para ampliar los retratos; las tarjetas actuales no responden. (Comando: `/impeccable delight`)
- **[P2] Inconsistencia arquitectónica y doble animación**: Estilos inline en vez de CSS Modules, hover inerte y conflicto entre `FadeContent` y `data-reveal`. (Comando: `/impeccable polish`)
- **[P2] Copy estéril y captions desaprovechadas**: Títulos impersonales y propiedad `caption` ignorada en el DOM. (Comando: `/impeccable clarify`)

#### Persona Red Flags
- **Alex (Power User)**: Toca una foto esperando un visor a pantalla completa o carrusel con swipe; nada responde. Sin soporte de teclado. Abandona la sección en 2 segundos.
- **Jordan (Compañera/Invitada joven en WhatsApp)**: Abre desde iPhone, ve 4 modelos desconocidas de stock, intenta hacer pellizco para zoom y se amplía toda la página. Pregunta: *"¿Esta es Carito?"*, desinflando la expectativa.
- **Marta / Abuela Sofía (Familiar mayor)**: En una pantalla de 375px las fotos son pequeñas; toca repetidamente para ver el rostro de Carito pero no se agranda. Títulos con bajo contraste.

#### Minor Observations
- Uso de `key={index}` en vez de identificadores estables.
- Falta de `object-position: center top` para evitar recortes indeseados en rostros.
- Márgenes laterales estrechos en viewports pequeños de 320px.

#### Questions to Consider
- ¿Y si la galería se presenta como una órbita celestial 3D donde los recuerdos giran en torno al universo de Carito con interacción táctil suave e inercia física?
- ¿Cómo podemos elevar este momento para que sea la cima emocional que impulse de forma natural a confirmar la asistencia en el RSVP?
