// Template HTML code

// Navbar
class tmpNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /*html*/ `
    <header class="main-header">
      <nav class="navbar header-nav navbar-expand-lg">
        <div class="container">
          <!-- Brand -->
          <a href="#" class="navbar-brand">
            <h4 class="mb-0">Ahmed <span class="text-primary">Saleh</span></h4>
          </a>
  
          <!-- Menu -->
          <div class="collapse navbar-collapse justify-content-end" id="navbar-collapse-toggle">
            <ul class="navbar-nav mx-auto">
              <li>
                <a href="./index.html#home" class="nav-link" data-scroll-nav="0">Home</a>
              </li>
              <li>
                <a href="./index.html#about" class="nav-link" data-scroll-nav="1">About Me</a>
              </li>
              <li>
                <a href="./index.html#services" class="nav-link" data-scroll-nav="2">Services</a>
              </li>
              <li>
                <a href="./index.html#skills" class="nav-link" data-scroll-nav="3">Skills</a>
              </li>
              <li>
                <a href="./index.html#projects" class="nav-link" data-scroll-nav="4">Projects</a>
              </li>
            </ul>
          </div>
  
          <!-- Download CV -->
          <div class="ms-auto d-none d-lg-block">
            <a class="colored-btn" href="#">Download CV</a>
          </div>
  
          <!-- Menu Toggle -->
          <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbar-collapse-toggle">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>
    `;
  }
}

// Contact form
class tmpContactForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /*html*/ `
    <section id="contact" class="section">
        <div class="container">
          <div class="row gy-5">
            <div class="col-lg-6">
              <div class="contact-form">
                <h2 class="text-dark">Get in Touch</h2>
                <p class="lead">lorem
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Exercitationem delectus deleniti cumque. Nisi quos ex sunt molestiae, cum explicabo voluptates unde, a consequuntur voluptas quod! Officia quod corrupti corporis repudiandae?
                </p>
                <form action="https://formspree.io/f/xyzyyada" method="POST">
                  <div class="row gy-4 gx-3">
                    <div class="col-12">
                      <div class="form-group">
                        <label class="form-label">Name:</label>
                        <input type="text" class="form-control" name="name">
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label class="form-label">Email Address:</label>
                        <input type="email" class="form-control" name="email">
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label class="form-label">Message:</label>
                        <textarea name="message" class="form-control"></textarea>
                      </div>
                    </div>
                    <div class="col-12">
                      <button class="colored-btn" type="submit">Send Message</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="col-lg-5 ms-auto col-xl-5">
              <div class="pb-5 d-none d-lg-block">
                <img src="assets/svg/asset_2.svg" class="w-100" alt="People talking to each other.">
              </div>
              <ul class="contact-info">
                <li>
                  <div class="icon ftb-bg-1">
                    <i class="bx bx-phone"></i>
                  </div>
                  <div class="col ps-3">
                    <h5>Phone</h5>
                    <p><a class="link-dark-bg" href="tel:201092778844">+20 109 277 8844</a></p>
                  </div>
                </li>
                <li>
                  <div class="icon ftb-bg-2">
                    <i class="bx bx-envelope"></i>
                  </div>
                  <div class="col ps-3">
                    <h5>Mail</h5>
                    <p><a class="link-dark-bg" href="mailto:a.ibrahimsaleh@outlook.com">a.ibrahimsaleh@outlook.com</a></p>
                  </div>
                </li>
                <li>
                  <div class="icon ftb-bg-2">
                    <i class="bx bxl-linkedin"></i>
                  </div>
                  <div class="col ps-3">
                    <h5>LinkedIn</h5>
                    <p><a class="link-dark-bg" href="https://www.linkedin.com/in/ai-saleh/">linkedin.com/in/ai-saleh</a></p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

// Footer
class tmpFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /*html*/ `
    <footer class="footer">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 py-2">
            <div class="nav justify-content-center justify-content-md-start">
              <a class="link-dark-bg" href="https://github.com/ai-saleh"><i class="bx bxl-github"></i></a>
              <a class="link-dark-bg" href="https://www.linkedin.com/in/ai-saleh/"><i class="bx bxl-linkedin-square"></i></a>
            </div>
          </div>
          <div class="col-md-6 py-2 text-center text-md-end">
            <p class="m-0">© 2024 Ahmed Saleh Portfolio. All rights reserved.</p>
            <p class="m-0">Website developed by Ahmed Saleh</p>
            <p class="m-0">Graphics by <a class="link-dark-bg" href="https://www.freepik.com" target="_blank">Freepik</a></p>
        </div>        
        </div>
      </div>  
    </footer>
    `;
  }
}

customElements.define("tmp-navbar", tmpNavbar);
customElements.define("tmp-contact", tmpContactForm);
customElements.define("tmp-footer", tmpFooter);
