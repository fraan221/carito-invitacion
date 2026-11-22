# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (mobile-first)

## Users

- Invitados a la fiesta de 15 años de Milagros Carolina Herrera ("Carito"): familiares, amigos, compañeros de escuela y allegados.
- Situación de uso: Acceden principalmente desde smartphones a través de enlaces enviados por WhatsApp, en momentos cotidianos o de ocio.
- Rango de usuarios: Desde adolescentes nativos digitales hasta adultos mayores, requiriendo claridad absoluta en la interacción sin perder el impacto emocional.

## Product Purpose

- Brindar una experiencia de invitación digital interactiva, cinematográfica e íntima que transmita la magia y la elegancia de los XV de Carito.
- Resolver con total claridad y confiabilidad la logística del evento: confirmación de asistencia (RSVP nominal con cupos validados por grupo), datos de ubicación con geolocalización directa, agenda horaria y datos de regalos/transferencias.

## Positioning

- A diferencia de las plantillas genéricas o servicios estándar de invitaciones de 15 años (landing pages estáticas o PDFs recargados), Carito XV es una experiencia editorial y cinematográfica art-directed: un viaje inmersivo directo hacia un universo celestial nocturno y refinado, con transiciones fluidas y una narrativa visual personalizada de alta costura.

## Operating Context

- Canales de distribución: Mensajería instantánea (WhatsApp mediante enlaces personalizados `?g=CODIGO`).
- Dispositivos: Teléfonos móviles predominantemente (iOS y Android en múltiples resoluciones), compatible y escalable a pantallas de escritorio.
- Conectividad variable: Redes móviles 4G/5G y Wi-Fi doméstico; la experiencia inicial debe cargar velozmente sin bloquearse por assets pesados.
- Backend de soporte: Google Apps Script conectado a Google Sheets con validación de códigos de grupo (`?g=CODE`) y gestión de cupos máximos por familia/grupo.

## Capabilities and Constraints

- Capacidades confirmadas:
  - Entrada inmersiva directa con Hero cinematográfico, fondo estelar interactivo (canvas de estrellas / medianoche cósmico) y tipografía con reflejos en plata líquida.
  - Navegación vertical fluida y transiciones secuenciales entre secciones editoriales orquestadas con GSAP ScrollTrigger.
  - Validación nominal de grupo por parámetro de URL (`?g=CODE`) o ingreso manual de código de pase.
  - Formulario RSVP con control dinámico de cupos máximos y envío directo al backend.
  - Datos de evento (Salón Royal Night, Florencio Varela) con apertura directa en Google Maps.
  - Copia al portapapeles del alias bancario (`mili.caro.herrera.`) con feedback visual instantáneo.
  - Cuenta regresiva interactiva y precisa hasta el 6 de febrero de 2027 a las 21:00 hs.
- Restricciones y decisiones descartadas:
  - **CONCEPTO DE SOBRE COMPLETAMENTE DESCARTADO**: Se descarta de manera definitiva cualquier apertura simulada de sobre, solapa, sello de cera, medallón de apertura o ritual de unboxing físico. La invitación inicia directamente en la experiencia digital.
  - El color definitivo del vestido aún no está confirmado; la paleta principal debe ser modular/adaptable (con plata líquida, acentos celestiales y destellos como bases firmes sobre fondo azul medianoche).
  - Respeto estricto por `prefers-reduced-motion` y rendimiento móvil (GSAP optimizado a 60fps, sin caídas de framerate).

## Brand Commitments

- Protagonista: Milagros Carolina Herrera ("Caro" / "Carito").
- Motivo: Celebración de Mis 15 Años.
- Tono: Sofisticado, íntimo, celestial, memorable y auténtico; libre de clichés de SaaS y de plantillas infantiles o recargadas.
- Elementos identitarios:
  - Atmósfera de azul medianoche abisal con partículas estelares suspendidas y sutiles cáusticas de luz.
  - Tipografía editorial refinada con jerarquía contundente y monograma romano "XV".
  - Monograma y Favicons: Monograma romano "XV" en plata líquida degradé (`#f8fafc` a `#e2e8f0`) sobre pastilla azul noche profundo (`#050814`), diseñado para máximo contraste y legibilidad tanto en pestañas claras como en modo oscuro. Set completo optimizado en `public/` (`favicon.svg`, `favicon-32.png`, `favicon-512.png`, `favicon.ico`, `apple-touch-icon.png`).
  - Acentos de plata líquida, reflejos diamantados y contrastes cuidados.
  - Composiciones editoriales asimétricas con amplio espacio negativo, evitando la monotonía de tarjetas idénticas.

## Evidence on Hand

- Fecha y hora: Sábado 6 de Febrero de 2027, 21:00 a 05:00 hs.
- Salón: Royal Night, Cno. Gral. Belgrano 5599, B1888 Florencio Varela, Provincia de Buenos Aires.
- Enlace Maps confirmado: Google Maps del salón Royal Night.
- Alias bancario confirmado: `mili.caro.herrera.`.
- Backend Apps Script funcional con tests unitarios (`backend/Code.test.ts`) y fórmulas documentadas (`backend/SHEETS_FORMULAS.md`).
- Generador de enlaces nominales por lote probado (`scripts/generate-links.ts`).
- Identidad visual de favicons completa y vinculada en `index.html`: SVG vectorial escalable con degradé en plata, PNGs 32x32 y 512x512, ICO multi-resolución y Apple Touch Icon 180x180.

## Product Principles

1. **La emoción precede a la información:** La invitación es primero una experiencia inmersiva y un recuerdo antes de ser una herramienta informativa.
2. **Claridad intachable en lo funcional:** El RSVP, las fechas, el mapa y los datos bancarios no deben competir con la fantasía visual; deben ser inmediatos, legibles y sin fricción.
3. **Fluidez cinematográfica móvil:** Cada transición (aparición del Hero, scroll progresivo, microinteracciones táctiles) debe sentirse física, con peso e intención, manteniendo 60fps en dispositivos móviles.
4. **Arquitectura cromática desacoplada:** La identidad visual debe funcionar de manera impecable ahora y permitir ajustar el color insignia una vez elegido el vestido sin reescribir la composición.
5. **Entrada directa sin barreras:** Al descartar el sobre, el usuario entra inmediatamente a la experiencia visual y narrativa sin esperas artificiales ni clics redundantes de desempaquetado.

## Accessibility & Inclusion

- Navegación táctil intuitiva con zonas de toque de al menos 44x44px.
- Contraste tipográfico AA en todos los textos informativos.
- Alternativa estática o reducción de movimiento elegante para usuarios con `prefers-reduced-motion`.
