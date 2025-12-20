export function initHeroIframe() {
  const heroIframeContainer = document.getElementById('hero-iframe-container');
  if (!heroIframeContainer) return;

  heroIframeContainer.addEventListener(
    'click',
    () => {
      const placeholder = document.getElementById('hero-iframe-placeholder');
      const iframe = document.getElementById('hero-iframe');
      if (iframe && iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
        if (placeholder) {
          placeholder.classList.add('hidden');
        }
        iframe.classList.remove('hidden');
        heroIframeContainer.style.cursor = 'default';
      }
    },
    { once: true }
  );
}
