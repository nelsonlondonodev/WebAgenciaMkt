
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenuBtn = document.getElementById('closeMobileMenu');
  const overlay = document.getElementById('nav-overlay');

  if (!mobileMenuButton || !mobileMenu || !overlay) return;

  const closeMobileMenu = () => {
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.classList.remove('mobile-menu-active');
    mobileMenu.classList.add('pointer-events-none');
    overlay.classList.add('opacity-0');
    overlay.classList.add('pointer-events-none');
    mobileMenuButton.classList.remove('is-active');
    document.body.classList.remove('menu-open');
    
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 500);
  };

  const openMobileMenu = () => {
    overlay.classList.remove('hidden');
    document.body.classList.add('menu-open');
    
    // Force reflow
    mobileMenu.offsetHeight;
    
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.add('mobile-menu-active');
    mobileMenu.classList.remove('pointer-events-none');
    overlay.classList.remove('opacity-0');
    overlay.classList.remove('pointer-events-none');
    mobileMenuButton.classList.add('is-active');
  };

  const toggleMobileMenu = () => {
    if (mobileMenu.classList.contains('translate-x-full')) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
  };

  mobileMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    openMobileMenu();
  });

  if (closeMobileMenuBtn) {
    closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
  }

  overlay.addEventListener('click', closeMobileMenu);

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

