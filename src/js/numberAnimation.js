/**
 * Anima el valor de un elemento HTML de un número inicial a uno final.
 * @param {HTMLElement} element - El elemento cuyo textContent será animado.
 * @param {number} start - El número inicial de la animación.
 * @param {number} end - El número final de la animación.
 * @param {number} duration - La duración de la animación en milisegundos.
 * @param {number} [decimals=0] - El número de decimales a mostrar.
 */
function animateValue(element, start, end, duration, decimals = 0) {
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const isCountingUp = start < end;
    const range = end - start;

    const currentValue = start + range * progress;

    // Asegurarse de que el valor final sea exactamente el 'end'
    if (progress === 1) {
      element.textContent = parseFloat(end).toFixed(decimals);
    } else {
      element.textContent = currentValue.toFixed(decimals);
    }

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

/**
 * Inicializa un IntersectionObserver para todos los elementos con la clase '.animate-number'.
 * La animación se dispara cuando el elemento es visible en la pantalla.
 * Utiliza data-attributes del HTML para configurar la animación.
 *
 * Atributos HTML esperados:
 * - class="animate-number" (obligatorio): Selector para el script.
 * - data-end-value (obligatorio): El número final de la animación.
 * - data-start-value (opcional): El número inicial. Por defecto es 0.
 * - data-duration (opcional): Duración en ms. Por defecto es 2000.
 * - data-decimals (opcional): Número de decimales. Por defecto es 0.
 */
function initNumberAnimation() {
  const numberElements = document.querySelectorAll('.animate-number');

  if (numberElements.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;

          // Extraer valores de los data-attributes
          const end = parseFloat(element.dataset.endValue);
          const start = parseFloat(element.dataset.startValue) || 0;
          const duration = parseInt(element.dataset.duration, 10) || 2000;
          const decimals = parseInt(element.dataset.decimals, 10) || 0;

          // Validar que el valor final exista
          if (isNaN(end)) {
            console.error(
              'El atributo data-end-value no es un número válido.',
              element
            );
            return;
          }

          animateValue(element, start, end, duration, decimals);

          // Dejar de observar el elemento una vez que la animación ha comenzado
          observer.unobserve(element);
        }
      });
    },
    { threshold: 0.5 } // Iniciar cuando el 50% del elemento sea visible
  );

  numberElements.forEach((element) => {
    observer.observe(element);
  });
}

export { initNumberAnimation };