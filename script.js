// script.js (type="module")

// --- CORE INITIALIZATIONS & UTILITIES ---
function initializeAOS() {
    AOS.init({
        duration: 700, // Slightly faster for smoother SPA feel
        offset: 50,    // Elements become visible fairly quickly
        once: false,   // Re-animate when sections are revisited
        easing: 'ease-out-quad', // Smooth easing
    });
}

function setFooterYear() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// --- NAVBAR FUNCTIONALITY ---
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar-main');
    if (!navbar) return;
    const scrollThreshold = 50;
    if (window.scrollY > scrollThreshold || document.documentElement.scrollTop > scrollThreshold) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// --- SPA NAVIGATION WITH HTML FETCHING ---
const mainContentContainer = document.getElementById('main-content');
const loadingIndicator = document.getElementById('loading-indicator'); // From index.html
let currentLoadedSectionId = null; // e.g., 'hero' (without '#')
const sectionCache = new Map(); // Use Map for better cache control if needed

/**
 * Fetches HTML content for a given section.
 * @param {string} sectionName - The name of the section (e.g., 'about').
 * @returns {Promise<string|null>} The HTML content or null on error.
 */
async function fetchSectionHTML(sectionName) {
    if (sectionCache.has(sectionName)) {
        return sectionCache.get(sectionName);
    }

    if (loadingIndicator) loadingIndicator.style.display = 'flex'; // Use flex for centering spinner

    try {
        const response = await fetch(`sections/${sectionName}.html?t=${Date.now()}`); // Cache buster for development
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for sections/${sectionName}.html`);
        }
        const html = await response.text();
        sectionCache.set(sectionName, html);
        return html;
    } catch (error) {
        console.error('Error fetching section HTML:', error);
        mainContentContainer.innerHTML = `<div class="container text-center py-5"><p class="text-danger h5">Sorry, an error occurred while loading content for "${sectionName}". Please try again or check the console.</p></div>`;
        return null;
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

/**
 * Fetches HTML content for a given resource article.
 * @param {string} resourceName - The name of the resource (e.g., 'cyber-hygiene-checklist').
 * @returns {Promise<string|null>} The HTML content or null on error.
 */
async function fetchResourceHTML(resourceName) {
    if (sectionCache.has('resource/' + resourceName)) {
        return sectionCache.get('resource/' + resourceName);
    }
    if (loadingIndicator) loadingIndicator.style.display = 'flex';
    try {
        const response = await fetch(`sections/resources/${resourceName}.html?t=${Date.now()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for sections/resources/${resourceName}.html`);
        }
        const html = await response.text();
        sectionCache.set('resource/' + resourceName, html);
        return html;
    } catch (error) {
        console.error('Error fetching resource HTML:', error);
        if (mainContentContainer)
            mainContentContainer.innerHTML = `<div class="container text-center py-5"><p class="text-danger h5">Sorry, an error occurred while loading resource "${resourceName}". Please try again or check the console.</p></div>`;
        return null;
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

// --- SPA NAVIGATION WITH HTML FETCHING (Unified for sections and resources) ---
let currentLoadedPath = null; // e.g., '#hero' or '#resource/cyber-hygiene-checklist'

/**
 * Navigates to a specific section or resource, fetching its HTML and updating the page.
 * @param {string} targetHash - The hash of the target (e.g., '#about' or '#resource/cyber-hygiene-checklist').
 * @param {boolean} [isInitialLoad=false] - True if this is the initial page load.
 */
async function navigateTo(targetHash, isInitialLoad = false) {
    if (!mainContentContainer) return;
    if (!targetHash || typeof targetHash !== 'string') targetHash = '#hero';

    const isResource = targetHash.startsWith('#resource/');
    const contentName = isResource
        ? targetHash.replace(/^#resource\//, '')
        : targetHash.substring(1);

    if (currentLoadedPath === targetHash && !isInitialLoad) {
        window.scrollTo(0, 0);
        return;
    }

    const oldContent = mainContentContainer.querySelector('.page-section.active, .resource-article-content.active');
    let animationOutPromise = Promise.resolve();

    if (oldContent && !isInitialLoad) {
        oldContent.classList.remove('fade-in', 'slide-in-from-right');
        oldContent.classList.add('fade-out');
        animationOutPromise = new Promise(resolve => setTimeout(resolve, 400));
    } else if (oldContent) {
        mainContentContainer.innerHTML = '';
    }

    const newHTMLPromise = isResource
        ? fetchResourceHTML(contentName)
        : fetchSectionHTML(contentName);

    await animationOutPromise;

    if (oldContent && !isInitialLoad) {
        oldContent.classList.remove('active');
    }
    if (mainContentContainer.firstChild && mainContentContainer.firstChild !== loadingIndicator) {
        mainContentContainer.innerHTML = '';
    }

    const newHTML = await newHTMLPromise;

    if (newHTML) {
        mainContentContainer.innerHTML = newHTML;
        const newContentWrapper = isResource
            ? mainContentContainer.querySelector('.resource-article-content')
            : mainContentContainer.querySelector(`#${contentName}.page-section`);

        if (newContentWrapper) {
            newContentWrapper.classList.remove('fade-out', 'slide-out-to-left');
            newContentWrapper.classList.add('active');
            // Force reflow before adding 'in' animation class for transition to trigger
            void newContentWrapper.offsetWidth;
            newContentWrapper.classList.add('fade-in');

            currentLoadedPath = targetHash;

            if (!isInitialLoad) {
                if (window.location.hash !== targetHash) {
                    history.pushState({ path: targetHash }, document.title, targetHash);
                }
            } else {
                history.replaceState({ path: targetHash }, document.title, targetHash);
            }

            if (isResource) {
                // Optionally, update document.title for resource articles
                const resourceTitle = newContentWrapper.getAttribute('data-title') || newContentWrapper.querySelector('h1,h2,h3')?.textContent || 'Resource Article';
                document.title = `${resourceTitle} | Vincent Omondi Portfolio`;
                updateActiveNavLink('#about'); // Or set to none if you prefer
                setupResourceArticleInteractions();
            } else {
                document.title = `Vincent Omondi Portfolio`;
                updateActiveNavLink(targetHash);
                reinitializeMainSectionScripts(contentName);
                AOS.refreshHard();
            }
            window.scrollTo(0, 0);
        } else {
            console.error(`Expected root element not found in fetched HTML for "${contentName}".`);
            mainContentContainer.innerHTML = `<div class="container text-center py-5"><p class="text-danger h5">Content for "${contentName}" loaded, but the main section element is missing.</p></div>`;
        }
    }
    // Error message handled by fetchSectionHTML/fetchResourceHTML if newHTML is null
}

/**
 * Handles JS interactions for loaded resource articles (e.g., "Back" buttons).
 */
function setupResourceArticleInteractions() {
    if (!mainContentContainer) return;
    // Back buttons: .back-to-about-button or .back-to-previous-button
    const backButtons = mainContentContainer.querySelectorAll('.back-to-about-button, .back-to-previous-button');
    backButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = btn.getAttribute('data-target-section') || '#about';
            navigateTo(targetSection);
        });
    });
    // Lazy load images in resource articles
    setupLazyLoading();
}

/**
 * Re-initializes JavaScript functionalities specific to the newly loaded main section.
 * @param {string} sectionName - The name of the loaded section.
 */
function reinitializeMainSectionScripts(sectionName) {
    // console.log(`Re-initializing scripts for section: ${sectionName}`);
    if (sectionName === 'hero') {
        heroTypingAnimation();
    }
    if (sectionName === 'skills') {
        setupSkillCharts();
    }
    if (sectionName === 'projects') {
        // Project modal event listener is on static modal. No re-init needed here for that.
        // But if project cards had specific JS, it would go here.
    }
    if (sectionName === 'interactive-demos') {
        setupVulnScannerDemo();
        setupMiniTerminal();
    }
    if (sectionName === 'contact') {
        setupContactForm();
        setupRotatingSecurityTips();
    }
    setupLazyLoading(); // Process any new images in the loaded section
}

/**
 * Updates the active state of navigation links.
 * @param {string} activeSectionIdWithHash - The hash of the active section (e.g., '#about').
 */
function updateActiveNavLink(activeSectionIdWithHash) {
    const navLinks = document.querySelectorAll('#navbar-main .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeSectionIdWithHash) {
            link.classList.add('active');
        }
    });
}

/**
 * Sets up event listeners for SPA navigation.
 */
function setupSpaNavigation() {
    const delegator = document.body; // Delegate clicks from body for dynamically added links too

    delegator.addEventListener('click', function(e) {
        // Find the closest ancestor anchor tag with an href starting with '#'
        const link = e.target.closest('a[href^="#"]');

        if (link) {
            const href = link.getAttribute('href');
            // Ensure it's a local hash link, not for a modal, and not just "#"
            if (href.length > 1 && !link.getAttribute('data-bs-toggle') && !link.classList.contains('carousel-control-prev') && !link.classList.contains('carousel-control-next')) {
                e.preventDefault();
                navigateTo(href);

                // Close mobile navbar if open and if the click was on a nav-link inside it
                if (link.classList.contains('nav-link')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapseElement = document.querySelector('.navbar-collapse.show');
                    if (navbarCollapseElement && navbarToggler && !navbarToggler.classList.contains('collapsed')) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapseElement);
                        if (bsCollapse) bsCollapse.hide();
                    }
                }
            }
        }
    });

    window.addEventListener('popstate', (event) => {
        let pathToLoad = '#hero';
        if (event.state && event.state.path) {
            pathToLoad = event.state.path;
        } else if (window.location.hash) {
            pathToLoad = window.location.hash;
        }
        navigateTo(pathToLoad, true); // Treat as initial load
    });

    const initialHash = window.location.hash || '#hero';
    navigateTo(initialHash, true);
}


// --- HERO SECTION TYPING ANIMATION ---
function heroTypingAnimation() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    // Query within the heroSection for robustness
    const titleSpanElement = heroSection.querySelector('#hero-title-main > span:first-child');
    const subtitleElement = heroSection.querySelector('#hero-subtitle-text');

    if (!titleSpanElement || !subtitleElement) {
        // console.warn("Hero typing child elements (title/subtitle span) not found.");
        return;
    }

    const nameToType = "Vincent Omondi";
    titleSpanElement.textContent = '';

    const rolesToType = ["Cybersecurity Specialist", "Cloud Security Engineer", "Software Developer", "Ethical Hacker", "Problem Solver"];
    let roleIndex = 0, charIndex = 0, nameCharIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100, erasingSpeed = 60, delayBetweenRoles = 1800;

    function typeName() {
        if (!document.contains(titleSpanElement)) return;
        if (nameCharIndex < nameToType.length) {
            titleSpanElement.textContent += nameToType.charAt(nameCharIndex++);
            setTimeout(typeName, typingSpeed - 20);
        } else {
            // The cursor is already in the HTML structure of hero.html for the title
            typeRoles();
        }
    }

    function typeRoles() {
        if (!document.contains(subtitleElement)) return;
        const currentRole = rolesToType[roleIndex];
        let currentSpeed = isDeleting ? erasingSpeed : typingSpeed;

        subtitleElement.textContent = currentRole.substring(0, charIndex + (isDeleting ? -1 : 1));
        charIndex += (isDeleting ? -1 : 1);

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true; currentSpeed = delayBetweenRoles;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false; roleIndex = (roleIndex + 1) % rolesToType.length; currentSpeed = typingSpeed / 2;
        }
        setTimeout(typeRoles, currentSpeed);
    }
    setTimeout(typeName, 300); // Initial delay
}


// --- THEME TOGGLING ---
// (Your existing setupThemeToggles function is good, just ensure chart re-init is robust)
function setupThemeToggles() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const pentesterViewToggle = document.getElementById('pentesterViewToggle');
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const lightIcon = document.getElementById('lightModeIcon');
    const darkIcon = document.getElementById('darkModeIcon');

    function applyTheme(theme, isPentester = false) {
        bodyElement.removeAttribute('data-pentester-view');
        if (isPentester) { /* ... */ localStorage.setItem('theme', 'pentester'); }
        else if (theme === 'dark') { /* ... */ localStorage.setItem('theme', 'dark'); }
        else { /* ... */ localStorage.setItem('theme', 'light'); }

        // Chart re-rendering if skills section is active
        if (currentLoadedSectionId === 'skills' && typeof Chart !== 'undefined') {
            setupSkillCharts(); // This function should handle destroying and re-creating
        }
    }
    // ... (rest of your existing theme toggle logic) ...
    // Ensure initial theme application logic is present
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'pentester') applyTheme(null, true);
    else if (savedTheme) applyTheme(savedTheme);
    else if (prefersDark) applyTheme('dark');
    else applyTheme('light');
}


// --- INTERACTIVE SKILL CHARTS (Chart.js) ---
let cybersecurityChartInstance = null;
let cloudSkillsChartInstance = null;
function setupSkillCharts() {
    if (typeof Chart === 'undefined') return;

    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return; // Skills section not loaded

    const cyberChartCtx = skillsSection.querySelector('#cybersecurityChart')?.getContext('2d');
    const cloudChartCtx = skillsSection.querySelector('#cloudSkillsChart')?.getContext('2d');

    if (!cyberChartCtx && !cloudChartCtx) return; // Canvas not found within loaded skills section

    if (cybersecurityChartInstance) cybersecurityChartInstance.destroy();
    if (cloudSkillsChartInstance) cloudSkillsChartInstance.destroy();

    // ... (Your existing chart color logic and chart instantiation - ensure it's complete)
    // Make sure this logic is robust and finds the canvas elements correctly after they are loaded.
    // Example (very shortened, refer to your full version for complete options):
    const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
    const isPentesterView = document.body.hasAttribute('data-pentester-view');
    let pointLabelColor = isPentesterView ? '#ffcccc' : (currentTheme === 'dark' ? '#ccd6f6' : '#343a40');
    // ... setup all colors ...

    if (cyberChartCtx) {
        cybersecurityChartInstance = new Chart(cyberChartCtx, { /* ... config ... */ });
    }
    if (cloudChartCtx) {
        cloudSkillsChartInstance = new Chart(cloudChartCtx, { /* ... config ... */ });
    }
}

// --- PROJECT MODAL FUNCTIONALITY ---
// (Your existing setupProjectModals function is largely fine as the modal is static.
//  Ensure projectData image paths are 'assets/...')
function setupProjectModals() {
    const projectModalElement = document.getElementById('projectModal');
    if (!projectModalElement) return;

    const projectData = {
        'student-attachment': { title: 'Student Attachment Platform', img: 'assets/project-placeholder.png', /* ...rest of data... */ },
        'personal-portfolio': { title: 'Personal Portfolio Website (This Site V1)', img: 'assets/project-placeholder.png', /* ... */ },
        'ai-pulse-blog': { title: 'AI Pulse - Dynamic AI Blog Platform', img: 'assets/project-placeholder.png', /* ... */ },
        'attachme-android': { title: 'AttachME - Android Internship App (In Progress)', img: 'assets/project-attachme-android.png', /* ... */ }
    };

    // Using a named function for the event listener to allow removal if ever needed,
    // though for a static modal and 'show.bs.modal', it's usually fine to add once.
    const modalShowHandler = function (event) {
        const button = event.relatedTarget;
        if (!button) return;
        const projectId = button.getAttribute('data-project-id');
        const project = projectData[projectId];
        // ... (rest of your modal population logic)
    };
    // Remove any old listener if this function were to be called multiple times for re-init (not current case)
    // projectModalElement.removeEventListener('show.bs.modal', modalShowHandler);
    projectModalElement.addEventListener('show.bs.modal', modalShowHandler);
}


// --- INTERACTIVE DEMOS & OTHER SECTION-SPECIFIC SCRIPTS ---
function setupVulnScannerDemo() {
    const demosSection = document.getElementById('interactive-demos');
    if (!demosSection) return;
    const scanButton = demosSection.querySelector('#vulnScanButton');
    if (!scanButton) return;
    // ... rest of your existing setupVulnScannerDemo, querying within demosSection ...
}

/*

function setupMiniTerminal() {
    const demosSection = document.getElementById('interactive-demos');
    if (!demosSection) return;
    const terminalInput = demosSection.querySelector('#terminalInput');
    if (!terminalInput) return;
    // ... rest of your setupMiniTerminal, ensuring nav-link-terminal listeners call navigateToSection ...
    // Example for attaching listeners to dynamically created links in terminal:
    // const terminalOutput = demosSection.querySelector('#terminalOutput');
    // terminalOutput.addEventListener('click', function(e) {
    //     const link = e.target.closest('a.nav-link-terminal[href^="#"]');
    //     if (link) {
    //         e.preventDefault();
    //         navigateToSection(link.getAttribute('href'));
    //     }
    // });
}
*/


// script.js

// ... (other functions like navigateToSection, initializeAOS, etc., remain the same) ...

/**
 * Sets up the interactive mini terminal functionality.
 * This function should be called after the 'interactive-demos.html' partial is loaded.
 */
 
// Crucial: Ensure this function is called when the 'interactive-demos' section is loaded
// This is handled by reinitializeSectionScripts:
// function reinitializeSectionScripts(sectionName) {
//     // ... other sections
//     if (sectionName === 'interactive-demos') {
//         setupVulnScannerDemo();
//         setupMiniTerminal(); // This call is essential
//     }
//     // ...
// }


function setupRotatingSecurityTips() {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;
    const tipElement = contactSection.querySelector('#securityTipText');
    if (!tipElement) return;
    // ... rest of your existing setupRotatingSecurityTips ...
}

function setupContactForm() {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;
    const form = contactSection.querySelector('#contactForm');
    if (!form) return;
    // ... rest of your existing setupContactForm ...
}

// --- LAZY LOADING IMAGES ---
function setupLazyLoading() {
    // Query for images only within the mainContentContainer that haven't been processed
    if (!mainContentContainer) return;
    const lazyImages = mainContentContainer.querySelectorAll('img[loading="lazy"]:not(.loaded)');
    if (lazyImages.length === 0) return;

    // ... (rest of your existing IntersectionObserver logic) ...
}

// --- DOCUMENT READY LISTENER ---
document.addEventListener('DOMContentLoaded', () => {
    initializeAOS();
    setFooterYear();
    setupThemeToggles();
    setupProjectModals();

    if (!mainContentContainer) {
        console.error('Main content container (#main-content) not found!');
        return;
    }
    setupSpaNavigation();

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    console.log("Portfolio SPA (V.HTML-Partials) Initialized.");
});


