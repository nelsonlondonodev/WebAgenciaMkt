export function initSmoothScroll() {
    document.body.classList.add('fade-in');

    document.querySelectorAll('a:not([href^="tel:"]):not([href^="mailto:"]):not(.social-share-btn):not(.modal-contact-button):not([target="_blank"])').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (!href || href === '#') {
                return;
            }

            const isInternalLink = href.startsWith('#');
            const isSamePageNavigation = isInternalLink || href.split('#')[0] === window.location.pathname.split('/').pop() || href.split('#')[0] === '';

            if (this.hostname === window.location.hostname || href.startsWith('/')) {
                e.preventDefault();
                document.body.classList.add('fade-out');
                
                setTimeout(() => {
                    if (isSamePageNavigation && isInternalLink) {
                        const targetElement = document.querySelector(href);
                        if (targetElement) {
                            const headerOffset = document.getElementById('mainHeader')?.offsetHeight || 80;
                            const elementPosition = targetElement.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                            
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                            
                            setTimeout(() => {
                                document.body.classList.remove('fade-out');
                            }, 50);

                        } else {
                            document.body.classList.remove('fade-out');
                        }
                    } else {
                        window.location.href = href;
                    }
                }, 300);
            }
        });
    });
}
