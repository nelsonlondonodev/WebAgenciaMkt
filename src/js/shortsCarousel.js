// src/js/shortsCarousel.js

/**
 * Flechas de la tira de Shorts de la home. La tira se desliza sola con el dedo,
 * el trackpad o el teclado (CSS); esto solo añade los botones y los apaga al
 * llegar a cada extremo. Vienen `disabled` en el HTML: sin JS no se ven.
 */
export function initShortsCarousel() {
  const carousel = document.querySelector('[data-shorts-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('ul');
  const prev = carousel.querySelector('[data-shorts-prev]');
  const next = carousel.querySelector('[data-shorts-next]');
  if (!track || !prev || !next) return;

  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    // 8 px de margen: el relleno lateral y el redondeo del navegador.
    prev.disabled = track.scrollLeft <= 8;
    next.disabled = track.scrollLeft >= max - 8;
  };

  const move = (direction) => {
    const card = track.querySelector('li');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}
