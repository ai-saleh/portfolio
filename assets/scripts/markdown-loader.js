// Configuration and Constants
const STORAGE_PREFIX = "preloaded_markdown_";
const loadingMessages = [
  "Fetching the awesome content...",
  "Converting markdown to magic...",
  "Brewing your content...",
  "Just a moment, crafting perfection...",
  "Doing some data gymnastics...",
  "Making sure everything looks pretty...",
];

// Configure Mermaid theme
const MERMAID_CONFIG = {
  theme: "base", // Choose from: default, dark, forest, neutral, base
  themeVariables: {}, // Using default theme variables
};

class EnhancedMarkdownLoader {
  constructor(options = {}) {
    // Preloader state
    this.loadingStatus = new Map();
    this.preloadQueue = [];
    this.maxConcurrentLoads = 2;
    this.activeLoads = 0;

    // Project to README URL mapping
    this.projectReadmeMap = new Map([
      [
        "project-internet-sales-analytics.html",
        "./content/projects/internet-sales-analytics/docs/README.md",
      ],
      [
        "project-coffee-beans-sales-analysis.html",
        "./content/projects/coffee-beans-sales-analysis/docs/README.md",
      ],
      // Add more project mappings here
    ]);

    // Mermaid theme configuration
    this.mermaidTheme = options.mermaidTheme || MERMAID_CONFIG.theme;
    this.mermaidThemeVariables =
      options.mermaidThemeVariables || MERMAID_CONFIG.themeVariables;

    // Bind methods
    this.initMarkdownLoader = this.initMarkdownLoader.bind(this);

    // Create a custom event for loader ready state
    this.readyEvent = new Event("markdownLoaderReady");
  }

  /**
   * Ensure required libraries (markdown-it, highlight.js, and mermaid) are loaded
   * This version implements:
   * - Custom header anchor solution using markdown-it's core ruler
   * - Syntax highlighting using highlight.js
   * - Mermaid diagram support
   */
  async ensureDependencies() {
    try {
      const dependencies = [
        {
          check: () => window.markdownit,
          url: "https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.1/markdown-it.min.js",
        },
        {
          check: () => window.hljs,
          url: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js",
        },
        {
          check: () => window.mermaid,
          url: "https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js",
        },
      ];

      // Load JavaScript dependencies
      const loadPromises = dependencies.map(async ({ check, url }) => {
        if (!check()) {
          const script = document.createElement("script");
          script.src = url;
          script.async = true;

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
      });

      // Add highlight.js CSS theme
      if (!document.querySelector('link[href*="highlight.js"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
        document.head.appendChild(link);
      }

      await Promise.all(loadPromises);

      // Initialize markdown-it with mermaid support, syntax highlighting, and custom header anchors
      if (!this.md && window.markdownit && window.hljs) {
        this.md = window.markdownit({
          html: true,
          highlight: (str, lang) => {
            // Handle Mermaid diagrams
            if (lang === "mermaid") {
              return `<div class="mermaid">${str}</div>`;
            }

            // Handle code syntax highlighting
            if (lang && window.hljs.getLanguage(lang)) {
              try {
                const highlighted = window.hljs.highlight(str, {
                  language: lang,
                  ignoreIllegals: true,
                });
                return `<pre class="hljs"><code class="language-${lang}">${highlighted.value}</code></pre>`;
              } catch (error) {
                console.warn("Error highlighting code:", error);
              }
            }

            // Fallback for unknown languages or no language specified
            return `<pre class="hljs"><code>${this.md.utils.escapeHtml(
              str
            )}</code></pre>`;
          },
          linkify: true,
        });

        // Add custom header anchors using markdown-it's core ruler
        this.md.core.ruler.push("header_anchors", (state) => {
          const tokens = state.tokens;
          for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.type === "heading_open") {
              // Get the heading text
              const headingContent = tokens[i + 1].content;
              // Create a slug from the heading text
              const slug = headingContent
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "");

              // Add id attribute to the heading
              token.attrSet("id", slug);

              // Add anchor link
              const anchorHTML = `<a href="#${slug}" class="header-anchor" aria-hidden="true">#</a> `;
              tokens[i + 1].content = anchorHTML + headingContent;
            }
          }
        });
      }

      // Initialize mermaid
      if (window.mermaid) {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: this.mermaidTheme,
          securityLevel: "loose",
          themeVariables: this.mermaidThemeVariables,
        });
      }
    } catch (error) {
      console.error("Error loading dependencies:", error);
      throw error;
    }
  }

  /**
   * Set Mermaid theme dynamically
   */
  setMermaidTheme(theme, variables = {}) {
    this.mermaidTheme = theme;
    this.mermaidThemeVariables = {
      ...MERMAID_CONFIG.themeVariables,
      ...variables,
    };

    if (window.mermaid) {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: this.mermaidTheme,
        securityLevel: "loose",
        themeVariables: this.mermaidThemeVariables,
      });
    }
  }

  /**
   * Cycles through loading messages with a fade transition effect
   */
  cycleMessages(messageElement, currentMessageIndex, callback) {
    messageElement.classList.add("fade");

    setTimeout(() => {
      const nextIndex = (currentMessageIndex + 1) % loadingMessages.length;
      messageElement.textContent = loadingMessages[nextIndex];
      messageElement.classList.remove("fade");
      callback(nextIndex);
    }, 500);
  }

  /**
   * Creates and returns the loading UI elements
   */
  createLoadingUI(initialMessageIndex) {
    const container = document.createElement("div");
    container.className = "loading-container";

    const spinner = document.createElement("div");
    spinner.className = "loading-spinner";

    const message = document.createElement("p");
    message.className = "loading-message";
    message.textContent = loadingMessages[initialMessageIndex];

    container.appendChild(spinner);
    container.appendChild(message);

    return { container, message };
  }

  /**
   * Check if content is already cached
   */
  isContentCached(url) {
    return !!sessionStorage.getItem(STORAGE_PREFIX + url);
  }

  /**
   * Get cached content if available
   */
  getCachedContent(url) {
    return sessionStorage.getItem(STORAGE_PREFIX + url);
  }

  /**
   * Store content in cache
   */
  setCachedContent(url, content) {
    sessionStorage.setItem(STORAGE_PREFIX + url, content);
  }

  /**
   * Extract project URLs from the homepage
   */
  extractProjectUrls() {
    const projectLinks = document.querySelectorAll('a[href*="project-"]');
    return Array.from(projectLinks)
      .map((link) => {
        const projectUrl = link.getAttribute("href");
        const readmeUrl = this.projectReadmeMap.get(
          projectUrl.split("/").pop()
        );
        if (readmeUrl) {
          return { projectUrl, readmeUrl };
        }
        return null;
      })
      .filter(Boolean);
  }

  /**
   * Fetch and process markdown content
   */
  async fetchMarkdown(readmeUrl) {
    const response = await fetch(readmeUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  }

  /**
   * Render Mermaid diagrams in the content
   */
  async renderMermaidDiagrams(element) {
    const mermaidDivs = element.querySelectorAll(".mermaid");
    if (mermaidDivs.length > 0 && window.mermaid) {
      try {
        await window.mermaid.run({
          nodes: Array.from(mermaidDivs),
        });
      } catch (error) {
        console.error("Error rendering Mermaid diagrams:", error);
      }
    }
  }

  /**
   * Preload a single markdown file
   */
  async preloadMarkdown(readmeUrl) {
    if (this.isContentCached(readmeUrl) || this.loadingStatus.get(readmeUrl)) {
      return;
    }

    this.loadingStatus.set(readmeUrl, "loading");

    try {
      const markdown = await this.fetchMarkdown(readmeUrl);
      this.setCachedContent(readmeUrl, markdown);
      this.loadingStatus.set(readmeUrl, "completed");
      console.log(`Preloaded: ${readmeUrl}`);
    } catch (error) {
      console.error(`Error preloading ${readmeUrl}:`, error);
      this.loadingStatus.set(readmeUrl, "error");
    }

    this.activeLoads--;
    this.processQueue();
  }

  /**
   * Add URL to preload queue
   */
  queuePreload(readmeUrl) {
    if (
      !this.isContentCached(readmeUrl) &&
      !this.loadingStatus.get(readmeUrl)
    ) {
      this.preloadQueue.push(readmeUrl);
      this.processQueue();
    }
  }

  /**
   * Process the preload queue
   */
  processQueue() {
    while (
      this.preloadQueue.length > 0 &&
      this.activeLoads < this.maxConcurrentLoads
    ) {
      const readmeUrl = this.preloadQueue.shift();
      this.activeLoads++;
      this.preloadMarkdown(readmeUrl);
    }
  }

  /**
   * Initialize markdown loader for a specific element
   * Handles the entire process of loading, rendering, and displaying markdown content
   * including automatic header anchor generation, syntax highlighting, and mermaid diagram rendering
   */
  async initMarkdownLoader(
    readmeUrl,
    elementId = "markdown-content",
    testMode = false
  ) {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      // Ensure dependencies are loaded
      await this.ensureDependencies();

      // Initialize with loading UI
      const currentMessageIndex = Math.floor(
        Math.random() * loadingMessages.length
      );
      const { container, message } = this.createLoadingUI(currentMessageIndex);
      element.innerHTML = "";
      element.appendChild(container);

      // Start message cycling
      let messageInterval = setInterval(() => {
        this.cycleMessages(message, currentMessageIndex, (nextIndex) => {
          currentMessageIndex = nextIndex;
        });
      }, 2000);

      let markdown;

      // Check cache first (unless in test mode)
      if (!testMode && this.isContentCached(readmeUrl)) {
        markdown = this.getCachedContent(readmeUrl);
      } else {
        // If not cached or in test mode, fetch it
        markdown = await this.fetchMarkdown(readmeUrl);
        if (!testMode) {
          this.setCachedContent(readmeUrl, markdown);
        }
      }

      // Clear loading UI and render markdown
      clearInterval(messageInterval);

      // Debug logging for content processing
      console.log("Processing markdown:", markdown.substring(0, 100)); // First 100 chars

      const renderedContent = this.md.render(markdown);
      console.log("Rendered content:", renderedContent.substring(0, 100)); // First 100 chars

      element.innerHTML = renderedContent;

      // Render any Mermaid diagrams
      await this.renderMermaidDiagrams(element);
    } catch (error) {
      console.error("Error in initMarkdownLoader:", error);
      element.innerHTML = `Error loading markdown content: ${error.message}`;
    }
  }

  /**
   * Initialize preloading on homepage
   * Preloads markdown content for better performance when navigating between pages
   */
  async initPreloader() {
    if (
      !window.location.pathname.endsWith("index.html") &&
      window.location.pathname !== "/"
    ) {
      return;
    }

    try {
      await this.ensureDependencies();
      const projectUrls = this.extractProjectUrls();
      projectUrls.forEach(({ readmeUrl }) => {
        if (readmeUrl) {
          this.queuePreload(readmeUrl);
        }
      });
    } catch (error) {
      console.error("Error in initPreloader:", error);
    }
  }

  /**
   * Initialize the enhanced markdown loader
   * Sets up the entire system including dependencies, preloading, and event handling
   */
  async init() {
    try {
      await this.ensureDependencies();
      window.initMarkdownLoader = this.initMarkdownLoader;
      await this.initPreloader();
      document.dispatchEvent(this.readyEvent);
    } catch (error) {
      console.error("Error initializing markdown loader:", error);
    }
  }
}

// Create and initialize the loader instance
const loader = new EnhancedMarkdownLoader();

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loader.init();
});

// Export the loader instance
window.markdownLoader = loader;
