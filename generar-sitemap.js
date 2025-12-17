const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

const hostname = 'https://nelsonlondono.es';
const sitemapPath = path.resolve(__dirname, 'sitemap.xml');

async function generateSitemap() {
  console.log('Starting sitemap generation...');

  const links = [
    { url: '/', changefreq: 'monthly', priority: 1.0 },
    { url: '/blog.html', changefreq: 'weekly', priority: 0.8 },
    { url: '/articulo-ejemplo.html', changefreq: 'monthly', priority: 0.7 },
    { url: '/articulo-seo-post-fiestas.html', changefreq: 'monthly', priority: 0.7 },
    { url: '/articulo-redes-sociales-publicidad-local.html', changefreq: 'monthly', priority: 0.7 },
    { url: '/agencia-automatizaciones.html', changefreq: 'monthly', priority: 0.9 },
    { url: '/agencia-desarrollo-web-con-codigo.html', changefreq: 'monthly', priority: 0.9 },
    { url: '/agencia-seo.html', changefreq: 'monthly', priority: 0.9 },
    { url: '/agencia-seo-local.html', changefreq: 'monthly', priority: 0.9 },
    { url: '/articulo-automatizacion-marketing.html', changefreq: 'monthly', priority: 0.7 },
    { url: '/proyectos.html', changefreq: 'monthly', priority: 0.8 },
  ];

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