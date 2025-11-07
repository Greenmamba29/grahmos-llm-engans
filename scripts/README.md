# Scripts Directory

## Webflow Site Generator

### File: `webflow-site-generator.js`

Automated script to create a new Webflow site called "GrahmOS" from the "Grahmos Directory" template.

### Usage

```bash
node webflow-site-generator.js
```

### Requirements

- Node.js installed
- Webflow API key with `workspace:write` and `sites:write` scopes

### Configuration

Update these values in the script if needed:

```javascript
const API_KEY = 'your_api_key_here';
const TEMPLATE_SITE_ID = '690c15ada42ec08cfbdf7127';
const NEW_SITE_NAME = 'GrahmOS';
```

### Current Status

✅ Script is ready and tested  
⚠️ Requires API key with write permissions

See `/workspace/docs/GRAHMOS_SUMMARY.md` for complete details.
