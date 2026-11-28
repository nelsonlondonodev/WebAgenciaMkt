import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { buildLeadPayload, interpretResponse, normalizePhone, validateLead, withPrefix } from './leadData.js';

const valid = { name: 'Ana', phone: '600 111 222', service: 'web', message: '', website: '', privacyAccepted: true };

test('el teléfono sale siempre con prefijo', () => {
  assert.equal(normalizePhone('600 111 222'), '+34600111222');
  assert.equal(normalizePhone('0034 600-111-222'), '+34600111222');
  assert.equal(normalizePhone('+57 (300) 123.4567'), '+573001234567');
  for (const bad of ['', '911222333', '34600111222', '60011122', '+0123456789', 'hola']) {
    assert.equal(normalizePhone(bad), null, bad);
  }
});

test('cada campo da su error', () => {
  assert.deepEqual(validateLead(valid), {});
  assert.deepEqual(validateLead({ ...valid, name: '' }), { name: 'required' });
  assert.deepEqual(validateLead({ ...valid, name: 'a'.repeat(121) }), { name: 'too_long' });
  assert.deepEqual(validateLead({ ...valid, name: 'Привет' }), { name: 'invalid' });
  assert.deepEqual(validateLead({ ...valid, phone: '' }), { phone: 'required' });
  assert.deepEqual(validateLead({ ...valid, phone: '12' }), { phone: 'invalid' });
  assert.deepEqual(validateLead({ ...valid, service: '' }), { service: 'required' });
  assert.deepEqual(validateLead({ ...valid, service: 'otro' }), { service: 'invalid' });
  assert.deepEqual(validateLead({ ...valid, message: 'a'.repeat(1001) }), { message: 'too_long' });
  assert.deepEqual(validateLead({ ...valid, privacyAccepted: false }), { privacy_accepted: 'not_accepted' });
  assert.deepEqual(validateLead({ ...valid, message: 'https://a.es https://b.es https://c.es' }), {});
});

test('el cuerpo cumple el contrato', () => {
  const context = { site: 'nelsonlondono', privacyVersion: '2026-11', page: '/contacto.html', elapsedMs: 8400.6 };
  assert.deepEqual(buildLeadPayload(valid, context), {
    site: 'nelsonlondono', name: 'Ana', phone: '+34600111222', service: 'web', page: '/contacto.html',
    privacy_accepted: true, privacy_version: '2026-11', website: '', elapsed_ms: 8401,
  });
  assert.equal(buildLeadPayload({ ...valid, message: 'Hola' }, context).message, 'Hola');
});

test('cada respuesta hace lo suyo', () => {
  assert.equal(interpretResponse(201, { ok: true }).type, 'success');
  assert.equal(interpretResponse(201, null).type, 'failed');
  assert.deepEqual(interpretResponse(400, { fields: { phone: 'invalid' } }), { type: 'fields', fields: { phone: 'invalid' } });
  assert.equal(interpretResponse(400, { fields: { site: 'invalid' } }).type, 'failed');
  assert.equal(interpretResponse(400, { error: 'invalid_body' }).type, 'failed');
  assert.equal(interpretResponse(403, {}).type, 'failed');
  assert.equal(interpretResponse(429, {}).type, 'rate_limited');
  assert.equal(interpretResponse(500, null).type, 'failed');
});

test('la versión enviada es la de la política publicada', () => {
  const config = readFileSync(new URL('./config.js', import.meta.url), 'utf8');
  const version = /PRIVACY_VERSION: '([^']+)'/.exec(config)[1];
  const page = readFileSync(new URL('../../politica-de-privacidad.html', import.meta.url), 'utf8');
  assert.ok(page.includes(`data-privacy-version="${version}"`));
});

test('el prefijo del desplegable completa el número', () => {
  const sent = (prefix, raw) => normalizePhone(withPrefix(prefix, raw));
  assert.equal(sent('+57', '300 123 4567'), '+573001234567');
  assert.equal(sent('+44', '07911 123456'), '+447911123456');
  assert.equal(sent('+34', '600 111 222'), '+34600111222');
  // Si ya trae código, no se duplica ni se pisa.
  assert.equal(sent('+34', '+57 300 123 4567'), '+573001234567');
  assert.equal(sent('+57', '0049 1512 3456789'), '+4915123456789');
  // «Otro país»: el código va en el número, con o sin +.
  assert.equal(sent('+', '61 412 345 678'), '+61412345678');
  // España sigue pidiendo un móvil; sin desplegable no cambia nada.
  assert.equal(sent('+34', '911 222 333'), null);
  assert.equal(sent(null, '600 111 222'), '+34600111222');
  assert.equal(withPrefix('+57', ''), '');
});

