const fs = require('fs').promises;
const { existsSync } = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * CACHE BUSTER POR CONTENIDO
 *
 * Las versiones salen del hash del contenido, no de la hora del build: así un
 * build sin cambios no reescribe nada y una página solo cambia cuando cambia
 * de verdad el recurso que enlaza.
 *
 * Va en dos pasos porque el bundle incluye APP_VERSION:
 *   node cache-buster.js componentes  → antes de build:js
 *     Footer con la versión de package.json y APP_VERSION = hash de components/.
 *   node cache-buster.js assets       → después de build:js
 *     ?v= de cada recurso = hash de su propio contenido.
 */
const ROOT = __dirname;
const ASSETS_TO_VERSION = [
  'bundle-v2.min.js',
  'output.css',
  'fontawesome.min.css',
  'nelson-v4.css',
];
const DIRECTORIES_TO_SCAN = ['', 'guia', 'cv', 'components'];
const COMPONENTS_DIR = 'components';
const CONFIG_FILE = 'src/js/config.js';

const shortHash = (content) =>
  crypto.createHash('sha256').update(content).digest('hex').slice(0, 8);

async function listHtmlFiles() {
  const htmlFiles = [];
  for (const dir of DIRECTORIES_TO_SCAN) {
    const fullPath = path.join(ROOT, dir);
    if (!existsSync(fullPath)) continue;
    const files = await fs.readdir(fullPath);
    files
      .filter((file) => file.endsWith('.html'))
      .sort()
      .forEach((file) => htmlFiles.push(path.join(dir, file)));
  }
  return htmlFiles;
}

/** Aplica `transform` y solo escribe si el contenido ha cambiado. */
async function rewriteFile(relativePath, transform) {
  const absolutePath = path.join(ROOT, relativePath);
  const data = await fs.readFile(absolutePath, 'utf8');
  const updated = transform(data);
  if (updated === data) return false;
  await fs.writeFile(absolutePath, updated, 'utf8');
  console.log(`[✓] Actualizado: ${relativePath}`);
  return true;
}

/**
 * PASO 1: COMPONENTES
 * El footer muestra la versión de package.json; después se calcula el hash de
 * components/ (ya con ese footer) y se guarda en APP_VERSION, que
 * componentLoader.js usa como ?v= al pedir cada componente.
 */
async function versionComponents() {
  const { version } = JSON.parse(
    await fs.readFile(path.join(ROOT, 'package.json'), 'utf8')
  );
  const footerRegex = /<span id="footer-build-version">.*?<\/span>/g;
  const footerSpan = `<span id="footer-build-version">v${version}</span>`;

  for (const file of await listHtmlFiles()) {
    await rewriteFile(file, (content) =>
      content.replace(footerRegex, footerSpan)
    );
  }

  const componentsPath = path.join(ROOT, COMPONENTS_DIR);
  const componentFiles = (await fs.readdir(componentsPath))
    .filter((file) => file.endsWith('.html'))
    .sort();
  const hash = crypto.createHash('sha256');
  for (const file of componentFiles) {
    hash.update(file);
    hash.update(await fs.readFile(path.join(componentsPath, file)));
  }
  const appVersion = hash.digest('hex').slice(0, 8);

  await rewriteFile(CONFIG_FILE, (content) =>
    content.replace(/APP_VERSION:\s*'[^']*'/, `APP_VERSION: '${appVersion}'`)
  );
  console.log(
    `--- Componentes: footer v${version}, APP_VERSION ${appVersion} ---`
  );
}

/**
 * PASO 2: ASSETS
 * Cada src/href a un recurso versionado pasa a /recurso?v=<hash del recurso>.
 * Se fuerza la ruta absoluta para que funcione en subcarpetas (guia/, cv/).
 */
async function versionAssets() {
  const versions = {};
  for (const asset of ASSETS_TO_VERSION) {
    const assetPath = path.join(ROOT, asset);
    if (!existsSync(assetPath)) continue;
    versions[asset] = shortHash(await fs.readFile(assetPath));
  }

  const escaped = Object.keys(versions).map((asset) =>
    asset.replace(/\./g, '\\.')
  );
  const assetsRegex = new RegExp(
    `(src|href)="(?:\\.\\./|\\./|/)?(${escaped.join('|')})(?:\\?v=[0-9a-z.]*)?"`,
    'g'
  );

  for (const file of await listHtmlFiles()) {
    await rewriteFile(file, (content) =>
      content.replace(
        assetsRegex,
        (match, attr, asset) => `${attr}="/${asset}?v=${versions[asset]}"`
      )
    );
  }
  console.log(
    `--- Assets: ${Object.entries(versions)
      .map(([asset, v]) => `${asset}?v=${v}`)
      .join(', ')} ---`
  );
}

const STEPS = { componentes: versionComponents, assets: versionAssets };

async function main() {
  const step = STEPS[process.argv[2]];
  if (!step) {
    console.error(
      `Uso: node cache-buster.js <${Object.keys(STEPS).join('|')}>`
    );
    process.exit(1);
  }
  await step();
}

main().catch((error) => {
  console.error('Error crítico en cache-buster:', error);
  process.exit(1);
});
