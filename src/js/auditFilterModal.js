/**
 * Módulo para gestionar el modal de pre-calificación en las reservas de auditoría gratuita.
 * Intercepta los enlaces de Cal.com y filtra usuarios no cualificados.
 */

// Estructura HTML del modal como un string de plantilla
const getModalTemplate = (targetUrl) => {
  return `
    <div id="audit-filter-modal" class="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-fade-in" aria-modal="true" role="dialog" aria-labelledby="modal-title">
      <div class="relative w-full max-w-lg rounded-3xl bg-white/95 dark:bg-zinc-950/90 border border-gray-100 dark:border-white/10 p-6 sm:p-8 text-gray-800 dark:text-gray-200 shadow-2xl animate-scale-in-core transition-transform duration-300">
        
        <!-- Header del Modal -->
        <div class="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-white/10">
          <h3 id="modal-title" class="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
            <span class="text-amber-500 text-2xl" aria-hidden="true">⚠️</span>
            Antes de reservar tu sesión
          </h3>
          <button id="audit-modal-close" class="p-1 -mr-2 text-gray-400 hover:text-gray-900 dark:hover:text-white text-3xl font-light leading-none transition-colors" aria-label="Cerrar modal">&times;</button>
        </div>

        <!-- Cuerpo del Modal -->
        <div class="mt-5 space-y-4">
          <p class="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
            Para ofrecerte el máximo valor y diseñar una hoja de ruta estratégica real en estos 30 minutos, mi equipo y yo nos enfocamos exclusivamente en perfiles que califiquen:
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
                <span><strong>Empresarios y directivos</strong> decididos a delegar la creación de <strong>automatizaciones con IA y agentes de WhatsApp</strong>.</span>
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
                <span>•</span> <span>Quienes quieren una clase paso a paso para aprender a programar o montar automatizaciones ellos mismos.</span>
              </li>
              <li class="flex items-start gap-2">
                <span>•</span> <span>Curiosos que no tienen intención de invertir en un servicio profesional.</span>
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
          <a id="audit-modal-btn-continue" href="${targetUrl}" target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-xl bg-primary-green hover:bg-emerald-500 dark:bg-primary-blue dark:hover:bg-sky-500 text-white text-center font-bold shadow-lg transition-colors text-sm uppercase tracking-wider">
            Sí, califico y quiero agendar
          </a>
        </div>

      </div>
    </div>
  `;
};

/**
 * Muestra el modal de pre-calificación en pantalla.
 * @param {string} targetUrl - La URL de Cal.com a la que se redirigirá.
 */
const showModal = (targetUrl) => {
  if (document.getElementById('audit-filter-modal')) return;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = getModalTemplate(targetUrl).trim();
  const modalElement = tempDiv.firstChild;

  document.body.appendChild(modalElement);
  document.body.classList.add('overflow-hidden');

  // Funcionalidad de cierre del modal con animación de salida
  const closeModal = () => {
    modalElement.classList.add('opacity-0');
    const content = modalElement.querySelector('div');
    if (content) {
      content.classList.add('scale-95');
    }
    
    // Esperar a que termine la transición de CSS (300ms)
    setTimeout(() => {
      if (document.body.contains(modalElement)) {
        document.body.removeChild(modalElement);
      }
      document.body.classList.remove('overflow-hidden');
    }, 300);
  };

  // Event Listeners para cerrar
  document.getElementById('audit-modal-close').addEventListener('click', closeModal);
  document.getElementById('audit-modal-btn-cancel').addEventListener('click', closeModal);
  
  // Si continúa, cerramos el modal a la vez que se abre en pestaña nueva
  document.getElementById('audit-modal-btn-continue').addEventListener('click', () => {
    closeModal();
  });

  // Cerrar al hacer clic en el fondo oscuro
  modalElement.addEventListener('click', (e) => {
    if (e.target === modalElement) {
      closeModal();
    }
  });

  // Cerrar con tecla Escape
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
};

/**
 * Inicializa los listeners globales para interceptar los clics de Cal.com.
 */
export function initAuditFilterModal() {
  document.body.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    
    // Verificar si es un enlace a la auditoría gratuita de Cal.com
    if (link && link.href && link.href.includes('cal.com/nelson-londono-dpobgm/estrategia30')) {
      event.preventDefault();
      showModal(link.href);
    }
  });
}
