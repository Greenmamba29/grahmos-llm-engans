/**
 * Grahmos Webflow Configuration
 * Place this in Webflow Project Settings → Custom Code → Head Code
 */

window.GRAHMOS_CONFIG = {
  // API Configuration
  apiBaseUrl: 'https://api.grahmos.com', // Change to your API domain
  
  // Feature Flags
  enableStreaming: true,
  enableImages: true,
  enableVideos: true,
  enableFollowUpQuestions: true,
  enableMentionTools: true,
  
  // Performance
  maxRetries: 3,
  timeout: 30000, // 30 seconds
  debounceDelay: 300, // milliseconds
  
  // UI Configuration
  animationSpeed: 300,
  maxInitialResults: 3,
  showSourceFavicons: true,
  
  // Error Messages
  messages: {
    networkError: 'Unable to connect. Please check your internet connection.',
    searchError: 'Something went wrong. Please try again.',
    rateLimitError: 'Too many requests. Please wait a moment.',
    emptyQuery: 'Please enter a search query.',
    timeout: 'Request timed out. Please try again.'
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Grahmos initialized with config:', window.GRAHMOS_CONFIG);
});
