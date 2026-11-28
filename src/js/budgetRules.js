// src/js/budgetRules.js
// Reglas de la calculadora de presupuesto, sin DOM: se prueban con `pnpm test`.
import { CONFIG } from './config.js';
import { formatPrice } from './pricing.js';

const { PRICING } = CONFIG;

/**
 * @typedef {object} Answers
 * @property {'tengo'|'landing'|'corporativa'|'avanzada'|'tienda'|'no'} web
 * @property {'si'|'no'} [seo] - Solo se pregunta a quien ya tiene web.
 * @property {'mensual'|'puesta_a_punto'|'no'} maps
 * @property {'si'|'no'} automatizar
 */

/**
 * @typedef {object} BudgetLine
 * @property {string} label
 * @property {number} amount - Precio «desde», en euros.
 * @property {boolean} monthly
 * @property {string} note
 */

const NEW_WEBS = {
  landing: { label: 'Landing page', pricing: PRICING.WEB_LANDING },
  corporativa: { label: 'Web corporativa (hasta 5 secciones)', pricing: PRICING.WEB_CORPORATIVA },
  avanzada: { label: 'Web avanzada (6 a 10 páginas)', pricing: PRICING.WEB_AVANZADA },
  tienda: { label: 'Tienda online', pricing: PRICING.WEB_ECOMMERCE },
};

/** El pack incluye una web de hasta 6 páginas: las avanzadas y las tiendas quedan fuera. */
const PACK_WEBS = ['landing', 'corporativa'];

const line = (label, pricing, monthly, note) => ({ label, amount: pricing.MIN_PRICE, monthly, note });

/**
 * @param {Answers} answers
 * @returns {BudgetLine[]}
 */
function budgetLines({ web, seo, maps }) {
  const newWeb = NEW_WEBS[web];

  if (PACK_WEBS.includes(web) && maps === 'mensual') {
    return [
      line(
        'Pack web + SEO local + SEO + GEO',
        PRICING.PACK_VISIBILIDAD,
        true,
        'Web de hasta 6 páginas incluida, sin pago inicial. Permanencia de 6 meses desde que se publica la web: con el primer mes de ficha son 7 cuotas como mínimo.'
      ),
    ];
  }

  const lines = [];
  if (newWeb) {
    lines.push(line(newWeb.label, newWeb.pricing, false, 'Pago único.'));
    lines.push(
      line('SEO de la web', PRICING.SEO_GENERAL, true, 'Va siempre con la web: mínimo 6 meses desde el lanzamiento.')
    );
  } else if (web === 'tengo' && seo === 'si') {
    lines.push(line('SEO de la web', PRICING.SEO_GENERAL, true, 'Mínimo 3 meses.'));
  }

  if (maps === 'mensual') {
    lines.push(line('SEO local en Google Maps', PRICING.SEO_LOCAL, true, 'Mínimo 3 meses.'));
  } else if (maps === 'puesta_a_punto') {
    lines.push(line('Puesta a punto de la ficha de Google', PRICING.SEO_LOCAL_EXPRESS, false, 'Pago único.'));
  }

  return lines;
}

const total = (lines, monthly) =>
  lines.filter((item) => item.monthly === monthly).reduce((sum, item) => sum + item.amount, 0);

/**
 * Preguntas que se hacen, en orden: la del SEO solo a quien ya tiene web.
 * @param {Partial<Answers>} answers
 * @returns {Array<keyof Answers>}
 */
export function visibleSteps({ web }) {
  return web === 'tengo' ? ['web', 'seo', 'maps', 'automatizar'] : ['web', 'maps', 'automatizar'];
}

/**
 * @param {Answers} answers
 * @returns {{lines: BudgetLine[], once: number, monthly: number, custom: string[]}}
 *   `custom` es lo que no tiene precio publicado y se presupuesta tras hablarlo.
 */
export function calculateBudget(answers) {
  const lines = budgetLines(answers);
  return {
    lines,
    once: total(lines, false),
    monthly: total(lines, true),
    custom: answers.automatizar === 'si' ? ['Automatizaciones y software a medida'] : [],
  };
}

/** «desde 1.150 €» o «desde 275 €/mes». */
export function formatAmount(amount, monthly) {
  return `desde ${formatPrice(amount)} €${monthly ? '/mes' : ''}`;
}

/**
 * Opción del formulario de contacto que mejor describe las respuestas.
 * @param {Answers} answers
 * @returns {'web'|'seo_local'|'automatizacion'|'no_lo_se'}
 */
export function leadService({ web, seo, maps, automatizar }) {
  if (NEW_WEBS[web]) return 'web';
  if (maps !== 'no' || (web === 'tengo' && seo === 'si')) return 'seo_local';
  return automatizar === 'si' ? 'automatizacion' : 'no_lo_se';
}

/**
 * Resumen que acompaña al lead en el campo de mensaje.
 * @param {ReturnType<typeof calculateBudget>} budget
 * @returns {string} Vacío si no hay nada que resumir.
 */
export function leadMessage({ lines, custom }) {
  const items = [
    ...lines.map((item) => `- ${item.label}: ${formatAmount(item.amount, item.monthly)}`),
    ...custom.map((label) => `- ${label}: a presupuestar`),
  ];
  return items.length ? ['He usado la calculadora de presupuesto (precios con IVA incluido):', ...items].join('\n') : '';
}

/**
 * Enlace para escribir por WhatsApp con el resumen ya puesto.
 * @param {ReturnType<typeof calculateBudget>} budget
 */
export function whatsappUrl(budget) {
  const summary = leadMessage(budget);
  const text = summary ? `Hola Nelson. ${summary}` : CONFIG.CONTACT.WHATSAPP_DEFAULT_MESSAGE;
  return `https://wa.me/${CONFIG.CONTACT.WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
