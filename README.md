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

## 🚀 Mejoras Estéticas y UX (Sesión 23/04/2026) - Premium Mobile Design
- **Navegación Móvil de Próxima Generación:** Rediseño integral del menú móvil integrando un sistema de **Glassmorphism** (`backdrop-blur-2xl`) con fondo semi-transparente. Incluye animaciones fluidas de entrada lateral y una jerarquía visual mejorada con iconos de marca.
- **Footer Visualmente Superior:**
    *   **Borde de Marca Animado:** Implementación de una barra superior de 3px con un gradiente dinámico que recorre la paleta de colores corporativa.
    *   **Efectos Glow en RRSS:** Los iconos sociales ahora cuentan con un efecto de resplandor (*glow*) reactivo al hover, elevando la interactividad.
    *   **Profundidad Visual:** Inclusión de un gradiente radial sutil en el fondo del footer para mejorar la separación de secciones y la percepción de calidad.
- **Estabilidad y Rendimiento:** Refactorización de la lógica de visibilidad para garantizar un comportamiento fluido en dispositivos móviles y compatibilidad total con el sistema de build.

---

## 🚀 Optimización Core Web Vitals (Sesión 14/04/2026) - PSI >= 90
Se ha realizado una auditoría y refactorización integral del sitio (15 páginas) para alcanzar una puntuación de **>=90 en PageSpeed Insights (Móvil)**, enfocándonos en la eliminación de bloqueos de renderizado y el control total del LCP y CLS.

- **Estatización de Componentes Críticos (Inyección Zero-JS):**
    - Refactorización de **Hero Sections** y **Breadcrumbs** de inyección dinámica (JS) a HTML estático en todas las páginas clave.
    - Resultado: Eliminación total del **CLS (Layout Shift)** de 0.7 a **<0.01**.
- **Entrega de Recursos No Bloqueante:**
    - Implementación del patrón `preload` para el CSS principal (`nelson-v4.css`) y FontAwesome, permitiendo un primer pintado (**FCP**) instantáneo.
    - Uso de `noscript` como fallback para garantizar compatibilidad universal.
- **Control de Carga Crítica (LCP):**
    - Implementación de `link rel="preload"` con `fetchpriority="high"` para imágenes críticas "above-the-fold" (fotos personales y destacados de artículos).
    - Optimización de imágenes secundarias con `loading="lazy"` y `decoding="async"`.
- **Higiene Visual y Bugs:**
    - **Favicons:** Restaurados en las páginas de `sobre-mi.html` y `contacto.html`.
    - **Breadcrumbs Limpios:** Eliminación de migas de pan innecesarias en Proyectos y Sobre Mí para un diseño más minimalista.
- **Autoría y Prueba Social:** 
    - Actualización del contador de reseñas de Google Maps a **19 reseñas reales (5.0 Rating)**.
- **Despliegue de Producción Pro:**
    - Ejecución de Build optimizado con minificación de activos.
    - Rotación de versiones mediante **Cache Buster** (`v.2026.04.14.0822`).
    - Despliegue sincronizado a la rama `main`.

---

## 🚀 Últimas Mejoras (Sesión 13/04/2026) - Premium 2026 UI & GMB
- **Estandarización de Títulos "Waoow":** Rediseño global de los encabezados `<h2>` con la clase `.section-title`, incorporando un pseudo-elemento decorativo con gradiente dinámico (Verde a Azul) que eleva la jerarquía visual del sitio.
- **Glassmorphism Evolucionado:** Actualización de componentes `service-card`, `portfolio-item` y `testimonial-card` con bordes lumínicos internos (`ring-1`), desenfoque biónico (`backdrop-blur-2xl`) y sombras volumétricas de alta profundidad, siguiendo el estándar estético de 2026.
- **Integración con GMB / Business Profile:** Vinculación del Trust Badge de reseñas con la ficha oficial de Google Maps, incluyendo micro-animaciones reactivas al hover y resplandor dinámico en las estrellas.
- **SEO de "Reloj Suizo":** 
    - **Schema Markup:** Enriquecimiento de datos estructurados con `AggregateRating` (5.0/19 reseñas) y expansión de `areaServed` a nivel local (Fuente el Saz, Algete, Madrid).
    - **Higiene 301:** Implementación de redirecciones masivas en `.htaccess` para capturar tráfico de URLs obsoletas (404s) detectadas en Google Search Console, preservando el Link Equity.
- **Optimización de CTAs:** Estandarización de botones de acción con mayor peso tipográfico y espaciado optimizado para maximizar la tasa de conversión en dispositivos móviles.

---

## 🚀 Últimas Mejoras (Sesión 21/03/2026)
- **Humanización de Marca:** Rediseño integral de la Hero Section en `index.html` con un layout de 2 columnas (50/50). Integración de la imagen personal de Nelson Londoño con efectos de *glow* perimetral y máscara de degradado circular para una fusión orgánica con el fondo, ocultando rastros de edición por IA.
- **Social Proof Estratégico:** Inclusión de un Trust Badge de Google Reviews con identidad visual corporativa (colores oficiales), resaltando la calificación de 5.0 y 19 reseñas reales para aumentar la credibilidad instantánea.
- **Optimización de Conversión (CTA):** Actualización del botón principal para dirigir a la agenda de auditorías en Cal.com, mejorando el flujo de adquisición de clientes.
- **Transformación Estratégica del Portafolio:** Transición de un catálogo de diseño genérico a una vitrina de "Proyectos de Alto Impacto". Se eliminaron servicios obsoletos (Tour 360) y se integraron 3 casos de éxito reales que validan los nuevos pilares: Web de Alto Rendimiento, SEO Local (Heatmap) y Automatización con IA (CRM propio).
- **Optimización de Activos Multimedia:** Conversión de capturas PNG de alta resolución a formato WebP optimizado, reduciendo la carga de red y mejorando la puntuación en Core Web Vitals.
- **Micro-UX Responsivo:** Refinado del Trust Badge de Google para pantallas pequeñas (layout multilínea) y corrección de márgenes verticales para una transición fluida entre secciones.

---

## 🎁 Recursos Gratuitos (Landing Page)

Se ha implementado una estrategia de captación y entrega de valor (Landing Page multiplataforma) en el directorio `/guia/`, diseñada sin fricción (sin registros, descarga directa en PDF) enfocada en:

-   **Página de Aterrizaje (`/guia/`)**: Ubicada en `guia/index.html`. Está integrada con el diseño global del sitio "2026 Aesthetic", cargando dinámicamente el `nav` y el `footer` originales.
-   **Guía Principal (Hero):**: *5 Errores Fatales en Google Maps*. Apunta al documento `Google_Maps_Dominance_compressed.pdf`.
-   **Recursos Secundarios (Grid):**
    -   *Guía de Automatización (n8n)*: Hoja de ruta para aprender automatización (`guia-n8n.pdf`).
    -   *Guía SEO Local (Jardinería Digital)*: Estrategias de posicionamiento (`Jardinería_Digital_SEO_Local_2026.pdf`).

*Importante: Los componentes `nav.html` y `footer.html` utilizan rutas absolutas (`/image/...` o `/blog.html`) para garantizar su correcta visualización desde subcarpetas como `/guia/`. Todos los recursos están bajo estrictas políticas `noindex, nofollow` para evitar que los buscadores los listen públicamente.*

---

## 💼 Portafolio Técnico (`/cv/`)

Se ha creado un subdirectorio con una "Developer Landing Page" específica en `/cv/index.html`. Esta página está separada de la agencia y enfocada exclusivamente en perfil técnico:

-   **Enfoque:** Orientado a contratantes y reclutadores IT. Resalta habilidades como React, TypeScript, Tailwind, Vite, Supabase y n8n.
-   **Diseño:** Estética "GitHub Dark", tipografías monoespaciadas y elementos neón (`#58a6ff`, `#3fb950`).
-   **Privacidad:** Incorpora estrictamente la metaetiqueta `<meta name="robots" content="noindex">` y está excluida del sitemap general para no entrelazar la estrategia SEO local de la agencia con el CV técnico de Nelson Londoño.

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

