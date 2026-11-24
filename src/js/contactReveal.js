// src/js/contactReveal.js
import { CONFIG } from './config.js';

/**
 * Copia un texto al portapapeles con fallback síncrono.
 */
function copyToClipboard(text) {
  // Intentar primero el método moderno si está disponible
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
    return true; // Asumimos éxito inicial para la UI
  }

  // Fallback síncrono
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText =
      'position:fixed;left:-9999px;top:-9999px;opacity:0;';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Copy Error:', err);
    return false;
  }
}

/**
 * Genera el HTML del modal de privacidad.
 */
const getPrivacyModalTemplate = (title, value, icon, link) => `
  <div class="relative w-full max-w-sm bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden transform scale-95 opacity-0 transition-all duration-300">
    <div class="absolute top-0 right-0 w-32 h-32 bg-primary-blue/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-32 h-32 bg-primary-green/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
    <div class="relative p-6 text-center">
      <button class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors close-btn" aria-label="Cerrar">
        <i class="fas fa-times text-lg"></i>
      </button>
      <div class="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner mb-4 animate-float-up-down">
        <i class="${icon} text-3xl text-white drop-shadow-lg"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-200 mb-1">${title}</h3>
      <a href="${link}" class="block text-xl font-bold text-white tracking-wide hover:text-primary-blue dark:hover:text-primary-green transition-colors mb-6 break-all">${value}</a>
      <div class="flex gap-3 justify-center">
        <a href="${link}" class="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white py-2 px-4 rounded-xl font-medium transition-all backdrop-blur-md flex items-center justify-center gap-2 group">
          <i class="fas fa-external-link-alt group-hover:scale-110 transition-transform"></i> Abrir
        </a>
        <button class="flex-1 bg-gradient-to-r from-primary-blue to-primary-green hover:opacity-90 text-white py-2 px-4 rounded-xl font-bold shadow-lg shadow-primary-blue/20 transition-all active:scale-95 copy-btn flex items-center justify-center gap-2">
          <i class="far fa-copy"></i> Copiar
        </button>
      </div>
    </div>
  </div>
`;

/**
 * Maneja el feedback visual del botón de copia.
 */
function setButtonFeedback(btn, type) {
  const original = btn.innerHTML;
  const states = {
    success: {
      html: '<i class="fas fa-check"></i> ¡Copiado!',
      class: 'bg-green-500',
    },
    error: { html: '<i class="fas fa-times"></i> Error', class: 'bg-red-500' },
  };

  const state = states[type];
  btn.innerHTML = state.html;
  btn.classList.add(state.class);

  setTimeout(() => {
    btn.innerHTML = original;
    btn.classList.remove(state.class);
  }, 2000);
}

/**
 * Abre un modal pequeño con efecto "glassmorphism" para mostrar datos sensibles.
 * @param {string} title - Título del dato (ej: "Correo Electrónico")
 * @param {string} value - El valor real (ej: email@dominio.com)
 * @param {string} iconClass - Clase de FontAwesome
 * @param {string} linkHref - Enlace para la acción principal (mailto: o tel:)
 */
function openPrivacyModal(title, value, icon, link) {
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in';
  overlay.innerHTML = getPrivacyModalTemplate(title, value, icon, link);

  const content = overlay.firstElementChild;
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    content.classList.replace('scale-95', 'scale-100');
    content.classList.replace('opacity-0', 'opacity-100');
  });

  const close = () => {
    content.classList.replace('scale-100', 'scale-95');
    content.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.onclick = (e) =>
    (e.target === overlay || e.target.closest('.close-btn')) && close();

  overlay.querySelector('.copy-btn').onclick = (e) => {
    const success = copyToClipboard(value);
    setButtonFeedback(e.currentTarget, success ? 'success' : 'error');
  };
}

export function initContactReveal() {
  const configs = [
    {
      id: 'reveal-email-btn',
      title: 'Correo Corporativo',
      value: CONFIG.CONTACT.EMAIL,
      icon: 'fas fa-envelope',
      link: `mailto:${CONFIG.CONTACT.EMAIL}`,
    },
  ];

  configs.forEach(({ id, ...data }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.onclick = (e) => {
        e.preventDefault();
        openPrivacyModal(data.title, data.value, data.icon, data.link);
      };
    }
  });
}
