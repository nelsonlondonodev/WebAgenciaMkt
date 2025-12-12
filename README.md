# Nelson Londoño - Agencia Web Personal

Este es el repositorio del código fuente de mi página web profesional, un sitio multi-página moderno y de alto rendimiento creado para mostrar mis servicios de desarrollo web, SEO y automatizaciones. El proyecto está construido con un enfoque "vanilla" (HTML, CSS, JS) y un pipeline de construcción moderno para máxima eficiencia y control.

## ✨ Características Principales

-   **Sitio Multi-página Estático:** Arquitectura optimizada para la velocidad y el SEO.
-   **Componentes Reutilizables:** Navegación y pie de página cargados dinámicamente con JavaScript (`fetch`) para facilitar el mantenimiento.
-   **Diseño Adaptable (Responsive):** Interfaz que se adapta perfectamente a cualquier tamaño de pantalla.
-   **Tema Claro y Oscuro:** Selector de tema manual que guarda la preferencia del usuario.
-   **Interactivo:** Animaciones por scroll, portafolio filtrable, modales y un formulario de contacto funcional.
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
-   **concurrently:** Para ejecutar múltiples scripts (watchers de JS y CSS) en paralelo.
-   **http-server:** Servidor de desarrollo local ligero.
-   **Node.js:** Para ejecutar los scripts de construcción y el ecosistema de `npm`.

---

## 🚀 Entorno de Desarrollo

Para trabajar en el proyecto localmente, necesitas tener **dos terminales abiertas** en el directorio raíz del proyecto.

### Requisitos

-   [Node.js](https://nodejs.org/) (versión 18 o superior)
-   `npm` (viene con Node.js)

### 1. Instalación

Primero, clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/nelsonlondonodev/nelson-agencia-web.git
cd nelson-agencia-web
npm install
```

### 2. Ejecución

Con las dependencias instaladas, sigue estos pasos:

1.  **En la Terminal 1 - Inicia los Watchers:**
    Este comando vigilará los cambios en los archivos de `src/` y reconstruirá automáticamente `output.css` y `bundle.min.js`.

    ```bash
    npm run dev
    ```
    *Deja esta terminal abierta mientras desarrollas.*

2.  **En la Terminal 2 - Inicia el Servidor de Desarrollo:**
    Este comando servirá el proyecto en un servidor local.

    ```bash
    npx http-server -c-1
    ```
    *El flag `-c-1` deshabilita el caché para asegurar que siempre veas los últimos cambios.*

3.  **Abre tu navegador:**
    Visita [http://localhost:8080](http://localhost:8080) para ver el sitio web y tus cambios en tiempo real al recargar la página.

---

## 📦 Construcción para Producción

Para generar la versión final del sitio, optimizada y lista para desplegar:

1.  **Detén todos los procesos de desarrollo** (`npm run dev` y `http-server`).
2.  **Ejecuta el script de construcción:**

    ```bash
    npm run build:dist
    ```

Este comando hará lo siguiente:
- Construirá y minificará el CSS y el JS.
- Aplicará cache-busting a los assets.
- Generará un `sitemap.xml` actualizado.
- Limpiará la carpeta `dist/` y copiará todos los archivos listos para producción en ella.

### Previsualizar la Versión de Producción

Para asegurarte de que todo funciona como se espera antes de subirlo, puedes previsualizar la carpeta `dist`:

```bash
cd dist
npx http-server -c-1
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