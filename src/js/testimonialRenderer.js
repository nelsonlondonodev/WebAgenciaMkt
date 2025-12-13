import { testimonialsData } from './data/testimonials.js';
import { observeAnimatedElements } from './scrollAnimations.js';

function createStarRating(rating) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += `<i class="fas fa-star ${i < rating ? 'text-yellow-400' : 'text-gray-300'}"></i>`;
  }
  return `<div class="testimonial-stars mb-2">${stars}</div>`;
}

function createTestimonialCard(testimonial) {
  return `
    <a
      href="${testimonial.reviewUrl}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ver reseña en Google"
      class="testimonial-card scroll-animate-initial block group transition-transform duration-300 ease-in-out hover:-translate-y-2"
    >
      <div class="flex justify-between items-start">
        <i class="fas fa-quote-left text-5xl text-primary-green/20 dark:text-primary-blue/20"></i>
        <div class="w-7 h-7">
          <svg viewBox="0 0 24 24" class="w-full h-full">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
            <path d="M12 5.16c1.56 0 2.95.55 4.06 1.6l3.16-3.16C17.45 1.99 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            <path d="M1 1h22v22H1z" fill="none"></path>
          </svg>
        </div>
      </div>
      <p class="my-4 text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300 flex-grow">
        ${testimonial.text}
      </p>
      <div class="mt-auto">
        ${createStarRating(testimonial.stars)}
        <p class="font-semibold text-gray-800 dark:text-white">${testimonial.author}</p>
        <p class="text-sm text-gray-500">${testimonial.service}</p>
      </div>
    </a>
  `;
}

export function initTestimonialCards() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  const cardsHtml = testimonialsData.map(createTestimonialCard).join('');
  container.innerHTML = cardsHtml;

  const newCards = container.querySelectorAll('.scroll-animate-initial');
  observeAnimatedElements(newCards);
}
