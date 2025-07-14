const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");
const path = require("path");

// URLs de tu sitio
const links = [
  { url: "/", changefreq: "monthly", priority: 1.0 },
  { url: "/#inicio", changefreq: "monthly", priority: 0.9 },
  { url: "/#servicios", changefreq: "monthly", priority: 0.8 },
  { url: "/#proyectos", changefreq: "monthly", priority: 0.7 },
  { url: "/#sobre-mi", changefreq: "monthly", priority: 0.6 },
  { url: "/#testimonios", changefreq: "monthly", priority: 0.5 },
  { url: "/#contacto", changefreq: "monthly", priority: 0.4 },
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
