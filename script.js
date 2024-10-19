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

  // Function to collapse navbar in desktop view
  function collapseNavbarInDesktop() {
    if (!isMobileView()) {
      $(".navbar-collapse").removeClass("show");
      $(".navbar-toggler").addClass("collapsed").attr("aria-expanded", "false");
    }
    updateHeaderClass();
  }

  // Window Scroll
  $(window).on("scroll", updateHeaderClass);

  // Navbar toggler click event
  $(".navbar-toggler").on("click", function () {
    // Toggle a custom class immediately
    $("body").toggleClass("navbar-toggled");

    // Use MutationObserver to detect when Bootstrap toggles the 'show' class
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          updateHeaderClass();
          observer.disconnect();
        }
      });
    });

    observer.observe($(".navbar-collapse")[0], { attributes: true });

    // Fallback in case MutationObserver doesn't trigger
    setTimeout(updateHeaderClass, 350);
  });

  // Window resize event
  $(window).on("resize", collapseNavbarInDesktop);

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

  let swiper = null;
  const mobileBreakpoint = 768; // Adjust this value based on your CSS breakpoint

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
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
    } else if (window.innerWidth >= mobileBreakpoint && swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }
  }

  // Initialize Swiper on load
  initSwiper();

  // Reinitialize Swiper on window resize
  window.addEventListener("resize", initSwiper);
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