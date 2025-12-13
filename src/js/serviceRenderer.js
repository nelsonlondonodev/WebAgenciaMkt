import { servicesData } from './data/services.js';
import { observeAnimatedElements } from './scrollAnimations.js';

function createServiceCard(service) {
  // scroll-animate-initial ya está en la clase
  return `
    <a
      href="${service.url}"
      class="service-card group hover:-translate-y-2 scroll-animate-initial cursor-pointer flex flex-col"
    >
      <div
        class="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary-green/20 dark:bg-primary-blue/20 text-glow-green dark:text-glow-blue group-hover:bg-primary-green dark:group-hover:bg-primary-blue group-hover:text-white transition-colors duration-300"
      >
        <i class="${service.icon}"></i>
      </div>
      <h3
        class="text-2xl md:text-3xl font-semibold mb-3 text-gray-900 dark:text-white"
      >
        ${service.title}
      </h3>
      <div
        class="text-base text-gray-600 dark:text-gray-400 mb-4 flex-grow"
      >
        <p class="mb-4">
          ${service.description}
        </p>
      </div>
    </a>
  `;
}

export function initServiceCards() {
  const container = document.getElementById('services-container');
  if (!container) return;

  const cardsHtml = servicesData.map(createServiceCard).join('');
  container.innerHTML = cardsHtml;

  // Después de añadir las tarjetas al DOM, buscarlas y pasarlas al observador
  const newCards = container.querySelectorAll('.scroll-animate-initial');
  observeAnimatedElements(newCards);
}
