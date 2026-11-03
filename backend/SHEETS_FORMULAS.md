# Google Sheets & Google Apps Script — Carito XV

Guía de fórmulas, estructura de datos y despliegue del backend serverless en Google Sheets + Google Apps Script para la invitación de 15 años de Milagros Carolina Herrera.

---

## 1. Arquitectura de Datos

El sistema utiliza dos hojas principales y un panel de control KPI:

1. **`Lista de invitados`**: Hoja maestra precargada por la familia. Define los grupos, nombres legibles y cupo máximo autorizado (`max_personas`).
2. **`Respuestas`**: Historial inmutable de eventos. Cada envío del formulario web agrega una nueva fila al final mediante `doPost` en Google Apps Script. Nunca se sobrescribe ni se borra.
3. **`Dashboard`**: Bloque o pestaña con métricas consolidadas en tiempo real.

> [!IMPORTANT]
> **Consistencia ante reenvíos:**  
> Las fórmulas de la hoja `Lista de invitados` leen exclusivamente la **última respuesta registrada** para cada código de grupo utilizando búsqueda reversa (`search_mode: -1` en `XLOOKUP` / `BUSCARX`). Si un invitado vuelve a enviar el formulario para corregir acompañantes o avisar que no puede asistir, la hoja se actualiza automáticamente preservando el historial completo.

---

## 2. Pestaña: `Lista de invitados`

### Estructura de columnas

| Columna | Encabezado | Tipo | Descripción |
|---|---|---|---|
| **A** | `grupo_code` | Texto | Slug único en minúsculas (ej: `casa`, `albia`, `acuno-kler`). |
| **B** | `nombre_grupo` | Texto | Nombre familiar o persona (ej: "Casa", "Familia Albia"). |
| **C** | `max_personas` | Número | Cupo máximo autorizado (ej: 4). Configurable por la familia. |
| **D** | `estado` | Fórmula | Estado dinámico: `Confirmado`, `No asiste` o `Pendiente`. |
| **E** | `personas_confirmadas` | Fórmula | Cantidad de personas confirmadas en la última respuesta (0 si no asiste o pendiente). |
| **F** | `ultima_actualizacion` | Fórmula | Timestamp del último envío registrado. |
| **G** | `link_invitacion` | Fórmula | URL única generada con parámetro `?g=`. |

---

### Fórmulas para la Fila 2 (arrastrar hacia abajo)

#### Columna D: `estado`

Calcula si el grupo confirmó asistencia (`Sí`), avisó que no asiste (`No`), o aún no respondió (`Pendiente`).

- **Configuración en Español (separador `;`):**
  ```excel
  =SI.ERROR(
    LET(
      last_asiste; BUSCARX(A2; Respuestas!B:B; Respuestas!D:D; ""; 0; -1);
      SI(last_asiste = ""; "Pendiente"; SI(last_asiste = "Sí"; "Confirmado"; "No asiste"))
    );
    "Pendiente"
  )
  ```

- **Configuración en Inglés (separador `,`):**
  ```excel
  =IFERROR(
    LET(
      last_asiste, XLOOKUP(A2, Respuestas!B:B, Respuestas!D:D, "", 0, -1),
      IF(last_asiste = "", "Pendiente", IF(last_asiste = "Sí", "Confirmado", "No asiste"))
    ),
    "Pendiente"
  )
  ```

---

#### Columna E: `personas_confirmadas`

Obtiene la cantidad de personas confirmadas vigentes de la última respuesta. Si el estado no es `Confirmado`, devuelve `0`.

- **Configuración en Español (separador `;`):**
  ```excel
  =SI(D2 = "Confirmado"; BUSCARX(A2; Respuestas!B:B; Respuestas!E:E; 0; 0; -1); 0)
  ```

- **Configuración en Inglés (separador `,`):**
  ```excel
  =IF(D2 = "Confirmado", XLOOKUP(A2, Respuestas!B:B, Respuestas!E:E, 0, 0, -1), 0)
  ```

---

#### Columna F: `ultima_actualizacion`

Trae la marca de tiempo del último envío registrado para este grupo.

- **Configuración en Español (separador `;`):**
  ```excel
  =SI.ERROR(BUSCARX(A2; Respuestas!B:B; Respuestas!A:A; "-"; 0; -1); "-")
  ```

- **Configuración en Inglés (separador `,`):**
  ```excel
  =IFERROR(XLOOKUP(A2, Respuestas!B:B, Respuestas!A:A, "-", 0, -1), "-")
  ```

---

#### Columna G: `link_invitacion`

Genera el enlace personalizado a la invitación web. Reemplazar `https://carolina-xv.vercel.app` por la URL de producción.

- **Fórmula:**
  ```excel
  ="https://carolina-xv.vercel.app/?g=" & A2
  ```

---

## 3. Pestaña: `Respuestas`

Se completa automáticamente desde Google Apps Script. No requiere fórmulas manuales.

### Estructura de columnas

| Columna | Encabezado | Descripción |
|---|---|---|
| **A** | `timestamp` | Fecha y hora registrada por el script (`new Date()`). |
| **B** | `grupo_code` | Código slug del grupo. |
| **C** | `nombre_respondente` | Nombre ingresado por quien completó el formulario. |
| **D** | `asiste` | `Sí` o `No`. |
| **E** | `cantidad` | Cantidad de personas confirmadas (0 si `asiste` es No). |
| **F** | `acompanantes` | Nombres o notas de acompañantes ingresados. |

---

## 4. Pestaña / Panel: `Dashboard`

Resumen ejecutivo para la familia y proveedores del salón:

| Métrica | Fórmula Español (`;`) | Fórmula Inglés (`,`) | Descripción |
|---|---|---|---|
| **Total invitados esperados** | `=SUMA('Lista de invitados'!C2:C)` | `=SUM('Lista de invitados'!C2:C)` | Suma de cupos máximos autorizados. |
| **Total confirmados** | `=SUMA('Lista de invitados'!E2:E)` | `=SUM('Lista de invitados'!E2:E)` | Asistentes confirmados vigentes. |
| **Total no asisten (bajas)** | `=SUMAR.SI.CONJUNTO('Lista de invitados'!C2:C; 'Lista de invitados'!D2:D; "No asiste")` | `=SUMIFS('Lista de invitados'!C2:C, 'Lista de invitados'!D2:D, "No asiste")` | Cupos liberados que avisaron que no van. |
| **Balance restante** | `=B1 - B2 - B3` *(celdas correspondientes)* | `=B1 - B2 - B3` | Cupos aún pendientes de resolución. |
| **Porcentaje de confirmación** | `=B2 / B1` *(formato `%`)* | `=B2 / B1` | Progreso de confirmación sobre el total. |
| **Grupos pendientes** | `=CONTAR.SI('Lista de invitados'!D2:D; "Pendiente")` | `=COUNTIF('Lista de invitados'!D2:D, "Pendiente")` | Cantidad de familias que aún no respondieron. |

---

## 5. Despliegue de Google Apps Script (`Code.gs`)

### Paso 1: Crear o vincular el script
1. Abrir la planilla de Google Sheets con las dos hojas creadas: `Lista de invitados` y `Respuestas`.
2. En el menú superior, hacer clic en **Extensiones** > **Apps Script**.
3. Borrar el contenido por defecto del archivo `Código.gs` y pegar todo el contenido de [`backend/Code.gs`](file:///home/fraan/Documents/Projects/carito-invitacion/backend/Code.gs).
4. Guardar los cambios (`Ctrl + S` o ícono de disco).

### Paso 2: Desplegar como Web App
1. En la esquina superior derecha de Apps Script, hacer clic en el botón azul **Implementar** (Deploy) > **Nueva implementación**.
2. En el engranaje tipo selección, elegir **Aplicación web**.
3. Configurar los siguientes campos **exactamente**:
   - **Descripción**: `Carito XV RSVP Backend v1`
   - **Ejecutar como**: **Yo** (`<tu-cuenta>@gmail.com`)
   - **Quién tiene acceso**: **Cualquier usuario** (*Anyone* / incluso usuarios anónimos).
4. Hacer clic en **Implementar**.
5. Si Google solicita autorizaciones de permisos por primera vez:
   - Clic en **Revisar permisos**.
   - Elegir la cuenta de Google.
   - Clic en **Configuración avanzada** > **Ir a (proyecto) (no seguro)**.
   - Clic en **Permitir**.
6. Copiar la **URL de la aplicación web** generada (formato `https://script.google.com/macros/s/.../exec`).

### Paso 3: Configurar en el proyecto React / Vercel
1. En el frontend local, agregar en `.env.local` (o `.env`):
   ```bash
   VITE_APPS_SCRIPT_URL="https://script.google.com/macros/s/TU_SCRIPT_ID/exec"
   ```
2. En el panel de Vercel, agregar la misma variable de entorno en **Settings > Environment Variables**.

---

## 6. Verificación Manual de los Endpoints

Una vez desplegada la Web App, se puede verificar su funcionamiento con `curl` o desde el navegador:

### 1. Validación de código existente (GET)
```bash
curl -L "https://script.google.com/macros/s/TU_SCRIPT_ID/exec?g=casa"
```
**Respuesta esperada:**
```json
{"valid":true,"maxPersonas":4,"max_personas":4}
```

### 2. Validación de código inexistente (GET)
```bash
curl -L "https://script.google.com/macros/s/TU_SCRIPT_ID/exec?g=codigo_falso"
```
**Respuesta esperada:**
```json
{"valid":false,"maxPersonas":0}
```

### 3. Envío de confirmación válida (POST)
```bash
curl -L -X POST "https://script.google.com/macros/s/TU_SCRIPT_ID/exec" \
  -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"grupo_code":"casa","nombre":"Carolina","asiste":true,"cantidad":3,"acompanantes":"Mamá, Papá"}'
```
**Respuesta esperada:**
```json
{"success":true}
```
*Verificar en Sheets que se agregó una nueva fila en la pestaña `Respuestas`.*

### 4. Envío con exceso de cupo (POST)
```bash
curl -L -X POST "https://script.google.com/macros/s/TU_SCRIPT_ID/exec" \
  -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"grupo_code":"casa","nombre":"Prueba","asiste":true,"cantidad":10,"acompanantes":""}'
```
**Respuesta esperada:**
```json
{"success":false,"error":"Excede capacidad autorizada"}
```
