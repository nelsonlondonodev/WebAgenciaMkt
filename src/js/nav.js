function createNavOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'nav-overlay';
  overlay.className =
    'fixed inset-0 bg-black/50 z-10 hidden';
  document.body.appendChild(overlay);
  return overlay;
}

function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = createNavOverlay();

  if (!mobileMenuButton || !mobileMenu) return;

  const closeMobileMenu = () => {
    mobileMenu.classList.add('hidden');
    overlay.classList.add('hidden');
    mobileMenuButton.classList.remove('is-active');
  };

  const openMobileMenu = () => {
    mobileMenu.classList.remove('hidden');
    overlay.classList.remove('hidden');
    mobileMenuButton.classList.add('is-active');
  };

  const toggleMobileMenu = () => {
    if (mobileMenu.classList.contains('hidden')) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
  };

  mobileMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Close menu when the overlay is clicked
  overlay.addEventListener('click', closeMobileMenu);

  // Close menu when a link is clicked, but not the services button
  mobileMenu.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    if (e.target.closest('#mobileServicesButton')) {
      return;
    }

    closeMobileMenu();
  });
}

function initMobileServicesMenu() {
  const mobileServicesButton = document.getElementById('mobileServicesButton');
  const mobileServicesMenu = document.getElementById('mobileServicesMenu');

  if (!mobileServicesButton || !mobileServicesMenu) return;

  mobileServicesButton.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileServicesMenu.classList.toggle('hidden');
    const icon = mobileServicesButton.querySelector('i.fa-chevron-down');
    if (icon) {
      icon.classList.toggle('rotate-180');
    }
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('header nav a');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('nav-active');
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
  const servicesMenuDropdown = document.getElementById('services-menu-dropdown');
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

export function initNav() {
  initMobileMenu();
  initMobileServicesMenu();
  initScrollSpy();
  initDesktopServicesMenu();
}

