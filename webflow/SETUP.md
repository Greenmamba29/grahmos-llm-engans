# GrahmOS Webflow Integration - Complete Setup Guide

## 🎯 What This Does

This integration provides **three ways** to update your Webflow site:

1. **API Scripts** - Direct updates via Webflow API (runs from terminal/Cursor)
2. **Designer Extension** - Interactive UI inside Webflow Designer
3. **Manual Updates** - Step-by-step guide for Designer

## ✅ Prerequisites

- Node.js 18+ installed
- Webflow API token (already configured)
- Site ID: `690c15ada42ec08cfbdf7127`

## 🚀 Installation

### Step 1: Install Dependencies

```bash
cd webflow
npm install
```

### Step 2: Test API Connection

```bash
npm run test-api
```

You should see:
```
✅ All API tests passed!
🎉 Your Webflow API connection is working correctly!
```

## 📋 Usage Options

### Option 1: API Scripts (Recommended for Cursor)

These scripts can be run directly from Cursor or terminal:

#### Test Connection
```bash
node scripts/test-api-connection.js
```

#### Apply Phase 2 Branding
```bash
node scripts/apply-phase2-branding.js
```

#### Update Home Page
```bash
node scripts/update-home-page.js
```

### Option 2: Designer Extension

1. **Start Local Server** (if needed):
   ```bash
   # The extension HTML can be loaded directly
   # Or serve it with a simple HTTP server
   python3 -m http.server 8000 -d designer-extension
   ```

2. **Load in Webflow Designer**:
   - Open your site in Webflow Designer
   - Press `E` to open extensions
   - Enter extension URL or load local file
   - Use the interactive UI to apply branding

### Option 3: Manual Designer Updates

See `PHASE_2_MANUAL_GUIDE.md` for step-by-step instructions.

## 🎨 Branding Configuration

Current branding (in `.webflow-config.json`):

- **Primary Blue**: `#2563EB`
- **Text Dark**: `#1F2937`
- **Success Green**: `#10B981`
- **Warning Amber**: `#F59E0B`
- **Font**: Inter, sans-serif

## 🔧 API Capabilities

### What API Can Do:
- ✅ Update page titles and descriptions
- ✅ Fetch site information
- ✅ List pages and collections
- ✅ Update CMS content
- ✅ Manage site structure

### What API Cannot Do (Requires Designer):
- ❌ Direct CSS/styling updates
- ❌ Visual element positioning
- ❌ Component styling
- ❌ Color palette updates

**Solution**: Use Designer Extension or manual Designer updates for visual styling.

## 🐛 Troubleshooting

### API Connection Fails

**Error**: `401 Unauthorized`
- Check API token in `.webflow-config.json`
- Verify token is valid at https://webflow.com/dashboard/account/integrations

**Error**: `404 Not Found`
- Verify Site ID is correct
- Check site exists in your Webflow account

### Designer Extension Not Loading

1. Check browser console for errors
2. Verify extension HTML is accessible
3. Ensure Webflow Designer API is available
4. Try loading extension in incognito mode

## 📊 What Gets Updated

### API Scripts Update:
- Page metadata (title, description)
- Site information
- Collection structure
- Content organization

### Designer Extension Updates:
- Visual colors
- Typography
- Component styles
- Element positioning

## 🎯 Next Steps

1. **Test API**: Run `npm run test-api`
2. **Apply Branding**: Run `npm run apply-branding`
3. **Use Designer Extension**: Load in Webflow Designer
4. **Scale to 50 Sites**: Use automation scripts (see `create-50-sites.js`)

## 💡 Pro Tips

- Run `test-api-connection.js` first to verify setup
- Use API scripts for bulk updates
- Use Designer Extension for visual fine-tuning
- Combine both approaches for complete automation

## 📚 Additional Resources

- [Webflow API Documentation](https://developers.webflow.com/)
- [Designer Extension API](https://developers.webflow.com/designer-extension)
- [GrahmOS Branding Guide](./README.md)

---

**Ready to start?** Run `npm run test-api` to verify everything is working! 🚀
