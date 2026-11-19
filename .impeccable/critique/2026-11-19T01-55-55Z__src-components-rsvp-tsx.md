---
target: src/components/RSVP.tsx
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 1
target_identity: "file:/home/fraan/Documents/Projects/carito-invitacion/src/components/RSVP.tsx"
target_fingerprint: "sha256:7fe58f198c062bc9ef5087f0a115c19d55112eb5a25889ac253e3595dde70e93"
target_path: /home/fraan/Documents/Projects/carito-invitacion/src/components/RSVP.tsx
timestamp: 2026-11-19T01-55-55Z
slug: src-components-rsvp-tsx
---
# Post-Implementation Critique: src/components/RSVP.tsx

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 3 | Estado de carga y feedback claros, pero spinner CSS genérico y transiciones abruptas. |
| 2 | Match System / Real World | 2 | Metáforas visuales transaccionales (toggles de configuración SaaS, badge de recibo) en lugar de una invitación de gala. |
| 3 | User Control and Freedom | 4 | Excelente: permite modificar la respuesta sin fricción gracias a `sessionStorage` y "Modificar respuesta". |
| 4 | Consistency and Standards | 1 | **Falla crítica de consistencia interna**: es el único componente encerrado en una card rígida mientras el resto (`EventDetails`, `Gifts`, `Message`, `Closing`) respira en flujo editorial abierto. |
| 5 | Error Prevention | 3 | Límite dinámico por `maxPersonas` previene cupos de más; el campo de acompañantes es texto libre no estructurado. |
| 6 | Recognition Rather Than Recall | 3 | Campos y etiquetas claros; persiste y recuerda la confirmación previa. |
| 7 | Flexibility and Efficiency | n/a | *Mode `experience`*: Formulario para invitados ocasionales; no aplican atajos de usuario experto. |
| 8 | Aesthetic and Minimalist Design | 1 | Contenedor `.card` opaco con borde gris, halos de neón (`dark-glow`) y badge circular que tapan el lienzo estelar Three.js. |
| 9 | Error Recovery | 3 | Errores del backend se informan claramente con reintento, aunque en una caja roja típica de alerta de sistema. |
| 10 | Help and Documentation | n/a | *Mode `experience`*: Flujo autoexplicativo y directo. |
| **Total** | | **20 / 32** | **Acceptable (62.5%)** |

## Design Specificity Verdict

- **LLM Assessment**: **Incongruencia entre Experiencia Celestial y Widget Transaccional**. Mientras el resto de la invitación (`Hero`, `Message`, `Countdown`, `EventDetails`, `Gifts`, `Closing`) abraza un flujo editorial etéreo sobre el cosmos con auras radiales y heráldica de plata líquida, `RSVP.tsx` sigue enclaustrado en un contenedor `.card` tipo panel de configuración o formulario de soporte SaaS.
- **Deterministic Scan**: El escáner estático arrojó 0 errores en regex plano, pero el análisis del bundle detectó `dark-glow` (`box-shadow: 0 0 16px/20px #3b82f659`) en botones y focos, `nested-cards` por el wrapper `.card` que ocluye el canvas Three.js, `icon-tile-stack` en el badge circular superior, y múltiples estilos inline en el TSX.
- **Visual Overlays**: Omitidos de forma segura debido a timeout en headless browser sobre el canvas Three.js en entorno local.

## Overall Impression

El núcleo funcional del componente es intachable (validación de cupos con Google Sheets, lectura de `?g=`, persistencia en sesión y control condicional de acompañantes). Sin embargo, a nivel sensorial se produce un efecto "freno de mano": el invitado viene flotando a través de un universo cinematográfico abierto y de pronto choca contra una tarjeta grisácea con un icono corporativo y botones de formulario administrativo.

## What's Working

1. **Gestión Dinámica de Cupos por Grupo**: La integración de `validateGroup(code)` con `maxPersonas` restringe el selector con elegancia matemática, evitando sobrecargas de invitados.
2. **Control y Libertad del Usuario**: La persistencia en `sessionStorage` evita envíos duplicados pero ofrece un botón de "Modificar respuesta" inmediato y sin bloqueos.
3. **Divulgación Progresiva Simple**: Si el invitado elige "No podré asistir", los campos de cantidad y acompañantes desaparecen de inmediato sin saturar la pantalla.

## Priority Issues

### [P0] Contenedor `.card` rígido que ocluye y rompe la continuidad del fondo cósmico Three.js
- **Qué**: `RSVP.tsx` está envuelto en una `.card` con fondo `var(--bg-surface)`, borde gris de 1px y sombra pesada.
- **Por qué importa**: Viola directamente la directiva de `AGENTS.md` ("Thoughtful use of space and asymmetry rather than repetitive boxed cards"). Es el único componente que no se fusiona con el fondo cósmico; corta abruptamente la visión de las estrellas que sí fluyen en `EventDetails`, `Gifts` y `Closing`.
- **Solución**: Reemplazar `.card` por `.editorialFlow` con el aura atmosférica radial característica (`.editorialFlow::before`), permitiendo que el polvo de estrellas y las partículas fluyan por detrás del formulario.
- **Comando sugerido**: `/impeccable layout` o `/impeccable craft`.

### [P1] Badge circular de icono (`.headerIcon`) rompe la heráldica celestial
- **Qué**: Cabecera con círculo de 48x48px con `HeartHandshake` celeste.
- **Por qué importa**: Es un patrón típico de landing page B2B. Desentona con la línea heráldica (`.herald` con líneas en gradiente y símbolo `✦`) usada con consistencia en `Message`, `Countdown`, `EventDetails` y `Gifts`.
- **Solución**: Sustituir el badge circular por la heráldica celestial unificada (`— ✦ —`), alineando la identidad visual con sus componentes hermanos.
- **Comando sugerido**: `/impeccable polish`.

### [P2] Halos de neón (`dark-glow`) y colores de utilidad tipo SaaS
- **Qué**: Sombras desenfocadas de radio cero con color azul eléctrico (`box-shadow: 0 0 16px/20px var(--color-primary-glow)`), además de verde `#86efac` y rojo `#fca5a5` planos en estados de éxito y error.
- **Por qué importa**: Los halos fluorescentes son un arquetipo genérico de IA en temas oscuros, y los colores de alerta planos parecen sacados de un carrito de compras.
- **Solución**: Usar elevación física sutil o resplandor de plata líquida (`--color-silver-glow`). Transformar el feedback de éxito en un sello estelar plateado/aurora cósmica y el error en un tono rosa/ámbar astral contenido.
- **Comando sugerido**: `/impeccable colorize` o `/impeccable polish`.

### [P3] Controles de formulario administrativos y botones segmentados
- **Qué**: Inputs con fondo sólido oscuro (`--bg-deep`) y bordes rígidos; el selector de asistencia parece un control segmentado de sistema operativo.
- **Por qué importa**: Transmite una sensación de trámite burocrático en lugar de la emoción de confirmar asistencia a una fiesta de 15.
- **Solución**: Diseñar campos etéreos semi-traslúcidos con bordes ultrafinos en plata líquida y focos iluminados por polvo estelar. Botones de asistencia en forma de cápsulas astrales táctiles.
- **Comando sugerido**: `/impeccable craft`.

### [P4] Mensaje de código inválido punitivo y frío
- **Qué**: Texto *"No te encontramos en la lista de invitados, pero gracias por tu interés. Esta sección está reservada para los invitados..."*.
- **Por qué importa**: Suena a mensaje de error HTTP 403 Forbidden. Si a un familiar se le reenvió un enlace que perdió el `?g=`, se sentirá excluido o rechazado.
- **Solución**: Redactar con calidez y hospitalidad celestial, guiando con empatía al invitado a abrir el enlace directo de WhatsApp.
- **Comando sugerido**: `/impeccable clarify`.

## Persona Walkthrough

- **Jordan (15 años, amiga en móvil)**: Llega emocionada tras ver la galería y la cuenta regresiva. Al tocar RSVP, siente que entró a un formulario de inscripción escolar; el contenedor card le reduce el ancho útil y el checkmark verde le parece de app bancaria.
- **Tía Marta (58 años, invitada con enlace reenviado sin `?g=`)**: Al llegar al RSVP ve un cartel gris que dice que no la encuentran en la lista y se angustia pensando que no está invitada.
- **Lucas (Familia con 4 cupos asignados)**: Al seleccionar "3 personas", aparece un campo libre de acompañantes sin pistas sobre si debe poner nombres completos o dietas. Al confirmar, no le queda un resumen de los nombres registrados salvo que toque "Modificar respuesta".

## Minor Observations

- `FadeContent` ya envuelve la sección; al quitar la card, la aparición flotante con desenfoque (`blur={10}`) sobre el starfield Three.js será mucho más impactante.
- Hay 6 estilos inline en `RSVP.tsx` que deben migrarse a `RSVP.module.css`.
- El botón `<StarBorder>` tiene reglas de fondo en el CSS que entran en conflicto con sus propiedades intrínsecas de canvas.

## Questions to Consider

1. ¿Cómo puede el formulario de RSVP sentirse como la firma de un libro de honor celestial en lugar de un registro de base de datos?
2. ¿Por qué la confirmación debe ser un checkmark verde de recibo en lugar de una constelación de bienvenida o un sello en plata líquida?
3. Si todos los demás componentes respiran sobre el fondo Three.js, ¿por qué no permitir que los campos del RSVP floten con auras radiales idénticas a `EventDetails` y `Gifts`?
