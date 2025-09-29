export function initNav() {
    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
            const icon = mobileMenuButton.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars");
                icon.classList.toggle("fa-times");
            }
        });
        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
                const icon = mobileMenuButton.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("header nav a");
    if (sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: "0px 0px -60% 0px",
            threshold: 0,
        };
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navLinks.forEach((link) => {
                        link.classList.remove("nav-active");
                        if (link.getAttribute("href") === `#${sectionId}`) {
                            link.classList.add("nav-active");
                        }
                    });
                }
            });
        }, observerOptions);
        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }
}
