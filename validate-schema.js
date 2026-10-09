/**
 * Valida los bloques JSON-LD de todas las páginas antes de publicar.
 *
 * Existe porque Search Console reportó 4 errores de "Datos estructurados de
 * Vídeos" que venían de un VideoObject anidado dentro de isPartOf con solo
 * name y url. Google valida TODOS los nodos tipados VideoObject del grafo,
 * no solo los de primer nivel, así que un nodo incompleto en cualquier
 * profundidad rompe los resultados enriquecidos de la página entera.
 *
 * También comprueba que cada pregunta y respuesta de un FAQPage aparezca
 * literal en el texto visible de la página: Google lo exige, y en el lote de
 * la v1.4.0 seis páginas divergían (casi siempre por comillas simples en el
 * marcado y dobles en pantalla), cada una arreglada a mano.
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

// Las etiquetas en línea se quitan sin dejar hueco ("GEO (<em>Generative</em>)"
// debe leerse igual que en el marcado); las de bloque separan palabras.
const INLINE_TAG = /<\/?(a|abbr|b|code|em|i|mark|small|span|strong|sub|sup)\b[^>]*>/gi;

const ENTITIES = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

// Texto plano comparable: sin etiquetas, con entidades decodificadas y los
// espacios colapsados. Las comillas NO se normalizan: que difieran es
// precisamente el fallo que se quiere detectar.
function plainText(html) {
  return html
    .replace(INLINE_TAG, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
}

function visibleText(html) {
  return plainText(
    html
      .replace(/<head[\s\S]*?<\/head>/i, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1>/gi, ' ')
  );
}

function checkFaqPage(node, file, jsonPath, visible) {
  [].concat(node.mainEntity || []).forEach((question, i) => {
    const answer = question.acceptedAnswer || {};
    const parts = [
      ['pregunta', question.name],
      ['respuesta', answer.text],
    ];
    for (const [label, raw] of parts) {
      if (typeof raw !== 'string') continue;
      const text = plainText(raw);
      if (visible.includes(text)) continue;
      errors.push(
        `${file} → ${jsonPath}/mainEntity[${i}]\n` +
          `    FAQPage: la ${label} no aparece literal en la página\n` +
          `    "${text}"\n` +
          `    Google exige que el FAQPage sea idéntico a lo visible (ojo a las comillas).`
      );
    }
  });
}

function walk(node, file, jsonPath, visible) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, file, `${jsonPath}[${i}]`, visible));
    return;
  }
  if (!node || typeof node !== 'object') return;

  const types = [].concat(node['@type'] || []);
  if (types.includes('VideoObject')) checkVideoObject(node, file, jsonPath);
  if (types.includes('FAQPage')) checkFaqPage(node, file, jsonPath, visible);

  // Se recorren también las claves con @, porque @graph es un array de nodos
  // y es justo donde vive el grafo de index.html y agencia-seo-local.html.
  // Saltarlas dejaba sin revisar precisamente las páginas que motivaron este
  // validador. Las que son strings (@context, @id, @type) las descarta la
  // guarda de arriba al no ser objetos.
  for (const [key, value] of Object.entries(node)) {
    if (key === '@type') continue;
    walk(value, file, `${jsonPath}/${key}`, visible);
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
  const visible = visibleText(html);
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
    walk(data, rel, jsonPath, visible);
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
