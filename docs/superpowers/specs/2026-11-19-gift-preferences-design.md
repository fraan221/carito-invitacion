# Design Document: Especificación de Preferencia de Regalo (Carito XV)

**Fecha**: 2026-11-19  
**Estado**: Aprobado para Planificación  
**Target**: `src/components/Gifts.tsx`, `src/api.ts`, `backend/Code.gs`, Google Sheets (`103IBE85kMDpWw5HfnaKfx6BfhehsQYh53jD7AR2leMc`)

---

## 1. Intención y Propósito

Permitir a los invitados indicar de forma ágil y a 1 solo clic su modalidad preferida de regalo (Transferencia por Mercado Pago, Dinero en efectivo o Regalo físico), para que la familia y la quinceañera puedan conocer con anticipación qué planea cada invitado y organizar la logística del evento.

---

## 2. Objetivos, No-Objetivos y Anti-Objetivos

### Objetivos
- Proveer una interacción de **1 solo clic** en la sección de Regalos (`src/components/Gifts.tsx`) mediante 3 píldoras celestiales:
  1. `✦ Transferencia MP`
  2. `✉️ Efectivo en fiesta`
  3. `🎁 Regalo físico`
- **Estado Inicial**: Las tres píldoras arrancan **deseleccionadas**. El bloque de alias bancario permanece oculto inicialmente hasta que el invitado decide tocar "Transferencia MP".
- **Revelación Condicional**:
  - Si el invitado toca `✦ Transferencia MP`: se despliega el alias `caro.herrera.15`, titular y botón de copiado con transición suave.
  - Si el invitado toca `✉️ Efectivo en fiesta` o `🎁 Regalo físico`: el alias no se muestra y se exhibe un agradecimiento sutil: *"✓ Preferencia registrada. ¡Muchas gracias!"*.
- **Feedback Táctil**: La píldora seleccionada se enciende con resplandor estelar y micro-destellos de `ClickSpark`.
- **Sincronización en Segundo Plano**: La selección se envía a Google Apps Script vinculada al código de invitación (`?g=CODE`) del invitado.
- **Registro en Google Sheets (`XV de Caro - Invitados y RSVP`, ID: `103IBE85kMDpWw5HfnaKfx6BfhehsQYh53jD7AR2leMc`)**:
  - En una pestaña dedicada `Preferencias Regalos` (para aislar completamente los eventos del RSVP y evitar colisiones de fórmulas), registrar cada evento con: `timestamp`, `grupo_code`, `nombre_grupo`, `tipo_regalo`.
  - En la pestaña `Lista de invitados`, en la Columna I (`tipo_regalo`, contigua a la Columna H `link_whatsapp`), mostrar en tiempo real la última elección del grupo usando la fórmula `BUSCARX`.

### No-Objetivos
- No solicitar montos de dinero ni detalles específicos de qué objeto van a regalar.
- No exigir un botón adicional de "Confirmar" o "Enviar"; la selección es directa al toque.
- No bloquear ni condicionar la asistencia del invitado.

### Anti-Objetivos
- No convertir la sección en una pasarela de pago o cobranza comercial.
- No permitir selección múltiple que confunda al invitado sobre si debe transferir y además llevar sobre.
- No mostrar explicaciones o manuales extensos cuando se elija efectivo o regalo físico.

---

## 3. Restricciones
- Respetar la identidad visual celestial y el flujo editorial abierto sin cajas rígidas (`Gifts.module.css`).
- Mantener compatibilidad móvil (touch targets >= 44px) y navegación sin parámetros (si el usuario entra sin `?g=CODE`, las píldoras funcionan como selector local sin fallar la petición de red).
- Compatibilidad con `prefers-reduced-motion` y `forced-colors`.
- Preservar las pruebas unitarias existentes (64/64 pasando).

---

## 4. Enfoques Considerados

### Enfoque 1: Historial de eventos inmutable con pestaña dedicada `Preferencias Regalos` y fórmula `BUSCARX` (Seleccionado)
- **Mecanismo**: Cada clic despacha `action: 'gift_preference'` al endpoint de Apps Script. Se agrega una fila a `Preferencias Regalos` y la Columna I en `Lista de invitados` resuelve la última decisión con `=SI.ERROR(BUSCARX(A2; 'Preferencias Regalos'!B:B; 'Preferencias Regalos'!D:D; "-"; 0; -1); "-")`.
- **Razón de elección**: Es 100% inmutable, preserva la auditoría histórica de eventos, tolera cambios de opinión sin borrar filas previas y tiene **cero riesgo de colisión o anulación** con las fórmulas de `Respuestas` / RSVP en `Lista de invitados`.

### Enfoque 2: Sobreescritura directa en la celda de `Lista de invitados`
- **Mecanismo**: Apps Script ubica la fila del grupo y actualiza directamente la celda con `setValue`.
- **Razón de descarte**: Falta de auditoría y riesgo de desincronización ante clics múltiples.

---

## 5. Decisiones de Diseño y Comportamiento Acordadas

1. **Selección Única (Excluyente)**:
   - Las tres opciones son mutuamente excluyentes (comportamiento tipo radio visualmente estilizado como píldoras).
   - Tocar una píldora deselecciona la anterior y envía la actualización.
2. **Estados en Pantalla**:
   - `inicial`: 3 píldoras deseleccionadas, alias oculto, mensaje de guía (*"Seleccioná una opción para acompañarme..."*).
   - `transferencia`: píldora activa, revela el alias `caro.herrera.15`, titular y botón `Copiar Alias`.
   - `efectivo` o `fisico`: píldora activa, alias oculto, mensaje de confirmación sutil (*"✓ Preferencia registrada. ¡Muchas gracias!"*).
3. **Persistencia Local**:
   - Guardar en `sessionStorage` (`carito_gift_preference_${code}`) para mantener la opción activa si el usuario recarga la página.
4. **Estructura en Google Sheets (`103IBE85kMDpWw5HfnaKfx6BfhehsQYh53jD7AR2leMc`)**:
   - `Lista de invitados`: Columna I con encabezado `tipo_regalo` (Col A: code, B: nombre, C: max, D: estado, E: confirmadas, F: fecha, G: link, H: whatsapp, I: tipo_regalo).
   - `Preferencias Regalos`: Pestaña dedicada con columnas A: `timestamp`, B: `grupo_code`, C: `nombre_grupo`, D: `tipo_regalo`.

---

## 6. Lo que queda al Constructor (Implementador)
- Implementar la función `submitGiftPreference(groupCode: string, tipo: string)` en `src/api.ts`.
- Incorporar el selector dinámico en `src/components/Gifts.tsx` y estilos en `src/components/Gifts.module.css`.
- Añadir tests unitarios en `Gifts.test.tsx` verificando el estado inicial sin selección, la revelación del alias en transferencia y el llamado a la API.
- Actualizar `backend/Code.gs` para manejar `action === 'gift_preference'` escribiendo en `Preferencias Regalos`.
- Aplicar la nueva pestaña y Columna I en la planilla en vivo mediante MCP `sheets`.
