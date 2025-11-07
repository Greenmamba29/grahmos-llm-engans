# 🚀 Quick Start - GrahmOS Webflow Integration

## ⚡ 3-Minute Setup

### 1. Install Dependencies
```bash
cd webflow
npm install
```

### 2. Test Connection
```bash
npm run test-api
```

### 3. Apply Branding
```bash
npm run apply-branding
```

**Done!** ✅

---

## 🎯 What You Can Do

### ✅ Update Home Page (API)
```bash
npm run dev
# or
node scripts/update-home-page.js
```

### ✅ Apply Complete Branding (API)
```bash
npm run apply-branding
# or
node scripts/apply-phase2-branding.js
```

### ✅ Use Designer Extension
1. Open Webflow Designer
2. Press `E` for extensions
3. Load `designer-extension/index.html`
4. Click "Apply Complete Branding"

### ✅ Create 50 Sites (Advanced)
```bash
node scripts/create-50-sites.js
# Test with 1 site:
node scripts/create-50-sites.js --limit=1
```

---

## 📋 Configuration

Your API is already configured:
- **Token**: `4ad349b8...` (in `.webflow-config.json`)
- **Site ID**: `690c15ada42ec08cfbdf7127`

---

## 🆘 Troubleshooting

**API fails?**
```bash
npm run test-api
```

**Extension not loading?**
- Check browser console
- Verify Webflow Designer is open
- Try incognito mode

**Need help?**
- See `SETUP.md` for detailed guide
- See `README.md` for full documentation

---

## 🎨 Brand Colors

- Primary: `#2563EB`
- Text: `#1F2937`
- Success: `#10B981`
- Warning: `#F59E0B`

---

**Ready?** Run `npm run test-api` to start! 🚀
