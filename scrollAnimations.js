export function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(".scroll-animate-initial");
    if (animatedElements.length > 0) {
        if (typeof IntersectionObserver !== "undefined") {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("is-visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );
            animatedElements.forEach((el, index) => {
                el.style.transitionDelay = `${30 * index}ms`;
                observer.observe(el);
            });
        }
    }
}
