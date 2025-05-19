// script.js (type="module")

// --- CORE INITIALIZATIONS & UTILITIES ---
function initializeAOS() {
    AOS.init({
        duration: 800,
        offset: 120, // Slightly increased offset
        once: true,
        easing: 'ease-in-out-quad', // A smoother easing
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
    if (window.scrollY > scrollThreshold) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function setupSmoothScrollingAndActiveNav() {
    const navbar = document.getElementById('navbar-main');
    const navLinks = document.querySelectorAll('#navbar-main .nav-link');
    const sections = document.querySelectorAll('section[id]');

    if (!navLinks.length || !sections.length) return;

    // Smooth scroll
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - navbarHeight - 20; // Adjusted buffer

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile navbar
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapseElement = document.querySelector('.navbar-collapse.show');
                    if (navbarCollapseElement && navbarToggler && !navbarToggler.classList.contains('collapsed')) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapseElement);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    }
                }
            }
        });
    });

    // Active link highlighting
    const highlightNavLink = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + (navbar ? navbar.offsetHeight : 0) + 80; // Increased offset for accuracy

        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Hero section active link
        if (window.scrollY < (sections[0].offsetTop - (navbar ? navbar.offsetHeight : 0) - 80)) {
             navLinks.forEach((link) => link.classList.remove('active'));
             const homeLink = document.querySelector('#navbar-main .nav-link[href="#hero"]');
             if(homeLink) homeLink.classList.add('active');
        }
    };

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Initial call
}


// --- HERO SECTION TYPING ANIMATION ---
function heroTypingAnimation() {
    const titleElement = document.getElementById('hero-title-main'); // For "Vincent Omondi"
    const subtitleElement = document.getElementById('hero-subtitle-text'); // For roles
    const cursorElement = document.querySelector('#hero .terminal-cursor'); // Hero cursor

    if (!titleElement || !subtitleElement || !cursorElement) {
        console.warn("Hero typing elements not found.");
        return;
    }

    const nameToType = "Vincent Omondi";
    const rolesToType = [
        "Cybersecurity Specialist",
        "Cloud Security Engineer",
        "Software Developer",
        "Ethical Hacker",
        "Problem Solver"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const delayBetweenRoles = 1800;

    // Type name first
    let nameCharIndex = 0;
    function typeName() {
        if (nameCharIndex < nameToType.length) {
            titleElement.textContent += nameToType.charAt(nameCharIndex);
            nameCharIndex++;
            setTimeout(typeName, typingSpeed - 20);
        } else {
            // Once name is typed, start typing roles
            cursorElement.style.display = 'inline-block'; // Show cursor for roles
            typeRoles();
        }
    }
    // Initialize title with empty and hide cursor initially for name typing
    titleElement.textContent = '';
    cursorElement.style.display = 'none';


    function typeRoles() {
        const currentRole = rolesToType[roleIndex];
        let currentSpeed = isDeleting ? erasingSpeed : typingSpeed;

        if (isDeleting) {
            subtitleElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            subtitleElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            currentSpeed = delayBetweenRoles;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % rolesToType.length;
            currentSpeed = typingSpeed / 2;
        }
        setTimeout(typeRoles, currentSpeed);
    }
    setTimeout(typeName, 500); // Start typing name after a short delay
}


// --- THEME TOGGLING (DARK/LIGHT MODE & PENTESTER VIEW) ---
function setupThemeToggles() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const pentesterViewToggle = document.getElementById('pentesterViewToggle');
    const htmlElement = document.documentElement; // Target <html> for data-bs-theme
    const bodyElement = document.body;

    const lightIcon = document.getElementById('lightModeIcon');
    const darkIcon = document.getElementById('darkModeIcon');

    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlElement.setAttribute('data-bs-theme', 'dark');
            if(lightIcon) lightIcon.style.display = 'inline-block';
            if(darkIcon) darkIcon.style.display = 'none';
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.setAttribute('data-bs-theme', 'light');
            if(lightIcon) lightIcon.style.display = 'none';
            if(darkIcon) darkIcon.style.display = 'inline-block';
            localStorage.setItem('theme', 'light');
        }
        bodyElement.removeAttribute('data-pentester-view'); // Ensure pentester view is off
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    if (pentesterViewToggle) {
        pentesterViewToggle.addEventListener('click', () => {
            if (bodyElement.hasAttribute('data-pentester-view')) {
                bodyElement.removeAttribute('data-pentester-view');
                // Reapply stored theme or default to light
                const storedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                applyTheme(storedTheme);
            } else {
                bodyElement.setAttribute('data-pentester-view', 'true');
                // Optionally, force Bootstrap base theme to dark for pentester view consistency
                htmlElement.setAttribute('data-bs-theme', 'dark');
                if(lightIcon) lightIcon.style.display = 'inline-block'; // Show sun as it's dark based
                if(darkIcon) darkIcon.style.display = 'none';
            }
        });
    }

    // Apply saved theme or OS preference on load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light'); // Default
    }
}

// --- INTERACTIVE SKILL CHARTS (Chart.js) ---
function setupSkillCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded. Skipping skill charts.');
        return;
    }

    const cyberChartCtx = document.getElementById('cybersecurityChart')?.getContext('2d');
    const cloudChartCtx = document.getElementById('cloudSkillsChart')?.getContext('2d');

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { display: true, color: 'rgba(255, 255, 255, 0.2)' },
                grid: { color: 'rgba(255, 255, 255, 0.2)'},
                pointLabels: { font: { size: 12 }, color: document.body.getAttribute('data-bs-theme') === 'dark' ? '#ccd6f6' : '#343a40' },
                ticks: { backdropColor: 'transparent', color: document.body.getAttribute('data-bs-theme') === 'dark' ? '#ccd6f6' : '#343a40', stepSize: 20, max: 100, min: 0 }
            }
        },
        plugins: {
            legend: {
                labels: { color: document.body.getAttribute('data-bs-theme') === 'dark' ? '#ccd6f6' : '#343a40' }
            }
        }
    };


    if (cyberChartCtx) {
        new Chart(cyberChartCtx, {
            type: 'radar',
            data: {
                labels: ['Network Security', 'Ethical Hacking', 'Threat Intel', 'Incident Response', 'Cryptography', 'Compliance'],
                datasets: [{
                    label: 'Cybersecurity Proficiency',
                    data: [85, 75, 70, 80, 65, 70], // Example data
                    backgroundColor: 'rgba(0, 255, 221, 0.2)', // --cyber-accent-color transparent
                    borderColor: 'rgb(0, 255, 221)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgb(0, 255, 221)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(0, 255, 221)'
                }]
            },
            options: chartOptions
        });
    }

    if (cloudChartCtx) {
         new Chart(cloudChartCtx, {
            type: 'polarArea',
            data: {
                labels: ['AWS (EC2, S3, VPC)', 'Cloud Security Principles', 'Azure (Basics)', 'GCP (Basics)', 'Serverless'],
                datasets: [{
                    label: 'Cloud Skills',
                    data: [90, 85, 60, 55, 70], // Example data
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.5)', // Orange
                        'rgba(75, 192, 192, 0.5)', // Teal
                        'rgba(54, 162, 235, 0.5)', // Blue
                        'rgba(255, 205, 86, 0.5)', // Yellow
                        'rgba(153, 102, 255, 0.5)' // Purple
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }]
            },
            options: { // Simplified options for PolarArea
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        grid: { color: document.body.getAttribute('data-bs-theme') === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' },
                        ticks: { display: false, stepSize: 20 } // Hide ticks for cleaner polar area
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: document.body.getAttribute('data-bs-theme') === 'dark' ? '#ccd6f6' : '#343a40' }
                    }
                }
            }
        });
    }
     // Re-render charts on theme change to update colors
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => setTimeout(setupSkillCharts, 100)); // delay slightly
    }
}

// --- PROJECT MODAL FUNCTIONALITY ---
function setupProjectModals() {
    const projectModalElement = document.getElementById('projectModal');
    if (!projectModalElement) return;

    const projectData = { // Store your project details here
        'student-attachment': {
            title: 'Student Attachment Platform',
            img: 'images/project-placeholder.png', // Replace with actual image
            description: `<p>As part of my Year 3 academic journey, I collaborated with a team of five to design and develop a student attachment application platform. This innovative system streamlines the process for students to discover attachment opportunities, submit applications, and track their progress efficiently.</p>
                          <p><strong>Key Challenges:</strong> Managing user roles (student, admin, company), ensuring secure data handling for applications, and creating an intuitive search/filter for opportunities.</p>
                          <p><strong>Solutions & Features:</strong> Implemented a role-based access control system. Utilized PHP for backend logic and MySQL for database management. Frontend built with HTML, CSS, and JavaScript for dynamic interactions.</p>
                          <p><strong>Impact:</strong> The platform aims to bridge the gap between students and potential employers, enhancing career growth prospects by centralizing the attachment search and application process.</p>`,
            tech: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
            liveLink: null, // or actual link
            codeLink: 'https://github.com/IT-Tutors-Coding-Space/Attachment.git'
        },
        'personal-portfolio': {
            title: 'Personal Portfolio Website (This Site V1)',
            img: 'images/project-placeholder.png',
            description: `<p>The initial version of this portfolio website, designed and developed to showcase my skills, projects, and professional journey. It was built using Bootstrap 5, HTML, CSS, and JavaScript.</p>
                          <p><strong>Objectives:</strong> Create a responsive, single-page application that is easy to navigate and visually appealing. Implement smooth scrolling and subtle animations to enhance user experience.</p>
                          <p>This version served as a foundation for the current, more advanced iteration you are viewing now, incorporating more complex interactive elements and a refined design.</p>`,
            tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap 5', 'AOS.js'],
            liveLink: '#', // Link to current site
            codeLink: 'https://github.com/owuorviny109/my-portfolio-website.git'
        },
         'ai-pulse-blog': {
            title: 'AI Pulse - Dynamic AI Blog Platform',
            img: 'images/project-placeholder.png',
            description: `<p>Developed "AI Pulse," a modern, responsive multi-page style blog website focused on exploring the evolving role of Artificial Intelligence in tech. Features a seamless SPA-like navigation (achieved with JS page loading), dark mode, dynamic content loading for AI concepts and impacts, expandable blog posts, and an interactive hero section with typing animation.</p>
                          <p><strong>Challenges:</strong> Implementing SPA-like navigation without a full framework, managing dynamic content for blog posts, and ensuring a consistent dark/light mode experience.</p>`,
            tech: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Responsive Design', 'AOS Library'],
            liveLink: 'https://owuorviny109.github.io/AI-pulse-blog-app/',
            codeLink: 'https://github.com/owuorviny109/AI-pulse-blog-app.git'
        },
        'attachme-android': {
            title: 'AttachME - Android Internship App (In Progress)',
            img: 'images/project-attachme-android.png',
            description: `<p>Currently developing "AttachME," a native Android application (100% Kotlin) designed to connect students with internship opportunities. This project is a significant undertaking, focusing on modern Android development practices.</p>
                          <p><strong>Core Features (Implemented/In Progress):</strong> User authentication (Firebase Auth), real-time internship posting and browsing (Firestore), a modern UI built with Jetpack Compose for a declarative UI approach. Utilizing Dagger Hilt for dependency injection, Coroutines & Flow for asynchronous operations.</p>
                          <p><strong>Learning & Challenges:</strong> Mastering Jetpack Compose, architecting a scalable Firebase backend, managing asynchronous data flows efficiently, and ensuring a smooth user experience on Android devices.</p>`,
            tech: ['Kotlin (100%)', 'Jetpack Compose', 'Firebase Auth', 'Firestore', 'Dagger Hilt', 'Coroutines & Flow', 'Android SDK'],
            liveLink: null, // Demo coming soon
            codeLink: 'https://github.com/owuorviny109/studnet-attachment-android-app.git'
        }
        // Add other projects here
    };

    projectModalElement.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget; // Button that triggered the modal
        const projectId = button.getAttribute('data-project-id');
        const project = projectData[projectId];

        const modalTitle = projectModalElement.querySelector('.modal-title');
        const modalBody = projectModalElement.querySelector('.modal-body');
        const modalFooter = projectModalElement.querySelector('.modal-footer');

        if (project) {
            modalTitle.textContent = project.title;
            modalBody.innerHTML = `
                <img src="${project.img}" alt="${project.title}" class="img-fluid rounded mb-3">
                ${project.description}
                <h4 class="mt-3 mb-2">Technologies Used:</h4>
                <div class="project-tags-modal">
                    ${project.tech.map(tag => `<span class="badge bg-secondary me-1 mb-1">${tag}</span>`).join('')}
                </div>
            `;
            modalFooter.innerHTML = ''; // Clear previous footer buttons
            if (project.liveLink) {
                const liveLinkBtn = document.createElement('a');
                liveLinkBtn.href = project.liveLink;
                liveLinkBtn.target = '_blank';
                liveLinkBtn.rel = 'noopener noreferrer';
                liveLinkBtn.className = 'btn btn-primary';
                liveLinkBtn.innerHTML = '<i class="fas fa-external-link-alt me-1"></i> Live Demo';
                modalFooter.appendChild(liveLinkBtn);
            }
            if (project.codeLink) {
                const codeLinkBtn = document.createElement('a');
                codeLinkBtn.href = project.codeLink;
                codeLinkBtn.target = '_blank';
                codeLinkBtn.rel = 'noopener noreferrer';
                codeLinkBtn.className = 'btn btn-outline-secondary';
                codeLinkBtn.innerHTML = '<i class="fab fa-github me-1"></i> View Code';
                modalFooter.appendChild(codeLinkBtn);
            }
             const closeBtn = document.createElement('button');
             closeBtn.type = 'button';
             closeBtn.className = 'btn btn-secondary';
             closeBtn.setAttribute('data-bs-dismiss', 'modal');
             closeBtn.textContent = 'Close';
             modalFooter.appendChild(closeBtn);

        } else {
            modalTitle.textContent = 'Project Not Found';
            modalBody.innerHTML = '<p>Details for this project are not available.</p>';
        }
    });
}


// --- INTERACTIVE DEMOS ---
// Vulnerability Scanner Demo
function setupVulnScannerDemo() {
    const scanInput = document.getElementById('vulnScanInput');
    const scanButton = document.getElementById('vulnScanButton');
    const scanResults = document.getElementById('vulnScanResults');

    if (!scanInput || !scanButton || !scanResults) return;

    scanButton.addEventListener('click', () => {
        const domain = scanInput.value.trim();
        if (!domain) {
            scanResults.innerHTML = '<p class="text-warning">Please enter a domain to scan.</p>';
            return;
        }

        scanResults.innerHTML = `<p>Scanning ${domain} for vulnerabilities...</p>
                                 <div class="spinner-border spinner-border-sm text-info" role="status">
                                     <span class="visually-hidden">Loading...</span>
                                 </div>`;
        // Simulate scan
        setTimeout(() => {
            const vulnerabilities = [
                { sev: 'High', desc: 'Outdated Server Software (Apache/2.4.18)' },
                { sev: 'Medium', desc: 'Missing HTTP Security Headers (X-Content-Type-Options)' },
                { sev: 'Low', desc: 'Directory Listing Enabled' },
                { sev: 'Info', desc: 'Cookies without HttpOnly flag' }
            ];
            let resultHTML = `<p class="text-success">Scan complete for ${domain}:</p><ul>`;
            vulnerabilities.forEach(vuln => {
                let sevClass = 'text-info';
                if (vuln.sev === 'High') sevClass = 'text-danger fw-bold';
                if (vuln.sev === 'Medium') sevClass = 'text-warning';
                resultHTML += `<li><span class="${sevClass}">[${vuln.sev}]</span> ${vuln.desc}</li>`;
            });
            resultHTML += '</ul><p class="small text-muted mt-2">Note: This is a simulated scan for demo purposes.</p>';
            scanResults.innerHTML = resultHTML;
        }, 2500);
    });
}

// Mini Terminal Demo
function setupMiniTerminal() {
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalInput = document.getElementById('terminalInput');

    if (!terminalOutput || !terminalInput) return;

    const welcomeMessage = "<p>Welcome to Vincent's Mini Terminal!</p><p>Type 'help' for available commands.</p>";
    terminalOutput.innerHTML = welcomeMessage;

    const commands = {
        help: () => {
            return `<p>Available commands:</p>
                    <ul>
                        <li><code class="text-info">help</code> - Show this help message</li>
                        <li><code class="text-info">about</code> - Display information about Vincent</li>
                        <li><code class="text-info">skills</code> - List key skills</li>
                        <li><code class="text-info">projects</code> - Show featured projects</li>
                        <li><code class="text-info">contact</code> - Show contact information</li>
                        <li><code class="text-info">clear</code> - Clear the terminal screen</li>
                        <li><code class="text-info">date</code> - Display current date and time</li>
                        <li><code class="text-info">easteregg</code> - Try it!</li>
                    </ul>`;
        },
        about: () => "<p>Vincent Omondi is a Cybersecurity Specialist, Cloud Security Engineer, and Software Developer passionate about building and securing digital infrastructures. <a href='#about' class='text-info text-decoration-underline'>Learn more...</a></p>",
        skills: () => "<p>Key Skills: AWS, Linux, Network Security, Python, JavaScript, Ethical Hacking, SIEM. <a href='#skills' class='text-info text-decoration-underline'>See all skills...</a></p>",
        projects: () => "<p>Featured Projects: Student Attachment Platform, AI Pulse Blog, AttachME Android App. <a href='#projects' class='text-info text-decoration-underline'>View projects...</a></p>",
        contact: () => "<p>Email: owuorvincent069@gmail.com | <a href='https://www.linkedin.com/in/owuor-vincent-38b2b02ba/' target='_blank' class='text-info text-decoration-underline'>LinkedIn</a> | <a href='https://github.com/owuorviny109' target='_blank' class='text-info text-decoration-underline'>GitHub</a></p>",
        clear: () => {
            terminalOutput.innerHTML = '';
            return ""; // Return empty string to not print "undefined"
        },
        date: () => `<p>${new Date().toString()}</p>`,
        easteregg: () => `<p>Congratulations! You found the easter egg! <i class="fas fa-shield-alt text-success"></i> Maybe try 'pentester view' toggle in the navbar?</p>`,
        default: (cmd) => `<p>bash: command not found: ${cmd}. Type 'help'.</p>`
    };

    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.value.trim().toLowerCase();
            this.value = ''; // Clear input

            const outputLine = document.createElement('p');
            outputLine.innerHTML = `<span class="terminal-prompt" style="color: var(--terminal-prompt-color, #00aaff);">guest@vince.portfolio:~$ </span>${command}`;
            terminalOutput.appendChild(outputLine);

            let responseHTML;
            if (commands[command]) {
                responseHTML = commands[command]();
            } else {
                responseHTML = commands.default(command);
            }
            if(responseHTML) { // Only add if there's a response
                 const responseLine = document.createElement('div');
                 responseLine.innerHTML = responseHTML;
                 terminalOutput.appendChild(responseLine);
            }

            // Scroll to bottom
            const terminalContainer = document.getElementById('miniTerminal');
            if(terminalContainer) terminalContainer.scrollTop = terminalContainer.scrollHeight;
        }
    });
     // Focus input on click anywhere in terminal (optional UX enhancement)
    const terminalContainer = document.getElementById('miniTerminal');
    if(terminalContainer) {
        terminalContainer.addEventListener('click', () => terminalInput.focus());
    }
}


// --- ROTATING SECURITY TIPS ---
function setupRotatingSecurityTips() {
    const tipElement = document.getElementById('securityTipText');
    if (!tipElement) return;

    const tips = [
        "Enable Two-Factor Authentication (2FA) on all your critical accounts.",
        "Use strong, unique passwords for every account. Consider a password manager.",
        "Keep your software and operating systems updated to patch vulnerabilities.",
        "Be cautious of phishing emails and suspicious links. Verify before you click.",
        "Regularly back up your important data to an external drive or cloud service.",
        "Secure your Wi-Fi network with a strong password and WPA3 encryption if available.",
        "Be mindful of what you share on social media; oversharing can be a security risk.",
        "Understand the privacy settings of apps and services you use."
    ];
    let currentTipIndex = 0;

    function showNextTip() {
        tipElement.style.opacity = 0;
        setTimeout(() => {
            currentTipIndex = (currentTipIndex + 1) % tips.length;
            tipElement.textContent = tips[currentTipIndex];
            tipElement.style.opacity = 1;
        }, 500); // Fade out/in duration
    }
    tipElement.style.transition = 'opacity 0.5s ease-in-out';
    setInterval(showNextTip, 7000); // Change tip every 7 seconds
}


// --- CONTACT FORM SUBMISSION (Using Formspree or similar) ---
function setupContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (!form || !formMessage) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...`;

        formMessage.innerHTML = ''; // Clear previous messages
        formMessage.className = ''; // Clear classes

        try {
            // IMPORTANT: Replace "YOUR_FORM_ENDPOINT_HERE" in your HTML form action
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formMessage.innerHTML = 'Thank you! Your message has been sent successfully.';
                formMessage.classList.add('success');
                form.reset();
            } else {
                // Try to parse error from Formspree
                const data = await response.json();
                if (data.errors && data.errors.length > 0) {
                    formMessage.innerHTML = data.errors.map(error => error.message).join('<br>');
                } else {
                    formMessage.innerHTML = 'Oops! There was a problem sending your message. Please try again.';
                }
                formMessage.classList.add('error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formMessage.innerHTML = 'An unexpected error occurred. Please try again later.';
            formMessage.classList.add('error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

// --- LAZY LOADING IMAGES ---
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    // console.log("Lazy loading image:", lazyImage.src || lazyImage.dataset.src);
                    if (lazyImage.dataset.src) { // If using data-src pattern
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.removeAttribute('data-src');
                    }
                    // For native loading="lazy", browser handles it, but we can add 'loaded' class
                    lazyImage.classList.add('loaded');
                    observerInstance.unobserve(lazyImage);
                }
            });
        }, { rootMargin: "0px 0px 100px 0px" }); // Start loading 100px before visible

        lazyImages.forEach(img => observer.observe(img));
    } else {
        // Fallback for older browsers (less efficient)
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            img.classList.add('loaded');
        });
    }
}


// --- PARTICLES.JS HERO BACKGROUND (Optional) ---
// function setupHeroParticles() {
//     if (typeof particlesJS !== 'undefined') {
//         particlesJS.load('hero-particles-bg', 'assets/particlesjs-config.json', function() {
//             console.log('particles.js config loaded');
//         });
//     } else {
//         console.warn('particles.js not loaded. Skipping hero particles.');
//         // Optionally, apply a fallback static background image to #hero via CSS if particles fail
//         document.getElementById('hero').style.backgroundImage = "url('images/hero-background.jpg')";
//     }
// }

// --- DOCUMENT READY LISTENER ---
document.addEventListener('DOMContentLoaded', () => {
    initializeAOS();
    setFooterYear();
    setupSmoothScrollingAndActiveNav();
    heroTypingAnimation();
    setupThemeToggles();
    setupSkillCharts(); // Ensure Chart.js is loaded before this
    setupProjectModals();
    setupVulnScannerDemo();
    setupMiniTerminal();
    setupRotatingSecurityTips();
    setupContactForm();
    setupLazyLoading();
    // setupHeroParticles(); // Uncomment if using Particles.js

    // Initial scroll check for navbar
    handleScroll();
    window.addEventListener('scroll', handleNavbarScroll);


    console.log("Portfolio V2 script loaded and running. All systems go!");
});