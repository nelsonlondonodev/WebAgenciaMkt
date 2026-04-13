const fs = require('fs').promises;
const { existsSync } = require('fs');
const path = require('path');

/**
 * CONFIGURACIÓN
 * Define los directorios a escanear y los archivos que requieren versionado.
 */
const DIST_PATH = __dirname;
const ASSETS_TO_VERSION = ['bundle.min.js', 'output.css', 'fontawesome.min.css', 'nelson-v4.css'];
const DIRECTORIES_TO_SCAN = ['', 'guia', 'cv', 'components'];

/**
 * GENERACIÓN DE VERSIÓN
 * Crea un identificador único basado en la fecha (Formato: YYYY.MM.DD.HHMM)
 */
function generateVersion() {
  const now = new Date();
  return `${now.getFullYear()}.${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}.${now
    .getHours()
    .toString()
    .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * ACTUALIZACIÓN DE ASSETS
 * Busca y actualiza las etiquetas src o href para incluir el parámetro de versión.
 */
function updateAssetUrls(content, version, fileName) {
  const escapedAssets = ASSETS_TO_VERSION.map(asset => asset.replace(/\./g, '\\.'));
  const assetsRegex = new RegExp(
    `(src|href)="((?:\\.\\./|\\./|/)?)( ${escapedAssets.join('|')})(?:\\?v=[0-9\\.]*)?"`,
    'g'
  );

  return content.replace(assetsRegex, (match, attr, prefix, asset) => {
    // Forzamos ruta absoluta desde la raíz (/) para evitar fallos de resolución en subcarpetas
    const newUrl = `${attr}="/${asset.trim()}?v=${version}"`;
    return newUrl;
  });
}

/**
 * INYECCIÓN EN FOOTER
 * Si el archivo es el componente de footer, inyecta la versión de forma visible.
 */
function injectFooterVersion(content, version, fileName) {
  if (!fileName.includes('footer.html')) return content;
  
  const versionRegex = /<span id="footer-build-version">.*?<\/span>/g;
  console.log(`[Build] Inyectando versión en footer: v.${version}`);
  return content.replace(versionRegex, `<span id="footer-build-version">v.${version}</span>`);
}

/**
 * PROCESAMIENTO DE ARCHIVO
 * Lee, transforma y guarda el archivo de forma asíncrona.
 */
async function processFile(relativeFilePath, version) {
  const absolutePath = path.join(DIST_PATH, relativeFilePath);
  
  try {
    const data = await fs.readFile(absolutePath, 'utf8');
    let updatedData = updateAssetUrls(data, version, relativeFilePath);
    updatedData = injectFooterVersion(updatedData, version, relativeFilePath);
    
    await fs.writeFile(absolutePath, updatedData, 'utf8');
    console.log(`[✓] Optimizado: ${relativeFilePath}`);
  } catch (error) {
    console.error(`[X] Error en ${relativeFilePath}:`, error.message);
  }
}

/**
 * ORQUESTADOR PRINCIPAL
 */
async function main() {
  console.log('--- Iniciando Cache Buster (Surgery Mode) ---');
  const version = generateVersion();
  const htmlFiles = [];

  try {
    for (const dir of DIRECTORIES_TO_SCAN) {
      const fullPath = path.join(DIST_PATH, dir);
      if (!existsSync(fullPath)) continue;

      const files = await fs.readdir(fullPath);
      files
        .filter(file => file.endsWith('.html'))
        .forEach(file => htmlFiles.push(path.join(dir, file)));
    }

    if (htmlFiles.length === 0) {
      console.log('No se encontraron archivos HTML para procesar.');
      return;
    }

    // Procesamos todos los archivos en paralelo para máxima velocidad
    await Promise.all(htmlFiles.map(file => processFile(file, version)));
    console.log(`--- Operación Finalizada Correctamente (v.${version}) ---`);
    
  } catch (error) {
    console.error('Error crítico durante la ejecución:', error);
    process.exit(1);
  }
}

main();
