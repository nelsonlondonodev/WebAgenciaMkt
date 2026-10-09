/**
 * Inyecta components/nav.html dentro del HTML de las páginas que llevan el
 * navbar en línea, entre <!-- nav:start ... --> y <!-- nav:end -->.
 *
 * Existe porque index, proyectos y sobre-mi copiaron el navbar a mano para
 * evitar FOUC y CLS, y las copias se quedaron atrás: a proyectos le faltaban
 * Software & SaaS y GEO. Así el navbar sigue en línea (sin fetch) pero tiene
 * una sola fuente. Las demás páginas lo cargan con #nav-placeholder.
 *
 * Con --check no escribe nada y falla si alguna página no coincide con el
 * componente: lo usa validate-schema.js para que el build no deje pasar una
 * edición hecha a mano dentro de los marcadores.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const COMPONENT = path.join(ROOT, 'components', 'nav.html');
const PAGES = ['index.html', 'proyectos.html', 'sobre-mi.html'];
const BLOCK = /(<!-- nav:start[^>]*-->)[\s\S]*?(<!-- nav:end -->)/;
const INDENT = '    ';

function render() {
  const html = fs.readFileSync(COMPONENT, 'utf8').trimEnd();
  return html
    .split('\n')
    .map((line) => (line ? INDENT + line : line))
    .join('\n');
}

function inject({ check = false } = {}) {
  const nav = render();
  const problems = [];

  for (const page of PAGES) {
    const file = path.join(ROOT, page);
    const html = fs.readFileSync(file, 'utf8');
    if (!BLOCK.test(html)) {
      problems.push(`${page}: no tiene los marcadores <!-- nav:start --> / <!-- nav:end -->`);
      continue;
    }
    const updated = html.replace(BLOCK, (_, start, end) => `${start}\n${nav}\n${INDENT}${end}`);
    if (updated === html) continue;
    if (check) problems.push(`${page}: el navbar no coincide con components/nav.html (ejecuta pnpm build)`);
    else fs.writeFileSync(file, updated);
  }
  return problems;
}

module.exports = { inject };

if (require.main === module) {
  const problems = inject({ check: process.argv.includes('--check') });
  if (problems.length > 0) {
    console.error(`\n❌ Navbar en línea:\n`);
    problems.forEach((p) => console.error(`  ${p}`));
    process.exit(1);
  }
  console.log(`✅ Navbar en línea sincronizado en ${PAGES.length} páginas.`);
}
