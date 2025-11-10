const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

// ¡CORREGIDO! Solo incluimos la URL principal.
const links = [
  { url: '/', changefreq: 'monthly', priority: 1.0 },
  { url: '/blog.html', changefreq: 'weekly', priority: 0.8 },
  { url: '/articulo-ejemplo.html', changefreq: 'monthly', priority: 0.7 },
  {
    url: '/articulo-seo-post-fiestas.html',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    url: '/articulo-redes-sociales-publicidad-local.html',
    changefreq: 'monthly',
    priority: 0.7,
  },
];

// --- DECISIÓN IMPORTANTE ---
// Elige tu dominio preferido (canónico). Se recomienda sin "www".
// Esta URL se debe usar en TODAS PARTES (Google Search Console, Google Analytics, etc).
const hostname = 'https://nelsonlondono.es';

// Ruta de destino para el sitemap (esto no cambia)
const dest = path.resolve(__dirname, 'sitemap.xml');

async function generateSitemap() {
  const stream = new SitemapStream({ hostname });
  const xmlStream = createWriteStream(dest);
  stream.pipe(xmlStream);

  links.forEach((link) => {
    stream.write(link);
  });

  stream.end();
  await streamToPromise(stream);
  console.log(
    `✅ Sitemap generado correctamente en ${dest} con la URL: ${hostname}`
  );
}

generateSitemap();
