const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");
const path = require("path");

// URLs de tu sitio
const links = [
  { url: "/", changefreq: "monthly", priority: 1.0 },
  // Si en el futuro añades más páginas, añádelas aquí.
  // { url: '/blog/', changefreq: 'weekly', priority: 0.8 },
  // { url: '/blog/mi-primer-post', changefreq: 'yearly', priority: 0.6 },
];

// Dominio de tu sitio
const hostname = "https://www.nelsonlondono.es";

// Ruta de destino para el sitemap
const dest = path.resolve(__dirname, "sitemap.xml");

async function generateSitemap() {
  const stream = new SitemapStream({ hostname });
  const xmlStream = createWriteStream(dest);
  stream.pipe(xmlStream);

  links.forEach((link) => {
    stream.write(link);
  });

  stream.end();
  await streamToPromise(stream);
  console.log("✅ Sitemap generado correctamente en sitemap.xml");
}

generateSitemap();
