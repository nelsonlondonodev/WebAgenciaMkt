/**
 * @file generar-sitemap.js
 * @description Generador de sitemap dinámico y escalable para nelsonlondono.es.
 * Escanea el proyecto, filtra contenidos privados (como /guia/) y asigna prioridades SEO.
 * 
 * @author Nelson Londoño - Agencia Web
 * @version 2.1.0
 */

const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { readdir, readFile, stat } = require('fs/promises');
const path = require('path');

// --- CONFIGURACIÓN CENTRALIZADA ---

const HOSTNAME = 'https://nelsonlondono.es';
const OUTPUT_FILE = 'sitemap.xml';
const SITEMAP_PATH = path.resolve(__dirname, OUTPUT_FILE);

/** @description Rutas que nunca deben aparecer en el sitemap */
const EXCLUDED_PATHS = [
  '/guia/',           // Lead Magnet/Comunidad privada
  '/_template',       // Plantilla interna
  '/404',             // Página de error
  '/google',          // Archivos de verificación
  '/guia-para-pdf',   // Herramienta interna de maquetación
  '/politica-de-cookies' // Excluida por Noindex
];

/** @description Directorios del sistema a ignorar durante el escaneo */
const IGNORED_DIRS = [
  'node_modules', '.git', '.gemini', 'src', 'components', 
  'image', 'webfonts', '.github', '.vscode'
];

/** @description Jerarquía de prioridades SEO */
const PRIORITY_MAP = {
  HOME: 1.0,
  SERVICE: 0.9,
  CONTACT: 0.9,
  LISTING: 0.8, // Blog, Proyectos
  ABOUT: 0.8,
  ARTICLE: 0.7,
  DEFAULT: 0.6
};

// --- FUNCIONES DE UTILIDAD (CLEAN CODE) ---

/**
 * Determina si un archivo es un template o archivo de sistema
 * @param {string} filename 
 * @returns {boolean}
 */
const isInternalFile = (filename) => {
  if (!filename.endsWith('.html')) return true;
  return ['404.html', '_template', 'guia-para-pdf'].some(p => filename.includes(p));
};

/**
 * Verifica si el archivo tiene la etiqueta meta noindex
 * @param {string} filePath 
 * @returns {Promise<boolean>}
 */
async function hasNoIndexTag(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    return content.includes('content="noindex"');
  } catch (error) {
    return true; // Ante error, protegemos la indexación
  }
}

/**
 * Limpia y normaliza la ruta del archivo para convertirla en URL
 * @param {string} relativePath 
 * @returns {string}
 */
const normalizeUrl = (relativePath) => {
  let url = '/' + relativePath.replace(/\\/g, '/'); // Asegurar slashes de URL
  if (url.endsWith('index.html')) url = url.replace('index.html', '');
  return url.replace(/\/+/g, '/'); // Evitar doble slashes
};

/**
 * Asigna la prioridad SEO basada en el patrón de la URL
 * @param {string} url 
 * @returns {number}
 */
const calculatePriority = (url) => {
  if (url === '/') return PRIORITY_MAP.HOME;
  if (url.includes('agencia-')) return PRIORITY_MAP.SERVICE;
  if (url === '/contacto.html') return PRIORITY_MAP.CONTACT;
  if (url === '/blog.html' || url === '/proyectos.html') return PRIORITY_MAP.LISTING;
  if (url === '/sobre-mi.html') return PRIORITY_MAP.ABOUT;
  if (url.includes('articulo-')) return PRIORITY_MAP.ARTICLE;
  return PRIORITY_MAP.DEFAULT;
};

// --- LÓGICA DE ESCANEO ---

/**
 * Escanea el directorio buscando archivos indexables
 * @param {string} directory 
 * @param {string} baseUrl 
 */
async function getIndexableFiles(directory, baseUrl = '') {
  let results = [];
  const items = await readdir(directory);

  for (const item of items) {
    const fullPath = path.join(directory, item);
    const relativePath = path.join(baseUrl, item);

    if (item.startsWith('.') || IGNORED_DIRS.includes(item)) continue;

    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      results = results.concat(await getIndexableFiles(fullPath, relativePath));
    } else if (stats.isFile() && !isInternalFile(item)) {
      if (!(await hasNoIndexTag(fullPath))) {
        results.push(relativePath);
      }
    }
  }
  return results;
}

// --- FUNCIÓN PRINCIPAL (ORQUESTADOR) ---

async function runGenerator() {
  console.log('🚀 [SEO Master] Iniciando análisis del proyecto...');
  
  try {
    const files = await getIndexableFiles(__dirname);
    const sitemapLinks = [];

    for (const file of files) {
      const url = normalizeUrl(file);

      // Filtro de exclusión manual (Seguridad extra)
      if (EXCLUDED_PATHS.some(p => url.startsWith(p))) {
        console.log(`  - Ignorado (Exclusión): ${url}`);
        continue;
      }

      const priority = calculatePriority(url);
      sitemapLinks.push({
        url,
        changefreq: url === '/blog.html' ? 'weekly' : 'monthly',
        priority
      });

      console.log(`  + Mapeado: ${url} (Prioridad: ${priority})`);
    }

    // Generar XML
    const stream = new SitemapStream({ hostname: HOSTNAME });
    const xmlStream = createWriteStream(SITEMAP_PATH);
    
    stream.pipe(xmlStream);
    sitemapLinks.forEach(link => stream.write(link));
    stream.end();

    await streamToPromise(stream);
    console.log(`\n✅ SUCESO: Sitemap generado con ${sitemapLinks.length} entradas.`);
    console.log(`📂 Ruta: ${SITEMAP_PATH}`);

  } catch (error) {
    console.error('❌ ERROR FATAL:', error.message);
    process.exit(1);
  }
}

// Ejecutar
runGenerator();