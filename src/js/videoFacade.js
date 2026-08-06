// src/js/videoFacade.js

/**
 * Sustituye una fachada (póster local + botón de play) por el iframe real.
 * @param {HTMLElement} facade - Elemento con los data-attributes del vídeo.
 */
const replaceFacadeWithIframe = (facade) => {
  const src = facade.dataset.videoSrc;
  if (!src) return;

  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = facade.dataset.videoTitle || 'Vídeo';
  iframe.className = 'relative z-10 w-full h-full border-0 rounded-2xl';
  iframe.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;

  facade.replaceWith(iframe);
};

/**
 * Inicializa las fachadas de vídeo. El iframe (y por tanto las cookies y el
 * reproductor de ~500 KiB del proveedor) solo se cargan tras la interacción,
 * no en la carga inicial de la página.
 */
export function initVideoFacades() {
  const facades = document.querySelectorAll('.video-facade');

  facades.forEach((facade) => {
    facade.addEventListener('click', () => replaceFacadeWithIframe(facade), {
      once: true,
    });
  });
}
