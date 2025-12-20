/**
 * Aplica clases de gradiente de fondo de forma alternada a las secciones de un contenedor.
 * @param {string} containerSelector - El selector del elemento contenedor (ej. 'main').
 * @param {string[]} gradientClasses - Un array con las dos clases de gradiente a alternar.
 */
export function applyAlternatingGradients(containerSelector, gradientClasses) {
  if (gradientClasses.length < 2) {
    console.error('Se necesitan al menos dos clases de gradiente para alternar.');
    return;
  }

  const container = document.querySelector(containerSelector);
  if (!container) {
    return; // No es un error, la página puede no tener este contenedor.
  }

  // Seleccionamos todas las <section> dentro del contenedor, sin importar la anidación
  const sections = container.querySelectorAll('section');



  sections.forEach((section, index) => {
    // Eliminamos clases viejas por si acaso (buena práctica)
    section.classList.remove(...gradientClasses);
    
    // Añadimos la nueva clase
    const classToAdd = gradientClasses[index % 2];
    section.classList.add(classToAdd);
  });
}