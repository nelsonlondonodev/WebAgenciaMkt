# Nelson Londoño - Agencia Web Personal

Este es el repositorio del código fuente de mi página web profesional, un sitio multi-página moderno y de alto rendimiento creado para mostrar mis servicios de desarrollo web, SEO y automatizaciones.

El proyecto ha evolucionado hacia una **arquitectura modular profesional**, separando lógica de negocio, configuración y presentación para garantizar escalabilidad y facilidad de mantenimiento.

## ✨ Características Principales

-   **Sitio Multi-página Estático:** Arquitectura optimizada para la velocidad y el SEO.
-   **Arquitectura Modular (JavaScript):** El código JS está dividido en módulos específicos (Cookies, Contacto, Chatbot, etc.) orquestados desde un script principal.
-   **Configuración Centralizada:** Un único archivo `config.js` controla las variables globales del entorno (APIs, claves, datos de contacto).
-   **Identidad Visual Moderna:** Interfaz refinada con fondos de gradiente radial y modos Claro/Oscuro persistentes.
-   **Componentes Reutilizables:** `nav`, `footer`, `cookie-banner` y `chatbot` se cargan dinámicamente, evitando duplicidad de código HTML.
-   **Optimizado para Producción:**
    -   **Tailwind CSS:** Configuración optimizada con `safelist` inteligente para clases dinámicas y purga de CSS no utilizado.
    -   **Bundling:** JavaScript minificado y empaquetado con `esbuild`.
    -   **Cache-busting:** Sistema automático de versiones para evitar problemas de caché en navegadores.

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
-   `npm run build:dist`: **Build final para despliegue.**
-   `npm run format`: Formatear código con Prettier.
