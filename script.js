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

// Document Ready
$(document).ready(function () {
  // Typing Animation
  new Typed("#type-it", {
    strings: ["Data Analyst", "BI Analyst", "BI Developer"],
    typeSpeed: 75,
    loop: true,
  });
});
