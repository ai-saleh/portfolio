// Function to replace asset paths based on project name
function replaceAssetPaths() {
  // Get the current page URL
  const currentPath = window.location.pathname;

  // Extract project name from the URL
  // This assumes URLs like "project-coffee-sales-analysis.html"
  const projectMatch = currentPath.match(/project-(.*?)\.html/);

  if (projectMatch && projectMatch[1]) {
    const projectName = projectMatch[1];

    // Function to replace paths in both src and srcset attributes
    function replacePaths(element) {
      const originalSrc = element.getAttribute("src");
      if (originalSrc && originalSrc.startsWith("assets/")) {
        element.setAttribute(
          "src",
          `content/projects/${projectName}/${originalSrc}`
        );
      }

      const originalSrcset = element.getAttribute("srcset");
      if (originalSrcset && originalSrcset.includes("assets/")) {
        const newSrcset = originalSrcset.replace(
          /assets\//g,
          `content/projects/${projectName}/assets/`
        );
        element.setAttribute("srcset", newSrcset);
      }
    }

    // Replace paths in all images
    document.querySelectorAll("img").forEach(replacePaths);

    // Replace paths in all source elements (for picture elements)
    document.querySelectorAll("source").forEach(replacePaths);

    // Replace paths in inline styles
    document.querySelectorAll('[style*="assets/"]').forEach((element) => {
      const style = element.getAttribute("style");
      const newStyle = style.replace(
        /assets\//g,
        `content/projects/${projectName}/assets/`
      );
      element.setAttribute("style", newStyle);
    });

    // Replace paths in background-image CSS properties
    document.querySelectorAll("*").forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const backgroundImage = computedStyle.backgroundImage;
      if (backgroundImage && backgroundImage.includes("assets/")) {
        const newBgImage = backgroundImage.replace(
          /assets\//g,
          `content/projects/${projectName}/assets/`
        );
        element.style.backgroundImage = newBgImage;
      }
    });
  }
}

// Run the path replacement when the DOM is loaded
document.addEventListener("DOMContentLoaded", replaceAssetPaths);

// Also run it when the page content changes dynamically
// This helps with single-page applications or dynamically loaded content
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      replaceAssetPaths();
    }
  });
});

// Start observing the document with the configured parameters
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
