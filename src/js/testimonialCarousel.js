import { testimonialsData } from './data/testimonials.js';

// --- Configuration ---
const CAROUSEL_ANIMATION_DURATION = '150s';
const MIN_CARDS_FOR_LOOP = 12;

/**
 * Injects the necessary CSS styles for the infinite carousel animation.
 * This ensures the component is self-contained and styles are present.
 */
function injectCarouselStyles() {
  if (document.getElementById('testimonial-carousel-styles')) return;

  const style = document.createElement('style');
  style.id = 'testimonial-carousel-styles';
  style.textContent = `
      @keyframes slow-carousel-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
      }
      .animate-slow-carousel {
          animation: slow-carousel-scroll ${CAROUSEL_ANIMATION_DURATION} linear infinite;
      }
      .hover\\:pause-animation:hover {
          animation-play-state: paused;
      }
      .mask-gradient-sides {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
      }
  `;
  document.head.appendChild(style);
}

/**
 * Generates the HTML string for the star rating.
 * @param {number} count - Number of stars (1-5)
 * @returns {string} HTML string of star icons
 */
function createStarsHtml(count) {
  return '<i class="fas fa-star"></i>'.repeat(count);
}

/**
 * Creates the HTML template for a single testimonial card.
 * @param {Object} data - The testimonial data object
 * @returns {string} HTML string for the card
 */
function createCardHtml(data) {
  return `
      <a href="https://share.google/PklHZIWoycARf1HGP" target="_blank" rel="noopener noreferrer" class="w-[280px] md:w-[320px] flex-shrink-0 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 h-full flex flex-col select-none block no-underline hover:no-underline cursor-pointer group">
          <div class="flex justify-between items-start mb-3">
               <div class="flex text-yellow-400 text-xs gap-0.5">
                  ${createStarsHtml(data.stars)}
               </div>
               <div class="w-5 h-5 transition-all group-hover:scale-110">
                  <svg viewBox="0 0 24 24" class="w-full h-full">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.16c1.56 0 2.95.55 4.06 1.6l3.16-3.16C17.45 1.99 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
               </div>
          </div>
          
          <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-grow mb-4 line-clamp-5 italic">
              "${data.text}"
          </p>
          
          <div class="mt-auto border-t border-gray-100 dark:border-gray-700 pt-3 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-green to-primary-blue text-white flex items-center justify-center font-bold text-xs shadow-inner">
                  ${data.author.charAt(0)}
              </div>
              <div class="overflow-hidden">
                  <p class="font-bold text-gray-900 dark:text-white text-xs truncate group-hover:text-primary-blue dark:group-hover:text-primary-green transition-colors">${data.author}</p>
                  <p class="text-[10px] text-gray-500 uppercase tracking-wide truncate">${data.service}</p>
              </div>
          </div>
      </a>
  `;
}

/**
 * Prepares the data array for infinite looping by duplicating it enough times.
 * @param {Array} originalData - The source data
 * @returns {Array} The expanded data array ready for the carousel
 */
function prepareCarouselData(originalData) {
  let cards = [...originalData];
  
  // Ensure we have enough cards to fill a wide screen before duplicating
  while (cards.length < MIN_CARDS_FOR_LOOP) {
      cards = [...cards, ...originalData];
  }
  
  // Double the final set to create the seamless visual loop (A + A)
  return [...cards, ...cards];
}

/**
 * Initializes the carousel DOM structure.
 * @param {HTMLElement} container 
 * @param {string} innerHtml - The HTML content of the cards
 */
function renderCarouselTrack(container, innerHtml) {
  // Apply mask and layout to container
  container.className = "relative w-full overflow-hidden mask-gradient-sides py-4";
  container.innerHTML = '';
  
  // Create animated track
  const track = document.createElement('div');
  track.className = "flex gap-6 w-max animate-slow-carousel hover:pause-animation";
  track.innerHTML = innerHtml;
  
  container.appendChild(track);
}

// --- Main Initialization Function ---

export function initTestimonialCarousel() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  injectCarouselStyles();

  const finalCardsData = prepareCarouselData(testimonialsData);
  const carouselHtml = finalCardsData.map(createCardHtml).join('');
  
  renderCarouselTrack(container, carouselHtml);
}
