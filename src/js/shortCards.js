/**
 * Plantilla de las tarjetas de Shorts de la home, sin DOM.
 *
 * La usa inyectar-componentes.js en el build para escribirlas en index.html
 * entre <!-- shorts:start --> y <!-- shorts:end -->: el HTML sigue estático
 * (la fachada no contacta con YouTube hasta que se pulsa, ver videoFacade.js).
 * Los datos salen de src/js/data/videos.js (carruselHome da el orden) y el
 * botón del vídeo, de videoFacadeTemplate.js.
 */
import { videos, carruselHome } from './data/videos.js';
import { renderVideoFacade } from './videoFacadeTemplate.js';

const NUEVO = `
    <span class="pointer-events-none absolute top-3 left-3 z-20 rounded-full bg-primary-green px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
      Nuevo
    </span>`;

function createShortCard(id, nuevo) {
  const video = videos[id];
  if (!video) throw new Error(`carruselHome: el vídeo ${id} no está en src/js/data/videos.js`);
  return `
<li class="w-[250px] shrink-0 snap-center sm:w-[280px]">
  <div class="relative w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 dark:border-white/10 group bg-gray-900">${nuevo ? NUEVO : ''}
    <!-- Fachada: no se contacta con YouTube hasta que el usuario pulsa -->
    ${renderVideoFacade(id, video)}
  </div>
  <p class="mt-4 text-sm font-semibold leading-snug text-gray-700 dark:text-gray-200">
    <a
      href="https://youtube.com/shorts/${id}"
      target="_blank"
      rel="noopener noreferrer"
      class="hover:text-primary-blue transition-colors"
    >${video.titulo}</a>
  </p>
</li>`;
}

/** HTML de las tarjetas, del Short más reciente al más antiguo. */
export function renderShortsHtml() {
  return carruselHome.map((id, i) => createShortCard(id, i === 0)).join('\n');
}
