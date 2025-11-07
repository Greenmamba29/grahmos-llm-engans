# Grahmos Webflow Frontend - Setup Guide

## Quick Start Checklist

- [ ] Deploy Next.js backend with API routes
- [ ] Configure environment variables
- [ ] Set up Webflow project
- [ ] Add custom code to Webflow
- [ ] Test search functionality
- [ ] Configure custom domain
- [ ] Launch to production

---

## Step 1: Deploy the Backend API

### 1.1 Prerequisites
```bash
# Ensure all dependencies are installed
npm install

# Build the project
npm run build
```

### 1.2 Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and note your deployment URL
# Example: https://grahmos-api.vercel.app
```

### 1.3 Configure Environment Variables in Vercel
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables:
```bash
# Required
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
BRAVE_SEARCH_API_KEY=your_brave_api_key
SERPER_API=your_serper_api_key

# For Webflow Integration
ALLOWED_ORIGINS=https://grahmos.webflow.io,https://www.grahmos.com,https://grahmos.com

# Optional
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 1.4 Test API Endpoints
```bash
# Health check
curl https://your-api-domain.vercel.app/api/health

# Should return:
{
  "status": "healthy",
  "timestamp": "2025-11-07T...",
  "version": "1.0.0",
  "services": {
    "search": "operational",
    "llm": "operational",
    "cache": "operational"
  }
}
```

### 1.5 Configure Custom Domain (Optional but Recommended)
1. Go to Vercel Dashboard → Settings → Domains
2. Add `api.grahmos.com` (or your preferred subdomain)
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

---

## Step 2: Create Webflow Project

### 2.1 Create New Project
1. Log in to Webflow
2. Click "New Project"
3. Choose "Blank Site" template
4. Name it "Grahmos"

### 2.2 Design the Search Interface

#### Required Elements
Create these elements in the Webflow Designer and add the specified data attributes:

**Search Container**
```html
<div data-grahmos="search-container">
  <input 
    data-grahmos="search-input" 
    type="text" 
    placeholder="Ask anything...">
  <button data-grahmos="search-submit">Search</button>
</div>
```

**Results Container**
```html
<div data-grahmos="results-container">
  <div data-grahmos="sources-section"></div>
  <div data-grahmos="llm-response"></div>
  <div data-grahmos="images-section"></div>
  <div data-grahmos="videos-section"></div>
  <div data-grahmos="followup-questions"></div>
</div>
```

**Loading Indicator**
```html
<div data-grahmos="loading-indicator" style="display:none;">
  <div class="loading-animation"></div>
</div>
```

**Error Message**
```html
<div data-grahmos="error-message" style="display:none;"></div>
```

#### How to Add Data Attributes in Webflow
1. Select element
2. Click Settings (⚙️)
3. Scroll to "Custom Attributes"
4. Add attribute: `data-grahmos` with value (e.g., `search-input`)

### 2.3 Style Your Interface
- Use Webflow's visual designer to style all elements
- Reference `/webflow-frontend/custom-code/css/styles.css` for inspiration
- Make it match your brand

---

## Step 3: Add Custom Code

### 3.1 Add Configuration (Head Code)
1. Go to Project Settings → Custom Code
2. In "Head Code" section, paste:

```html
<script>
// Paste contents of: webflow-frontend/custom-code/head/config.js
// Make sure to update apiBaseUrl to your actual API domain
window.GRAHMOS_CONFIG = {
  apiBaseUrl: 'https://api.grahmos.com', // ← CHANGE THIS
  enableStreaming: true,
  enableImages: true,
  enableVideos: true,
  // ... rest of config
};
</script>
```

### 3.2 Add Main Search Engine (Before </body>)
1. In "Footer Code" section, paste:

```html
<script>
// Paste contents of: webflow-frontend/custom-code/body/search-engine.js
</script>
```

### 3.3 Add Custom Styles (Optional)
In "Head Code" section, add:

```html
<style>
/* Paste contents of: webflow-frontend/custom-code/css/styles.css */
</style>
```

Or create a separate CSS file and host it, then link to it.

---

## Step 4: Test Your Integration

### 4.1 Publish to Staging
1. Click "Publish" in Webflow
2. Choose "Publish to Staging"
3. Note your staging URL (e.g., `grahmos.webflow.io`)

### 4.2 Test Search Functionality
1. Open staging URL
2. Type a query: "What is the weather like?"
3. Click Search
4. Verify:
   - ✅ Loading indicator appears
   - ✅ Sources appear
   - ✅ LLM response streams in
   - ✅ Images appear (if enabled)
   - ✅ Follow-up questions appear

### 4.3 Test Error Handling
1. Stop your API backend temporarily
2. Try searching
3. Verify error message appears

### 4.4 Test on Mobile
1. Open staging URL on mobile device
2. Test search functionality
3. Verify responsive design

---

## Step 5: Configure Custom Domain

### 5.1 Add Domain in Webflow
1. Go to Project Settings → Hosting
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `www.grahmos.com`)
4. Follow DNS configuration instructions

### 5.2 Update DNS Records
Add these records to your DNS provider:

```
Type: CNAME
Name: www
Value: proxy-ssl.webflow.com

Type: A (for apex domain)
Name: @
Value: 75.2.70.75
```

### 5.3 Update CORS Origins
Update your backend environment variables to include your production domain:

```bash
ALLOWED_ORIGINS=https://grahmos.webflow.io,https://www.grahmos.com,https://grahmos.com
```

### 5.4 Wait for DNS Propagation
- Usually takes 1-24 hours
- Check status: https://www.whatsmydns.net/

---

## Step 6: Launch to Production

### 6.1 Final Checks
- [ ] All API endpoints working
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] CORS configured correctly
- [ ] Search functionality tested
- [ ] Mobile responsive
- [ ] Error handling works
- [ ] Analytics configured (optional)

### 6.2 Publish to Production
1. Click "Publish" in Webflow
2. Choose "Publish to grahmos.com"
3. Confirm

### 6.3 Monitor
- Check backend logs in Vercel
- Monitor API response times
- Track search queries (if analytics enabled)
- Watch for errors

---

## Troubleshooting

### Issue: "CORS Error"
**Solution**: 
- Verify `ALLOWED_ORIGINS` includes your Webflow domain
- Redeploy backend after changing environment variables
- Check browser console for exact error message

### Issue: "API Not Responding"
**Solution**:
- Test `/api/health` endpoint directly
- Check Vercel deployment logs
- Verify environment variables are set correctly

### Issue: "Search Not Working"
**Solution**:
- Open browser console (F12)
- Look for JavaScript errors
- Verify all `data-grahmos` attributes are set correctly
- Check `apiBaseUrl` in config.js

### Issue: "Streaming Not Working"
**Solution**:
- Verify your API route supports Server-Sent Events
- Check network tab for streaming response
- Ensure `enableStreaming` is true in config

### Issue: "Elements Not Appearing"
**Solution**:
- Verify `data-grahmos` attributes are spelled correctly
- Check that elements exist in DOM
- Look for JavaScript console errors

---

## Advanced Configuration

### Enable @Mention Tools
1. Set `enableMentionTools: true` in config
2. Add mention UI to Webflow
3. Configure mention tools in backend

### Add Analytics
```javascript
// In search-engine.js, add:
function trackSearch(query) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'search', {
      search_term: query
    });
  }
}
```

### Custom Styling
- Override CSS variables
- Add animations
- Customize loading states

---

## Performance Optimization

### Frontend
- Enable Webflow CDN
- Optimize images
- Lazy load components
- Debounce search input

### Backend
- Enable semantic caching
- Use edge functions
- Implement rate limiting
- Monitor API response times

---

## Support

### Documentation
- [Architecture Guide](../WEBFLOW_ARCHITECTURE.md)
- [API Reference](../API_REFERENCE.md)
- [Webflow Docs](https://university.webflow.com/)

### Common Issues
- Check GitHub Issues
- Review Vercel logs
- Test API endpoints independently

---

## Next Steps

1. ✅ Complete this setup
2. Consider adding:
   - User authentication
   - Search history
   - Saved searches
   - Advanced filters
   - Voice search
   - Multi-language support

---

*Last Updated: 2025-11-07*
*Questions? Open an issue or contact support*
