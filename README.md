# Nelson Londoño - Agencia Web Personal

Este es el repositorio del código fuente de mi página web profesional, un sitio multi-página moderno y de alto rendimiento creado para mostrar mis servicios de desarrollo web, SEO y automatizaciones. El proyecto está construido con un enfoque "vanilla" (HTML, CSS, JS) y un pipeline de construcción moderno para máxima eficiencia y control.

## ✨ Características Principales

-   **Sitio Multi-página Estático:** Arquitectura optimizada para la velocidad y el SEO.
-   **Identidad Visual Moderna:** Interfaz refinada con fondos de gradiente radial que proporcionan un look tecnológico y dinámico, tanto en modo claro como oscuro.
-   **Componentes Reutilizables:** El `nav`, `footer`, `cookie-banner` y `chatbot` se cargan dinámicamente con JavaScript (`fetch`) para facilitar el mantenimiento y la coherencia en todo el sitio.
-   **Diseño Adaptable (Responsive):** Interfaz que se adapta perfectamente a cualquier tamaño de pantalla.
-   **Tema Claro y Oscuro:** Selector de tema manual que guarda la preferencia del usuario en `localStorage`.
-   **Interactivo y Moderno:**
    -   Animaciones por scroll.
    -   Portafolio filtrable.
    -   Modales para mostrar proyectos y detalles de servicios.
    -   Formulario de contacto funcional.
    -   Menú móvil mejorado con animación CSS.
    -   Chatbot integrado para interactuar con los visitantes.
-   **Optimizado para Producción:**
    -   Bundling y minificación de JavaScript con `esbuild`.
    -   Procesamiento y minificación de CSS con `PostCSS` y `Tailwind CSS`.
    -   Cache-busting automático para los archivos CSS y JS.
    -   Generación automática de `sitemap.xml`.

## 🛠️ Tecnologías Utilizadas

-   **HTML5:** Estructura semántica del contenido.
-   **Tailwind CSS:** Framework CSS "utility-first" para un diseño rápido y personalizado.
-   **PostCSS:** Herramienta para transformar CSS, usada aquí para el autoprefijado y la minificación con `cssnano`.
-   **JavaScript (Vanilla):** Lógica interactiva modular (ESM).
-   **esbuild:** Bundler y minificador de JavaScript extremadamente rápido.
-   **concurrently:** Para ejecutar múltiples scripts (watchers de JS y CSS) en paralelo durante el desarrollo.
-   **Node.js:** Para ejecutar los scripts de construcción y el ecosistema de `npm`.

---

## 🚀 Entorno de Desarrollo

Para trabajar en el proyecto localmente, solo necesitas tener Node.js y npm instalados.

### Requisitos

-   [Node.js](https://nodejs.org/) (versión 18 o superior)
-   `npm` (viene con Node.js)

### 1. Instalación

Primero, clona el repositorio e instala las dependencias del proyecto:

```bash
git clone https://github.com/nelsonlondonodev/nelson-agencia-web.git
cd nelson-agencia-web
npm install
```

### 2. Ejecución

El entorno de desarrollo requiere dos procesos simultáneos: uno para compilar los archivos en tiempo real y otro para servir el contenido en un servidor local.

1.  **En la Terminal 1 - Inicia los Watchers:**
    Este comando vigilará los cambios en los archivos de `src/` y reconstruirá automáticamente `output.css` y `bundle.min.js`.

    ```bash
    npm run dev
    ```
    *Deja esta terminal abierta mientras desarrollas.*

2.  **En la Terminal 2 - Inicia el Servidor de Desarrollo:**
    Este comando servirá el proyecto en un servidor local. Recomendamos `http-server` por su simplicidad.

    ```bash
    # Si no lo tienes, puedes instalarlo globalmente: npm install -g http-server
    npx http-server -c-1
    ```
    *El flag `-c-1` deshabilita el caché para asegurar que siempre veas los últimos cambios.*

3.  **Abre tu navegador:**
    Visita [http://localhost:8080](http://localhost:8080) para ver el sitio web. La página se actualizará al recargar manualmente después de que `npm run dev` haya procesado tus cambios.

---

## 📦 Construcción para Producción

Para generar la versión final del sitio, optimizada y lista para desplegar:

1.  **Detén todos los procesos de desarrollo** (si se están ejecutando).
2.  **Ejecuta el script de construcción principal:**

    ```bash
    npm run build:dist
    ```

Este comando hará lo siguiente:
- Construirá y minificará el CSS y el JS.
- Aplicará cache-busting a los assets para evitar problemas de caché.
- Generará un `sitemap.xml` actualizado.
- Limpiará la carpeta `dist/` y copiará todos los archivos listos para producción en ella.

### Previsualizar la Versión de Producción

Para asegurarte de que todo funciona como se espera antes de subirlo, puedes previsualizar el contenido de la carpeta `dist`:

```bash
npx http-server dist
```
Accede a `http://localhost:8080` para ver la versión final.

---

## 📜 Scripts de NPM

-   `npm run dev`: Inicia los watchers para JS y CSS en paralelo. Ideal para desarrollo.
-   `npm run watch:css`: Inicia el watcher de PostCSS/Tailwind.
-   `npm run watch:js`: Inicia el watcher de esbuild.
-   `npm run build`: Ejecuta la construcción de CSS y JS, el cache-busting y la generación del sitemap.
-   `npm run build:css`: Construye `output.css` para producción (minificado).
-   `npm run build:js`: Construye `bundle.min.js` para producción (minificado).
-   `npm run build:dist`: Construye el proyecto y empaqueta todo en la carpeta `dist/`. **Este es el comando que debes usar para preparar el despliegue.**
-   `npm run format`: Formatea todo el código del proyecto usando Prettier.
-   `npm run format:check`: Comprueba si el código está formateado correctamente, sin hacer cambios.
-   `npm run sitemap`: Genera manualmente el `sitemap.xml`.
-   `npm test`: (Actualmente no configurado).