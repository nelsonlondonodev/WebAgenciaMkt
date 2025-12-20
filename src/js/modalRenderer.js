import { portfolioData } from './data/portfolio.js';

function getProjectData(projectId) {
  // The card ID is "card-proyecto-blabla", we need to extract "blabla"
  const cleanId = projectId.replace('card-proyecto-', '');
  return portfolioData.find((item) => item.id === cleanId);
}

function createModalHTML(project) {
  if (!project) return '';

  // This structure is based on the modals I removed from proyectos.html
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
      <div class="m-4 max-w-4xl w-full rounded-xl bg-light-card p-4 sm:p-6 text-gray-800 dark:bg-dark-card dark:text-gray-200 shadow-2xl animate-zoom-in">
        <div class="flex items-start justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-2xl font-bold text-primary-blue dark:text-primary-green">${project.title}</h3>
          <button class="close-modal-button text-3xl text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">&times;</button>
        </div>
        <div class="mt-4 h-[75vh]">
          <iframe
            title="Tour Virtual 360 de ${project.title}"
            width="100%"
            height="100%"
            style="border: none"
            frameborder="0"
            allow="xr-spatial-tracking; gyroscope; accelerometer"
            allowfullscreen
            scrolling="no"
            src="${project.tourUrl}" 
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  `;
  // NOTE: The original iframe had a data-src. I'm using src directly now
  // because we are creating the modal on demand. I'll need to add `tourUrl` to the data.
}

export function initDynamicModals() {
  document.body.addEventListener('click', (event) => {
    const card = event.target.closest('.portfolio-item[data-type="modal"]');
    if (!card) return;

    const projectId = card.id;
    const projectData = getProjectData(projectId);

    if (!projectData) {
      console.error(`No project data found for ID: ${projectId}`);
      return;
    }

    const modalHTML = createModalHTML(projectData);
    if (!modalHTML) return;

    const modalWrapper = document.createElement('div');
    modalWrapper.innerHTML = modalHTML;
    const modalElement = modalWrapper.firstElementChild;

    document.body.appendChild(modalElement);
    document.body.classList.add('overflow-hidden');

    const closeModal = () => {
      modalElement.classList.add('animate-fade-out');
      modalElement.addEventListener('animationend', () => {
        document.body.removeChild(modalElement);
        document.body.classList.remove('overflow-hidden');
      }, { once: true });
    };

    const closeButton = modalElement.querySelector('.close-modal-button');
    closeButton.addEventListener('click', closeModal);

    modalElement.addEventListener('click', (e) => {
      if (e.target === modalElement) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handler);
      }
    });
  });
}
