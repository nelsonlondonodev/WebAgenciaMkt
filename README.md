# Nelson Londoño - Agencia Web Personal

Este es el repositorio del código fuente de mi página web profesional, un sitio multi-página moderno y de alto rendimiento creado para mostrar mis servicios de desarrollo web, SEO y automatizaciones.

El proyecto ha evolucionado hacia una **arquitectura modular profesional**, separando lógica de negocio, configuración y presentación para garantizar escalabilidad y facilidad de mantenimiento.

## ✨ Características Principales

-   **Sitio Multi-página Estático:** Arquitectura optimizada para la velocidad y el SEO.
-   **Arquitectura Modular (JavaScript):** El código JS está dividido en módulos específicos (Cookies, Contacto, Chatbot, etc.) orquestados desde un script principal.
-   **Configuración Centralizada:** Un único archivo `config.js` controla las variables globales del entorno (APIs, claves, datos de contacto).
-   **Diseño Adaptable y Optimizado:** Interfaz refinada con soporte para modo Claro/Oscuro y espaciado optimizado específicamente para dispositivos móviles (UI adaptativa).
-   **Sistema de Plantillas para Blog:** Incluye un `_template-articulo.html` optimizado para SEO, facilitando la creación de nuevos artículos sin duplicar lógica técnica.
-   **Componentes Reutilizables:** `nav`, `footer`, `cookie-banner` y `chatbot` se cargan dinámicamente, evitando duplicidad de código HTML.
-   **Optimizado para Producción:**
    -   **Tailwind CSS:** Configuración optimizada con `safelist` explícita para clases dinámicas y purga agresiva de CSS no utilizado, reduciendo el tamaño del bundle.
    -   **Optimización LCP (Largest Contentful Paint):** La sección Hero de la página de inicio está integrada directamente en el HTML (inlining) para eliminar la dependencia de JavaScript en el primer renderizado, logrando una carga instantánea.
    -   **Bundling:** JavaScript minificado y empaquetado con `esbuild`.
    -   **Cache-busting:** Sistema automático de versiones para evitar problemas de caché en navegadores.

---

## 🎁 Recurso Gratuito: Guía de Automatización

Se ha implementado una estrategia de captación de leads (Landing Page) diseñada específicamente para tráfico proveniente de redes sociales (TikTok).

-   **Página de Aterrizaje (`/guia/`)**: Ubicada en `guia/index.html`. Está integrada con el diseño global del sitio, cargando dinámicamente el `nav` y el `footer` originales.
-   **Generador de PDF (`guia/guia-para-pdf.html`)**: Herramienta interna para maquetar la guía en formato A4.
    -   *Uso:* Abrir en servidor local, presionar `Ctrl+P` y "Guardar como PDF".
    -   *Nota:* Este archivo tiene la etiqueta `noindex` para no aparecer en buscadores.
-   **Archivo de Descarga (`guia/guia-n8n.pdf`)**: El documento final que los usuarios descargan desde la landing.

*Importante: Los componentes `nav.html` y `footer.html` ahora utilizan rutas absolutas (`/image/...` o `/blog.html`) para garantizar su correcta visualización desde subcarpetas como `/guia/`.*

---

## 📂 Estructura del Proyecto

### Directorios Clave

-   **`src/js/`**: Contiene la lógica modular del sitio.
    -   `script.js`: Orquestador principal. Importa e inicializa los módulos.
    -   `config.js`: **[IMPORTANTE]** Archivo central de configuración (URLs, IDs, Contacto).
    -   `componentLoader.js`: Sistema de inyección dinámica de HTML.
    -   `contactForm.js`, `cookieConsent.js`, `chatbot.js`, etc.: Módulos de funcionalidad específica.
-   **`components/`**: Fragmentos HTML reutilizables (Navbar, Footer, Modales).
-   **`dist/`**: Directorio generado automáticamente para despliegue en producción.
-   **`_template-articulo.html`**: Base limpia para crear nuevos contenidos en el blog.
-   **`image/`**: Todas las imágenes utilizadas en el sitio web.

---

## 🛠️ Tecnologías y Herramientas

-   **HTML5 & Tailwind CSS:** Estructura y diseño.
-   **JavaScript (ESM):** Lógica modular moderna.
-   **Node.js & NPM:** Gestión de dependencias y scripts.
-   **PostCSS & cssnano:** Procesamiento y minificación de CSS.
-   **esbuild:** Empaquetado ultrarrápido de JS.

---

## 🚀 Entorno de Desarrollo

### 1. Instalación
```bash
git clone https://github.com/nelsonlondonodev/nelson-agencia-web.git
cd nelson-agencia-web
npm install
```

### 2. Desarrollo (Watch Mode)
Inicia los observadores de cambios para CSS y JS en paralelo:
```bash
npm run dev
```
*Recomendación: Usar un servidor local como `http-server` en otra terminal para ver los cambios.*

### 3. Construcción para Producción
Genera la carpeta `dist/` con todos los archivos optimizados:
```bash
npm run build:dist
```

### Previsualizar la Versión de Producción
Para asegurarte de que todo funciona como se espera antes de subirlo, puedes previsualizar el contenido de la carpeta `dist`:
```bash
npx http-server dist
```

---

## ⚙️ Configuración Global

Para cambiar variables clave del proyecto, edita **`src/js/config.js`**:

```javascript
export const CONFIG = {
  CHATBOT: { WEBHOOK_URL: '...', ... },
  ANALYTICS: { GA_MEASUREMENT_ID: '...', ... },
  CONTACT: { EMAIL: '...', PHONE: '...' },
  // ...
};
```
Cualquier cambio aquí se reflejará automáticamente en todo el sitio (Chatbot, botones de contacto, Analytics, etc.).

---

## 📜 Scripts de NPM

-   `npm run dev`: Desarrollo (watch CSS & JS).
-   `npm run build:dist`: **Build final para despliegue.** (Incluye minificación y cache-busting).
-   `npm run format`: Formatear código con Prettier.
-   `npm run format:check`: Verificar formato.
-   `npm run sitemap`: Generar mapa del sitio manualmente.