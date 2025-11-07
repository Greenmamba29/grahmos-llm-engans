# Grahmos Webflow Frontend Architecture

## Overview

This document outlines the architecture for building a Webflow frontend that communicates with the existing Next.js backend API. This separation allows for:
- Beautiful, designer-friendly UI in Webflow
- Powerful AI/LLM processing in Next.js backend
- Flexibility to update frontend without touching backend logic
- Easy scaling of frontend and backend independently

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Webflow Frontend (grahmos.com)               │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  - HTML/CSS (Webflow Designer)                       │  │
│  │  - Custom JavaScript (Search Interface)              │  │
│  │  - Real-time Streaming UI                            │  │
│  │  - Results Display Components                        │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│                     │ HTTPS/WebSocket                        │
│                     │                                        │
└─────────────────────┼────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js API Backend (api.grahmos.com)          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │              API Routes (Edge Functions)            │    │
│  │  /api/search     - Streaming search endpoint       │    │
│  │  /api/images     - Image search                    │    │
│  │  /api/videos     - Video search                    │    │
│  │  /api/questions  - Follow-up questions             │    │
│  │  /api/mention    - @mention tools                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Existing Backend Services                 │    │
│  │  - Search Providers (Brave, Serper)                │    │
│  │  - LLM Providers (Groq, OpenAI)                    │    │
│  │  - Content Processing (RAG)                        │    │
│  │  - Function Calling (Maps, Shopping)               │    │
│  │  - Semantic Cache & Rate Limiting                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Webflow Frontend
- **Webflow Designer** - Visual design and layout
- **Webflow CMS** (optional) - Blog/content management
- **Custom JavaScript** - Search functionality and API integration
- **WebSocket Client** - Real-time streaming responses
- **Fetch API** - REST API calls to backend

### Next.js Backend (Existing)
- **Next.js 14 API Routes** - RESTful endpoints
- **Edge Functions** - Fast global response
- **Streaming** - Real-time token streaming
- **All existing tools** - Search, LLM, RAG, etc.

## Data Flow

### 1. User Search Query
```
User types in Webflow search bar
    ↓
JavaScript captures input
    ↓
POST to api.grahmos.com/api/search
    ↓
Backend processes (search, RAG, LLM)
    ↓
Stream response back to Webflow
    ↓
JavaScript renders results in real-time
```

### 2. Real-time Streaming
```javascript
// Webflow frontend
fetch('https://api.grahmos.com/api/search', {
  method: 'POST',
  body: JSON.stringify({ query: 'user question' })
})
.then(response => response.body.getReader())
.then(reader => {
  // Stream tokens as they arrive
  // Update UI in real-time
})
```

## API Endpoints Design

### POST /api/search
**Purpose**: Main search endpoint with streaming response

**Request**:
```json
{
  "query": "How is Apple stock doing?",
  "mentionTool": null,
  "includeImages": true,
  "includeVideos": true
}
```

**Response** (Server-Sent Events):
```json
// Event: searchResults
{"searchResults": [...], "images": [...], "videos": [...]}

// Event: llmToken
{"token": "Apple", "isComplete": false}

// Event: llmToken
{"token": " stock", "isComplete": false}

// Event: followUp
{"questions": ["...", "...", "..."]}

// Event: complete
{"status": "done"}
```

### GET /api/images?q={query}
**Purpose**: Get image results

**Response**:
```json
{
  "images": [
    {"link": "https://...", "title": "..."},
    ...
  ]
}
```

### GET /api/videos?q={query}
**Purpose**: Get video results

### POST /api/mention
**Purpose**: Handle @mention tools (image generation, etc.)

### GET /api/health
**Purpose**: Health check endpoint

## Webflow Project Structure

```
grahmos-webflow/
├── pages/
│   ├── home.webflow         # Main search interface
│   ├── about.webflow        # About page
│   └── blog.webflow         # Blog (CMS)
├── custom-code/
│   ├── head/
│   │   └── config.js        # Global configuration
│   ├── body/
│   │   ├── search-engine.js      # Main search functionality
│   │   ├── stream-handler.js     # Streaming response handler
│   │   ├── results-renderer.js   # Results display logic
│   │   └── mention-tools.js      # @mention functionality
│   └── footer/
│       └── analytics.js     # Analytics tracking
├── cms-collections/
│   ├── blog-posts/          # Blog content
│   └── faq-items/           # FAQ items
└── assets/
    ├── css/
    │   └── custom.css       # Additional styling
    └── js/
        └── utilities.js     # Helper functions
```

## Webflow Elements Naming Convention

Use `data-grahmos` attributes for JavaScript targeting:

```html
<!-- Search Interface -->
<div data-grahmos="search-container">
  <input data-grahmos="search-input" placeholder="Ask anything...">
  <button data-grahmos="search-submit">Search</button>
</div>

<!-- Results Display -->
<div data-grahmos="results-container">
  <div data-grahmos="sources-section"></div>
  <div data-grahmos="llm-response"></div>
  <div data-grahmos="images-section"></div>
  <div data-grahmos="videos-section"></div>
  <div data-grahmos="followup-questions"></div>
</div>

<!-- Loading States -->
<div data-grahmos="loading-indicator" style="display:none;">
  <div class="loading-animation"></div>
</div>

<!-- Error Display -->
<div data-grahmos="error-message" style="display:none;"></div>
```

## CORS Configuration

Backend must allow Webflow domain:

```javascript
// In Next.js API routes
export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const origin = req.headers.get('origin')
  const allowedOrigins = [
    'https://grahmos.webflow.io',
    'https://www.grahmos.com',
    'https://grahmos.com'
  ]
  
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers })
  }
  
  // Handle request...
  return new Response(JSON.stringify(data), { headers })
}
```

## Environment Variables

### Backend (.env)
```bash
# Existing variables
GROQ_API_KEY=...
OPENAI_API_KEY=...
BRAVE_SEARCH_API_KEY=...
SERPER_API=...

# New for Webflow frontend
ALLOWED_ORIGINS=https://grahmos.webflow.io,https://grahmos.com
WEBFLOW_API_TOKEN=...  # For CMS integration
WEBFLOW_SITE_ID=...
```

### Webflow (Custom Code)
```javascript
// In Webflow head custom code
window.GRAHMOS_CONFIG = {
  apiBaseUrl: 'https://api.grahmos.com',
  enableStreaming: true,
  enableImages: true,
  enableVideos: true,
  maxRetries: 3,
  timeout: 30000
}
```

## Deployment Strategy

### Phase 1: Backend API Layer
1. Create API routes in Next.js
2. Deploy to Vercel/Netlify with edge functions
3. Configure custom domain (api.grahmos.com)
4. Test all endpoints

### Phase 2: Webflow Development
1. Design UI in Webflow Designer
2. Add custom code for search functionality
3. Test on Webflow staging domain
4. Integrate with backend API

### Phase 3: Production Launch
1. Connect custom domain (grahmos.com) to Webflow
2. Configure DNS for API subdomain
3. Enable SSL certificates
4. Launch and monitor

## Security Considerations

1. **API Rate Limiting**: Already implemented in backend
2. **CORS Protection**: Whitelist only Webflow domains
3. **Input Validation**: Sanitize all user inputs
4. **API Keys**: Never expose in frontend code
5. **Content Security Policy**: Configure in Webflow settings

## Performance Optimizations

1. **CDN**: Webflow serves static assets via CDN
2. **Edge Functions**: Next.js API routes on edge
3. **Caching**: 
   - Browser cache for static assets
   - Semantic cache for repeated queries (backend)
4. **Lazy Loading**: Load images/videos on demand
5. **Debouncing**: Debounce search input (300ms)

## Monitoring & Analytics

1. **Frontend Monitoring**:
   - Google Analytics in Webflow
   - Custom events for searches
   - Error tracking (Sentry)

2. **Backend Monitoring**:
   - Vercel Analytics
   - API response times
   - Error rates
   - Cache hit rates

## Advantages of This Architecture

### For Design
✅ Full control over UI/UX in Webflow
✅ No code deployment for design changes
✅ Designer-friendly workflow
✅ Fast iteration on frontend

### For Development
✅ Separation of concerns
✅ Independent scaling
✅ Backend can serve multiple frontends
✅ Technology flexibility

### For Business
✅ Faster time to market
✅ Lower maintenance costs
✅ Better performance
✅ Easier A/B testing

## Next Steps

1. ✅ Read this architecture document
2. ⏭️ Review API routes creation guide
3. ⏭️ Implement custom JavaScript for Webflow
4. ⏭️ Set up Webflow project
5. ⏭️ Test integration
6. ⏭️ Deploy to production

---

*Last Updated: 2025-11-07*
