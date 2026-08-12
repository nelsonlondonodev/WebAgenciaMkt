/**
 * Valida los bloques JSON-LD de todas las páginas antes de publicar.
 *
 * Existe porque Search Console reportó 4 errores de "Datos estructurados de
 * Vídeos" que venían de un VideoObject anidado dentro de isPartOf con solo
 * name y url. Google valida TODOS los nodos tipados VideoObject del grafo,
 * no solo los de primer nivel, así que un nodo incompleto en cualquier
 * profundidad rompe los resultados enriquecidos de la página entera.
 *
 * Falla el build si encuentra un problema. Referenciar una entidad ya
 * declarada en otro sitio con { "@id": "..." } (sin "@type") es la forma
 * correcta y no dispara ninguna validación.
 */

const fs = require('fs');
const path = require('path');

const LD_JSON = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

// https://developers.google.com/search/docs/appearance/structured-data/video
const VIDEO_REQUIRED = ['name', 'description', 'thumbnailUrl', 'uploadDate'];

const errors = [];

function checkVideoObject(node, file, jsonPath) {
  const missing = VIDEO_REQUIRED.filter((field) => !(field in node));
  if (!('contentUrl' in node) && !('embedUrl' in node)) {
    missing.push('contentUrl o embedUrl');
  }
  if (missing.length === 0) return;

  const label = node.name || node['@id'] || '(sin nombre)';
  errors.push(
    `${file} → ${jsonPath}\n` +
      `    VideoObject "${label}"\n` +
      `    faltan: ${missing.join(', ')}\n` +
      `    Si solo quieres referenciar un vídeo declarado en otra página, usa\n` +
      `    { "@id": "https://..." } sin "@type": Google no valida nodos sin tipo.`
  );
}

function walk(node, file, jsonPath) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, file, `${jsonPath}[${i}]`));
    return;
  }
  if (!node || typeof node !== 'object') return;

  const types = [].concat(node['@type'] || []);
  if (types.includes('VideoObject')) checkVideoObject(node, file, jsonPath);

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('@')) continue;
    walk(value, file, `${jsonPath}/${key}`);
  }
}

function htmlFiles(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, found);
    else if (entry.name.endsWith('.html')) found.push(full);
  }
  return found;
}

const files = htmlFiles(process.cwd());
let blocks = 0;

for (const file of files) {
  const rel = path.relative(process.cwd(), file);
  const html = fs.readFileSync(file, 'utf8');
  let match;
  let index = 0;

  while ((match = LD_JSON.exec(html)) !== null) {
    const jsonPath = `ld+json[${index++}]`;
    blocks++;
    let data;
    try {
      data = JSON.parse(match[1]);
    } catch (err) {
      errors.push(`${rel} → ${jsonPath}\n    JSON inválido: ${err.message}`);
      continue;
    }
    walk(data, rel, jsonPath);
  }
}

if (errors.length > 0) {
  console.error(`\n❌ Datos estructurados inválidos (${errors.length}):\n`);
  errors.forEach((e) => console.error(`  ${e}\n`));
  process.exit(1);
}

console.log(
  `✅ Datos estructurados OK: ${blocks} bloques JSON-LD en ${files.length} páginas.`
);
