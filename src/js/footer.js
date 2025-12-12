// src/js/footer.js

/**
 * Inicializa la funcionalidad del pie de página, como la actualización del año actual.
 */
export const initFooter = () => {
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
};
