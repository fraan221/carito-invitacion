---
target: src/components/EventDetails.tsx
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 1
target_identity: "file:/home/fraan/Documents/Projects/carito-invitacion/src/components/EventDetails.tsx"
target_fingerprint: "sha256:090115c5caa299c85697b289382e9c7495bb91119852f7f7f35430b3639cb654"
target_path: /home/fraan/Documents/Projects/carito-invitacion/src/components/EventDetails.tsx
timestamp: 2026-11-19T00-22-55Z
slug: src-components-eventdetails-tsx
---
Method: dual-agent (A: 3f817da8-2b03-4454-9aea-fc444bd5a51a · B: e2d81f81-f207-44fa-80e7-cd377b0c3cb7)

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 4 | Feedback táctil inmediato ("¡Dirección copiada!"), transición con resplandor zafiro y anuncio accesible para lectores de pantalla. |
| 2 | Match System / Real World | 2 | Badges de llegada usan iconos de seguridad (`ShieldCheck` para estacionamiento, `Compass` para zona) que evocan compliance de SaaS y apps de tránsito en vez de hospitalidad de gala. |
| 3 | User Control and Freedom | 4 | Enlaces externos seguros (`_blank`, `noopener noreferrer`), generación local de `.ics` estándar RFC 5545 sin trampas de redirección. |
| 4 | Consistency and Standards | 1 | Quiebre espacial crítico con el resto del sistema. Mientras Hero, Message, Countdown y Closing flotan sobre el cosmos, EventDetails se encierra en una card rectangular opaca. |
| 5 | Error Prevention | 4 | Sanitización defensiva contra URLs maliciosas (`javascript:`, `data:`), normalización de strings vacíos y query de fallback automática a Google Maps. |
| 6 | Recognition Rather Than Recall | 3 | Datos esenciales (fecha, hora, salón, dirección) claros, pero 4 botones contiguos (Maps, Copiar, GCal, iCal) compiten por atención y demandan escaneo innecesario. |
| 7 | Flexibility and Efficiency | n/a | Mode experience: flujo unívoco de invitación; no aplican aceleradores ni atajos para usuarios expertos. |
| 8 | Aesthetic and Minimalist Design | 1.5 | Sobrecarga de widgets. Divisores internos cortan la tarjeta en tres micro-bloques; badges y estrellas en las 4 esquinas añaden ruido ornamental gratuito. |
| 9 | Error Recovery | 3.5 | Doble capa de copiado (Async Clipboard API + fallback `execCommand`) para webviews integrados de WhatsApp e Instagram donde el portapapeles suele fallar. |
| 10 | Help and Documentation | n/a | Mode experience: la invitación es autoexplicativa y no requiere manual de usuario. |
| **Total** | | **23/32** | **Good (71.9%)** |

---

#### Design Specificity Verdict

**Evaluación del Director (LLM Assessment)**:
Tu observación es 100% acertada: *"no me gusta que sea una card cuando casi todos los componentes del sistema estan conviviendo con el fondo, si pueden el resto, porque no puede este?"*.

El componente actual padece de un **"Síndrome de Widget de Dashboard"**. Mientras que `Hero`, `Message`, `Countdown`, `Gallery` y `Closing` respiran de forma etérea sobre el lienzo cósmico de estrellas y halos nocturnos, `EventDetails` se repliega defensivamente dentro de un búnker rectangular opaco (`.charter` con fondo degradado al 94%, borde rígido de 1px y sombra pesada `box-shadow: 0 24px 60px rgba(0,0,0,0.5)`). 

Dentro de esa caja de 600px se apiñan 4 botones interactivos, 2 badges corporativos tipo "Trust & Security", 2 líneas divisorias y 4 asteriscos ornamentales (`✦`) en las esquinas que intentan disfrazar de "celestial" a una tarjeta que en el fondo parece una vista previa de Eventbrite o un modal de reservas de hotel. El Salón BIM es el destino culminante de toda la fiesta: debe presentarse como un templo estelar integrado al cosmos, no como un ticket enlatado.

**Escaneo Determinístico (Deterministic Scan)**:
El detector de Impeccable arrojó **0 infracciones (Clean scan, exit code 0)**. A nivel de micro-reglas de código, el componente está impecablemente programado: tipografía en escala legible (mínimo 0.775rem para metadata secundaria), sombras neutras oscuras sin halos saturados, curvas de desaceleración `cubic-bezier(0.16, 1, 0.3, 1)` sin rebotes elásticos, soporte total para `prefers-reduced-motion` y targets táctiles de 44px a 48px. 

*Lección clave de la síntesis:* El escáner automatizado confirma que el código es robusto y prolijo, pero no puede detectar la desconexión macro-arquitectónica: encapsular un destino poético dentro de una tarjeta utilitaria de SaaS.

**Visual Overlays**:
No disponibles en este entorno (la sesión CLI no dispone de navegador headless con control DOM/CDP montado).

---

#### Overall Impression
La ingeniería funcional es impecable (sanitización de URLs, portapapeles resiliente en webviews de WhatsApp y generación RFC 5545 cliente), pero a nivel de experiencia estética comete el error de aislarse en una tarjeta convencional. Desmantelar la caja y dejar que la información conviva directamente con el universo estelar transformará este bloque de "trámite logístico" a una parte orgánica del viaje astronómico.

---

#### What's Working
1. **Ergonomía de copiado ultra-defensiva**: La combinación de la API moderna de portapapeles con fallback inmediato a `document.execCommand` y verificación de `isSecureContext` garantiza que ningún invitado en navegadores embebidos de WhatsApp/Instagram sufra una acción rota al intentar copiar la dirección.
2. **Generación nativa RFC 5545 para iCalendar**: Generar un archivo `.ics` estandarizado en memoria con zonas horarias precisas para usuarios de Apple Calendar sin depender de servidores externos es una decisión elegante y respetuosa de la privacidad.
3. **Resiliencia de datos y sanitización**: El bloqueo de esquemas peligrosos (`javascript:`, `data:`) y el fallback dinámico que reconstruye la búsqueda en Google Maps si falta la URL directa impiden enlaces muertos.

---

#### Priority Issues

- **[P0] Aislamiento en Card Cerrada vs. Integración Cósmica Ambiental**
  - **Qué**: El contenedor `.charter` encierra los datos en un bloque opaco con borde rígido y sombra pesada, rompiendo la continuidad espacial del fondo de estrellas.
  - **Por qué importa**: Traiciona la premisa de Carito XV ("la emoción precede a la información" y diseño sin cards genéricas). Hace que la sección se sienta como un plugin de terceros insertado a la fuerza.
  - **Fix**: **Desmantelar `.charter` por completo.** Eliminar el fondo degradado opaco, el borde plateado de 1px, el border-radius y la sombra de caja. Permitir que el canvas de estrellas y el resplandor cósmico (`radial-gradient` azul zafiro/medianoche como en `Message.module.css`) fluyan libremente a través de la sección.
  - **Comando sugerido**: `/impeccable layout`

- **[P1] Sobrecarga de Botones y "Síndrome de Widget"**
  - **Qué**: 4 botones de acción contiguos ("Cómo llegar", "Copiar dirección", "Google Calendar", "Apple / iCal") y 2 badges decorativos compiten simultáneamente.
  - **Por qué importa**: En pantallas móviles de WhatsApp, abruma al invitado con micro-decisiones técnicas (elegir formato de calendario, diferenciar mapas de copiado). Los badges (`ShieldCheck`, `Compass`) abaratan el tono pareciendo sellos de e-commerce.
  - **Fix**: 
    1. Consagrar **"Cómo llegar"** como el único botón de acción primario monumental (con reflejo plata líquida y profundidad zafiro).
    2. Convertir **"Copiar dirección"** en una microinteracción sutil integrada en el propio texto de la dirección (un tap sobre la dirección la copia con un destello estelar).
    3. Unificar el calendario en una sola acción discreta o micro-pills armonizadas.
    4. Eliminar los badges corporativos e integrar las comodidades en prosa editorial refinada (*"Salón BIM · Estacionamiento privado dentro del predio"*).
  - **Comando sugerido**: `/impeccable distill`

- **[P2] Inconsistencia en Nombre de Salón por Defecto**
  - **Qué**: En la línea 25 de `EventDetails.tsx`, `DEFAULT_VENUE` está definido como `"Salón Royal Night"`, mientras que `PRODUCT.md`, la documentación y la realidad del evento establecen `"Salón BIM"`.
  - **Por qué importa**: Si por alguna razón de renderizado fallan las props, la invitación mostraría un salón falso.
  - **Fix**: Cambiar el valor por defecto a `"Salón BIM"` en código y pruebas asociadas.
  - **Comando sugerido**: `/impeccable harden`

- **[P3] Asteriscos Ornamentales en Esquinas y Divisores Rígidos**
  - **Qué**: Los cuatro asteriscos absolutos (`.cornerMark`) y las líneas divisorias dobles (`.divider`) acentúan el perímetro de la caja.
  - **Por qué importa**: En lugar de evocar estrellas, funcionan como remaches visuales que enfatizan los límites de la card.
  - **Fix**: Remover `.cornerMark` y los divisores mecánicos. Estructurar la jerarquía mediante ritmo vertical generoso, tipografía `Cinzel` con reflejos plateados y micro-separadores etéreos.
  - **Comando sugerido**: `/impeccable polish`

---

#### Persona Red Flags

- **Jordan (64 años, familiar que abre el link desde WhatsApp en Android)**:
  - *Frustración*: Ve 4 botones juntos y duda: *"¿Tengo que tocar Apple si tengo Android? Si toco Copiar dirección, ¿dónde se guarda?"*. Pierde de vista el nombre del salón porque compite con los badges y botones.
- **Alex (17 años, compañero de colegio que va en Uber la noche del evento)**:
  - *Frustración*: Necesita pegar la dirección en Uber ya mismo mientras viaja. Debe sortear el botón de Google Maps y buscar el botón secundario más pequeño de copiado.
- **Sam (Invitado con baja visión / Modo Alto Contraste)**:
  - *Frustración*: En modo `forced-colors`, la card, los dos badges y los cuatro botones dibujan rectángulos rígidos con bordes en cada elemento, creando un laberinto visual de cajas anidadas con texto pequeño de 0.775rem.

---

#### Minor Observations
- El texto `"Recepción y fiesta · Agradecemos puntualidad"` usa `--text-muted` a 0.875rem, perdiendo presencia frente a fondos oscuros profundos.
- El botón `.btnPrimary` usa un degradado muy oscuro (`#1e3a8a` a `#0f172a`) que se mimetiza con el fondo nocturno en lugar de destacar como acción principal.
- La etiqueta en mayúsculas `"AGENDAR FECHA:"` tiene reminiscencias de formulario administrativo.

---

#### Questions to Consider
1. *¿Por qué encerrar el destino culminante de la fiesta en una tarjeta de dashboard en lugar de permitir que las coordenadas del Salón BIM floten como una constelación estelar abierta sobre el cielo nocturno?*
2. *¿Por qué forzar al invitado a elegir entre formatos técnicos (.ics vs Google Calendar) en lugar de una acción poética unificada para agendar la fecha?*
3. *¿Qué tan más natural y táctil sería si simplemente tocar la dirección la copiara al portapapeles con un destello estelar, eliminando por completo un botón redundante?*
