/**
 * Botón-fachada de un vídeo de YouTube, sin DOM: póster y botón de play que no
 * contactan con YouTube hasta que el usuario pulsa (el comportamiento está en
 * videoFacade.js).
 *
 * Una sola plantilla para las tarjetas de Shorts de la home (shortCards.js) y
 * los vídeos de las páginas (data/videos.js, inyectados por
 * inyectar-componentes.js entre <!-- video:start ID --> y <!-- video:end -->).
 * Antes el botón estaba copiado a mano en seis sitios.
 *
 * - titulo: el de YouTube; va en data-video-title.
 * - aria: texto del aria-label (por defecto «Reproducir el vídeo: <titulo>»).
 * - ancho × alto: tamaño del póster. Un vídeo horizontal lleva el botón de
 *   play más grande.
 */
export function renderVideoFacade({ id, titulo, aria, poster, ancho, alto }) {
  const horizontal = ancho > alto;
  const play = horizontal ? 'w-20 h-20' : 'w-16 h-16';
  const icono = horizontal ? 'text-3xl' : 'text-2xl';
  return `
<button
  type="button"
  class="video-facade relative z-10 w-full h-full block border-0 rounded-2xl cursor-pointer group/facade"
  data-video-src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1"
  data-video-title="${titulo}"
  aria-label="${aria || `Reproducir el vídeo: ${titulo}`}"
>
  <img
    src="${poster}"
    alt=""
    width="${ancho}"
    height="${alto}"
    loading="lazy"
    class="absolute inset-0 w-full h-full object-cover rounded-2xl"
  />
  <span
    class="absolute inset-0 flex items-center justify-center bg-black/25 group-hover/facade:bg-black/10 transition-colors rounded-2xl"
  >
    <span
      class="flex items-center justify-center ${play} rounded-full bg-red-600 shadow-2xl group-hover/facade:scale-110 transition-transform"
    >
      <i class="fas fa-play text-white ${icono} ml-1" aria-hidden="true"></i>
    </span>
  </span>
</button>`;
}
