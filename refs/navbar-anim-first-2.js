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
  
    // Close navbar when clicking on a nav item
    $(".navbar-nav .nav-link").on("click", function (e) {
        // Allow the default action to occur first (navigating to the section)
        setTimeout(function() {
            collapseNavbar();
        }, 300); // Adjust this delay if needed to match your scroll animation duration
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
  
    // Handle navbar collapse animation end
    $('.navbar-collapse').on('hidden.bs.collapse', function () {
        $("body").removeClass("navbar-toggled");
        updateHeaderClass();
    });
  
    // Initial calls
    collapseNavbarInDesktop();
    updateHeaderClass();
  });