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
-   **Consistencia Lingüística de Alta Calidad:** Estandarización de gramática y capitalización en todo el sitio siguiendo las normas de la RAE (Sentence case), mejorando la legibilidad y el profesionalismo.
-   **Navegación Móvil Optimizada:** Implementación de migas de pan (**breadcrumbs**) dinámicas y simplificadas (1-2 palabras clave) para maximizar el espacio en dispositivos pequeños.
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
    
### 🎨 Identidad Visual y UI (Actualización 2026)
-   **Modo Oscuro Premium (Default):** El sitio ahora carga por defecto en un modo oscuro inmersivo con un fondo "Rich Dark" (gradiente profundo azul/verde), inspirado en temas modernos como Astra.
-   **Header Inteligente:** La barra de navegación se integra perfectamente con el fondo (transparente) al inicio y realiza una transición suave a un fondo sólido "glassmorphism" al hacer scroll, garantizando legibilidad sin sacrificar estilo.
-   **Hero Sections Limpios:** Se han eliminado bordes y elementos superfluos en las secciones principales para una estética más minimalista y profesional.
-   **Eliminación de Redundancias:** Limpieza de elementos de navegación duplicados (como botones "Volver al blog") en favor de las migas de pan, creando una UI más limpia y enfocada.
-   **Modo Claro Clean:** Se mantiene la disponibilidad del modo claro con una estética tradicional (fondo blanco/gris limpio) para usuarios que lo prefieran.
-   **Tarjetas Premium "2026 Aesthetic":** Implementación global del diseño **Glassmorphism** en todas las tarjetas interactivas (Servicios, Portafolio, Testimonios y Contacto). Incluye bordes sutiles tipo neón, sombras de color reactivas y un efecto de "resplandor interno" (glowing gradient) al pasar el cursor, elevando la percepción de calidad del sitio.
-   **Tarjetas de Privacidad en Contacto:** Nueva funcionalidad que oculta datos sensibles (Email, Teléfono) detrás de un botón de revelado. Al hacer clic, despliega un modal animado con opciones de copiado rápido y acceso directo, mejorando la UX y protegiendo la privacidad.

### 🌓 Comportamiento y Reglas UI (Estrictas)
1.  **Iconos de Fondo (Decorativos):** Los elementos flotantes (flecha, árbol, etc.) **SOLO son visibles en Modo Oscuro**. En Modo Claro se ocultan para mantener la limpieza visual.
2.  **Toggle Dark Mode:** El cambio de tema solo se realiza mediante el icono de la luna/sol ubicado estrictamente en la **esquina superior derecha** del Navbar, visible y accesible tanto en escritorio como en móvil.
3.  **Comportamiento del Navbar:**
    -   **Modo Claro:** Fondo gris muy claro (`bg-gray-100` o similar) con texto negro (`text-black`) para máximo contraste.
    -   **Modo Oscuro:**
        -   *Top:* Transparente (se funde con el fondo).
        -   *Scroll:* Fondo `bg-rich-dark` con transparencia (`bg-opacity-90`) y efecto blur, texto blanco (`text-white`).

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

### 1. Despliegue en Raíz (Producción)
-   **Este proyecto se despliega directamente desde la RAÍZ.**
-   Hostinger sirve los archivos desde `public_html`.
-   **La carpeta `/dist` NO se utiliza** para producción en este entorno (es un remanente legacy).
-   **Flujo de Trabajo Correcto:**
    1.  Edita el archivo original (ej: `blog.html`) o en `src/`.
    2.  Ejecuta `npm run build` (esto actualiza los assets en la raíz).
    3.  Sube/Empuja los cambios a la raíz de tu repositorio o hosting.

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
-   **`components/`**: Fragmentos HTML reutilizables (Navbar, Footer, Modales) esenciales para producción.
-   **`output.css`**: Archivo CSS compilado final.
-   **`bundle.min.js`**: Archivo JS empaquetado final.
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

## 🚦 Flujos de Trabajo (Guía Simplificada)

### A. Para Desarrollar (Mientras trabajas)
Usa este comando para ver tus cambios mientras programas. "Vigila" tus archivos y actualiza el CSS automáticamente.

```bash
npm run dev
```

### B. Para Producción (Cuando termines)
Este es el **ÚNICO** proceso que debes seguir para subir tu web a internet.

1.  **Construir (Build):**
    Prepara tu web para salir al mundo. Optimiza imágenes, compacta el código y arregla los iconos.
    ```bash
    npm run build
    ```

2.  **Desplegar (Git Push):**
    Envía los archivos preparados a Hostinger.
    ```bash
    git add .
    git commit -m "Descripción de lo que hiciste"
    git push
    ```

**¡Y listo!** Hostinger se encarga del resto. No necesitas tocar carpetas ni mover archivos manualmente.

---

## 📜 Diccionario de Comandos

-   `npm run dev`: **Modo Creador.** Úsalo cuando estés diseñando o escribiendo código.
-   `npm run build`: **Modo Fábrica.** Empaqueta todo para que esté listo para el público. Ejecútalo SIEMPRE antes de hacer `git push`.

---

## 🔍 SEO e Indexación (Actualización Feb 2026)

Se ha implementado una arquitectura de SEO técnico avanzada para optimizar el rastreo:

-   **Sitemap Dinámico Pro:** Generado mediante `generar-sitemap.js`. A diferencia de versiones anteriores, ahora escanea automáticamente el proyecto, detecta etiquetas `noindex` en tiempo real y asigna prioridades SEO basadas en patrones de URL.
-   **Privacidad de Recursos (`/guia/`):** Se ha reforzado la invisibilidad de esta sección para proteger el contenido de la comunidad:
    -   `robots.txt`: Bloqueo total del directorio.
    -   `Meta Robots`: Implementación de `noindex, nofollow` en el HTML.
    -   Exclusión algorítmica del sitemap.
-   **Optimización de Redirecciones:** Refactorización del `.htaccess` para forzar HTTPS y el dominio canónico (sin www) en una sola regla, reduciendo el TTFB (Time To First Byte).
-   **Cache Busting:** Sistema de versionado automático `?v=timestamp` para CSS y JS, garantizando que las actualizaciones sean instantáneas en dispositivos móviles (especialmente iOS).

