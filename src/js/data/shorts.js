/**
 * Shorts de YouTube del carrusel «Errores en Google Maps» de la home, del más
 * reciente al más antiguo: el primero lleva la etiqueta «Nuevo».
 *
 * - titulo: el que se lee bajo el vídeo y en el aria-label.
 * - tituloYoutube: el de YouTube, si cambia (mayúsculas de gancho). Es el que
 *   va en data-video-title y el que debe tener el VideoObject del JSON-LD.
 *
 * Cada Short necesita además su VideoObject en el JSON-LD de index.html (con
 * uploadDate y duration): validate-schema.js hace fallar el build si falta o
 * si no coincide el título, el embedUrl o el póster.
 */
export const shorts = [
  {
    id: 'WZMDWeJs6Pc',
    titulo: 'Cómo marcar tu negocio como cerrado en Google Maps (horario especial)',
    poster: '/image/youtube-short-4-poster.webp',
  },
  {
    id: 'ryeaU4Gz6HU',
    titulo: 'Le cambiaron la dirección en Google Maps y no puede recuperar su ficha',
    poster: '/image/youtube-short-3-poster.webp',
  },
  {
    id: 'oNMGUX9e-9U',
    titulo: 'Tu negocio en Google Maps corre peligro si no haces esto',
    tituloYoutube: 'Tu negocio en Google Maps corre PELIGRO si no haces esto',
    poster: '/image/youtube-short-2-poster.webp',
  },
  {
    id: '6hEDQJNyA80',
    titulo: '¿Subes 20 fotos de golpe a Google Maps? Estás perdiendo clientes',
    poster: '/image/youtube-short-poster.webp',
  },
];
