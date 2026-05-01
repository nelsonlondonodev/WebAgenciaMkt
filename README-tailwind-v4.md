# Nelson Londoño | Agencia Web

## Migración a Tailwind CSS v4

Este proyecto ha sido migrado exitosamente a **Tailwind CSS v4** utilizando el CLI oficial. Se han eliminado las dependencias de PostCSS para mejorar el rendimiento del build.

### Cambios Principales:

- **CSS-First Configuration**: La configuración del tema se encuentra ahora en `src/input.css` bajo la directiva `@theme`.
- **Cache Busting**: El archivo de salida se ha renombrado a `nelson-v4.css` para evitar problemas de caché en el navegador.
- **Scripts**: Los comandos `npm run build` y `npm run watch:css` utilizan ahora `tailwindcss` directamente.

### Notas de Desarrollo:

- **Visibilidad**: Se ha restaurado el comportamiento estándar de la clase `.hidden`.
- **Z-Index**: El modal de cookies tiene ahora prioridad absoluta (`z-100`) para evitar conflictos con otros widgets.

### Pendiente:

- Verificar la consistencia visual en el entorno Live Server (puerto 5500) realizando un refresco profundo de caché (Cmd+Shift+R).
