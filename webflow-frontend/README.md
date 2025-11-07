# Grahmos Webflow Frontend

Complete frontend implementation for Grahmos AI Search Engine using Webflow.

## 📁 Directory Structure

```
webflow-frontend/
├── custom-code/
│   ├── head/
│   │   └── config.js              # Configuration (Webflow Head Code)
│   ├── body/
│   │   └── search-engine.js       # Main search functionality (Webflow Footer Code)
│   └── css/
│       └── styles.css             # Custom styles
├── HTML_TEMPLATE.html             # Complete HTML template for reference
├── SETUP_GUIDE.md                 # Step-by-step setup instructions
└── README.md                      # This file
```

## 🚀 Quick Start

### 1. **Deploy Backend API**
```bash
cd /workspace
npm install
npm run build
vercel deploy
```

Note your API URL (e.g., `https://api.grahmos.com`)

### 2. **Set Up Webflow Project**
1. Create new Webflow project
2. Design your search interface
3. Add `data-grahmos` attributes to elements

### 3. **Add Custom Code**
- Copy `custom-code/head/config.js` → Webflow Head Code
- Copy `custom-code/body/search-engine.js` → Webflow Footer Code
- Copy `custom-code/css/styles.css` → Webflow Head Code (in `<style>` tags)

### 4. **Configure API URL**
Update in `config.js`:
```javascript
apiBaseUrl: 'https://your-api-domain.com', // ← Change this
```

### 5. **Publish & Test**
1. Publish to staging
2. Test search functionality
3. Deploy to production

## 📖 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[../WEBFLOW_ARCHITECTURE.md](../WEBFLOW_ARCHITECTURE.md)** - Architecture overview
- **[HTML_TEMPLATE.html](./HTML_TEMPLATE.html)** - Reference implementation

## 🎨 Required HTML Structure

Your Webflow page must include these elements with specific `data-grahmos` attributes:

### Search Interface
```html
<div data-grahmos="search-container">
  <input data-grahmos="search-input" placeholder="Ask anything...">
  <button data-grahmos="search-submit">Search</button>
</div>
```

### Results Container
```html
<div data-grahmos="results-container">
  <div data-grahmos="sources-section"></div>
  <div data-grahmos="llm-response"></div>
  <div data-grahmos="images-section"></div>
  <div data-grahmos="videos-section"></div>
  <div data-grahmos="followup-questions"></div>
</div>
```

### Loading & Error States
```html
<div data-grahmos="loading-indicator" style="display:none;">
  <div class="loading-animation"></div>
</div>

<div data-grahmos="error-message" style="display:none;"></div>
```

## ⚙️ Configuration Options

Edit `custom-code/head/config.js`:

```javascript
window.GRAHMOS_CONFIG = {
  // API Configuration
  apiBaseUrl: 'https://api.grahmos.com',
  
  // Feature Toggles
  enableStreaming: true,        // Real-time streaming responses
  enableImages: true,            // Show images in results
  enableVideos: true,            // Show videos in results
  enableFollowUpQuestions: true, // Show related questions
  
  // Performance
  timeout: 30000,               // Request timeout (ms)
  debounceDelay: 300,          // Search input debounce (ms)
  maxRetries: 3,               // Failed request retries
  
  // UI
  maxInitialResults: 3,        // Number of sources to show initially
  showSourceFavicons: true,    // Display website favicons
  animationSpeed: 300          // UI animation speed (ms)
};
```

## 🎯 Features

### ✨ Core Features
- **Real-time Streaming** - Responses stream as they're generated
- **Source Citations** - Shows sources with links and favicons
- **Rich Results** - Images, videos, and structured data
- **Follow-up Questions** - AI-generated related questions
- **Error Handling** - Graceful error messages
- **Loading States** - Smooth loading indicators
- **Responsive Design** - Works on all devices

### 🚀 Advanced Features
- **Semantic Caching** - Faster responses for repeated queries
- **Rate Limiting** - Prevents API abuse
- **@Mention Tools** - Special functionality (image generation, etc.)
- **Function Calling** - Dynamic UI (maps, shopping, charts)
- **Dark Mode** - Automatic dark mode support

## 🔧 Customization

### Styling
Edit `custom-code/css/styles.css` or use Webflow's visual designer:

```css
/* Change primary color */
[data-grahmos="search-submit"] {
  background: #your-color;
}

/* Customize cards */
.source-card {
  background: #your-background;
  border-radius: 12px;
}
```

### Behavior
Edit `custom-code/body/search-engine.js`:

```javascript
// Change debounce delay
const debounceDelay = 500; // milliseconds

// Modify result rendering
function renderSearchResults(results) {
  // Your custom logic
}
```

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure backend `ALLOWED_ORIGINS` includes your Webflow domain
- Verify domain spelling (https://your-site.webflow.io)

**Search Not Working**
- Check browser console for errors
- Verify `data-grahmos` attributes are correct
- Test API endpoint directly: `https://your-api.com/api/health`

**Streaming Not Working**
- Verify `enableStreaming: true` in config
- Check network tab for SSE connection
- Ensure backend supports Server-Sent Events

**Elements Not Appearing**
- Verify elements exist with correct `data-grahmos` attributes
- Check JavaScript console for errors
- Ensure custom code is in correct location (head/footer)

## 📊 Testing

### Manual Testing Checklist
- [ ] Search returns results
- [ ] Sources display with links
- [ ] LLM response streams in real-time
- [ ] Images appear
- [ ] Videos appear
- [ ] Follow-up questions work
- [ ] Error messages display correctly
- [ ] Loading indicators work
- [ ] Mobile responsive
- [ ] Dark mode (if implemented)

### API Testing
```bash
# Health check
curl https://your-api.com/api/health

# Search test
curl -X POST https://your-api.com/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test query"}'

# Images test
curl https://your-api.com/api/images?q=test
```

## 🚀 Deployment

### Staging
1. Publish to Webflow staging: `project-name.webflow.io`
2. Test all functionality
3. Verify API connection

### Production
1. Configure custom domain in Webflow
2. Update DNS records
3. Update backend CORS settings
4. Publish to production
5. Monitor logs and analytics

## 📈 Performance

### Frontend Optimization
- Webflow CDN serves static assets
- JavaScript is minified
- Images lazy-loaded
- Debounced input
- Efficient DOM updates

### Backend Optimization
- Edge functions (low latency)
- Semantic caching
- Parallel API calls
- Rate limiting

## 🔐 Security

### Frontend
- Input sanitization
- XSS prevention
- HTTPS only
- No API keys in code

### Backend
- CORS protection
- Rate limiting
- Input validation
- Environment variables for secrets

## 📞 Support

### Resources
- [Setup Guide](./SETUP_GUIDE.md)
- [Architecture](../WEBFLOW_ARCHITECTURE.md)
- [Main README](../README.md)
- [Webflow University](https://university.webflow.com/)

### Need Help?
- Check troubleshooting section
- Review browser console
- Test API endpoints independently
- Open GitHub issue

## 📝 License

Same as parent project (MIT License)

---

## Next Steps

1. ✅ Complete [Setup Guide](./SETUP_GUIDE.md)
2. Deploy backend API
3. Create Webflow project
4. Add custom code
5. Test & launch

---

*Built with ❤️ for Grahmos*
*Last Updated: 2025-11-07*
