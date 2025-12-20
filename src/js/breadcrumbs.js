/**
 * Define la estructura y nombres para las migas de pan.
 * Es un mapa que asocia una parte de la URL con el nombre a mostrar.
 */
const BREADCRUMB_NAMES = {
  '/': 'Inicio',
  'blog.html': 'Blog',
  'proyectos.html': 'Proyectos',
  'agencia-automatizaciones.html': 'Automatizaciones',
  'agencia-desarrollo-web-con-codigo.html': 'Desarrollo a Medida',
  'agencia-seo-local.html': 'SEO Local',
  'agencia-seo.html': 'SEO General',
};

/**
 * Genera e inserta las migas de pan en el placeholder correspondiente.
 * @param {string} placeholderSelector - El selector del div donde se insertarán las migas de pan.
 */
export function generateBreadcrumbs(placeholderSelector) {
  const placeholder = document.querySelector(placeholderSelector);
  if (!placeholder) {
    // No hay placeholder en esta página, no hacemos nada.
    return;
  }

  const path = window.location.pathname;
  const pageFileName = path.substring(path.lastIndexOf('/') + 1) || 'index.html'; // Handle root path

  let crumbs = [{ name: BREADCRUMB_NAMES['/'], url: '/' }];

  // Lógica para artículos de blog
  if (pageFileName.startsWith('articulo-')) {
    crumbs.push({ name: BREADCRUMB_NAMES['blog.html'], url: '/blog.html' });
    // El título del artículo se toma directamente del H1 de la página
    const articleTitle = document.querySelector('h1')?.textContent.trim();
    if (articleTitle) {
      crumbs.push({ name: articleTitle }); // La última miga no tiene enlace
    }
  } else if (BREADCRUMB_NAMES[pageFileName] && pageFileName !== 'index.html') {
    // Lógica para otras páginas (proyectos, blog, servicios)
    crumbs.push({ name: BREADCRUMB_NAMES[pageFileName] });
  }

  // Si solo tenemos "Inicio", no mostramos las migas de pan.
  if (crumbs.length <= 1) {
    return;
  }

  // Generar el HTML
  const breadcrumbsHtml = `
    <nav aria-label="Breadcrumb" class="breadcrumb-nav">
      <ol class="flex items-center space-x-2 text-sm">
        ${crumbs
          .map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            if (isLast) {
              return `<li><span class="font-medium text-gray-500 dark:text-gray-400" aria-current="page">${crumb.name}</span></li>`;
            } else {
              return `
                <li class="flex items-center">
                  <a href="${crumb.url}" class="text-primary-blue dark:text-primary-green hover:underline">${crumb.name}</a>
                  <span class="mx-2 text-gray-400 dark:text-gray-500" aria-hidden="true">/</span>
                </li>
              `;
            }
          })
          .join('')}
      </ol>
    </nav>
  `;

  placeholder.innerHTML = breadcrumbsHtml;
}
