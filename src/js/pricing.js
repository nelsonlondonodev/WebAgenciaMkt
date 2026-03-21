// src/js/pricing.js
import { CONFIG } from './config.js';

/**
 * Inyecta los precios configurados en el archivo central de configuración
 * en los elementos HTML que tengan el atributo [data-service-price].
 */
export function initPricing() {
  const priceElements = document.querySelectorAll('[data-service-price]');
  
  priceElements.forEach(element => {
    const serviceKey = element.getAttribute('data-service-price');
    const pricingData = CONFIG.PRICING[serviceKey];
    
    if (pricingData) {
      // Inyectar el precio formateado: e.g. "Desde 230 €/mes"
      // Si el elemento tiene data-price-only="true", solo inyecta el número
      const onlyNumber = element.getAttribute('data-price-only') === 'true';
      
      if (onlyNumber) {
        element.textContent = `${pricingData.MIN_PRICE}${pricingData.CURRENCY}`;
      } else {
        element.textContent = `desde ${pricingData.MIN_PRICE} ${pricingData.CURRENCY}${pricingData.SUFFIX}`;
      }
      
      // Si el elemento tiene data-include-note="true", inyectar la nota
      // Buscamos un contenedor de nota adjunto si existe
      if (pricingData.NOTE && element.getAttribute('data-include-note') === 'true') {
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
    noteElement.className = 'text-xs italic text-gray-500 mt-2 font-light';
    anchorElement.parentNode.insertBefore(noteElement, anchorElement.nextSibling);
  }
  
  noteElement.textContent = `* ${noteText}`;
}
