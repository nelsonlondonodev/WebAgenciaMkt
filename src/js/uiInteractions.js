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

    const updateSlider = (x) => {
      const rect = slider.getBoundingClientRect();
      let position = ((x - rect.left) / rect.width) * 100;

      // Limitar el rango entre 0% y 100%
      position = Math.max(0, Math.min(position, 100));

      handle.style.left = `${position}%`;
      afterImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    };

    const onMove = (e) => {
      const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      updateSlider(x);
    };

    // Los listeners globales solo viven mientras dura el arrastre,
    // evitando que se acumulen en window por cada slider de la página.
    const stopResizing = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', stopResizing);
      window.removeEventListener('touchend', stopResizing);
    };

    const startResizing = () => {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove);
      window.addEventListener('mouseup', stopResizing);
      window.addEventListener('touchend', stopResizing);
    };

    handle.addEventListener('mousedown', startResizing);
    handle.addEventListener('touchstart', startResizing);

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

/**
 * Inicializa el selector de pestañas interactivas (ChatGPT / Gemini) en la página GEO.
 * Permite comparar en tiempo real las respuestas de ambos motores de IA.
 */
export function initGeoTabs() {
  const tabButtons = document.querySelectorAll('[data-geo-tab]');
  const tabPanels = document.querySelectorAll('[data-geo-panel]');

  if (tabButtons.length === 0 || tabPanels.length === 0) return;

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-geo-tab');

      tabButtons.forEach((btn) => {
        const isActive = btn.getAttribute('data-geo-tab') === target;
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        if (isActive) {
          btn.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-900', 'dark:text-white', 'shadow-sm');
          btn.classList.remove('text-gray-500', 'dark:text-gray-400');
        } else {
          btn.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-900', 'dark:text-white', 'shadow-sm');
          btn.classList.add('text-gray-500', 'dark:text-gray-400');
        }
      });

      tabPanels.forEach((panel) => {
        if (panel.getAttribute('data-geo-panel') === target) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Inicializa el modal/lightbox accesible para inspeccionar las capturas de pantalla reales.
 */
export function initGeoEvidenceModal() {
  const modal = document.getElementById('geoEvidenceModal');
  const modalImage = document.getElementById('geoEvidenceModalImg');
  const modalCaption = document.getElementById('geoEvidenceModalCaption');
  const closeBtn = document.getElementById('closeGeoEvidenceModal');
  const triggerBtns = document.querySelectorAll('[data-open-evidence]');

  if (!modal || !modalImage || triggerBtns.length === 0) return;

  const openModal = (src, caption) => {
    modalImage.src = src;
    modalImage.alt = caption || 'Captura de pantalla de la auditoría IA';
    if (modalCaption) modalCaption.textContent = caption || '';
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.classList.remove('hidden');
    }
    document.body.classList.add('overflow-hidden');
  };

  const closeModal = () => {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.classList.add('hidden');
    }
    document.body.classList.remove('overflow-hidden');
  };

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const src = btn.getAttribute('data-evidence-src');
      const caption = btn.getAttribute('data-evidence-caption');
      if (src) openModal(src, caption);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    // Cerrar si se hace clic en el backdrop
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      closeModal();
    }
  });

  modal.addEventListener('cancel', () => {
    document.body.classList.remove('overflow-hidden');
  });
}


