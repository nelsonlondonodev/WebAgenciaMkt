function animateValue(element, start, end, duration, decimals = 0) {
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    const currentValue = start + (end - start) * progress;
    element.textContent = currentValue.toFixed(decimals);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

function initNumberAnimation() {
  const card = document.getElementById('seo-case-study-card');
  if (!card) return;

  const endPosElement = document.getElementById('case-study-end-pos');
  const startPosElement = document.getElementById('case-study-start-pos');
  const endPosDescElement = document.getElementById('case-study-end-pos-desc');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (endPosElement) {
            // Animate the main number from 9.0 down to 6.6
            animateValue(endPosElement, 9.0, 6.6, 2000, 1);
          }
          // The other numbers in the text will remain static.
          observer.unobserve(card); // Animate only once
        }
      });
    },
    { threshold: 0.5 } // Trigger when 50% of the element is visible
  );

  observer.observe(card);
}

export { initNumberAnimation };
