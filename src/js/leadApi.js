// src/js/leadApi.js
import { CONFIG } from './config.js';
import { interpretResponse } from './leadData.js';

/**
 * Fuera de producción no se llama a Waboce (respondería 403). Se simula la respuesta con
 * ?simular=<código>: 201, 400, body, 403, 429, 500 o red. Sin parámetro, 201.
 */
async function simulatedFetch() {
  const wanted = new URLSearchParams(window.location.search).get('simular') ?? '201';
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (wanted === 'red') throw new TypeError('Failed to fetch');
  const cases = {
    201: [201, { ok: true }],
    400: [400, { ok: false, error: 'validation', fields: { phone: 'invalid', name: 'too_long' } }],
    body: [400, { ok: false, error: 'invalid_body' }],
    403: [403, { ok: false, error: 'origin_not_allowed' }],
    429: [429, { ok: false, error: 'rate_limited' }],
    500: [500, { ok: false, error: 'internal' }],
  };
  const [status, body] = cases[wanted] ?? cases[500];
  return new Response(JSON.stringify(body), { status });
}

/**
 * Envía el lead una sola vez, sin reintentos.
 * @param {object} payload
 * @returns {Promise<ReturnType<typeof interpretResponse>>}
 */
export async function submitLead(payload) {
  const isProduction = CONFIG.ANALYTICS.PRODUCTION_HOSTS.includes(window.location.hostname);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.LEADS.TIMEOUT_MS);

  try {
    const response = isProduction
      ? await fetch(CONFIG.LEADS.ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'omit',
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
      : await simulatedFetch();

    const body = await response.json().catch(() => null);
    return interpretResponse(response.status, body);
  } catch {
    return { type: 'failed' };
  } finally {
    clearTimeout(timeout);
  }
}
