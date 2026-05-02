function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenuBtn = document.getElementById('closeMobileMenu');
const overlay = document.getElementById('nav-overlay');

/**
 * Helper para alternar atributos de accesibilidad.
 */
const toggleAria = (element, attr, value) => {
  if (element) element.setAttribute(attr, value);
};

  if (!mobileMenuButton || !mobileMenu || !overlay) return;

  const setMenuState = (isOpen) => {
    if (isOpen) {
      // Show overlay immediately but transparently
      overlay.classList.remove('hidden');
      
      // Prevent body scroll
      document.documentElement.classList.add('menu-open');
      document.body.classList.add('menu-open');

      // Small delay to allow 'hidden' removal before animating opacity
      requestAnimationFrame(() => {
        mobileMenu.classList.add('mobile-menu-active');
        mobileMenu.classList.remove('translate-x-full', 'pointer-events-none');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        
        mobileMenuButton.classList.add('is-active');
        toggleAria(mobileMenuButton, 'aria-expanded', 'true');
        toggleAria(mobileMenu, 'aria-hidden', 'false');
      });
    } else {
      // Close animations
      mobileMenu.classList.remove('mobile-menu-active');
      mobileMenu.classList.add('translate-x-full', 'pointer-events-none');
      overlay.classList.add('opacity-0', 'pointer-events-none');

      mobileMenuButton.classList.remove('is-active');
      toggleAria(mobileMenuButton, 'aria-expanded', 'false');
      toggleAria(mobileMenu, 'aria-hidden', 'true');

      // Delay cleanup until animations finish
      setTimeout(() => {
        if (!mobileMenu.classList.contains('mobile-menu-active')) {
          overlay.classList.add('hidden');
          document.documentElement.classList.remove('menu-open');
          document.body.classList.remove('menu-open');
        }
      }, 500);
    }
  };

  const openMobileMenu = () => setMenuState(true);
  const closeMobileMenu = () => setMenuState(false);

  mobileMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mobileMenu.classList.contains('mobile-menu-active');
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  });

  if (closeMobileMenuBtn) {
    closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
  }

  overlay.addEventListener('click', closeMobileMenu);

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      mobileMenu.classList.contains('mobile-menu-active')
    ) {
      closeMobileMenu();
    }
  });

  // Handle link clicks
  mobileMenu.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    if (e.target.closest('#mobileServicesButton')) return;
    closeMobileMenu();
  });
}

function initMobileServicesMenu() {
  const mobileServicesButton = document.getElementById('mobileServicesButton');
  const mobileServicesMenu = document.getElementById('mobileServicesMenu');

  if (!mobileServicesButton || !mobileServicesMenu) return;

  mobileServicesButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = mobileServicesMenu.classList.toggle('is-active');
    toggleAria(mobileServicesButton, 'aria-expanded', isActive);

    const icon = mobileServicesButton.querySelector('i.fa-chevron-down');
    if (icon) {
      icon.classList.toggle('rotate-180');
    }
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('header nav a');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  if (sections.length === 0 && desktopLinks.length === 0) return;

  // Highlight current page based on URL
  const currentPath = window.location.pathname;
  mobileLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (
      href === currentPath ||
      (currentPath === '/' && href === '/index.html')
    ) {
      link.classList.add('mobile-link-active');
    } else {
      link.classList.remove('mobile-link-active');
    }
  });

  if (sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;

        // Update Desktop Links
        desktopLinks.forEach((link) => {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('nav-active');
          }
        });

        // Update Mobile Links for sections
        mobileLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('mobile-link-active');
          } else if (link.getAttribute('href')?.startsWith('#')) {
            link.classList.remove('mobile-link-active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

function initDesktopServicesMenu() {
  const servicesMenuGroup = document.getElementById('services-menu-group');
  const servicesMenuDropdown = document.getElementById(
    'services-menu-dropdown'
  );
  let timeoutId;

  if (!servicesMenuGroup || !servicesMenuDropdown) return;

  servicesMenuGroup.addEventListener('mouseenter', () => {
    clearTimeout(timeoutId);
    servicesMenuDropdown.classList.remove('hidden');
  });

  servicesMenuGroup.addEventListener('mouseleave', () => {
    timeoutId = setTimeout(() => {
      servicesMenuDropdown.classList.add('hidden');
    }, 300); // 300ms de retardo
  });
}

function initStickyHeader() {
  const header = document.querySelector('.sticky-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

export function initNav() {
  initMobileMenu();
  initMobileServicesMenu();
  initScrollSpy();
  initDesktopServicesMenu();
  initStickyHeader();
}
