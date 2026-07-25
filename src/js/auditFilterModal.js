/**
 * Módulo para gestionar el modal de pre-calificación en las reservas de auditoría gratuita.
 * Intercepta los enlaces de auditoría/reserva y redirige a WhatsApp (Waboce AI) con el usuario pre-cualificado.
 */
import { CONFIG } from './config.js';

const AUDIT_URL_PREFIX = 'cal.com/nelson-londono-dpobgm/estrategia30';
const MODAL_ANIMATION_DURATION = 300; // ms

/**
 * Retorna la plantilla HTML del modal de pre-cualificación.
 * @param {string} targetUrl - URL de WhatsApp de destino.
 * @returns {string} Código HTML del modal.
 */
const getModalTemplate = (targetUrl) => {
  const whatsappUrl = targetUrl || CONFIG.CONTACT.WHATSAPP_URL;

  return `
    <div id="audit-filter-modal" class="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-fade-in" aria-modal="true" role="dialog" aria-labelledby="modal-title">
      <div class="relative w-full max-w-lg rounded-3xl bg-white/95 dark:bg-zinc-950/90 border border-gray-100 dark:border-white/10 p-6 sm:p-8 text-gray-800 dark:text-gray-200 shadow-2xl animate-scale-in-core transition-transform duration-300">
        
        <!-- Header del Modal -->
        <div class="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-white/10">
          <h3 id="modal-title" class="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
            <span class="text-amber-500 text-2xl" aria-hidden="true">⚠️</span>
            Antes de agendar tu sesión
          </h3>
          <button id="audit-modal-close" class="p-1 -mr-2 text-gray-400 hover:text-gray-900 dark:hover:text-white text-3xl font-light leading-none transition-colors" aria-label="Cerrar modal">&times;</button>
        </div>

        <!-- Cuerpo del Modal -->
        <div class="mt-5 space-y-4">
          <p class="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
            Para ofrecerte el máximo valor y diseñar una hoja de ruta estratégica real en estos 30 minutos, nos enfocamos exclusivamente en perfiles que califiquen:
          </p>

          <!-- Tarjeta SÍ califica -->
          <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
            <h4 class="text-sm font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
              <span aria-hidden="true">✅</span> ¿Quién califica?
            </h4>
            <ul class="text-xs sm:text-sm space-y-1.5 text-gray-700 dark:text-gray-300">
              <li class="flex items-start gap-2">
                <span class="text-emerald-500 mt-0.5">•</span>
                <span><strong>Dueños de negocios locales, autónomos y PYMEs</strong> que buscan captar más clientes mediante <strong>SEO Local</strong>.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-500 mt-0.5">•</span>
                <span><strong>Empresarios y directivos</strong> decididos a delegar la creación de <strong>automatizaciones con IA y desarrollo de software/SaaS</strong>.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-emerald-500 mt-0.5">•</span>
                <span>Negocios con capacidad y presupuesto real para <strong>invertir</strong> en su crecimiento.</span>
              </li>
            </ul>
          </div>

          <!-- Tarjeta NO califica -->
          <div class="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/15">
            <h4 class="text-sm font-extrabold uppercase tracking-wider text-rose-500/80 dark:text-rose-400 mb-2 flex items-center gap-2">
              <span aria-hidden="true">❌</span> ¿Quién NO califica?
            </h4>
            <ul class="text-xs sm:text-sm space-y-1.5 text-gray-600 dark:text-gray-400">
              <li class="flex items-start gap-2">
                <span>•</span> <span>Personas que buscan soporte técnico gratuito para sus herramientas.</span>
              </li>
              <li class="flex items-start gap-2">
                <span>•</span> <span>Quienes quieren aprender a programar o montar automatizaciones por su cuenta.</span>
              </li>
              <li class="flex items-start gap-2">
                <span>•</span> <span>Curiosos sin intención de invertir en un servicio profesional.</span>
              </li>
            </ul>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400 text-center italic mt-2">
            ¿Cumples con los requisitos y estás listo para escalar tu negocio?
          </p>
        </div>

        <!-- Acciones del Modal -->
        <div class="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-end border-t border-gray-100 dark:border-white/10 pt-4">
          <button id="audit-modal-btn-cancel" class="px-5 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors text-sm uppercase tracking-wider">
            No califico / Cancelar
          </button>
          <a id="audit-modal-btn-continue" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-center font-bold shadow-lg transition-colors text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <i class="fab fa-whatsapp text-lg" aria-hidden="true"></i>
            <span>Sí, califico y quiero agendar</span>
          </a>
        </div>

      </div>
    </div>
  `;
};

/**
 * Cierra y remueve el modal del DOM aplicando animaciones.
 * @param {HTMLElement} modalElement - Elemento del modal en el DOM.
 */
const destroyModal = (modalElement) => {
  modalElement.classList.add('opacity-0');
  
  const contentElement = modalElement.querySelector('div');
  if (contentElement) {
    contentElement.classList.add('scale-95');
  }
  
  setTimeout(() => {
    if (document.body.contains(modalElement)) {
      document.body.removeChild(modalElement);
    }
    document.body.classList.remove('overflow-hidden');
  }, MODAL_ANIMATION_DURATION);
};

/**
 * Maneja el clic en el backdrop oscuro del modal.
 */
const handleBackdropClick = (event, modalElement, closeCallback) => {
  if (event.target === modalElement) {
    closeCallback();
  }
};

/**
 * Inicializa y configura los listeners de interacción del modal.
 */
const setupModalListeners = (modalElement, closeCallback) => {
  const closeBtn = modalElement.querySelector('#audit-modal-close');
  const cancelBtn = modalElement.querySelector('#audit-modal-btn-cancel');
  const continueBtn = modalElement.querySelector('#audit-modal-btn-continue');

  if (closeBtn) closeBtn.addEventListener('click', closeCallback);
  if (cancelBtn) cancelBtn.addEventListener('click', closeCallback);
  if (continueBtn) continueBtn.addEventListener('click', closeCallback);

  modalElement.addEventListener('click', (e) => handleBackdropClick(e, modalElement, closeCallback));

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeCallback();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
};

/**
 * Crea e inyecta el modal en el DOM.
 * @param {string} targetUrl - URL de redirección final de WhatsApp.
 */
const createAndInjectModal = (targetUrl) => {
  if (document.getElementById('audit-filter-modal')) return;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = getModalTemplate(targetUrl).trim();
  const modalElement = tempDiv.firstChild;

  document.body.appendChild(modalElement);
  document.body.classList.add('overflow-hidden');

  const closeCallback = () => destroyModal(modalElement);
  setupModalListeners(modalElement, closeCallback);
};

/**
 * Inicializa los listeners globales para interceptar los clics de auditoría y agendamiento.
 */
export function initAuditFilterModal() {
  document.body.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    
    if (link && link.id === 'audit-modal-btn-continue') return;

    if (link && link.href && link.href.includes(AUDIT_URL_PREFIX)) {
      event.preventDefault();
      createAndInjectModal(CONFIG.CONTACT.WHATSAPP_URL);
    }
  });
}
