import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  calculateBudget,
  formatAmount,
  leadMessage,
  leadService,
  visibleSteps,
  whatsappUrl,
} from './budgetRules.js';
import { CONFIG } from './config.js';
import { LIMITS, SERVICES } from './leadData.js';

const price = (key) => CONFIG.PRICING[key].MIN_PRICE;
const nothing = { web: 'no', maps: 'no', automatizar: 'no' };
const labels = (answers) => calculateBudget(answers).lines.map((item) => item.label);

const everyAnswer = ['tengo', 'landing', 'corporativa', 'avanzada', 'tienda', 'no'].flatMap((web) =>
  ['si', 'no'].flatMap((seo) =>
    ['mensual', 'puesta_a_punto', 'no'].flatMap((maps) =>
      ['si', 'no'].map((automatizar) => ({ web, seo, maps, automatizar }))
    )
  )
);

test('una web nueva nunca sale sin SEO', () => {
  for (const answers of everyAnswer.filter(({ web }) => !['tengo', 'no'].includes(web))) {
    const { lines } = calculateBudget(answers);
    assert.ok(
      lines.some((item) => item.monthly && /SEO/.test(item.label)),
      JSON.stringify(answers)
    );
  }
});

test('web aparte: pago único y SEO mensual por separado', () => {
  const budget = calculateBudget({ ...nothing, web: 'landing' });
  assert.equal(budget.once, price('WEB_LANDING'));
  assert.equal(budget.monthly, price('SEO_GENERAL'));
});

test('web pequeña con Maps mensual es el pack, sin pago inicial', () => {
  for (const web of ['landing', 'corporativa']) {
    const budget = calculateBudget({ ...nothing, web, maps: 'mensual' });
    assert.equal(budget.lines.length, 1);
    assert.equal(budget.once, 0);
    assert.equal(budget.monthly, price('PACK_VISIBILIDAD'));
    assert.match(budget.lines[0].note, /7 cuotas/);
  }
});

test('las webs avanzadas y las tiendas quedan fuera del pack', () => {
  const budget = calculateBudget({ ...nothing, web: 'tienda', maps: 'mensual' });
  assert.equal(budget.once, price('WEB_ECOMMERCE'));
  assert.equal(budget.monthly, price('SEO_GENERAL') + price('SEO_LOCAL'));
});

test('el SEO sin web nueva solo se suma si lo pide quien ya tiene web', () => {
  assert.deepEqual(labels({ ...nothing, web: 'tengo', seo: 'si' }), ['SEO de la web']);
  assert.deepEqual(labels({ ...nothing, web: 'tengo', seo: 'no' }), []);
  assert.deepEqual(labels({ ...nothing, seo: 'si' }), []);
});

test('el SEO de una web que ya existe pide 3 meses', () => {
  const [seo] = calculateBudget({ ...nothing, web: 'tengo', seo: 'si' }).lines;
  assert.match(seo.note, /3 meses/);
});

test('la pregunta del SEO solo sale a quien ya tiene web', () => {
  assert.deepEqual(visibleSteps({}), ['web', 'maps', 'automatizar']);
  assert.deepEqual(visibleSteps({ web: 'tengo' }), ['web', 'seo', 'maps', 'automatizar']);
});

test('la puesta a punto de la ficha es de pago único', () => {
  const budget = calculateBudget({ ...nothing, maps: 'puesta_a_punto' });
  assert.equal(budget.once, price('SEO_LOCAL_EXPRESS'));
  assert.equal(budget.monthly, 0);
});

test('los importes salen con punto de miles', () => {
  assert.equal(formatAmount(1150, false), 'desde 1.150 €');
  assert.equal(formatAmount(275, true), 'desde 275 €/mes');
});

test('lo que llega a Waboce siempre es válido', () => {
  for (const answers of everyAnswer) {
    assert.ok(SERVICES.includes(leadService(answers)), JSON.stringify(answers));
    assert.ok(leadMessage(calculateBudget(answers)).length <= LIMITS.message, JSON.stringify(answers));
  }
});

test('sin nada elegido no hay mensaje; las automatizaciones van sin precio', () => {
  assert.equal(leadMessage(calculateBudget(nothing)), '');
  const answers = { ...nothing, automatizar: 'si' };
  assert.equal(leadService(answers), 'automatizacion');
  assert.match(leadMessage(calculateBudget(answers)), /a presupuestar/);
});

test('el enlace de WhatsApp lleva el resumen, o el saludo de siempre si no hay nada', () => {
  const textOf = (answers) => new URL(whatsappUrl(calculateBudget(answers))).searchParams.get('text');
  assert.match(textOf({ ...nothing, web: 'landing' }), /Hola Nelson\. He usado[\s\S]*Landing page/);
  assert.equal(textOf(nothing), CONFIG.CONTACT.WHATSAPP_DEFAULT_MESSAGE);
});
