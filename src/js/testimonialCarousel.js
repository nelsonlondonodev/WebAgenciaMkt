import { testimonialsData } from './data/testimonials.js';

export function initTestimonialCarousel() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  // Transform container for carousel
  container.className = "relative w-full overflow-hidden mask-gradient-sides py-4";
  container.innerHTML = ''; // Clear existing static grid

  // Create animation track
  const track = document.createElement('div');
  track.className = "flex gap-6 w-max animate-infinite-scroll hover:pause-animation";

  // Card Template Function
  const createCard = (data) => `
      <div class="w-[280px] md:w-[320px] flex-shrink-0 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 h-full flex flex-col select-none">
          <div class="flex justify-between items-start mb-3">
               <div class="flex text-yellow-400 text-xs gap-0.5">
                  ${'<i class="fas fa-star"></i>'.repeat(data.stars)}
               </div>
               <div class="w-5 h-5 opacity-50 grayscale hover:grayscale-0 transition-all">
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
                  <p class="font-bold text-gray-900 dark:text-white text-xs truncate">${data.author}</p>
                  <p class="text-[10px] text-gray-500 uppercase tracking-wide truncate">${data.service}</p>
              </div>
          </div>
      </div>
  `;

  // Determine needed duplicates to fill screen and animate smoothly
  // We want at least 15 cards total for a smooth long loop
  let cards = [...testimonialsData];
  while (cards.length < 12) {
      cards = [...cards, ...testimonialsData];
  }
  // Double it once more for seamless loop
  const finalCards = [...cards, ...cards];

  track.innerHTML = finalCards.map(createCard).join('');
  container.appendChild(track);
  
  // Inject component-specific styles
  if (!document.getElementById('testimonial-carousel-styles')) {
      const style = document.createElement('style');
      style.id = 'testimonial-carousel-styles';
      style.textContent = `
          @keyframes infinite-scroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
              animation: infinite-scroll 60s linear infinite;
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
}
