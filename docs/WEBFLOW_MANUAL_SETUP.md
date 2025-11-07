# Manual GrahmOS Site Creation Guide

Since the API key has read-only permissions, here's how to manually create the GrahmOS site from the template:

## Steps

### 1. Access Webflow Dashboard

1. Go to https://webflow.com/dashboard
2. Sign in with your account

### 2. Locate the Template

The template "Grahmos Directory" is already in your workspace (ID: 690c15ada42ec08cfbdf7127)

### 3. Duplicate the Site

**Option A: Using the Dashboard**
1. Find "Grahmos Directory" in your sites list
2. Click the three dots menu (⋯) next to the site name
3. Select "Duplicate Site" or "Clone Site"
4. Name the new site: **GrahmOS**
5. Click "Create"

**Option B: Using the Template**
1. Open "Grahmos Directory" in the Webflow Designer
2. Click on the site name in the top-left corner
3. Select "Site Settings" → "Duplicate"
4. Enter "GrahmOS" as the new site name
5. Confirm the duplication

### 4. Verify the New Site

After creation, verify:
- ✅ Site name is "GrahmOS"
- ✅ All pages are copied from the template
- ✅ Design and components are intact
- ✅ Site is in the correct workspace

### 5. Get the New Site Information

1. Open the new GrahmOS site in the Designer
2. Go to Site Settings → General
3. Note down:
   - Site ID (found in the URL or settings)
   - Site subdomain
   - Publishing domain

### 6. Configure and Publish

1. **Customize Content**: Update any content specific to GrahmOS
2. **Update Branding**: Adjust logos, colors, and text
3. **Test Pages**: Review all pages in the Designer
4. **Publish**: When ready, click "Publish" to make it live

## What Gets Copied

When you duplicate a site, the following are included:
- ✅ All pages and their content
- ✅ CMS collections and items
- ✅ Custom code and scripts
- ✅ Site settings and SEO
- ✅ Forms and integrations
- ✅ Custom domain settings (need reconfiguration)

## Post-Creation Tasks

### Update Site Settings
1. **General Settings**
   - Site name: GrahmOS
   - Favicon and webclip icons
   - SEO meta tags

2. **Hosting Settings**
   - Custom domain (if applicable)
   - SSL certificate
   - 404 page

3. **Integrations**
   - Analytics (Google Analytics, etc.)
   - Forms (form handlers)
   - Third-party scripts

### Content Updates
1. Replace any template-specific text
2. Update contact information
3. Add GrahmOS-specific images and assets
4. Review and update CMS items

## Using the API After Manual Creation

Once you manually create the site, you can still use the Webflow API for:
- **Content management** (with current read permissions)
- **Fetching site data**
- **Listing collections and items**
- **Monitoring site status**

To use the API with the new GrahmOS site:

```javascript
// Get the new site ID after creation
const GRAHMOS_SITE_ID = 'YOUR_NEW_SITE_ID';

// Use the existing script to fetch site info
node /workspace/scripts/webflow-site-generator.js
```

## Troubleshooting

### Can't Find Duplicate Option
- Make sure you have the correct workspace permissions
- Contact the workspace owner if you don't have site creation rights

### Template Not Found
- Verify you're in the correct workspace
- Check that the template site ID is correct: `690c15ada42ec08cfbdf7127`

### Site Creation Failed
- Ensure your workspace plan supports multiple sites
- Check workspace site limits
- Contact Webflow support if issues persist

## Alternative: Request API Access

If you prefer automated site creation, request from the workspace owner:
1. New API key with `workspace:write` scope
2. Update the generator script with the new key
3. Run the automated script

---

**Note**: This manual process achieves the same result as the automated script, just requires a few clicks in the Webflow interface instead of running code.
