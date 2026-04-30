// src/js/uiInteractions.js

/**
 * Inicializa el slider comparativo de Antes/Después (Before & After).
 * Busca elementos con la clase .ba-slider-container.
 */
export function initBeforeAfterSlider() {
  const sliders = document.querySelectorAll('.ba-slider-container');

  sliders.forEach((slider) => {
    const handle = slider.querySelector('.ba-slider-handle');
    const afterImage = slider.querySelector('.ba-after-image');

    if (!handle || !afterImage) return;

    let isResizing = false;

    const updateSlider = (x) => {
      const rect = slider.getBoundingClientRect();
      let position = ((x - rect.left) / rect.width) * 100;

      // Limitar el rango entre 0% y 100%
      position = Math.max(0, Math.min(position, 100));

      handle.style.left = `${position}%`;
      afterImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    };

    const onMove = (e) => {
      if (!isResizing) return;
      const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      updateSlider(x);
    };

    const startResizing = () => {
      isResizing = true;
    };
    const stopResizing = () => {
      isResizing = false;
    };

    handle.addEventListener('mousedown', startResizing);
    handle.addEventListener('touchstart', startResizing);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', stopResizing);
    window.addEventListener('touchend', stopResizing);

    // Posición inicial al 50%
    updateSlider(
      slider.getBoundingClientRect().left +
        slider.getBoundingClientRect().width / 2
    );
  });
}

/**
 * Inicializa los carruseles de casos de éxito (como el de Blond Bros).
 * Maneja la navegación por flechas y dots de forma desacoplada del HTML.
 */
export function initSuccessCaseCarousels() {
  const carousels = document.querySelectorAll('[data-carousel="success-case"]');

  carousels.forEach((container) => {
    const carouselId = container.id;
    if (!carouselId) return;

    // Buscar controles asociados por ID de carrusel
    const prevBtn = document.querySelector(
      `[data-carousel-prev="${carouselId}"]`
    );
    const nextBtn = document.querySelector(
      `[data-carousel-next="${carouselId}"]`
    );
    const dots = document.querySelectorAll(
      `[data-carousel-dot="${carouselId}"]`
    );

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        container.scrollBy({ left: -400, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        container.scrollBy({ left: 400, behavior: 'smooth' });
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        // Asumimos un scroll de 500px por imagen o scroll al elemento específico si fuera necesario
        // Para mayor precisión en responsive, calculamos el ancho del contenedor
        const scrollAmount = container.offsetWidth * index;
        container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      });
    });

    // Actualizar dots activos al hacer scroll (opcional pero profesional)
    container.addEventListener('scroll', () => {
      const activeIndex = Math.round(
        container.scrollLeft / container.offsetWidth
      );
      dots.forEach((dot, idx) => {
        dot.classList.toggle('bg-primary-blue', idx === activeIndex);
        dot.classList.toggle('bg-white/20', idx !== activeIndex);
      });
    });
  });
}

/**
 * Añade una nota de beneficio directo bajo el Hero sin modificar el H1 (Preservar SEO).
 */
export function initHeroBenefitBadge() {
  const heroMain = document.querySelector('[data-component="hero-section"]');
  if (
    heroMain &&
    heroMain.dataset.showBadge === 'true' &&
    !document.querySelector('.hero-benefit-badge')
  ) {
    const badge = document.createElement('div');
    badge.className =
      'hero-benefit-badge mt-4 py-2 px-4 bg-primary-green/20 border border-primary-green text-primary-green rounded-lg text-sm font-bold inline-block animate-fade-in';
    badge.textContent =
      '🚀 Objetivo: Llevamos tu negocio al Top 3 de Google Maps.';

    // Insertar después del subtítulo
    setTimeout(() => {
      const subtitle = document.querySelector('.max-w-4xl p'); // Selector genérico para el subtítulo del hero
      if (subtitle) {
        subtitle.after(badge);
      }
    }, 500);
  }
}
