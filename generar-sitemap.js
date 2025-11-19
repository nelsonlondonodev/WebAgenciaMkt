const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream, readdirSync } = require('fs');
const path = require('path');

// --- DECISIÓN IMPORTANTE ---
// Elige tu dominio preferido (canónico). Se recomienda sin "www".
// Esta URL se debe usar en TODAS PARTES (Google Search Console, Google Analytics, etc).
const hostname = 'https://nelsonlondono.es';
const distPath = path.resolve(__dirname, 'dist');
const sitemapPath = path.resolve(distPath, 'sitemap.xml');

async function generateSitemap() {
  console.log('Starting sitemap generation...');

  const links = [];
  const files = readdirSync(distPath);

  files.forEach(file => {
    if (file.endsWith('.html')) {
      const urlPath = file === 'index.html' ? '/' : `/${file}`;
      links.push({ url: urlPath, changefreq: 'monthly', priority: 0.8 });
    }
  });

  // Add specific links that might not be directly HTML files or need different priority
  // Example: If you have a blog index that's not blog.html but generated dynamically
  // links.push({ url: '/blog', changefreq: 'weekly', priority: 0.8 });

  const stream = new SitemapStream({ hostname });
  const xmlStream = createWriteStream(sitemapPath);
  stream.pipe(xmlStream);

  links.forEach((link) => {
    stream.write(link);
  });

  stream.end();
  await streamToPromise(stream);
  console.log(
    `✅ Sitemap generado correctamente en ${sitemapPath} con la URL: ${hostname}`
  );
}

generateSitemap();
