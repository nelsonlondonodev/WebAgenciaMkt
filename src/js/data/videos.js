/**
 * Todos los vídeos de YouTube de la web, por id: los del carrusel de la home
 * (carruselHome, abajo) y los incrustados en páginas entre
 * <!-- video:start ID --> y <!-- video:end -->. inyectar-componentes.js escribe
 * el botón de cada uno con videoFacadeTemplate.js.
 *
 * - titulo: el que se lee bajo la tarjeta y en el aria-label.
 * - tituloYoutube: el de YouTube, si cambia (mayúsculas de gancho), sin el
 *   «#shorts» del final.
 * - aria: aria-label, si no vale «Reproducir el vídeo: <titulo>».
 * - poster, ancho × alto: el póster local y su tamaño.
 *
 * Cada vídeo necesita su VideoObject en el JSON-LD de la página donde sale,
 * con el mismo embedUrl, name = tituloYoutube (o titulo) y el póster en
 * thumbnailUrl: validate-schema.js hace fallar el build si no coincide.
 */
export const videos = {
  WZMDWeJs6Pc: {
    titulo: 'Cómo marcar tu negocio como cerrado en Google Maps (horario especial)',
    poster: '/image/youtube-short-4-poster.webp',
    ancho: 640,
    alto: 1138,
  },
  ryeaU4Gz6HU: {
    titulo: 'Le cambiaron la dirección en Google Maps y no puede recuperar su ficha',
    poster: '/image/youtube-short-3-poster.webp',
    ancho: 640,
    alto: 1138,
  },
  'oNMGUX9e-9U': {
    titulo: 'Tu negocio en Google Maps corre peligro si no haces esto',
    tituloYoutube: 'Tu negocio en Google Maps corre PELIGRO si no haces esto',
    poster: '/image/youtube-short-2-poster.webp',
    ancho: 640,
    alto: 1138,
  },
  '6hEDQJNyA80': {
    titulo: '¿Subes 20 fotos de golpe a Google Maps? Estás perdiendo clientes',
    poster: '/image/youtube-short-poster.webp',
    ancho: 640,
    alto: 1138,
  },
  'qYoHj_nrq-I': {
    titulo: 'Auditoría técnica: más de 2300 reseñas en Google Maps que no venden',
    tituloYoutube: 'Tienen más 2300 reseñas en Google Maps pero NO VENDEN (Auditoría Técnica)',
    aria: 'Reproducir la auditoría técnica en vídeo',
    poster: '/image/auditoria-google-maps-poster.webp',
    ancho: 960,
    alto: 540,
  },
  aAbTycmhhY0: {
    titulo: 'Auditoría SEO en vivo: errores técnicos que hunden tu web',
    tituloYoutube: 'Auditoría SEO en vivo: Errores técnicos que hunden tu web (Caso Real)',
    aria: 'Reproducir la auditoría SEO técnica en vídeo',
    poster: '/image/auditoria-seo-tecnico-poster.webp',
    ancho: 960,
    alto: 540,
  },
  '7_FTDJN-0gM': {
    titulo: 'De web de plantilla a pedidos por WhatsApp en 2 días',
    tituloYoutube: 'De web de plantilla a pedidos por WhatsApp en 2 días | Caso real',
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

/**
 * Carrusel «SEO Local en 1 minuto» de la home (shortCards.js), del más reciente
 * al más antiguo: el primero lleva la etiqueta «Nuevo».
 */
export const carruselHome = ['WZMDWeJs6Pc', 'ryeaU4Gz6HU', 'oNMGUX9e-9U', '6hEDQJNyA80'];
