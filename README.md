Nelson Londoño - Agencia de Marketing Digital
Este es el repositorio del código fuente de mi página web profesional, una landing page moderna y completamente adaptable creada para mostrar mis servicios de desarrollo web, SEO y marketing digital. El proyecto está diseñado para ser visualmente atractivo, rápido y funcional, utilizando tecnologías web modernas como Tailwind CSS y JavaScript puro para una máxima eficiencia.

Ver el sitio en vivo: https://www.nelsonlondono.es/

✨ Características Principales
Diseño Totalmente Adaptable (Responsive): La interfaz se adapta perfectamente a cualquier tamaño de pantalla, desde móviles pequeños hasta monitores de escritorio grandes.

Tema Claro y Oscuro: Los usuarios pueden elegir entre un tema claro y uno oscuro según sus preferencias. El sistema también puede detectar la preferencia del sistema operativo del usuario.

Soporte Multilenguaje (i18n): Todo el contenido textual de la página puede cambiar dinámicamente entre Español e Inglés, guardando la preferencia del usuario.

Secciones Interactivas:

Portafolio Filtrable: Los proyectos se pueden filtrar por categorías (Tours Virtuales, Desarrollo Web, SEO Local) de forma dinámica y sin recargar la página.

Modales Detallados: Cada servicio y proyecto del portafolio tiene una ventana modal que se abre para mostrar información más detallada.

Formulario de Contacto Funcional: Envío de datos a través de AJAX a Formspree, con validación en el cliente y mensajes de estado (enviando, éxito, error).

Animaciones y Microinteracciones: Se utilizan animaciones sutiles (al hacer scroll, en botones, tarjetas, etc.) para mejorar la experiencia de usuario.

Optimización SEO:

Uso de etiquetas semánticas de HTML5.

Metaetiquetas optimizadas para descripción y título.

Generación de sitemap.xml y configuración de robots.txt para un correcto rastreo.

Gestión de Cookies: Incluye un banner de consentimiento de cookies y un modal para que el usuario gestione sus preferencias, cumpliendo con las normativas de privacidad.

🛠️ Tecnologías Utilizadas
HTML5: Para la estructura semántica del contenido.

CSS3: Para los estilos base y animaciones.

Tailwind CSS: Un framework de CSS "utility-first" para un diseño rápido y personalizado.

JavaScript (Vanilla): Para toda la lógica interactiva, sin necesidad de frameworks pesados, garantizando un rendimiento óptimo.

PostCSS: Para procesar el CSS, utilizando autoprefixer para añadir prefijos de navegador automáticamente.

Font Awesome: Para la iconografía del sitio.

Formspree: Como backend para el formulario de contacto.

🚀 Instalación y Uso Local
Si deseas clonar y ejecutar este proyecto en tu máquina local, sigue estos pasos:

Clona el repositorio:

Bash

git clone https://github.com/nelsonlondonodev/webagenciamkt.git
Navega a la carpeta del proyecto:

Bash

cd webagenciamkt
Instala las dependencias de desarrollo:

Bash

npm install
Inicia el proceso de compilación de CSS en modo "watch":
Este comando vigilará los cambios en src/input.css y los compilará automáticamente en output.css.

Bash

npm run build-css
Abre index.html en tu navegador:
Puedes usar una extensión como "Live Server" en VS Code para ver los cambios en tiempo real.

📜 Scripts Disponibles
En el archivo package.json, puedes encontrar los siguientes scripts:

npm run build-css: Compila el archivo src/input.css usando PostCSS y Tailwind CSS, y lo guarda en output.css. El flag --watch mantiene el proceso activo para compilar sobre la marcha.

npm run sitemap: Ejecuta un script de Node.js para generar el archivo sitemap.xml basado en las rutas definidas.
