function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileServicesButton = document.getElementById('mobileServicesButton');

  if (!mobileMenuButton || !mobileMenu) return;

  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuButton.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });

  // Close menu when a link is clicked, but not the services button
  mobileMenu.addEventListener('click', (e) => {
    // Check if the clicked element is a link inside the mobile menu
    const link = e.target.closest('a');
    if (!link) return;

    // If the click is on the services button, do nothing, let its own handler work
    if (e.target.closest('#mobileServicesButton')) {
      return;
    }

    // For all other links, close the menu
    mobileMenu.classList.add('hidden');
    const icon = mobileMenuButton.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
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

