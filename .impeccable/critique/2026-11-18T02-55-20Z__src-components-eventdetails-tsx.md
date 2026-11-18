---
target: src/components/EventDetails.tsx
total_score: 39
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 0
target_identity: "file:/home/fraan/Documents/Projects/carito-invitacion/src/components/EventDetails.tsx"
target_fingerprint: "sha256:332f6210fe5584e392782dc2ea4ba01341c3542a96a02aa7a61ac33b27a91462"
target_path: /home/fraan/Documents/Projects/carito-invitacion/src/components/EventDetails.tsx
timestamp: 2026-11-18T02-55-20Z
slug: src-components-eventdetails-tsx
---
# Design Critique: src/components/EventDetails.tsx

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|:---:|---|
| 1 | Visibility of System Status | 4/4 | Feedback táctil inmediato en copiado (icono, texto, pulso zafiro, anuncio aria-live y temporizador de 2.5s). |
| 2 | Match Between System and Real World | 4/4 | Lenguaje natural y cálido en contexto rioplatense ("Recepción y fiesta · Agradecemos puntualidad"); sin jerga técnica como `.ics` en UI visible. |
| 3 | User Control and Freedom | 4/4 | Total autonomía de navegación: Google Maps, copiado de dirección en 1 toque para Uber/Cabify/Waze, Google Calendar y Apple Calendar. |
| 4 | Consistency and Standards | 4/4 | Adherencia estricta a tokens de diseño (`tokens.css`), landmarks semánticos HTML5 y zonas de contacto >= 44px. |
| 5 | Error Prevention | 4/4 | Normalización defensiva de props vacías, sanitización estricta de protocolos URL, generación RFC 5545 y fallback dual de portapapeles. |
| 6 | Recognition Rather Than Recall | 4/4 | Todos los datos logísticos clave (fecha, horarios, dirección, partido de Florencio Varela, estacionamiento) visibles simultáneamente. |
| 7 | Flexibility and Efficiency of Use | 4/4 | Jerarquía de acciones en dos niveles: botones de tránsito inmediato vs pastillas compactas para agendar con anticipación. |
| 8 | Aesthetic and Minimalist Design | 4/4 | Elegancia celestial de alta costura; cero ruido decorativo que compita con la legibilidad; balance armonioso entre Cinzel y Plus Jakarta Sans. |
| 9 | Help Users Recognize, Diagnose, Recover | 3/4 | Si el acceso al portapapeles fuese bloqueado a nivel sistema en navegadores integrados muy restrictivos, la dirección permanece directamente seleccionable arriba. |
| 10 | Help and Documentation | 4/4 | Pistas contextuales integradas ("Estacionamiento privado", "Zona Sur · Buenos Aires", "Agradecemos puntualidad") resuelven dudas antes de viajar. |
| **Total** | | **39/40** | **Excellent (97.5%)** |

---

### Design Specificity Verdict

**LLM Assessment**:
La transformación de `EventDetails` ha sido rotunda. El componente ha abandonado por completo el "Síndrome de Tarjeta SaaS" y se ha erigido como una auténtica **Carta Magna Celestial** ("La Cita Bajo las Estrellas"), perfectamente enraizada en la identidad de los 15 de Carito:
- **Estructura ceremonial**: La deconstrucción de la caja uniforme de 520px hacia un pliego astral de 600px con filetes en plata líquida, marcas astrales de esquina (`✦`) y un haz de luz superior continuo aporta sofisticación editorial.
- **Narrativa visual articulada**: El flujo desciende naturalmente desde el heraldo temporal monumental en `Cinzel` (`Sábado 6 de Febrero de 2027`), pasando por la geolocalización física asistida por insignias de arribo ("Estacionamiento privado", "Recepción & Fiesta"), hasta rematar en utilidades prácticas depuradas.
- **Disciplina cromática**: La confirmación de copiado en zafiro celestial de medianoche (`rgba(30, 58, 138, 0.95)`) con resplandor en plata líquida erradica la discordancia del verde neón previo y consolida la inmersión nocturna.

**Deterministic Scan**:
- **Escaneo directo de `EventDetails.tsx`**: 0 violaciones, 0 advertencias (Exit Code 0).
- **Escaneo directo de `EventDetails.module.css`**: 0 violaciones, 0 advertencias (Exit Code 0).
- Antipatrones auditados:
  - `dark-glow`: **Limpio (0 casos)**. Todas las sombras emplean elevaciones neutras con offset y biseles plateados interiores.
  - `gradient-text`: **Limpio (0 casos)**.
  - `ai-color-palette`: **Limpio (0 casos)**.
  - `nested-cards`: **Limpio (0 casos)**.
  - `copypop`: **Armónico**. Feedback migrado a zafiro estelar.

**Visual Overlays**:
El overlay visual en navegador fue omitido con señal de fallback formal (`BROWSER_MUTATION_UNAVAILABLE`), dado que no se cuenta con automatización interactiva de navegador o puente CDP en este entorno.

---

### Overall Impression
Una metamorfosis sobresaliente. `EventDetails` pasó de ser una tarjeta administrativa genérica a una pieza insignia de la invitación: un decreto celestial que resuelve la logística con solvencia técnica, calidez humana y una estética de alta costura.

---

### What's Working
1. **Logística adaptada a la realidad local**: La combinación de "Cómo llegar" junto a "Copiar dirección" (especialmente pensada para conductores y apps de transporte como Uber, Cabify o Waze) atiende con empatía los hábitos reales de los invitados en el Gran Buenos Aires.
2. **Insignias de tranquilidad física**: La inclusión de *Estacionamiento privado* y *Zona Sur · Buenos Aires* con iconografía sutil despeja de inmediato las ansiedades de seguridad y acceso nocturno.
3. **Resiliencia técnica y accesibilidad intachables**: Zonas de contacto de 44–48px, sanitización URL contra XSS, fallback dual de portapapeles, compatibilidad total con `prefers-reduced-motion` y `forced-colors`.

---

### Priority Issues
No se registran problemas bloqueantes (P0, P1 ni P2). Se identifican únicamente 2 detalles menores de mantenibilidad:

#### [P3] Gradiente de Botón Primario con Valores Hexadecimales
- **Por qué importa**: `.btnPrimary` define `linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)` con colores directos en vez de variables de token (`var(--color-primary)` y `var(--color-primary-dark)`).
- **Solución**: Enlazar los tokens CSS para facilitar la futura personalización del color del vestido.
- **Comando sugerido**: `/impeccable polish`

#### [P3] Encapsulación de Insignias de Arribo
- **Por qué importa**: En resoluciones de escritorio, `.badgesList` compensa el ancho del icono con un padding izquierdo de `3.875rem`.
- **Solución**: Mover `.badgesList` dentro de `.venueMeta` para una alineación estructuralmente intrínseca.
- **Comando sugerido**: `/impeccable polish`

---

### Persona Red Flags
- **Jordan (Adulto mayor / 68 años vía WhatsApp)**: **APROBADO**. Tipografía de alto contraste sobre fondo oscuro, nombre del salón y dirección claros, botón amplio de 48px y la tranquilidad explícita del estacionamiento privado.
- **Sam (Lector de pantalla / Reducción de movimiento)**: **APROBADO**. Región semántica bien rotulada, glifos decorativos con `aria-hidden="true"`, anuncio claro de copiado vía `aria-live="polite"` y desactivación total de animaciones.
- **Alex (Invitado en viaje en taxi o auto)**: **APROBADO**. Acciones principales alcanzables con un solo toque; copiado instantáneo sin navegación por menús.

---

### Minor Observations
- La configuración de `FadeContent` con `trigger="mount"` sincroniza la animación de forma limpia con el ScrollTrigger orquestado en `App.tsx`.
- La generación de iCalendar (.ics) RFC 5545 es 100% autónoma en el cliente sin librerías pesadas externas.

---

### Questions to Consider
1. *¿Deseas conectar inmediatamente las variables `--color-primary` en `.btnPrimary` para que el eventual cambio del color del vestido modifique también este componente con un solo cambio de token?*
2. *¿Consideras necesario agregar un enlace directo específico a Waze, o la opción universal de "Copiar dirección" ya cubre de forma óptima a todas las aplicaciones de navegación?*
