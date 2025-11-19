export function initSmoothScroll() {
  document.body.classList.add('fade-in');

  /**
   * Handles smooth scrolling to an internal anchor.
   * @param {string} href - The href of the internal link (e.g., '#sectionId').
   */
  function handleSmoothScroll(href) {
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const headerOffset = document.getElementById('mainHeader')?.offsetHeight || 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  /**
   * Manages the page transition (fade-out/fade-in) and navigates or scrolls.
   * @param {string} href - The target URL or anchor.
   * @param {boolean} isInternalLink - True if the link is an internal anchor.
   */
  function handlePageTransition(href, isInternalLink) {
    document.body.classList.add('fade-out');

    setTimeout(() => {
      if (isInternalLink) {
        handleSmoothScroll(href);
        setTimeout(() => {
          document.body.classList.remove('fade-out');
        }, 50); // Small delay to ensure scroll starts before fade-in
      } else {
        window.location.href = href;
      }
    }, 300); // Match CSS transition duration
  }

  document
    .querySelectorAll(
      'a:not([href^="tel:"]):not([href^="mailto:"]):not(.social-share-btn):not(.modal-contact-button):not([target="_blank"])'
    )
    .forEach((link) => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (!href || href === '#') {
          return;
        }

        const isInternalAnchor = href.startsWith('#');
        const isSamePage =
          isInternalAnchor ||
          href.split('#')[0] === window.location.pathname.split('/').pop() ||
          href.split('#')[0] === '';

        if (this.hostname === window.location.hostname || href.startsWith('/')) {
          e.preventDefault();
          handlePageTransition(href, isInternalAnchor && isSamePage);
        }
      });
    });
}
