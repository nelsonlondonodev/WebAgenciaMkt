// src/js/pricing.js
import { CONFIG } from './config.js';

// es-ES no agrupa los números de cuatro cifras por defecto ("1150"); el
// HTML estático escribe "1.150", así que se fuerza el punto de miles.
const priceFormatter = new Intl.NumberFormat('es-ES', { useGrouping: 'always' });

/** @param {number} amount */
export const formatPrice = (amount) => priceFormatter.format(amount);

/**
 * Inyecta los precios configurados en el archivo central de configuración
 * en los elementos HTML que tengan el atributo [data-service-price].
 */
export function initPricing() {
  const priceElements = document.querySelectorAll('[data-service-price]');

  priceElements.forEach((element) => {
    const serviceKey = element.getAttribute('data-service-price');
    const pricingData = CONFIG.PRICING[serviceKey];

    if (pricingData) {
      // Inyectar el precio formateado: e.g. "Desde 230 €/mes"
      // Si el elemento tiene data-price-only="true", solo inyecta el número
      const onlyNumber = element.getAttribute('data-price-only') === 'true';
      const price = formatPrice(pricingData.MIN_PRICE);

      if (onlyNumber) {
        element.textContent = `${price}${pricingData.CURRENCY}`;
      } else {
        element.textContent = `desde ${price} ${pricingData.CURRENCY}${pricingData.SUFFIX}`;
      }

      // Si el elemento tiene data-include-note="true", inyectar la nota
      if (
        pricingData.NOTE &&
        element.getAttribute('data-include-note') === 'true'
      ) {
        renderPriceNote(element, pricingData.NOTE);
      }
    }
  });
}

/**
 * Crea o actualiza una nota aclaratoria bajo el elemento de precio
 */
function renderPriceNote(anchorElement, noteText) {
  const noteId = `note-${anchorElement.getAttribute('data-service-price')}`;
  let noteElement = document.getElementById(noteId);

  if (!noteElement) {
    noteElement = document.createElement('p');
    noteElement.id = noteId;
    noteElement.className = 'text-xs italic text-gray-500 dark:text-gray-400 mt-2 font-light';
    // Al final del bloque del precio: dentro de su fila se colaba entre el importe y «/mes».
    anchorElement.parentElement.parentElement.append(noteElement);
  }

  noteElement.textContent = `* ${noteText}`;
}
