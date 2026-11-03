/**
 * CARITO XV - Google Apps Script Backend (Code.gs)
 * Validación de códigos de grupo y registro de RSVP en Google Sheets.
 */

const SHEET_GUESTS = 'Lista de invitados';
const SHEET_RESPONSES = 'Respuestas';

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name);
}

function findGuestGroup(code) {
  if (!code) return null;
  const sheet = getSheet(SHEET_GUESTS);
  if (!sheet) return null;
  const values = sheet.getDataRange().getValues();
  const normalized = String(code).trim().toLowerCase();

  // Fila 0 son encabezados. Col 0: grupo_code, Col 1: nombre_grupo, Col 2: max_personas
  for (let i = 1; i < values.length; i++) {
    const rowCode = String(values[i][0]).trim().toLowerCase();
    if (rowCode === normalized) {
      return {
        row: i + 1,
        code: values[i][0],
        nombre: values[i][1],
        maxPersonas: Number(values[i][2]) || 0,
      };
    }
  }
  return null;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const code = e && e.parameter ? e.parameter.g : '';
    const group = findGuestGroup(code);
    if (!group) {
      return jsonResponse({ valid: false, maxPersonas: 0 });
    }
    return jsonResponse({
      valid: true,
      maxPersonas: group.maxPersonas,
      max_personas: group.maxPersonas,
    });
  } catch (err) {
    return jsonResponse({ valid: false, maxPersonas: 0, error: err.message });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // shortcut: waitLock 10s is plenty for low-traffic family events, upgrade if bulk concurrent traffic is expected
    lock.waitLock(10000);

    const contents = e && e.postData ? e.postData.contents : '';
    if (!contents) {
      return jsonResponse({ success: false, error: 'Payload vacío' });
    }

    const data = JSON.parse(contents);
    const code = String(data.grupo_code || '').trim();
    const group = findGuestGroup(code);

    if (!group) {
      return jsonResponse({ success: false, error: 'Código de invitación no encontrado' });
    }

    const asiste = Boolean(data.asiste);
    const cantidad = asiste ? Number(data.cantidad || 0) : 0;

    if (asiste && (cantidad < 1 || cantidad > group.maxPersonas)) {
      return jsonResponse({ success: false, error: 'Excede capacidad autorizada' });
    }

    const sheetResponses = getSheet(SHEET_RESPONSES);
    if (!sheetResponses) {
      return jsonResponse({ success: false, error: 'Hoja de respuestas no encontrada' });
    }

    const timestamp = new Date();
    sheetResponses.appendRow([
      timestamp,
      group.code,
      data.nombre ? String(data.nombre).trim() : '',
      asiste ? 'Sí' : 'No',
      cantidad,
      data.acompanantes ? String(data.acompanantes).trim() : '',
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  } finally {
    lock.releaseLock();
  }
}

// Export para testing en entorno Node/Vitest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { doGet, doPost, findGuestGroup, jsonResponse, SHEET_GUESTS, SHEET_RESPONSES };
}
