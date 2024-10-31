// Array of loading messages to cycle through
const loadingMessages = [
    "Fetching the awesome content...",
    "Converting markdown to magic...",
    "Brewing your content...",
    "Just a moment, crafting perfection...",
    "Doing some data gymnastics...",
    "Making sure everything looks pretty..."
  ];
  
  /**
   * Cycles through loading messages with a fade transition effect
   * - Adds fade out class
   * - Updates message after fade
   * - Removes fade class for fade in effect
   */
  function cycleMessages(messageElement, currentMessageIndex, callback) {
    messageElement.classList.add('fade');
    
    setTimeout(() => {
      const nextIndex = (currentMessageIndex + 1) % loadingMessages.length;
      messageElement.textContent = loadingMessages[nextIndex];
      messageElement.classList.remove('fade');
      callback(nextIndex);
    }, 500); // Wait for fade out to complete before changing text
  }
  
  /**
   * Initializes the markdown loader with a specific README URL
   * @param {string} readmeUrl - The URL of the README.md file to load
   * @param {string} [elementId='markdown-content'] - ID of the container element
   * @param {boolean} [testMode=false] - Enable test mode with delayed loading
   */
  function initMarkdownLoader(readmeUrl, elementId = 'markdown-content', testMode = false) {
    // Initialize markdown parser
    const md = window.markdownit();
    let messageInterval;
    
    // Start with a random message index
    let currentMessageIndex = Math.floor(Math.random() * loadingMessages.length);
    
    // Initialize loading container with random message
    document.getElementById(elementId).innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-message">${loadingMessages[currentMessageIndex]}</p>
      </div>
    `;
  
    const messageElement = document.querySelector('.loading-message');
    
    // Start cycling through messages every 2 seconds
    messageInterval = setInterval(() => {
      cycleMessages(messageElement, currentMessageIndex, (nextIndex) => {
        currentMessageIndex = nextIndex;
      });
    }, 2000);
  
    /**
     * Loads and renders the markdown content
     */
    function loadContent() {
      const cachedContent = sessionStorage.getItem(readmeUrl);
      if (cachedContent && !testMode) {
        clearInterval(messageInterval);
        document.getElementById(elementId).innerHTML = md.render(cachedContent);
      } else {
        fetch(readmeUrl)
          .then(response => response.text())
          .then(markdown => {
            clearInterval(messageInterval);
            sessionStorage.setItem(readmeUrl, markdown);
            document.getElementById(elementId).innerHTML = md.render(markdown);
          })
          .catch(error => {
            clearInterval(messageInterval);
            console.error('Error fetching markdown:', error);
            document.getElementById(elementId).innerHTML = 'Error loading markdown content';
          });
      }
    }
  
    // In test mode, clear cache and add delay
    if (testMode) {
      sessionStorage.removeItem(readmeUrl);
      setTimeout(loadContent, 10000);
    } else {
      loadContent();
    }
  }
  
  // Make the function available globally
  window.initMarkdownLoader = initMarkdownLoader;