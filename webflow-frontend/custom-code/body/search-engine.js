/**
 * Grahmos Search Engine - Main Search Functionality
 * Place this in Webflow Page Settings → Before </body> tag
 */

(function() {
  'use strict';
  
  const config = window.GRAHMOS_CONFIG;
  
  // DOM Elements (using data-grahmos attributes)
  const elements = {
    searchInput: document.querySelector('[data-grahmos="search-input"]'),
    searchSubmit: document.querySelector('[data-grahmos="search-submit"]'),
    resultsContainer: document.querySelector('[data-grahmos="results-container"]'),
    sourcesSection: document.querySelector('[data-grahmos="sources-section"]'),
    llmResponse: document.querySelector('[data-grahmos="llm-response"]'),
    imagesSection: document.querySelector('[data-grahmos="images-section"]'),
    videosSection: document.querySelector('[data-grahmos="videos-section"]'),
    followUpSection: document.querySelector('[data-grahmos="followup-questions"]'),
    loadingIndicator: document.querySelector('[data-grahmos="loading-indicator"]'),
    errorMessage: document.querySelector('[data-grahmos="error-message"]')
  };
  
  // State
  let isSearching = false;
  let debounceTimer = null;
  let currentReader = null;
  
  /**
   * Initialize search interface
   */
  function init() {
    if (!elements.searchInput || !elements.searchSubmit) {
      console.error('Grahmos: Required search elements not found');
      return;
    }
    
    // Bind event listeners
    elements.searchSubmit.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
    
    // Optional: Auto-search on input (debounced)
    if (config.debounceDelay > 0) {
      elements.searchInput.addEventListener('input', function(e) {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        if (query.length > 2) {
          debounceTimer = setTimeout(() => handleSearch(), config.debounceDelay);
        }
      });
    }
    
    console.log('Grahmos Search Engine initialized');
  }
  
  /**
   * Handle search submission
   */
  async function handleSearch() {
    const query = elements.searchInput.value.trim();
    
    if (!query) {
      showError(config.messages.emptyQuery);
      return;
    }
    
    if (isSearching) {
      return; // Prevent multiple simultaneous searches
    }
    
    isSearching = true;
    showLoading(true);
    hideError();
    clearResults();
    
    try {
      await performSearch(query);
    } catch (error) {
      console.error('Search error:', error);
      showError(config.messages.searchError);
    } finally {
      isSearching = false;
      showLoading(false);
    }
  }
  
  /**
   * Perform search with streaming
   */
  async function performSearch(query) {
    const url = `${config.apiBaseUrl}/api/search`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query,
          includeImages: config.enableImages,
          includeVideos: config.enableVideos
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Handle streaming response
      const reader = response.body.getReader();
      currentReader = reader;
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Decode chunk
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete SSE messages
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep incomplete message in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            try {
              const data = JSON.parse(jsonStr);
              handleStreamMessage(data);
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Search aborted');
      } else {
        throw error;
      }
    }
  }
  
  /**
   * Handle individual stream messages
   */
  function handleStreamMessage(message) {
    switch (message.type) {
      case 'cached':
        handleCachedResponse(message.data);
        break;
        
      case 'results':
        renderSearchResults(message.searchResults);
        if (message.images) renderImages(message.images);
        if (message.videos) renderVideos(message.videos);
        if (message.conditionalFunctionCallUI) {
          handleFunctionCall(message.conditionalFunctionCallUI);
        }
        break;
        
      case 'llmToken':
        appendLLMToken(message.token);
        break;
        
      case 'followUp':
        renderFollowUpQuestions(message.questions);
        break;
        
      case 'complete':
        console.log('Search complete');
        break;
        
      case 'error':
        showError(message.error);
        break;
        
      default:
        console.warn('Unknown message type:', message.type);
    }
  }
  
  /**
   * Handle cached response
   */
  function handleCachedResponse(data) {
    if (data.searchResults) renderSearchResults(data.searchResults);
    if (data.images) renderImages(data.images);
    if (data.videos) renderVideos(data.videos);
    if (data.llmResponse) setLLMResponse(data.llmResponse);
    if (data.followUp) renderFollowUpQuestions(data.followUp);
  }
  
  /**
   * Render search results (sources)
   */
  function renderSearchResults(results) {
    if (!elements.sourcesSection || !results || results.length === 0) return;
    
    elements.sourcesSection.innerHTML = '<h3 class="sources-title">Sources</h3>';
    
    const container = document.createElement('div');
    container.className = 'sources-grid';
    
    results.slice(0, config.maxInitialResults).forEach((result, index) => {
      const card = document.createElement('a');
      card.href = result.link;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.className = 'source-card';
      
      card.innerHTML = `
        ${config.showSourceFavicons && result.favicon ? 
          `<img src="${result.favicon}" alt="" class="source-favicon" />` : 
          ''}
        <div class="source-title">${escapeHtml(result.title)}</div>
      `;
      
      container.appendChild(card);
    });
    
    elements.sourcesSection.appendChild(container);
    elements.sourcesSection.style.display = 'block';
  }
  
  /**
   * Append LLM token to response
   */
  function appendLLMToken(token) {
    if (!elements.llmResponse) return;
    
    elements.llmResponse.textContent += token;
    elements.llmResponse.style.display = 'block';
    
    // Auto-scroll to bottom
    elements.llmResponse.scrollTop = elements.llmResponse.scrollHeight;
  }
  
  /**
   * Set complete LLM response (for cached)
   */
  function setLLMResponse(response) {
    if (!elements.llmResponse) return;
    elements.llmResponse.textContent = response;
    elements.llmResponse.style.display = 'block';
  }
  
  /**
   * Render images
   */
  function renderImages(images) {
    if (!elements.imagesSection || !images || images.length === 0) return;
    
    elements.imagesSection.innerHTML = '<h3 class="images-title">Images</h3>';
    
    const container = document.createElement('div');
    container.className = 'images-grid';
    
    images.slice(0, 6).forEach(image => {
      const img = document.createElement('img');
      img.src = image.link;
      img.alt = image.title || '';
      img.className = 'result-image';
      img.loading = 'lazy';
      container.appendChild(img);
    });
    
    elements.imagesSection.appendChild(container);
    elements.imagesSection.style.display = 'block';
  }
  
  /**
   * Render videos
   */
  function renderVideos(videos) {
    if (!elements.videosSection || !videos || videos.length === 0) return;
    
    elements.videosSection.innerHTML = '<h3 class="videos-title">Videos</h3>';
    
    const container = document.createElement('div');
    container.className = 'videos-grid';
    
    videos.slice(0, 4).forEach(video => {
      const card = document.createElement('a');
      card.href = video.link;
      card.target = '_blank';
      card.className = 'video-card';
      
      card.innerHTML = `
        <img src="${video.imageUrl}" alt="" class="video-thumbnail" />
        <div class="video-title">${escapeHtml(video.title || 'Video')}</div>
      `;
      
      container.appendChild(card);
    });
    
    elements.videosSection.appendChild(container);
    elements.videosSection.style.display = 'block';
  }
  
  /**
   * Render follow-up questions
   */
  function renderFollowUpQuestions(questions) {
    if (!elements.followUpSection || !questions) return;
    
    const questionsArray = questions.choices?.[0]?.message?.content 
      ? JSON.parse(questions.choices[0].message.content).questions 
      : [];
    
    if (questionsArray.length === 0) return;
    
    elements.followUpSection.innerHTML = '<h3 class="followup-title">Related Questions</h3>';
    
    const container = document.createElement('div');
    container.className = 'followup-grid';
    
    questionsArray.forEach(question => {
      const button = document.createElement('button');
      button.className = 'followup-button';
      button.textContent = question;
      button.addEventListener('click', () => {
        elements.searchInput.value = question;
        handleSearch();
      });
      container.appendChild(button);
    });
    
    elements.followUpSection.appendChild(container);
    elements.followUpSection.style.display = 'block';
  }
  
  /**
   * Handle function calling UI (maps, shopping, etc.)
   */
  function handleFunctionCall(functionCall) {
    // Implement based on your needs
    console.log('Function call:', functionCall);
  }
  
  /**
   * Show/hide loading indicator
   */
  function showLoading(show) {
    if (elements.loadingIndicator) {
      elements.loadingIndicator.style.display = show ? 'block' : 'none';
    }
  }
  
  /**
   * Show error message
   */
  function showError(message) {
    if (elements.errorMessage) {
      elements.errorMessage.textContent = message;
      elements.errorMessage.style.display = 'block';
    }
  }
  
  /**
   * Hide error message
   */
  function hideError() {
    if (elements.errorMessage) {
      elements.errorMessage.style.display = 'none';
    }
  }
  
  /**
   * Clear results
   */
  function clearResults() {
    if (elements.sourcesSection) elements.sourcesSection.innerHTML = '';
    if (elements.llmResponse) elements.llmResponse.textContent = '';
    if (elements.imagesSection) elements.imagesSection.innerHTML = '';
    if (elements.videosSection) elements.videosSection.innerHTML = '';
    if (elements.followUpSection) elements.followUpSection.innerHTML = '';
  }
  
  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
