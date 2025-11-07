# GrahmOS Webflow Automation

Complete automation system for applying GrahmOS branding to Webflow sites.

## 🚀 Quick Start

### 1. Test API Connection

```bash
cd webflow
npm install
npm run test-api
```

### 2. Apply Phase 2 Branding

```bash
npm run apply-branding
```

### 3. Update Home Page

```bash
npm run dev
```

## 📁 Structure

```
webflow/
├── .webflow-config.json      # API configuration
├── package.json              # Dependencies
├── scripts/
│   ├── update-home-page.js   # Home page updater
│   ├── apply-phase2-branding.js  # Complete branding
│   └── test-api-connection.js    # API tester
└── designer-extension/
    ├── manifest.json         # Extension manifest
    └── index.html           # Extension UI
```

## 🔧 Configuration

Edit `.webflow-config.json`:

```json
{
  "apiToken": "your-token-here",
  "siteId": "your-site-id",
  "branding": {
    "primaryColor": "#2563EB",
    ...
  }
}
```

## 🎨 Designer Extension

The Designer Extension runs inside Webflow Designer:

1. Load `designer-extension/index.html` in Webflow Designer
2. Press 'E' to open extensions
3. Select "GrahmOS Branding Automator"
4. Click "Apply Complete Branding"

## 📚 API Scripts

### Test Connection
```bash
node scripts/test-api-connection.js
```

### Apply Branding
```bash
node scripts/apply-phase2-branding.js
```

### Update Home Page
```bash
node scripts/update-home-page.js
```

## 🎯 Features

- ✅ Direct API updates to Webflow
- ✅ Phase 2 branding automation
- ✅ Home page content updates
- ✅ Designer Extension for interactive updates
- ✅ Comprehensive error handling
- ✅ Progress tracking

## 📝 Notes

- Visual styling (colors, fonts) requires Designer Extension or manual Designer updates
- API can update content, pages, and collections
- Designer Extension provides interactive UI for styling

## 🔗 Resources

- [Webflow API Docs](https://developers.webflow.com/)
- [Designer Extension API](https://developers.webflow.com/designer-extension)
