/**
 * Plantilla de las tarjetas de Shorts de la home, sin DOM.
 *
 * La usa inyectar-componentes.js en el build para escribirlas en index.html
 * entre <!-- shorts:start --> y <!-- shorts:end -->: el HTML sigue estático
 * (la fachada no contacta con YouTube hasta que se pulsa, ver videoFacade.js)
 * y src/js/data/shorts.js es la única fuente. Antes cada Short eran ~45
 * líneas copiadas a mano.
 */
import { shorts } from './data/shorts.js';

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
    <button
      type="button"
      class="video-facade relative z-10 w-full h-full block border-0 rounded-2xl cursor-pointer group/facade"
      data-video-src="https://www.youtube-nocookie.com/embed/${short.id}?autoplay=1&rel=0&modestbranding=1"
      data-video-title="${tituloYoutube}"
      aria-label="Reproducir el vídeo: ${short.titulo}"
    >
      <img
        src="${short.poster}"
        alt=""
        width="640"
        height="1138"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-cover rounded-2xl"
      />
      <span
        class="absolute inset-0 flex items-center justify-center bg-black/25 group-hover/facade:bg-black/10 transition-colors rounded-2xl"
      >
        <span
          class="flex items-center justify-center w-16 h-16 rounded-full bg-red-600 shadow-2xl group-hover/facade:scale-110 transition-transform"
        >
          <i class="fas fa-play text-white text-2xl ml-1" aria-hidden="true"></i>
        </span>
      </span>
    </button>
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
