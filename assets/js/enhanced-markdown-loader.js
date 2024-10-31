// Configuration and Constants
const STORAGE_PREFIX = 'preloaded_markdown_';
const loadingMessages = [
    "Fetching the awesome content...",
    "Converting markdown to magic...",
    "Brewing your content...",
    "Just a moment, crafting perfection...",
    "Doing some data gymnastics...",
    "Making sure everything looks pretty..."
];

class EnhancedMarkdownLoader {
    constructor() {
        // Preloader state
        this.loadingStatus = new Map();
        this.preloadQueue = [];
        this.maxConcurrentLoads = 2;
        this.activeLoads = 0;
        
        // Project to README URL mapping
        this.projectReadmeMap = new Map([
            ['project-coffee-beans-sales-analysis.html', 'https://raw.githubusercontent.com/ai-saleh/coffee-sales-analysis/refs/heads/main/README.md'],
            // Add more project mappings here
        ]);

        // Bind methods
        this.initMarkdownLoader = this.initMarkdownLoader.bind(this);
        
        // Create a custom event for loader ready state
        this.readyEvent = new Event('markdownLoaderReady');
    }

    /**
     * Ensure markdown-it is loaded
     */
    async ensureMarkdownIt() {
        if (!window.markdownit) {
            // Create script element for markdown-it
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.1/markdown-it.min.js';
            
            // Wait for script to load
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        
        // Initialize markdown-it
        if (!this.md && window.markdownit) {
            this.md = window.markdownit();
        }
    }

    /**
     * Cycles through loading messages with a fade transition effect
     */
    cycleMessages(messageElement, currentMessageIndex, callback) {
        messageElement.classList.add('fade');
        
        setTimeout(() => {
            const nextIndex = (currentMessageIndex + 1) % loadingMessages.length;
            messageElement.textContent = loadingMessages[nextIndex];
            messageElement.classList.remove('fade');
            callback(nextIndex);
        }, 500);
    }

    /**
     * Creates and returns the loading UI elements
     */
    createLoadingUI(initialMessageIndex) {
        const container = document.createElement('div');
        container.className = 'loading-container';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        const message = document.createElement('p');
        message.className = 'loading-message';
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
            .map(link => {
                const projectUrl = link.getAttribute('href');
                const readmeUrl = this.projectReadmeMap.get(projectUrl.split('/').pop());
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
     * Preload a single markdown file
     */
    async preloadMarkdown(readmeUrl) {
        if (this.isContentCached(readmeUrl) || this.loadingStatus.get(readmeUrl)) {
            return;
        }

        this.loadingStatus.set(readmeUrl, 'loading');

        try {
            const markdown = await this.fetchMarkdown(readmeUrl);
            this.setCachedContent(readmeUrl, markdown);
            this.loadingStatus.set(readmeUrl, 'completed');
            console.log(`Preloaded: ${readmeUrl}`);
        } catch (error) {
            console.error(`Error preloading ${readmeUrl}:`, error);
            this.loadingStatus.set(readmeUrl, 'error');
        }

        this.activeLoads--;
        this.processQueue();
    }

    /**
     * Add URL to preload queue
     */
    queuePreload(readmeUrl) {
        if (!this.isContentCached(readmeUrl) && !this.loadingStatus.get(readmeUrl)) {
            this.preloadQueue.push(readmeUrl);
            this.processQueue();
        }
    }

    /**
     * Process the preload queue
     */
    processQueue() {
        while (this.preloadQueue.length > 0 && this.activeLoads < this.maxConcurrentLoads) {
            const readmeUrl = this.preloadQueue.shift();
            this.activeLoads++;
            this.preloadMarkdown(readmeUrl);
        }
    }

    /**
     * Initialize markdown loader for a specific element
     */
    async initMarkdownLoader(readmeUrl, elementId = 'markdown-content', testMode = false) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Ensure markdown-it is loaded
        await this.ensureMarkdownIt();

        // Initialize with loading UI
        const currentMessageIndex = Math.floor(Math.random() * loadingMessages.length);
        const { container, message } = this.createLoadingUI(currentMessageIndex);
        element.innerHTML = '';
        element.appendChild(container);

        // Start message cycling
        let messageInterval = setInterval(() => {
            this.cycleMessages(message, currentMessageIndex, (nextIndex) => {
                currentMessageIndex = nextIndex;
            });
        }, 2000);

        try {
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
            element.innerHTML = this.md.render(markdown);

        } catch (error) {
            clearInterval(messageInterval);
            console.error('Error loading markdown:', error);
            element.innerHTML = 'Error loading markdown content';
        }
    }

    /**
     * Initialize preloading on homepage
     */
    async initPreloader() {
        // Only run on the homepage
        if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
            return;
        }

        // Ensure markdown-it is loaded
        await this.ensureMarkdownIt();

        // Extract and queue all project URLs for preloading
        const projectUrls = this.extractProjectUrls();
        projectUrls.forEach(({ readmeUrl }) => {
            if (readmeUrl) {
                this.queuePreload(readmeUrl);
            }
        });
    }

    /**
     * Initialize the enhanced markdown loader
     */
    async init() {
        try {
            // Ensure markdown-it is loaded first
            await this.ensureMarkdownIt();
            
            // Make the loader function available globally
            window.initMarkdownLoader = this.initMarkdownLoader;
            
            // Start preloading if on homepage
            await this.initPreloader();

            // Dispatch ready event
            document.dispatchEvent(this.readyEvent);
        } catch (error) {
            console.error('Error initializing markdown loader:', error);
        }
    }
}

// Create and initialize the loader instance
const loader = new EnhancedMarkdownLoader();

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loader.init();
});

// Export the loader instance
window.markdownLoader = loader;