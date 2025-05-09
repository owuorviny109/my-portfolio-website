// Initialize AOS (Animate on Scroll) Library
AOS.init({
    duration: 800,  // Animation duration in ms
    offset: 100,    // Offset (in px) from the original trigger point
    once: true,     // Whether animation should happen only once - while scrolling down
    easing: 'ease-in-out', // Default easing for AOS animations
});

// Set current year in footer
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// Navbar background change on scroll
const navbar = document.getElementById('navbar-main');
if (navbar) {
    const scrollThreshold = 50; // Pixels to scroll before changing navbar style

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check in case the page loads already scrolled
    handleScroll();
}

// Smooth scrolling for all links with hashes & Active Nav Link Highlighting
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#navbar-main .nav-link');
    const sections = document.querySelectorAll('section[id]'); // Ensure sections have IDs

    // Smooth scroll functionality
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if it's an internal link starting with # and has more characters
            if (href && href.startsWith('#') && href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();

                    // Calculate scroll position (consider navbar height if fixed)
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    // Using getBoundingClientRect().top gives distance from viewport top
                    // Adding window.pageYOffset gives distance from document top
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    // Subtract navbar height and a small buffer (e.g., 10px)
                    const offsetPosition = elementPosition - navbarHeight - 10;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Optional: Close mobile navbar after clicking a link
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse.show'); // Only target if shown
                    if (navbarCollapse && navbarToggler && !navbarToggler.classList.contains('collapsed')) {
                         const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                         if (bsCollapse) {
                            bsCollapse.hide();
                         }
                    }
                }
            }
        });
    });

    const heroTypedTextOutputElement = document.getElementById('hero-typed-text-output');
    const heroCursorElement = document.querySelector('.hero-typing-cursor');

    if (heroTypedTextOutputElement && heroCursorElement) {
        const textsToTypeHero = [
            "Vincent Omondi",
            "Cybersecurity Specialist",
            "Cloud Security Engineer",
            "Software Developer"
        ];
        let heroTextArrayIndex = 0;
        let heroCharIndex = 0;
        let heroIsDeleting = false;
        const heroTypingSpeed = 120;
        const heroErasingSpeed = 70;
        const heroDelayBetweenTexts = 2000;

        function heroTypeAnimation() {
            if (!document.body.contains(heroTypedTextOutputElement)) return;
            heroCursorElement.style.display = 'inline-block';
            const currentHeroText = textsToTypeHero[heroTextArrayIndex];
            let currentHeroSpeed = heroIsDeleting ? heroErasingSpeed : heroTypingSpeed;

            if (heroIsDeleting) {
                heroTypedTextOutputElement.textContent = currentHeroText.substring(0, heroCharIndex - 1);
                heroCharIndex--;
            } else {
                heroTypedTextOutputElement.textContent = currentHeroText.substring(0, heroCharIndex + 1);
                heroCharIndex++;
            }

            if (!heroIsDeleting && heroCharIndex === currentHeroText.length) {
                heroIsDeleting = true;
                currentHeroSpeed = heroDelayBetweenTexts;
            } else if (heroIsDeleting && heroCharIndex === 0) {
                heroIsDeleting = false;
                heroTextArrayIndex = (heroTextArrayIndex + 1) % textsToTypeHero.length;
                currentHeroSpeed = heroTypingSpeed / 2;
            }
            setTimeout(heroTypeAnimation, currentHeroSpeed);
        }

        setTimeout(heroTypeAnimation, 1000); // Initial delay
    } else {
        if (!heroTypedTextOutputElement) console.warn("Element with ID 'hero-typed-text-output' not found.");
        if (!heroCursorElement) console.warn("Element with class 'hero-typing-cursor' not found.");
    }

    // Active link highlighting on scroll
    const highlightNavLink = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + (navbar ? navbar.offsetHeight : 0) + 50; // Add offset

        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            // Check if link's href matches the current section ID (ignoring the #)
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        // Special case for top of page / Hero section
        if (window.scrollY < sections[0].offsetTop - (navbar ? navbar.offsetHeight : 0) - 50) {
             navLinks.forEach((link) => link.classList.remove('active'));
             const homeLink = document.querySelector('#navbar-main .nav-link[href="#hero"]');
             if(homeLink) homeLink.classList.add('active');
        }


    };

    window.addEventListener('scroll', highlightNavLink);
    // Initial check on load
    highlightNavLink();
});

console.log("Portfolio script loaded and running.");

// Note: The Bootstrap JS bundle handles the basic collapse functionality for the navbar toggler.
// This script adds smooth scrolling, active link highlighting, and the scroll effect for the navbar background.