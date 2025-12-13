const observer =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      )
    : null;

export function observeAnimatedElements(elements) {
  if (!observer || !elements) return;

  const elementsToObserve =
    elements instanceof NodeList ? Array.from(elements) : [elements];

  elementsToObserve.forEach((el, index) => {
    // La clase 'scroll-animate-initial' ya debe estar en el elemento
    if (el.classList.contains('scroll-animate-initial')) {
      el.style.transitionDelay = `${30 * index}ms`;
      observer.observe(el);
    }
  });
}

export function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-animate-initial');
  if (animatedElements.length > 0) {
    observeAnimatedElements(animatedElements);
  }
}
