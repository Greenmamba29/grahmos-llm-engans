# GrahmOS Directory - Hero Section Implementation Guide

## 🎯 IMPORTANT: Webflow Implementation Required

The Webflow API v2 has limitations on direct DOM manipulation. You'll need to implement the hero section in the **Webflow Designer**. Here's exactly what to do:

---

## Step 1: Access Webflow Designer

1. Go to https://webflow.com
2. Open your "Grahmos Directory" site
3. Go to the **Home (Index)** page
4. Click "Edit" to open the Designer

---

## Step 2: Add Custom Code Section

### Option A: Using Webflow's Custom Code Embed

1. Add a **Custom Code** element at the top of your page
2. Paste the following HTML:

```html
<!-- GrahmOS Hero Section -->
<style>
@keyframes blob {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.grahmos-hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  overflow: hidden;
}

.grahmos-hero-bg {
  position: absolute;
  inset: 0;
  z-index: -10;
}

.blob {
  position: absolute;
  width: 18rem;
  height: 18rem;
  border-radius: 9999px;
  mix-blend-mode: multiply;
  filter: blur(64px);
  opacity: 0.7;
  animation: blob 7s infinite;
}

.blob-1 {
  top: 0;
  left: -1rem;
  background: rgba(37, 99, 235, 0.2);
}

.blob-2 {
  top: 0;
  right: -1rem;
  background: rgba(30, 64, 175, 0.2);
  animation-delay: 2s;
}

.blob-3 {
  bottom: -2rem;
  left: 5rem;
  background: rgba(37, 99, 235, 0.2);
  animation-delay: 4s;
}

.grahmos-hero-content {
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  text-align: center;
  animation: fadeIn 0.6s ease-out;
}

.grahmos-hero-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(to right, #2563EB, #1E40AF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
  animation: slideUp 0.6s ease-out;
}

.grahmos-hero-subtitle {
  font-size: 1.5rem;
  color: #6B7280;
  margin-bottom: 2rem;
  animation: slideUp 0.6s ease-out 0.2s both;
}

.grahmos-search-wrapper {
  width: 100%;
  max-width: 42rem;
  margin: 0 auto 1.5rem;
  animation: slideUp 0.6s ease-out 0.4s both;
}

.grahmos-search-container {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #E5E7EB;
  overflow: hidden;
  transition: all 0.3s;
}

.grahmos-search-container:hover {
  box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.1);
}

.grahmos-search-icon {
  padding-left: 1.5rem;
  padding-right: 0.75rem;
}

.grahmos-search-input {
  flex: 1;
  padding: 1.25rem 1rem;
  font-size: 1.125rem;
  border: none;
  outline: none;
  background: transparent;
}

.grahmos-search-button {
  margin: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #2563EB, #1E40AF);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.grahmos-search-button:hover {
  background: linear-gradient(to right, #1D4ED8, #1E3A8A);
  transform: translateY(-1px);
}

.grahmos-quick-searches {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  animation: slideUp 0.6s ease-out 0.6s both;
}

.grahmos-quick-search {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #E5E7EB;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
}

.grahmos-quick-search:hover {
  background: white;
  transform: scale(1.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.grahmos-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding-top: 3rem;
  animation: slideUp 0.6s ease-out 0.8s both;
}

.grahmos-feature {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  border: 1px solid #E5E7EB;
  transition: all 0.3s;
}

.grahmos-feature:hover {
  border-color: #2563EB;
  transform: scale(1.05);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.grahmos-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  border-radius: 0.75rem;
  background: linear-gradient(to bottom right, #2563EB, #1E40AF);
  color: white;
  font-size: 1.5rem;
}

.grahmos-feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

.grahmos-feature-description {
  font-size: 0.875rem;
  color: #6B7280;
}

@media (min-width: 768px) {
  .grahmos-hero-title {
    font-size: 4.5rem;
  }
  .grahmos-hero-subtitle {
    font-size: 1.875rem;
  }
}
</style>

<div class="grahmos-hero">
  <!-- Animated Background Blobs -->
  <div class="grahmos-hero-bg">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>

  <!-- Main Content -->
  <div class="grahmos-hero-content">
    <!-- Title -->
    <h1 class="grahmos-hero-title">GrahmOS Directory</h1>
    <p class="grahmos-hero-subtitle">Search smarter, discover faster</p>

    <!-- Search Bar -->
    <div class="grahmos-search-wrapper">
      <div class="grahmos-search-container">
        <div class="grahmos-search-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <input 
          type="text" 
          class="grahmos-search-input" 
          placeholder="Ask me anything..."
        />
        <button class="grahmos-search-button">
          Search
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Quick Searches -->
    <div class="grahmos-quick-searches">
      <button class="grahmos-quick-search">Find stadiums near me</button>
      <button class="grahmos-quick-search">Browse routes</button>
      <button class="grahmos-quick-search">Discover providers</button>
      <button class="grahmos-quick-search">Search directory</button>
    </div>

    <!-- Features -->
    <div class="grahmos-features">
      <div class="grahmos-feature">
        <div class="grahmos-feature-icon">✨</div>
        <h3 class="grahmos-feature-title">AI-Powered Answers</h3>
        <p class="grahmos-feature-description">Get intelligent responses powered by advanced AI</p>
      </div>
      <div class="grahmos-feature">
        <div class="grahmos-feature-icon">⚡</div>
        <h3 class="grahmos-feature-title">Lightning Fast</h3>
        <p class="grahmos-feature-description">Instant results from multiple sources</p>
      </div>
      <div class="grahmos-feature">
        <div class="grahmos-feature-icon">🌍</div>
        <h3 class="grahmos-feature-title">Global Directory</h3>
        <p class="grahmos-feature-description">Search stadiums, routes, and providers worldwide</p>
      </div>
    </div>
  </div>
</div>

<script>
// Make search functional
document.querySelector('.grahmos-search-button').addEventListener('click', function() {
  const query = document.querySelector('.grahmos-search-input').value;
  if (query.trim()) {
    window.location.href = '/search?q=' + encodeURIComponent(query);
  }
});

document.querySelector('.grahmos-search-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    document.querySelector('.grahmos-search-button').click();
  }
});

// Quick search buttons
document.querySelectorAll('.grahmos-quick-search').forEach(button => {
  button.addEventListener('click', function() {
    const query = this.textContent;
    window.location.href = '/search?q=' + encodeURIComponent(query);
  });
});
</script>
```

---

## Step 3: Alternative - Using Webflow Designer Elements

If you prefer to build with Webflow's native elements:

### Structure:
1. **Section** (min-height: 80vh)
   - Background: Gradient overlay
   - Position: Relative
   
2. **Container** (centered, max-width: 1200px)
   - **Heading 1**: "GrahmOS Directory"
     - Font: 72px, Bold
     - Gradient: Blue-600 to Blue-800
   
   - **Paragraph**: "Search smarter, discover faster"
     - Font: 24px
     - Color: Gray-600
   
   - **Form Block** (Search bar)
     - Input: Search field
     - Button: Submit (Blue gradient)
   
   - **Div Block** (Quick searches)
     - 4 Link Blocks with pill styling
   
   - **Grid** (3 columns on desktop)
     - 3 Feature Cards with icons

---

## Step 4: Apply GrahmOS Brand Colors

In Webflow's Style Panel:

### Brand Colors:
- **Primary Blue**: `#2563EB` (rgb(37, 99, 235))
- **Dark Blue**: `#1E40AF` (rgb(30, 64, 175))
- **Text Gray**: `#1F2937` (rgb(31, 41, 55))
- **Light Gray**: `#6B7280` (rgb(107, 114, 128))

### Typography:
- **Font**: Inter (or system default)
- **Display**: 72px, Bold
- **H1**: 48px, Bold
- **Body**: 16px, Regular

---

## Step 5: Connect to Your Search Page

Update the search button/form to redirect to:
```
/search?q={user_query}
```

Or connect to your existing search page ID: `68ab4cb4e6f4d590011e1188`

---

## Step 6: Publish

1. Click **Publish** in Webflow Designer
2. Changes will be live at: www.grahmos.com

---

## ✅ What This Creates:

- ✨ Animated gradient background with floating blobs
- 🔍 Large, centered search bar (Perplexity/Google style)
- 🎯 Quick search suggestions (4 pills)
- 📊 3 feature cards highlighting key benefits
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 GrahmOS branding (blue gradients, Inter font)
- 🚀 Smooth animations and hover effects

---

## 🆘 Need Help?

If you need me to help with any specific part, let me know! I can:
1. Create additional pages
2. Update collections (stadiums, routes, providers)
3. Modify page metadata
4. Create custom interactions

The hero section is ready to be added to your Webflow site!
