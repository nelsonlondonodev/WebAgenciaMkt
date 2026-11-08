/**
 * Plantilla de las tarjetas de Shorts de la home, sin DOM.
 *
 * La usa inyectar-componentes.js en el build para escribirlas en index.html
 * entre <!-- shorts:start --> y <!-- shorts:end -->: el HTML sigue estático
 * (la fachada no contacta con YouTube hasta que se pulsa, ver videoFacade.js)
 * y src/js/data/shorts.js es la única fuente. Antes cada Short eran ~45
 * líneas copiadas a mano. El botón del vídeo sale de videoFacadeTemplate.js.
 */
import { shorts } from './data/shorts.js';
import { renderVideoFacade } from './videoFacadeTemplate.js';

const NUEVO = `
    <span class="pointer-events-none absolute top-3 left-3 z-20 rounded-full bg-primary-green px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
      Nuevo
    </span>`;

function createShortCard(short, nuevo) {
  const tituloYoutube = short.tituloYoutube || short.titulo;
  return `
<li class="w-[250px] shrink-0 snap-center sm:w-[280px]">
  <div class="relative w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 dark:border-white/10 group bg-gray-900">${nuevo ? NUEVO : ''}
    <!-- Fachada: no se contacta con YouTube hasta que el usuario pulsa -->
    ${renderVideoFacade({
      id: short.id,
      titulo: tituloYoutube,
      aria: `Reproducir el vídeo: ${short.titulo}`,
      poster: short.poster,
      ancho: 640,
      alto: 1138,
    })}
  </div>
  <p class="mt-4 text-sm font-semibold leading-snug text-gray-700 dark:text-gray-200">
    <a
      href="https://youtube.com/shorts/${short.id}"
      target="_blank"
      rel="noopener noreferrer"
      class="hover:text-primary-blue transition-colors"
    >${short.titulo}</a>
  </p>
</li>`;
}

/** HTML de las tarjetas, del Short más reciente al más antiguo. */
export function renderShortsHtml() {
  return shorts.map((short, i) => createShortCard(short, i === 0)).join('\n');
}
