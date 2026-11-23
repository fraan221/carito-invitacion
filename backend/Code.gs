/**
 * CARITO XV - Google Apps Script Backend (Code.gs)
 * Validación de códigos de grupo y registro de RSVP en Google Sheets.
 */

const SHEET_GUESTS = 'Lista de invitados';
const SHEET_RESPONSES = 'Respuestas';
const SHEET_GIFT_PREFERENCES = 'Preferencias Regalos';

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

    if (data.action === 'gift_preference') {
      const allowedGiftTypes = ['transferencia', 'efectivo', 'fisico'];
      const tipoRegalo = String(data.tipo_regalo || '').trim().toLowerCase();
      if (!allowedGiftTypes.includes(tipoRegalo)) {
        return jsonResponse({ success: false, error: 'Tipo de regalo inválido' });
      }

      const sheetGifts = getSheet(SHEET_GIFT_PREFERENCES);
      if (!sheetGifts) {
        return jsonResponse({ success: false, error: 'Hoja Preferencias Regalos no encontrada' });
      }
      sheetGifts.appendRow([
        new Date(),
        String(group.code).trim().toLowerCase(),
        group.nombre,
        tipoRegalo,
      ]);
      return jsonResponse({ success: true });
    }

    const nombre = data.nombre ? String(data.nombre).trim() : '';
    if (!nombre) {
      return jsonResponse({ success: false, error: 'Nombre es requerido' });
    }

    const asiste = Boolean(data.asiste);
    const cantidad = asiste ? Number(data.cantidad || 0) : 0;

    if (asiste) {
      if (!Number.isInteger(cantidad) || cantidad < 1) {
        return jsonResponse({ success: false, error: 'Cantidad inválida' });
      }
      if (cantidad > group.maxPersonas) {
        return jsonResponse({ success: false, error: 'Excede capacidad autorizada' });
      }
      if (cantidad > 1 && (!data.acompanantes || !String(data.acompanantes).trim())) {
        return jsonResponse({ success: false, error: 'Debe especificar los nombres de los acompañantes' });
      }
    }

    const sheetResponses = getSheet(SHEET_RESPONSES);
    if (!sheetResponses) {
      return jsonResponse({ success: false, error: 'Hoja de respuestas no encontrada' });
    }

    const timestamp = new Date();
    sheetResponses.appendRow([
      timestamp,
      String(group.code).trim().toLowerCase(),
      nombre,
      asiste ? 'Sí' : 'No',
      cantidad,
      data.acompanantes ? String(data.acompanantes).trim() : '',
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  } finally {
    if (lock && (typeof lock.hasLock === 'function' ? lock.hasLock() : true)) {
      try {
        lock.releaseLock();
      } catch (_) {
        // Ignore lock release error if lock expired or was not acquired
      }
    }
  }
}

// Export para testing en entorno Node/Vitest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { doGet, doPost, findGuestGroup, jsonResponse, SHEET_GUESTS, SHEET_RESPONSES, SHEET_GIFT_PREFERENCES };
}
