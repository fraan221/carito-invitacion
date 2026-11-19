# Preferencias de Regalo (Carito XV) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar un selector interactivo a 1 clic en la sección de Regalos con 3 opciones excluyentes (Transferencia MP, Dinero en efectivo, Regalo físico) que arranquen deseleccionadas, revelen el alias solo en transferencia y registren automáticamente la preferencia en Google Sheets en segundo plano.

**Architecture:** Frontend en React 19 con máquina de estados local y `sessionStorage`, despachando eventos asíncronos (`action: 'gift_preference'`) hacia Google Apps Script. El backend registra cada evento en una pestaña aislada (`Preferencias Regalos`) y la hoja principal `Lista de invitados` refleja en tiempo real la última elección de cada familia en la Columna I (`tipo_regalo`) mediante `BUSCARX`.

**Tech Stack:** React 19, TypeScript, CSS Modules, Vitest + Testing Library, Google Apps Script, Google Sheets API (MCP).

**Spec:** [docs/superpowers/specs/2026-11-19-gift-preferences-design.md](file:///home/fraan/Documents/Projects/carito-invitacion/docs/superpowers/specs/2026-11-19-gift-preferences-design.md)

## Global Constraints

- Plataforma web mobile-first con soporte para navegadores de escritorio.
- Sin contenedores rígidos ni cajas estilo SaaS; se debe respetar el flujo editorial abierto en plata líquida y azul medianoche de [Gifts.module.css](file:///home/fraan/Documents/Projects/carito-invitacion/src/components/Gifts.module.css).
- Targets táctiles mínimos de 44x44px para dispositivos móviles.
- Cero acoplamiento o interferencia con las fórmulas existentes de RSVP en la hoja `Respuestas`.
- Respeto estricto por `prefers-reduced-motion` y `forced-colors: active`.
- Todos los tests existentes (64/64) y nuevos deben pasar en verde, con 0 errores y 0 advertencias en Oxlint (`pnpm lint`).

## Review Focus

- **Invitado sin código de grupo (`?g=` ausente o vacío)**: Al hacer clic en una píldora, la UI debe cambiar de estado y mostrar/ocultar el alias fluidamente, omitiendo la llamada a la red sin arrojar excepciones.
- **Clics sucesivos rápidos entre opciones**: El estado visual debe actualizarse al instante al último toque, y la última opción debe ser la que quede registrada en el backend.
- **Fallo de red o timeout al guardar preferencia**: La interfaz no debe bloquearse ni mostrar alertas invasivas; el fallo se absorbe de forma resiliente y se preserva el estado en `sessionStorage`.
- **Persistencia en la sesión actual**: Al recargar la página (`F5`), el componente debe leer `sessionStorage` para restaurar la píldora previamente seleccionada por el usuario.
- **Normalización de códigos de grupo**: El backend en Apps Script debe normalizar el código con `.trim().toLowerCase()` antes de insertar en `Preferencias Regalos`.

---

### Task 1: API Layer & Type Definitions

**Files:**
- Modify: `src/types.ts`
- Modify: `src/api.ts`
- Test: `src/api.test.ts`

**Interfaces:**
- Produces: `GiftPreferenceType = 'transferencia' | 'efectivo' | 'fisico'`
- Produces: `submitGiftPreference(groupCode: string, tipo: GiftPreferenceType): Promise<{ success: boolean; error?: string }>`

- [ ] **Step 1: Write the failing tests in `src/api.test.ts`**

```ts
it('submits gift preference successfully to backend', async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true }),
  } as Response);

  const res = await submitGiftPreference('casa', 'transferencia');
  expect(res.success).toBe(true);
  expect(globalThis.fetch).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        action: 'gift_preference',
        grupo_code: 'casa',
        tipo_regalo: 'transferencia',
      }),
    })
  );
});

it('handles network error in submitGiftPreference gracefully', async () => {
  globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));
  const res = await submitGiftPreference('casa', 'efectivo');
  expect(res.success).toBe(false);
  expect(res.error).toBeDefined();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/api.test.ts`  
Expected: FAIL with "submitGiftPreference is not defined"

- [ ] **Step 3: Define types in `src/types.ts` and implement `submitGiftPreference` in `src/api.ts`**

In `src/types.ts`:
```ts
export type GiftPreferenceType = 'transferencia' | 'efectivo' | 'fisico';
```

In `src/api.ts`:
```ts
export async function submitGiftPreference(
  groupCode: string,
  tipo: GiftPreferenceType
): Promise<{ success: boolean; error?: string }> {
  if (!groupCode.trim()) return { success: false, error: 'Código de grupo requerido' };
  try {
    const res = await fetch(getEndpointUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'gift_preference',
        grupo_code: groupCode.trim(),
        tipo_regalo: tipo,
      }),
    });
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` };
    return await res.json();
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/api.test.ts`  
Expected: PASS (all tests green)

- [ ] **Step 5: Commit**

```bash
git add src/types.ts src/api.ts src/api.test.ts
git commit -m "feat(api): add submitGiftPreference and GiftPreferenceType"
```

---

### Task 2: Backend Google Apps Script & Unit Tests

**Files:**
- Modify: `backend/Code.gs`
- Modify: `backend/Code.test.ts`
- Modify: `backend/SHEETS_FORMULAS.md`

**Interfaces:**
- Consumes: `{ action: 'gift_preference', grupo_code: string, tipo_regalo: string }`
- Produces: Appends row `[timestamp, group.code, group.nombre, tipo_regalo]` in sheet `Preferencias Regalos`

- [ ] **Step 1: Write the failing tests in `backend/Code.test.ts`**

```ts
it('handles gift_preference action by appending to Preferencias Regalos sheet', () => {
  const mockSheet = {
    appendRow: vi.fn(),
  };
  // Mock getSheet('Preferencias Regalos')
  const payload = JSON.stringify({
    action: 'gift_preference',
    grupo_code: 'casa',
    tipo_regalo: 'transferencia',
  });
  // Execute doPost mock
  const res = doPostMock({ postData: { contents: payload } });
  expect(res.success).toBe(true);
  expect(mockSheet.appendRow).toHaveBeenCalledWith([
    expect.any(Date),
    'casa',
    'Casa',
    'transferencia',
  ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run backend/Code.test.ts`  
Expected: FAIL

- [ ] **Step 3: Update `backend/Code.gs`**

Add constant `SHEET_GIFT_PREFERENCES = 'Preferencias Regalos'` and handle `data.action === 'gift_preference'` in `doPost`:
```js
const SHEET_GIFT_PREFERENCES = 'Preferencias Regalos';

// Inside doPost(e):
if (data.action === 'gift_preference') {
  const sheetGifts = getSheet(SHEET_GIFT_PREFERENCES);
  if (!sheetGifts) {
    return jsonResponse({ success: false, error: 'Hoja Preferencias Regalos no encontrada' });
  }
  sheetGifts.appendRow([
    new Date(),
    group.code,
    group.nombre,
    String(data.tipo_regalo || '').trim(),
  ]);
  return jsonResponse({ success: true });
}
```
Update `backend/SHEETS_FORMULAS.md` documenting the new sheet and the formula for Columna I:
`=SI.ERROR(BUSCARX(A2; 'Preferencias Regalos'!B:B; 'Preferencias Regalos'!D:D; "-"; 0; -1); "-")`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run backend/Code.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/Code.gs backend/Code.test.ts backend/SHEETS_FORMULAS.md
git commit -m "feat(backend): add gift_preference handler and formulas documentation"
```

---

### Task 3: Live Google Sheets Structure via MCP

**Tools:**
- Call MCP `sheets`:
  - `sheets_insert_sheet`: create sheet `Preferencias Regalos` in spreadsheet `103IBE85kMDpWw5HfnaKfx6BfhehsQYh53jD7AR2leMc`
  - `sheets_update_values`: set headers `timestamp`, `grupo_code`, `nombre_grupo`, `tipo_regalo` in `'Preferencias Regalos'!A1:D1`
  - `sheets_update_values`: set header `tipo_regalo` in `'Lista de invitados'!I1`
  - `sheets_update_values`: set formula `=SI.ERROR(BUSCARX(A2; 'Preferencias Regalos'!B:B; 'Preferencias Regalos'!D:D; "-"; 0; -1); "-")` in `'Lista de invitados'!I2:I31`

- [ ] **Step 1: Check existing sheets and verify `Preferencias Regalos` is created**

Call `sheets_get_metadata` on `103IBE85kMDpWw5HfnaKfx6BfhehsQYh53jD7AR2leMc`. If `Preferencias Regalos` does not exist, call `sheets_insert_sheet`.

- [ ] **Step 2: Add headers to `Preferencias Regalos`**

Call `sheets_update_values` on `'Preferencias Regalos'!A1:D1` with `[["timestamp", "grupo_code", "nombre_grupo", "tipo_regalo"]]`.

- [ ] **Step 3: Add Columna I header and formulas in `Lista de invitados`**

Call `sheets_update_values` on `'Lista de invitados'!I1` with `[["tipo_regalo"]]`.  
Populate formulas in column I for all rows (rows 2 to 31).

- [ ] **Step 4: Verify sheet values via `sheets_get_values`**

Read `'Lista de invitados'!A1:I5` and `'Preferencias Regalos'!A1:D2` to ensure proper linkage without errors.

---

### Task 4: Frontend Component & Styling (`Gifts.tsx`)

**Files:**
- Modify: `src/components/Gifts.tsx`
- Modify: `src/components/Gifts.module.css`
- Test: `src/components/Gifts.test.tsx`

**Interfaces:**
- Consumes: `submitGiftPreference` from `../api`
- Consumes: `GiftPreferenceType` from `../types`
- Props: `interface GiftsProps { alias?: string; groupCode?: string }`

- [ ] **Step 1: Write the failing tests in `src/components/Gifts.test.tsx`**

Test the 4 key behaviors:
1. Renders 3 pills (`Transferencia MP`, `Efectivo en fiesta`, `Regalo físico`) unselected by default.
2. Alias is hidden initially when no pill is selected.
3. Clicking `✦ Transferencia MP` reveals the alias (`caro.herrera.15`) and copy button, and calls `submitGiftPreference`.
4. Clicking `✉️ Efectivo en fiesta` hides the alias, displays confirmation text, and calls `submitGiftPreference`.
5. Restores selection from `sessionStorage` if present.

```tsx
it('renders 3 gift options unselected initially with alias hidden', () => {
  render(<Gifts groupCode="casa" />);
  expect(screen.getByRole('button', { name: /transferencia/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /efectivo/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /regalo físico/i })).toBeInTheDocument();
  expect(screen.queryByText('caro.herrera.15')).not.toBeInTheDocument();
});

it('reveals alias when Transferencia MP is clicked and submits preference', async () => {
  render(<Gifts groupCode="casa" />);
  const mpButton = screen.getByRole('button', { name: /transferencia/i });
  await act(async () => {
    fireEvent.click(mpButton);
  });
  expect(screen.getByText('caro.herrera.15')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /copiar alias/i })).toBeInTheDocument();
});

it('hides alias and shows confirmation when Efectivo is clicked', async () => {
  render(<Gifts groupCode="casa" />);
  const cashButton = screen.getByRole('button', { name: /efectivo/i });
  await act(async () => {
    fireEvent.click(cashButton);
  });
  expect(screen.queryByText('caro.herrera.15')).not.toBeInTheDocument();
  expect(screen.getByText(/preferencia registrada/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/Gifts.test.tsx`  
Expected: FAIL

- [ ] **Step 3: Implement the 3-pill selector in `src/components/Gifts.tsx` and styles in `Gifts.module.css`**

Implement:
- Prop `groupCode`: fallback to `new URLSearchParams(window.location.search).get("g") ?? ""`
- State `selectedGift: GiftPreferenceType | null` initialized from `sessionStorage`
- Pill group rendered with `role="radiogroup"` and `aria-checked`
- Wrap pill clicks with `ClickSpark` micro-destellos
- Fire `submitGiftPreference(code, option)` silently on click
- Render alias block conditionally: `{selectedGift === 'transferencia' && ( ... )}`
- Render confirmation conditionally: `{(selectedGift === 'efectivo' || selectedGift === 'fisico') && ( ... )}`

In `src/components/Gifts.module.css`:
- Add `.pillGroup`, `.pill`, `.pillActive`, `.pillText`, `.confirmationNote`, and smooth opacity/transform transition for alias reveal.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/Gifts.test.tsx`  
Expected: PASS (all tests green)

- [ ] **Step 5: Commit**

```bash
git add src/components/Gifts.tsx src/components/Gifts.module.css src/components/Gifts.test.tsx
git commit -m "feat(ui): add 1-click gift preference selector with conditional reveal"
```

---

### Task 5: End-to-End Verification & Quality Polish

**Files:**
- Entire repository

- [ ] **Step 1: Run the complete test suite**

Run: `pnpm test`  
Expected: 10/10 test files passed, all tests green.

- [ ] **Step 2: Run linter**

Run: `pnpm lint`  
Expected: 0 warnings, 0 errors.

- [ ] **Step 3: Run production build**

Run: `pnpm build`  
Expected: Build succeeds with 0 errors.

- [ ] **Step 4: Final verification commit**

```bash
git add -A
git commit -m "chore: complete gift preference feature verification and build"
```
