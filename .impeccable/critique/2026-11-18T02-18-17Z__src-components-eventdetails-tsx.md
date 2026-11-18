---
target: src/components/EventDetails.tsx
total_score: 26
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/home/fraan/Documents/Projects/carito-invitacion/src/components/EventDetails.tsx"
target_fingerprint: "sha256:8c1f8324143bd18dd995a1b03e1e812a72043376af7ced982bd45b37a9946be4"
target_path: /home/fraan/Documents/Projects/carito-invitacion/src/components/EventDetails.tsx
timestamp: 2026-11-18T02-18-17Z
slug: src-components-eventdetails-tsx
closed: true
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|:---:|---|
| 1 | Visibility of System Status | 3 | "Copiar dirección" tiene excelente feedback ("¡Dirección copiada!"), pero las salidas externas no tienen micro-transición. |
| 2 | Match System / Real World | 3 | La etiqueta "Apple / iCal (.ics)" filtra terminología técnica (.ics) que confunde a invitados no técnicos o abuelos. |
| 3 | User Control and Freedom | 4 | Enlaces externos seguros en nueva pestaña, descarga de .ics sin lock-in y reseteo automático del estado de copiado (2.5s). |
| 4 | Consistency and Standards | 3 | Triple repetición del icono MapPin (header, fila de dirección y botón). Dos botones de calendario con estilos idénticos pero conductas distintas (web vs descarga). |
| 5 | Error Prevention | 4 | Excelente ingeniería defensiva: sanitización de URLs maliciosas, fallbacks si faltan props y validación RFC 5545 para iCalendar. |
| 6 | Recognition Rather Than Recall | 4 | Todos los datos clave (fecha, horario, salón, dirección) visibles de un vistazo con iconos y etiquetas explícitas. |
| 7 | Flexibility and Efficiency | n/a | Experiencia contemplativa / invitación digital; no aplican atajos de usuario experto. |
| 8 | Aesthetic and Minimalist Design | 2 | **"Button farm"**: 4 botones apilados al pie de la card saturan visualmente en celular. Aún persiste la estructura rígida de caja en lugar de composición editorial abierta. |
| 9 | Help Users Recognize/Recover from Errors | 3 | Doble motor de copiado con fallback a execCommand, pero falla silenciosamente si el sandbox del navegador bloquea ambos sin mensaje de contingencia. |
| 10 | Help and Documentation | n/a | Invitación festiva auto-contenida. |
| **Total** | | **26 / 32** | **Bueno (81.25%)** |

### Design Specificity Verdict

**Evaluación LLM**: La sección dio un salto notable en calidad técnica y terminación (`harden` y `clarify`), pero en el plano visual es una **"Tarjeta de utilidad con pulido cósmico"**.
Se añadieron detalles de buen gusto como el borde de luz estelar superior (`.card::before`) y estilos limpios en CSS Modules. Sin embargo, la estructura sigue siendo una caja centrada de 540px con tres filas de tabla (icono en caja redonda + dos líneas de texto), idéntica a las demás secciones del sitio. Además, al sumar "Copiar dirección" y "Apple / iCal (.ics)", el pie de la tarjeta se convirtió en una "granja de botones" (4 botones) que en celulares ocupa casi el 50% de la altura de la tarjeta.

**Escaneo Determinista**: El detector arrojó `0 findings`. Se comprobó que el código cumple con jerarquía tipográfica sin aplanamiento, no abusa de fuentes prohibidas, no tiene rebotes elásticos y mantiene contrastes AAA en textos y bordes.

**Overlays Visuales**: Omitidos por entorno Linux headless (la app tiene canvas de estrellas y listeners continuos de GSAP que extienden el ciclo de vida de carga en Puppeteer).

### Overall Impression

Hubo un gran avance: de un puntaje de 22/32 subió a 26/32 (+4 puntos, saltando a la banda "Bueno"). La ingeniería es impecable y súper robusta. El desafío pendiente es puramente de **dirección de arte y síntesis**: limpiar el amontonamiento de los 4 botones en pantallas chicas y darle a la fecha la majestuosidad tipográfica que merece una noche de 15 años.

### What's Working

1. **Ingeniería de calendario multi-plataforma**: Generación nativa de `.ics` para Apple/Outlook combinada con Google Calendar pre-llenado.
2. **Sistema de copiado en dos niveles**: `navigator.clipboard` con fallback a `execCommand` para webviews de WhatsApp e Instagram.
3. **Accesibilidad de primer nivel**: `aria-live="polite"` para anunciar copiado, estados `:focus-visible` accesibles y contraste estricto.

### Priority Issues

- **[P1] "Button Farm" y sobrecarga cognitiva en mobile**  
  *Por qué importa*: 4 botones ("Cómo llegar", "Copiar dirección", "Google Calendar", "Apple / iCal (.ics)") se apilan en una torre vertical en pantallas de celular, ocupando la mitad de la card y generando parálisis de decisión.  
  *Solución*: Jerarquizar. "Cómo llegar" debe ser el botón primario solitario. "Copiar dirección" puede ser una acción compacta integrada a la fila de la dirección. Los calendarios deben unificarse en una sola acción inteligente ("Agendar fiesta") o desplegable sutil.  
  *Comando sugerido*: `/impeccable distill`

- **[P1] Persistencia de la estructura de tarjeta y filas de tabla**  
  *Por qué importa*: Sigue enclaustrada en un contenedor de 540px con lista tipo agenda de contactos, sufriendo de "card fatigue" frente a las demás secciones.  
  *Solución*: Abrir la composición. Darle a la fecha protagonismo monumental (`Cinzel` con números grandes y destacados en plata líquida) y al Salón BIM un tratamiento de coordenadas celestiales.  
  *Comando sugerido*: `/impeccable layout`

- **[P2] Jerga técnica en la interfaz del invitado (`.ics`)**  
  *Por qué importa*: La etiqueta "Apple / iCal (.ics)" asusta a familiares no técnicos o abuelos que no saben qué es un archivo `.ics` o temen descargar algo desconocido.  
  *Solución*: Simplificar el texto a "Apple Calendar" o "Agregar al Calendario".  
  *Comando sugerido*: `/impeccable clarify`

- **[P2] Redundancia visual (Triple icono de MapPin)**  
  *Por qué importa*: El icono de chincheta aparece tres veces en menos de 200px (emblema superior, fila de dirección y botón de mapa).  
  *Solución*: Cambiar el icono superior por un sello celestial (compás cósmico, estrellas o monograma XV) y dejar el pin solo para el mapa.  
  *Comando sugerido*: `/impeccable polish`

### Persona Red Flags

- **Jordan (Abuelo / Familiar mayor en WhatsApp)**: Ve 4 botones juntos y se marea. Lee ".ics" y le da miedo tocarlo por si le descarga un virus o le rompe el celular.
- **Martina (Adolescente en iPhone SE / pantalla angosta)**: Los 4 botones apilados le tapan la pantalla y tiene que hacer scroll de más para ver la dirección completa.
- **Sam (Usuario con teclado)**: Tiene que pulsar Tab cuatro veces consecutivas solo para cruzar el área de botones del evento.

### Minor Observations

- El heading `"Cuándo y Dónde"` está como `<h2>`, pero el sub-encabezado de calendario `"Agendar fiesta en tu calendario"` está como un `<p>` en vez de un `<h3 class="srOnly">` o jerarquía formal.
- La frase de puntualidad sigue en texto muy pequeño y formal.

### Questions to Consider

- ¿Podemos condensar los dos botones de calendario en uno solo que detecte el sistema operativo (iOS -> .ics, Android/Web -> Google Calendar)?
- ¿Qué pasaría si la dirección tuviera su propio icono de copiado al lado del texto, liberando espacio para que solo haya UN botón protagonista?
