# Carito XV — Invitación Digital Interactiva

Experiencia web interactiva, editorial y cinematográfica para la celebración de los 15 años de **Milagros Carolina Herrera ("Carito")**.

Diseñada bajo la metodología **Impeccable**, priorizando una dirección de arte exclusiva, composición editorial, atmósfera celestial nocturna (azul medianoche abisal y plata líquida) y rendimiento fluido en dispositivos móviles.

---

## ⚠️ Directiva Clave para Agentes y Desarrolladores

> [!IMPORTANT]
> **CONCEPTO DE SOBRE COMPLETAMENTE DESCARTADO**: Cualquier concepto de entrada con sobre físico simulado, solapas interactivas, sellos de cera o rituales de "unboxing" está **formal y permanentemente descartado**.
>
> - La invitación comienza **directamente** en el Hero cinematográfico inmersivo.
> - Ningún agente o desarrollador debe proponer, recrear o reintroducir componentes de sobre o apertura física.
> - Para más detalles de dirección artística, consultar [AGENTS.md](file:///home/fraan/Documents/Projects/carito-invitacion/AGENTS.md) y [PRODUCT.md](file:///home/fraan/Documents/Projects/carito-invitacion/PRODUCT.md).

---

## 🚀 Stack Tecnológico

- **Frontend Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Animaciones & Motion**: [GSAP](https://gsap.com/) (GreenSock) con plugin `ScrollTrigger`, Canvas para partículas estelares interactivas
- **Estilos**: CSS Modules (`*.module.css`) + CSS Custom Properties / Tokens ([`src/styles/tokens.css`](file:///home/fraan/Documents/Projects/carito-invitacion/src/styles/tokens.css), [`src/styles/global.css`](file:///home/fraan/Documents/Projects/carito-invitacion/src/styles/global.css))
- **Iconografía**: [lucide-react](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) con `@testing-library/react` y `@testing-library/jest-dom`
- **Linter**: [Oxlint](https://oxc.rs/)
- **Backend Serverless**: Google Apps Script ([`backend/Code.gs`](file:///home/fraan/Documents/Projects/carito-invitacion/backend/Code.gs)) respaldado por Google Sheets ([`backend/SHEETS_FORMULAS.md`](file:///home/fraan/Documents/Projects/carito-invitacion/backend/SHEETS_FORMULAS.md))

---

## 📂 Estructura del Proyecto

```text
carito-invitacion/
├── AGENTS.md                  # Reglas y directivas de diseño y comportamiento para agentes AI
├── PRODUCT.md                 # Documento de producto, especificaciones, alcance y decisiones
├── README.md                  # Este documento
├── index.html                 # Punto de entrada HTML con Google Fonts (Cinzel, Montserrat, Playfair)
├── package.json               # Dependencias y scripts
├── vite.config.ts             # Configuración de Vite
├── tsconfig.json              # Configuración de TypeScript
├── public/                    # Assets estáticos y favicons
│   ├── favicon.svg            # Monograma "XV" en plata líquida sobre azul noche (vectorial SVG)
│   ├── favicon-32.png         # Favicon rasterizado 32x32 px para pestañas de navegador
│   ├── favicon-512.png        # Icono de alta resolución 512x512 px (PWA / Android)
│   ├── favicon.ico            # Favicon multiresolución tradicional (16x16, 32x32, 48x48)
│   ├── apple-touch-icon.png   # Icono para dispositivos Apple iOS (180x180 px)
│   └── icons.svg              # Sprite SVG de iconos
├── backend/
│   ├── Code.gs                # Código fuente de Google Apps Script (API backend para RSVP)
│   ├── Code.test.ts           # Tests unitarios del backend simulado en TypeScript
│   └── SHEETS_FORMULAS.md     # Documentación del esquema y fórmulas de la base en Google Sheets
├── scripts/
│   ├── generate-links.ts      # Script para generar enlaces personalizados para WhatsApp con código (?g=CODE)
│   ├── generate-links.test.ts # Tests del generador de enlaces
│   └── invitados-con-links.csv# Salida del listado de invitados con URLs nominales
└── src/
    ├── main.tsx               # Bootstrap de la aplicación React
    ├── App.tsx                # Orquestador principal de secciones y ScrollTrigger
    ├── App.module.css         # Contenedor y layout global
    ├── types.ts               # Tipos comunes de dominio (invitados, RSVP, respuestas)
    ├── api.ts                 # Cliente de conexión con el backend de Google Apps Script
    ├── api.test.ts            # Tests unitarios del cliente API
    ├── styles/
    │   ├── tokens.css         # Variables CSS de colores (medianoche, plata), tipografía, espaciados
    │   └── global.css         # Resets y tipografía base
    └── components/
        ├── StarryBackground.tsx # Canvas interactivo con cielo estrellado y cometas
        ├── Hero.tsx             # Portada inmersiva con titular, nombre y fecha
        ├── Message.tsx          # Palabras de dedicatoria y bienvenida
        ├── Countdown.tsx        # Contador regresivo al 06/02/2027 21:00 hs
        ├── EventDetails.tsx     # Ubicación (Salón Royal Night), horarios y enlace directo a Google Maps
        ├── Gallery.tsx          # Composición visual de fotos
        ├── RSVP.tsx             # Formulario nominal de confirmación con validación de cupos
        ├── Gifts.tsx            # Datos de presentes y alias bancario con botón de copiado
        └── Closing.tsx          # Despedida final y firma
```

---

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo local
pnpm dev

# Ejecutar suite de pruebas con Vitest
pnpm test

# Ejecutar linter Oxlint
pnpm lint

# Compilar para producción (TypeScript check + Vite build)
pnpm build

# Previsualizar el build de producción
pnpm preview
```

---

## 📱 Experiencia y Flujo de Usuario

1. **Acceso Nominal por WhatsApp**:
   - El invitado recibe un link personalizado con el parámetro `?g=CODIGO` generado por `scripts/generate-links.ts`.
2. **Entrada Directa e Inmersiva**:
   - Sin pantallas intermedias ni apertura de sobres. La atmósfera estelar y la tipografía editorial en plata reciben al invitado de inmediato.
3. **Narrativa Scroll-Driven**:
   - Cada sección aparece de forma orquestada mediante GSAP ScrollTrigger con aceleración por hardware y respeto por `prefers-reduced-motion`.
4. **Logística y Confirmación (RSVP)**:
   - El componente `RSVP` valida el código de grupo en el backend, precarga los nombres de los asistentes habilitados y permite confirmar o declinar dentro del cupo asignado.
5. **Facilidades para el Invitado**:
   - Apertura de la ubicación exacta en Google Maps con un solo tap.
   - Copiado con un tap del alias bancario (`caro.herrera.15`) con feedback visual instantáneo.

---

## 🛡️ Guía para Agentes AI

1. **Respetar Decisiones de Diseño**:
   - Consultar [AGENTS.md](file:///home/fraan/Documents/Projects/carito-invitacion/AGENTS.md) antes de plantear cambios visuales.
   - Mantener el enfoque de diseño editorial ("Experience"), evitando componentes genéricos de librerías sin personalizar.
2. **Regla de Oro sobre el Sobre**:
   - Jamás reintroducir o proponer un sobre.
3. **Calidad y Verificación**:
   - Ejecutar `pnpm test` y `pnpm lint` tras cada modificación de código.
   - Garantizar que todo cambio mantenga compatibilidad móvil estricta (mínimo 375px de ancho) y áreas táctiles de al menos 44x44px.
