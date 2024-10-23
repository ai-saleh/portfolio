// Navbar functionality
$(document).ready(function () {
  // Function to check if we're in mobile view
  function isMobileView() {
      return $(".navbar-toggler").is(":visible");
  }

  // Function to check if navbar is open
  function isNavbarOpen() {
      return $(".navbar-collapse").hasClass("show");
  }

  // Function to update the header class
  function updateHeaderClass() {
      var scrollTop = $(window).scrollTop();

      if (scrollTop >= 80 || isNavbarOpen()) {
          $("body").addClass("fixed-header");
      } else {
          $("body").removeClass("fixed-header");
      }
  }

  // Function to collapse navbar with animation
  function collapseNavbar() {
      if (isNavbarOpen()) {
          $(".navbar-toggler").click(); // This triggers Bootstrap's collapse animation
      }
  }

  // Function to collapse navbar in desktop view
  function collapseNavbarInDesktop() {
      if (!isMobileView()) {
          collapseNavbar();
      }
  }

  // Window Scroll
  $(window).on("scroll", updateHeaderClass);

  // Navbar toggler click event
  $(".navbar-toggler").on("click", function () {
      // Toggle a custom class immediately
      $("body").toggleClass("navbar-toggled");

      // Immediately update the header class when opening
      if (!isNavbarOpen()) {
          $("body").addClass("fixed-header");
      }
      // When closing, the header class will be updated after animation completes
  });

  // Window resize event
  $(window).on("resize", collapseNavbarInDesktop);

  // Close navbar when clicking on a nav item
  $(".navbar-nav .nav-link").on("click", function (e) {
      // Don't prevent default - allow immediate navigation
      
      // Set a timeout to collapse the navbar after navigation
      setTimeout(function() {
          collapseNavbar();
      }, 300); // Adjust this delay if needed
  });

  // Close navbar when clicking outside
  $(document).on("click", function (event) {
      var $navbar = $(".navbar-collapse");
      if (
          !$(event.target).closest(".navbar-collapse").length &&
          !$(event.target).is(".navbar-toggler") &&
          $navbar.hasClass("show")
      ) {
          collapseNavbar();
      }
  });

  // Handle navbar collapse animation start
  $('.navbar-collapse').on('hide.bs.collapse', function () {
      // Do nothing here, just listen for the event
  });

  // Handle navbar collapse animation end
  $('.navbar-collapse').on('hidden.bs.collapse', function () {
      $("body").removeClass("navbar-toggled");
      updateHeaderClass();
  });

  // Handle navbar expand animation start
  $('.navbar-collapse').on('show.bs.collapse', function () {
      $("body").addClass("fixed-header");
  });

  // Handle navbar expand animation end
  $('.navbar-collapse').on('shown.bs.collapse', function () {
      updateHeaderClass();
  });

  // Initial calls
  collapseNavbarInDesktop();
  updateHeaderClass();
});

// Typing effect functionality
$(document).ready(function () {
  // Typing Animation
  new Typed("#type-it", {
    strings: ["Data Analyst", "BI Analyst", "BI Developer"],
    typeSpeed: 75,
    loop: true,
  });
});

// Feature box functionality
document.addEventListener("DOMContentLoaded", function () {
  const services = [
    {
      icon: "bx bx-analyse",
      title: "Data Analysis",
      description: "Transform raw data into insightful reports.",
    },
    {
      icon: "bx bx-line-chart",
      title: "Data Visualization",
      description: "Create compelling dashboards and charts.",
    },
    {
      icon: "bx bx-data",
      title: "Database Management",
      description: "Optimize and maintain databases for peak performance.",
    },
    {
      icon: "bx bx-bar-chart-alt-2",
      title: "Business Intelligence",
      description:
        "Implement and manage BI tools to drive strategic decisions.",
    },
    // You can add more services here in the future
  ];

  const skills = [
    { icon: "bx bx-spreadsheet", title: "Excel" },
    { icon: "bx bxs-bar-chart-alt-2", title: "Power BI" },
    { icon: "bx bxs-cube", title: "Power Query" },
    { icon: "bx bx-calculator", title: "DAX" },
    { icon: "bx bx-data", title: "SQL" },
    { icon: "bx bxl-python", title: "Python" },
    { icon: "bx bx-grid-alt", title: "NumPy" },
    { icon: "bx bx-bar-chart", title: "pandas" },
    { icon: "bx bx-pie-chart-alt-2", title: "Matplotlib" },
    { icon: "bx bx-scatter-chart", title: "Seaborn" },
    // Add more skills as needed
  ];

  const desktopView = document.querySelector(".ftb-desktop-view");
  const mobileView = document.querySelector(".ftb-mobile-view .swiper-wrapper");
  const skillsView = document.querySelector(".skill-box .row");

  // Define color classes
  const colorClasses = [
    "ftb-bg-1",
    "ftb-bg-2",
    "ftb-bg-3",
    "ftb-bg-4",
    "ftb-bg-5",
    "ftb-bg-6",
    "ftb-bg-7",
    "ftb-bg-8",
  ];
  // You can add more color classes here in the future

  // Fisher-Yates shuffle algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Shuffle the color classes
  let shuffledColors = shuffleArray([...colorClasses]);

  // Function to get next color class
  function getNextColorClass(index) {
    if (index % colorClasses.length === 0) {
      shuffledColors = shuffleArray([...colorClasses]);
    }
    return shuffledColors[index % colorClasses.length];
  }

  // Generate service boxes
  services.forEach((service, index) => {
    const colorClass = getNextColorClass(index);
    const featureBox = `
      <div class="feature-box ${colorClass}">
        <div class="icon"><i class="${service.icon}"></i></div>
        <div class="content">
          <h5>${service.title}</h5>
          <p>${service.description}</p>
        </div>
      </div>
    `;

    // Append to desktop view
    desktopView.insertAdjacentHTML(
      "beforeend",
      `
      <div class="col-md-6">
        ${featureBox}
      </div>
    `
    );

    // Append to mobile view
    mobileView.insertAdjacentHTML(
      "beforeend",
      `
      <div class="swiper-slide">
        ${featureBox}
      </div>
    `
    );
  });

  // Clear existing content in skills view
  skillsView.innerHTML = "";

  // Generate skill boxes
  skills.forEach((skill, index) => {
    const colorClass = getNextColorClass(index + services.length);
    const skillBox = `
      <div class="col-6 col-md-4 col-lg-6">
        <div class="feature-box skill ${colorClass}">
          <div class="icon"><i class="${skill.icon}"></i></div>
          <div class="content">
            <h5>${skill.title}</h5>
          </div>
        </div>
      </div>
    `;

    // Append to skills view
    skillsView.insertAdjacentHTML("beforeend", skillBox);
  });

  // Initialize skill box highlight functionality
  function initSkillBoxHighlight() {
    const skillBoxes = Array.from(document.querySelectorAll('.skill-box .feature-box'));
    let availableIndices = []; // Array to track unused indices
    let currentTimeout = null;

    // Function to reset available indices when all boxes have been used
    function resetAvailableIndices() {
      availableIndices = Array.from({ length: skillBoxes.length }, (_, i) => i);
      shuffleArray(availableIndices); // Reuse existing shuffleArray function
    }

    // Initialize the indices array
    resetAvailableIndices();

    // Function to highlight a random skill box
    function highlightRandomSkill() {
      // Remove active class from all skill boxes
      skillBoxes.forEach(box => box.classList.remove('active-slide'));

      // If we've used all boxes, reset the cycle
      if (availableIndices.length === 0) {
        resetAvailableIndices();
      }

      // Pick and remove a random index from available indices
      const randomIndex = availableIndices.pop();
      
      // Add active class to the selected box
      skillBoxes[randomIndex].classList.add('active-slide');

      // Schedule the next highlight
      currentTimeout = setTimeout(highlightRandomSkill, 3000); // Adjust timing as needed (currently 3 seconds)
    }

    // Start the highlight cycle
    highlightRandomSkill();

    // Optional: Pause on hover
    skillBoxes.forEach(box => {
      box.addEventListener('mouseenter', () => {
        if (currentTimeout) {
          clearTimeout(currentTimeout);
        }
        // Remove active class from all boxes
        skillBoxes.forEach(b => b.classList.remove('active-slide'));
        // Add active class to hovered box
        box.classList.add('active-slide');
      });

      box.addEventListener('mouseleave', () => {
        // Remove active class from hovered box
        box.classList.remove('active-slide');
        // Resume the cycle
        highlightRandomSkill();
      });
    });

    // Clean up function
    return function cleanup() {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }

  // Initialize the skill box highlight feature
  const cleanupSkillHighlight = initSkillBoxHighlight();

  let swiper = null;
  const mobileBreakpoint = 768; // Adjust this value based on your CSS breakpoint

  // Initialize Swiper for mobile view with active slide tracking
  function initSwiper() {
    if (window.innerWidth < mobileBreakpoint && !swiper) {
      swiper = new Swiper(".ftb-mobile-view", {
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          waitForTransition: true
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        on: {
          init: function () {
            updateActiveSlide(this);
          },
          slideChangeTransitionStart: function () {
            removeActiveClassFromSlides();
          },
          slideChangeTransitionEnd: function () {
            updateActiveSlide(this);
            // Ensure autoplay is running
            if (!this.autoplay.running) {
              this.autoplay.start();
            }
          },
          touchStart: function () {
            // Temporarily pause autoplay during manual interaction
            this.autoplay.pause();
          },
          touchEnd: function () {
            // Resume autoplay after a short delay
            setTimeout(() => {
              this.autoplay.resume();
            }, 100);
          },
          beforeDestroy: function () {
            // Clean up autoplay before destroying
            if (this.autoplay.running) {
              this.autoplay.stop();
            }
          }
        },
      });
    } else if (window.innerWidth >= mobileBreakpoint && swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }
  }

  // Function to remove active class from all slides
  function removeActiveClassFromSlides() {
    const slides = document.querySelectorAll('.ftb-mobile-view .swiper-slide .feature-box');
    slides.forEach(slide => {
      slide.classList.remove('active-slide');
    });
  }

  // Function to update active slide styling
  function updateActiveSlide(swiperInstance) {
    // Remove active class from all slides first
    removeActiveClassFromSlides();
    
    // Add active class only to the current active slide
    const activeIndex = swiperInstance.realIndex;
    const activeSlide = swiperInstance.slides.filter(slide => 
      slide.getAttribute('data-swiper-slide-index') == activeIndex
    )[0];
    
    if (activeSlide) {
      activeSlide.querySelector('.feature-box').classList.add('active-slide');
    }
  }

  // Initialize Swiper on load
  initSwiper();

  // Reinitialize Swiper on window resize
  window.addEventListener("resize", initSwiper);

  // Clean up on window unload
  window.addEventListener('unload', () => {
    if (cleanupSkillHighlight) {
      cleanupSkillHighlight();
    }
  });
});

// Project Swiper styles
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Swiper for each project
  const projectSwipers = document.querySelectorAll('.project-swiper');
  
  projectSwipers.forEach((swiperElement, index) => {
    new Swiper(swiperElement, {
      slidesPerView: 1,
      spaceBetween: 3, // Adjust this value to control the thickness of the space between slides
      loop: true,
      pagination: {
        el: swiperElement.querySelector('.swiper-pagination'),
        clickable: true,
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    });
  });
});

// ScrollIt Setup
$(document).ready(function() {
  // Initialize ScrollIt
  $.scrollIt({
      upKey: 38,             // key code to navigate to the next section
      downKey: 40,           // key code to navigate to the previous section
      easing: 'linear',      // the easing function for animation
      scrollTime: 100,       // how long (in ms) the animation takes
      activeClass: 'active', // class given to the active nav element
      onPageChange: null,    // function(pageIndex) that is called when page is changed
      topOffset: 0           // offset (in px) for fixed top navigation
  });

  // Custom handling for links
  $('a[href^="#"]').on('click', function(event) {
    // This is an in-page link, let ScrollIt handle it
    return;
  });

  $('a:not([href^="#"])').on('click', function(event) {
    // This is a link to another page, handle it normally
    // But first, check if it's an external link
    var href = $(this).attr('href');
    var isExternal = href.indexOf('http') === 0; // Simple check for http:// or https://

    if (!isExternal) {
      // It's an internal link to another page
      event.preventDefault(); // Prevent the default action
      window.location.href = href; // Navigate to the new page
    }
    // If it's external, let the browser handle it normally
  });
});