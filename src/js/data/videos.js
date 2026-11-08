/**
 * Vídeos de YouTube incrustados en las páginas (no los del carrusel de la home,
 * que están en shorts.js), por id. Cada uno va en su página entre
 * <!-- video:start ID --> y <!-- video:end -->; inyectar-componentes.js escribe
 * el botón con videoFacadeTemplate.js.
 *
 * Cada vídeo necesita su VideoObject en el JSON-LD de esa página con el mismo
 * embedUrl y el póster en thumbnailUrl: validate-schema.js hace fallar el build
 * si falta.
 */
export const videos = {
  'qYoHj_nrq-I': {
    titulo: 'Auditoría técnica: más de 2300 reseñas en Google Maps que no venden',
    aria: 'Reproducir la auditoría técnica en vídeo',
    poster: '/image/auditoria-google-maps-poster.webp',
    ancho: 960,
    alto: 540,
  },
  aAbTycmhhY0: {
    titulo: 'Auditoría SEO en vivo: errores técnicos que hunden tu web',
    aria: 'Reproducir la auditoría SEO técnica en vídeo',
    poster: '/image/auditoria-seo-tecnico-poster.webp',
    ancho: 960,
    alto: 540,
  },
  '7_FTDJN-0gM': {
    titulo: 'De web de plantilla a pedidos por WhatsApp en 2 días',
    poster: '/image/short-suave-bocado-poster.webp',
    ancho: 640,
    alto: 1137,
  },
  '9hEdVVkgMOY': {
    titulo: 'Cuidado si tu página web usa esta tecnología',
    poster: '/image/short-tecnologia-angular-poster.webp',
    ancho: 640,
    alto: 1137,
  },
  '-rFc59dMHkQ': {
    titulo: 'Qué tarea automatizar primero en tu negocio (no es la que más te molesta)',
    aria: 'Reproducir el vídeo: Qué tarea automatizar primero en tu negocio',
    poster: '/image/short-grifo-poster.webp',
    ancho: 640,
    alto: 1137,
  },
};
