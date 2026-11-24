// src/js/leadData.js
// Reglas del formulario sin DOM: se prueban con `pnpm test`.

export const LIMITS = { name: 120, message: 1000, page: 200 };
export const SERVICES = ['seo_local', 'web', 'automatizacion', 'no_lo_se'];

/** Campos que la persona puede corregir. Un error en cualquier otro es nuestro. */
export const VISIBLE_FIELDS = ['name', 'phone', 'service', 'message', 'privacy_accepted'];

const MESSAGES = {
  name: {
    required: 'Escribe tu nombre.',
    invalid: 'Revisa el nombre: usa letras latinas.',
    too_long: `El nombre es demasiado largo (máximo ${LIMITS.name} caracteres).`,
  },
  phone: {
    required: 'Escribe tu número de WhatsApp.',
    invalid: 'Revisa el número. Si no es un móvil español, escríbelo con su prefijo: +57, +34…',
  },
  service: {
    required: 'Elige una opción. Si dudas, «No lo sé aún».',
    invalid: 'Elige una de las opciones.',
  },
  message: {
    invalid: 'Revisa el mensaje: usa letras latinas.',
    too_long: `El mensaje es demasiado largo (máximo ${LIMITS.message} caracteres).`,
  },
  privacy_accepted: {
    required: 'Marca la casilla para poder enviar.',
    not_accepted: 'Marca la casilla para poder enviar.',
  },
};

/**
 * @param {string} field
 * @param {string} code - Código de error propio o de la entrada de Waboce.
 * @returns {string}
 */
export function errorMessage(field, code) {
  return MESSAGES[field]?.[code] ?? 'Revisa este campo.';
}

/**
 * Deja el teléfono con prefijo de país. Solo se supone España con un móvil de 9 cifras.
 * @param {string} raw
 * @returns {string|null} Número en formato internacional o null si no es válido.
 */
export function normalizePhone(raw) {
  const compact = String(raw ?? '').trim().replace(/[\s.\-()]/g, '');
  if (/^[67]\d{8}$/.test(compact)) return `+34${compact}`;

  const international = compact.replace(/^00/, '+');
  return /^\+[1-9]\d{7,14}$/.test(international) ? international : null;
}

/**
 * Agrupa las cifras de un móvil español para enseñarlo.
 * @param {string} phone - Número ya normalizado.
 */
export function formatPhone(phone) {
  const spanish = /^\+34(\d{3})(\d{3})(\d{3})$/.exec(phone);
  return spanish ? `+34 ${spanish[1]} ${spanish[2]} ${spanish[3]}` : phone;
}

/** Cirílico, chino y japonés: es el spam que llega, y así se dice en vez de fingir un envío. */
function hasForeignScript(text) {
  return /[Ѐ-ӿ぀-ヿ一-鿿]/.test(text);
}

/**
 * @param {{name: string, phone: string, service: string, message: string, privacyAccepted: boolean}} values
 * @returns {Record<string, string>} Código de error por campo. Vacío si todo está bien.
 */
export function validateLead({ name, phone, service, message, privacyAccepted }) {
  const errors = {};

  if (!name) errors.name = 'required';
  else if (name.length > LIMITS.name) errors.name = 'too_long';
  else if (hasForeignScript(name)) errors.name = 'invalid';

  if (!phone) errors.phone = 'required';
  else if (!normalizePhone(phone)) errors.phone = 'invalid';

  if (!service) errors.service = 'required';
  else if (!SERVICES.includes(service)) errors.service = 'invalid';

  if (message.length > LIMITS.message) errors.message = 'too_long';
  else if (hasForeignScript(message)) errors.message = 'invalid';

  if (!privacyAccepted) errors.privacy_accepted = 'not_accepted';

  return errors;
}

/** Cuerpo que espera la entrada de Waboce. */
export function buildLeadPayload(values, { site, privacyVersion, page, elapsedMs }) {
  return {
    site,
    name: values.name,
    phone: normalizePhone(values.phone),
    service: values.service,
    ...(values.message ? { message: values.message } : {}),
    page: page.slice(0, LIMITS.page),
    privacy_accepted: values.privacyAccepted,
    privacy_version: privacyVersion,
    website: values.website,
    elapsed_ms: Math.round(elapsedMs),
  };
}

/**
 * Traduce la respuesta de Waboce a lo que hace la web.
 * @param {number} status
 * @param {{fields?: Record<string, string>}|null} body
 * @returns {{type: 'success'|'fields'|'rate_limited'|'failed', fields?: Record<string, string>}}
 */
export function interpretResponse(status, body) {
  if (status === 201 && body?.ok === true) return { type: 'success' };
  if (status === 429) return { type: 'rate_limited' };

  if (status === 400 && body?.fields && typeof body.fields === 'object') {
    const names = Object.keys(body.fields);
    const fixable = names.filter((name) => VISIBLE_FIELDS.includes(name));
    if (names.length > 0 && fixable.length === names.length) {
      return { type: 'fields', fields: body.fields };
    }
  }

  return { type: 'failed' };
}
