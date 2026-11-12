/**
 * Inyecta en el HTML, entre marcadores <!-- X:start ... --> y <!-- X:end -->,
 * bloques que tienen una sola fuente:
 *
 * - nav: components/nav.html en index, proyectos y sobre-mi. Copiaron el
 *   navbar a mano para evitar FOUC y CLS, y las copias se quedaron atrás (a
 *   proyectos le faltaban Software & SaaS y GEO). Las demás páginas lo
 *   cargan con #nav-placeholder.
 * - portfolio: las tarjetas de src/js/data/portfolio.js en proyectos. Antes
 *   había tarjetas estáticas y además el JS las regeneraba al cargar. La
 *   home pinta las suyas con JS desde la misma plantilla (portfolioCards.js).
 * - shorts: las tarjetas del carrusel de la home (carruselHome en
 *   src/js/data/videos.js, shortCards.js). Antes cada Short eran ~45 líneas
 *   copiadas a mano.
 * - video: el botón-fachada de cada vídeo incrustado en una página, entre
 *   <!-- video:start ID --> y <!-- video:end -->, desde src/js/data/videos.js
 *   (videoFacadeTemplate.js). Antes estaba copiado a mano en cada página.
 *
 * Así el contenido sigue en el HTML (sin fetch ni JS) con una sola fuente.
 *
 * Con --check no escribe nada y falla si alguna página no coincide con el
 * fuente: lo usa validate-schema.js para que el build no deje pasar una
 * edición hecha a mano dentro de los marcadores.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const { renderPortfolioHtml } = require('./src/js/portfolioCards.js');
const { renderShortsHtml } = require('./src/js/shortCards.js');
const { renderVideoFacade } = require('./src/js/videoFacadeTemplate.js');
const { videos } = require('./src/js/data/videos.js');

function component(name) {
  return () => fs.readFileSync(path.join(ROOT, 'components', `${name}.html`), 'utf8');
}

// marcador → { página: () => html }
const BLOCKS = {
  nav: {
    'index.html': component('nav'),
    'proyectos.html': component('nav'),
    'sobre-mi.html': component('nav'),
  },
  portfolio: {
    'proyectos.html': () => renderPortfolioHtml({ priority: true }),
  },
  shorts: {
    'index.html': () => renderShortsHtml(),
  },
};

// Respeta la sangría del marcador y quita las líneas vacías y los espacios
// sobrantes que dejan las plantillas, para que el HTML quede legible.
function indent(html, pad) {
  return html
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim())
    .map((line) => pad + line)
    .join('\n');
}

function inject({ check = false } = {}) {
  const problems = [];
  const pages = new Map();
  const read = (page) => {
    if (!pages.has(page)) pages.set(page, fs.readFileSync(path.join(ROOT, page), 'utf8'));
    return pages.get(page);
  };

  for (const [name, targets] of Object.entries(BLOCKS)) {
    const block = new RegExp(`([ \\t]*)(<!-- ${name}:start[^>]*-->)[\\s\\S]*?(<!-- ${name}:end -->)`);
    for (const [page, render] of Object.entries(targets)) {
      const html = read(page);
      if (!block.test(html)) {
        problems.push(`${page}: no tiene los marcadores <!-- ${name}:start --> / <!-- ${name}:end -->`);
        continue;
      }
      pages.set(
        page,
        html.replace(block, (_, pad, start, end) => `${pad}${start}\n${indent(render(), pad)}\n${pad}${end}`)
      );
    }
  }

  // Vídeos de las páginas: un marcador por vídeo, con su id en el de apertura.
  const video = /([ \t]*)(<!-- video:start ([\w-]+) -->)[\s\S]*?(<!-- video:end -->)/g;
  for (const page of fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'))) {
    const html = read(page);
    pages.set(
      page,
      html.replace(video, (whole, pad, start, id, end) => {
        if (!videos[id]) {
          problems.push(`${page}: el vídeo ${id} no está en src/js/data/videos.js`);
          return whole;
        }
        return `${pad}${start}\n${indent(renderVideoFacade(id, videos[id]), pad)}\n${pad}${end}`;
      })
    );
  }

  for (const [page, updated] of pages) {
    const file = path.join(ROOT, page);
    if (updated === fs.readFileSync(file, 'utf8')) continue;
    if (check) problems.push(`${page}: un bloque generado no coincide con su fuente (ejecuta pnpm build)`);
    else fs.writeFileSync(file, updated);
  }
  return problems;
}

module.exports = { inject };

if (require.main === module) {
  const problems = inject({ check: process.argv.includes('--check') });
  if (problems.length > 0) {
    console.error(`\n❌ Bloques generados:\n`);
    problems.forEach((p) => console.error(`  ${p}`));
    process.exit(1);
  }
  console.log('✅ Bloques generados sincronizados (nav, portfolio, shorts y vídeos).');
}
