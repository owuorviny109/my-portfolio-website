# Vincent Omondi Portfolio
live demo:  https://owuorviny109.github.io/my-portfolio-website/

A modern, responsive, single-page application (SPA) portfolio for Vincent Omondi, Cybersecurity Specialist, Cloud Security Engineer, and Software Developer. Built with HTML, CSS (custom + Bootstrap 5), and JavaScript (ES6+), this site showcases technical skills, projects, education, and interactive cybersecurity demos.

---

## Features

- **SPA Navigation:** Loads section content dynamically for fast, seamless transitions.
- **Responsive Design:** Mobile-first layout using Bootstrap 5.
- **Dark & Pentester Themes:** Toggle between light, dark, and pentester (red-team) color schemes.
- **AOS Animations:** Smooth scroll and fade-in effects using [AOS](https://michalsnik.github.io/aos/).
- **Interactive Demos:** Includes a conceptual vulnerability scanner and a mini terminal with commands.
- **Project Modal:** View project details in a Bootstrap modal.
- **Security Resources:** Curated articles on cyber hygiene, threat modeling, and cloud security.
- **Contact Form:** Email and quick message form (endpoint to be configured).
- **Accessibility:** Keyboard navigation and focus styles.

---

## Project Structure

```
index.html
script.js
style.css
assets/
    hero-background.jpg
    industry.jpg
    vincent omondi CV.pdf
sections/
    about.html
    contact.html
    education.html
    experience.html
    hero.html
    interactive-demos.html
    projects.html
    skills.html
    resources/
        cloud-security-best-practices.html
        cyber-hygiene-checklist.html
        intro-threat-modeling.html
```

- **index.html**: Main HTML file, loads the SPA shell and navigation.
- **script.js**: Main JavaScript file (ES6 module), handles SPA navigation, theme toggling, interactive demos, and more.
- **style.css**: Custom CSS, including theme variables, section styles, and responsive tweaks.
- **assets/**: Images, CV PDF, and favicon resources.
- **sections/**: HTML partials for each SPA section.
    - **resources/**: Security resource articles.

---

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- No build tools required (pure HTML/CSS/JS)

### Running Locally

1. **Clone or Download the Repository**
    ```sh
    git clone https://github.com/owuorviny109/my-portfolio-website.git
    cd my-portfolio-website
    ```

2. **Serve with a Local Web Server**  
   _SPA navigation uses fetch to load HTML partials, so you must use a local server (not `file://`)._

    - **Python 3:**
      ```sh
      python -m http.server 8000
      ```
      Then open [http://localhost:8000/](http://localhost:8000/) in your browser.

    - **VS Code Live Server Extension:**  
      Right-click `index.html` and select "Open with Live Server".

    - **Node.js (http-server):**
      ```sh
      npx http-server .
      ```

3. **Browse the Site**  
   Navigate through the SPA using the navbar or footer links.

---

## Customization

- **Update Personal Info:**  
  Edit `sections/about.html`, `sections/contact.html`, and `index.html` for your name, bio, and contact details.

- **Add/Update Projects:**  
  Edit `sections/projects.html` and update the `projectData` object in [`script.js`](script.js) for modal details.

- **Add Skills:**  
  Edit `sections/skills.html`.

- **Add Security Resources:**  
  Add new HTML files in `sections/resources/` and link them in `about.html`.

- **Change Theme Colors:**  
  Edit CSS variables in [`style.css`](style.css) under `:root`, `[data-bs-theme="dark"]`, and `[data-pentester-view="true"]`.

- **Configure Contact Form:**  
  Set your form endpoint in the `<form>` tag in `sections/contact.html`.

---

## Main Technologies Used

- [Bootstrap 5](https://getbootstrap.com/)
- [Font Awesome 6](https://fontawesome.com/)
- [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
- [Chart.js](https://www.chartjs.org/) (for skill charts, optional)
- [Google Fonts: Poppins, Roboto Mono](https://fonts.google.com/)

---

## Notable Files

- [`index.html`](index.html): SPA shell, navbar, footer, modal.
- [`script.js`](script.js): SPA logic, navigation, theme, demos.
- [`style.css`](style.css): All custom styles and theme variables.
- [`sections/`](sections/): All main content sections as HTML partials.
- [`sections/resources/`](sections/resources/): Security resource articles.

---

## Deployment

You can deploy this site to any static hosting provider (GitHub Pages, Netlify, Vercel, etc.).  
**Important:** Ensure the server supports client-side routing (SPA) and serves all files from the root.

---

## Credits

- **Vincent Omondi** – Portfolio owner and developer.
- [Bootstrap](https://getbootstrap.com/), [Font Awesome](https://fontawesome.com/), [AOS](https://michalsnik.github.io/aos/), [Chart.js](https://www.chartjs.org/)

---

## License

This project is for personal portfolio use.  
For reuse or adaptation, please credit the original author.

---
 
## Contact

- **Email:** owuorvincent069@gmail.com
- **LinkedIn:** [owuor-vincent-38b2b02ba](https://www.linkedin.com/in/owuor-vincent-38b2b02ba/)
- **GitHub:** [owuorviny109](https://github.com/owuorviny109)
- live demo :  https://owuorviny109.github.io/my-portfolio-website/

---
