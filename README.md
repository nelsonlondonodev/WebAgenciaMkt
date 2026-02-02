# Nelson Londoño - Agencia Web Personal

Este es el repositorio del código fuente de mi página web profesional, un sitio multi-página moderno y de alto rendimiento creado para mostrar mis servicios de desarrollo web, SEO y automatizaciones.

El proyecto ha evolucionado hacia una **arquitectura modular profesional**, separando lógica de negocio, configuración y presentación para garantizar escalabilidad y facilidad de mantenimiento.

## ✨ Características Principales

-   **Sitio Multi-página Estático:** Arquitectura optimizada para la velocidad y el SEO.
-   **Arquitectura Modular (JavaScript):** El código JS está dividido en módulos específicos (Cookies, Contacto, Chatbot, etc.) orquestados desde un script principal.
-   **Configuración Centralizada:** Un único archivo `config.js` controla las variables globales del entorno (APIs, claves, datos de contacto).
-   **Diseño Adaptable y Optimizado:** Interfaz refinada con soporte para modo Claro/Oscuro y espaciado optimizado específicamente para dispositivos móviles (UI adaptativa).
-   **Sistema de Plantillas para Blog:** Incluye un `_template-articulo.html` optimizado para SEO, facilitando la creación de nuevos artículos sin duplicar lógica técnica.
-   **Componentes Reutilizables:** `nav`, `footer`, `cookie-banner`, `chatbot` y `tech-stack-carousel` (carrusel infinito) se cargan dinámicamente, evitando duplicidad de código HTML.
-   **Página 'Sobre Mí' Integral:** Nueva arquitectura que consolida Historia, Misión, Visión y Testimonios en una sola landing de autoridad (`sobre-mi.html`).
-   **Carrusel de Testimonios Avanzado:** Componente de scroll infinito (`testimonialCarousel.js`) refactorizado con principios SOLID, optimizado para rendimiento y con integración visual de marca (Google).
-   **Optimizado para Producción:**
    -   **Tailwind CSS:** Configuración optimizada con `safelist` explícita para clases dinámicas y purga agresiva de CSS no utilizado.
    -   **Optimización LCP (Core Web Vitals):** Eliminación de bloqueos de renderizado (opacity 0 global) y lógica de animación condicional para móviles.
    -   **Prueba Social de Alto Impacto:** Badges de estadísticas reales y logotipos SVG optimizados para generar confianza inmediata.
    -   **CRO (Optimización de Conversión):** 
        -   **Integración Cal.com:** CTAs principales redirigen a agendamiento directo (eliminando fricción de formularios).
        -   **Tarjetas de Precios Premium:** Diseño visual estandarizado y robusto en todas las páginas de servicios.
        -   **Modales Desactivados:** Se prioriza la acción directa sobre la interacción en modal para "Offers".
    -   **Bundling:** JavaScript minificado y empaquetado con `esbuild`.
    -   **Cache-busting:** Sistema automático de versiones para evitar problemas de caché.

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

## 🏗️ Mantenimiento y SEO Técnico (Reglas de Oro)

Para mantener la integridad del despliegue y el SEO, sigue estas reglas estrictas:

### 1. La Carpeta `/dist` es Sagrada (Read-Only)
-   **NUNCA edites archivos dentro de `/dist` directamente.**
-   Esta carpeta se borra y regenera automáticamente en cada despliegue.
-   **Flujo de Trabajo Correcto:**
    1.  Edita el archivo original en la raíz (ej: `blog.html`) o en `src/`.
    2.  Ejecuta `npm run build:dist`.
    3.  Verifica los cambios en `/dist`.

### 2. URLs Canónicas
-   Las etiquetas `<link rel="canonical" ...>` deben apuntar siempre al archivo final con extensión (ej: `https://nelsonlondono.es/blog.html`).
-   Esto previene bucles de redirección infinitos con las reglas del `.htaccess` y evita que Google indexe URLs incorrectas.

### 3. Archivo `.htaccess`
-   Gestiona las redirecciones 301 (SEO) y el enrutamiento interno.
-   Redirige el tráfico HTTP a HTTPS.
-   Enruta silenciosamente las peticiones a la carpeta `/dist` sin cambiar la URL visible del navegador.

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
