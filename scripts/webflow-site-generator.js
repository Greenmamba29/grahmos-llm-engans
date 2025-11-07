#!/usr/bin/env node

/**
 * Webflow Site Generator
 * Creates a new Webflow site from a template
 */

const https = require('https');

// Configuration
const API_KEY = '4ad349b8f15c0f11be17a513aa46fe834c7697c2c7ccbe6bbf117e0dbf3c8d48';
const TEMPLATE_SITE_ID = '690c15ada42ec08cfbdf7127';
const NEW_SITE_NAME = 'GrahmOS';

/**
 * Makes an HTTPS request to the Webflow API
 */
function makeWebflowRequest(method, path, data = null, apiVersion = 'v2') {
  return new Promise((resolve, reject) => {
    const fullPath = apiVersion === 'v2' ? `/v2${path}` : path;
    
    const options = {
      hostname: 'api.webflow.com',
      port: 443,
      path: fullPath,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    
    // Add Accept-Version header only for v1 API
    if (apiVersion === 'v1') {
      options.headers['Accept-Version'] = '1.0.0';
    }

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(new Error(`API Error (${res.statusCode}): ${JSON.stringify(parsedData)}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(responseData);
          } else {
            reject(new Error(`Parse Error: ${e.message}, Response: ${responseData}`));
          }
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Get site information (v2 API)
 */
async function getSiteInfo() {
  console.log(`\n📋 Fetching site information...`);
  try {
    // Try v2 API first
    const response = await makeWebflowRequest('GET', `/sites/${TEMPLATE_SITE_ID}`, null, 'v2');
    console.log(`✅ Site found: ${response.displayName || response.name || 'Unknown'}`);
    return response;
  } catch (error) {
    console.log(`⚠️  V2 API failed, trying v1: ${error.message}`);
    try {
      const site = await makeWebflowRequest('GET', `/sites/${TEMPLATE_SITE_ID}`, null, 'v1');
      console.log(`✅ Template site found (v1): ${site.name || site.displayName || 'Unknown'}`);
      return site;
    } catch (v1Error) {
      console.error(`❌ Error fetching site info: ${v1Error.message}`);
      throw v1Error;
    }
  }
}

/**
 * Create a new site (v2 API using workspace endpoint)
 */
async function createSiteFromTemplate() {
  console.log(`\n🚀 Creating new site: ${NEW_SITE_NAME}...`);
  
  try {
    // First, get the workspace/template site info
    const templateSite = await getSiteInfo();
    const workspaceId = templateSite.workspaceId;
    
    if (!workspaceId) {
      throw new Error('No workspace ID found for the template site');
    }
    
    console.log(`\n📝 Workspace ID: ${workspaceId}`);
    
    // Prepare site data for v2 API
    const siteData = {
      displayName: NEW_SITE_NAME
    };

    console.log(`\n📝 Site configuration:`, JSON.stringify(siteData, null, 2));
    
    // Try v2 API with workspace endpoint
    try {
      console.log(`\n🔄 Attempting to create site via v2 workspace API...`);
      const newSite = await makeWebflowRequest('POST', `/workspaces/${workspaceId}/sites`, siteData, 'v2');
      console.log(`\n✅ Site created successfully!`);
      displaySiteInfo(newSite);
      return newSite;
    } catch (v2Error) {
      console.log(`\n⚠️  V2 workspace creation failed: ${v2Error.message}`);
      
      // Try to publish/duplicate from template
      console.log(`\n🔄 Trying to duplicate from template site...`);
      try {
        const duplicateData = {
          displayName: NEW_SITE_NAME
        };
        const newSite = await makeWebflowRequest('POST', `/sites/${TEMPLATE_SITE_ID}/duplicate`, duplicateData, 'v2');
        console.log(`\n✅ Site duplicated successfully!`);
        displaySiteInfo(newSite);
        return newSite;
      } catch (duplicateError) {
        console.log(`\n⚠️  Duplication failed: ${duplicateError.message}`);
        
        // Final fallback: try v1 API
        console.log(`\n🔄 Trying v1 API as final fallback...`);
        const v1SiteData = {
          displayName: NEW_SITE_NAME,
          shortName: NEW_SITE_NAME.toLowerCase().replace(/\s+/g, '-')
        };
        
        const newSite = await makeWebflowRequest('POST', '/sites', v1SiteData, 'v1');
        console.log(`\n✅ Site created successfully via v1!`);
        displaySiteInfo(newSite);
        return newSite;
      }
    }
  } catch (error) {
    console.error(`\n❌ Error creating site: ${error.message}`);
    throw error;
  }
}

/**
 * Display site information
 */
function displaySiteInfo(site) {
  console.log(`\n📊 Site Details:`);
  console.log(`   - Name: ${site.displayName || site.name}`);
  console.log(`   - Site ID: ${site.id || site._id || site.siteId}`);
  
  if (site.shortName || site.subdomain) {
    console.log(`   - Subdomain: ${site.subdomain || site.shortName}.webflow.io`);
  }
  
  if (site.previewUrl) {
    console.log(`   - Preview URL: ${site.previewUrl}`);
  }
  
  if (site.workspaceId) {
    console.log(`   - Workspace ID: ${site.workspaceId}`);
  }
}

/**
 * List all sites (for verification)
 */
async function listSites() {
  console.log(`\n📚 Listing all sites...`);
  try {
    // Try v2 API first
    try {
      const response = await makeWebflowRequest('GET', '/sites', null, 'v2');
      const sites = response.sites || response;
      
      if (Array.isArray(sites)) {
        console.log(`\n✅ Found ${sites.length} site(s) (v2):`);
        sites.forEach((site, index) => {
          console.log(`   ${index + 1}. ${site.displayName || site.name} (ID: ${site.id || site._id})`);
        });
      } else {
        console.log(`\n✅ Sites response (v2):`, JSON.stringify(sites, null, 2));
      }
      
      return sites;
    } catch (v2Error) {
      console.log(`⚠️  V2 listing failed: ${v2Error.message}`);
      console.log(`\n🔄 Trying v1 API...`);
      
      const sites = await makeWebflowRequest('GET', '/sites', null, 'v1');
      
      if (Array.isArray(sites)) {
        console.log(`\n✅ Found ${sites.length} site(s) (v1):`);
        sites.forEach((site, index) => {
          console.log(`   ${index + 1}. ${site.displayName || site.name} (ID: ${site._id || site.id})`);
        });
      } else {
        console.log(`\n✅ Sites response (v1):`, JSON.stringify(sites, null, 2));
      }
      
      return sites;
    }
  } catch (error) {
    console.error(`❌ Error listing sites: ${error.message}`);
    console.log(`\n💡 This might mean the API key doesn't have the correct permissions.`);
    console.log(`   Required scopes: sites:read, sites:write`);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║        Webflow Site Generator - GrahmOS                  ║
╚══════════════════════════════════════════════════════════╝
  `);
  
  try {
    // Step 1: List existing sites
    await listSites();
    
    // Step 2: Create new site
    const newSite = await createSiteFromTemplate();
    
    // Step 3: Verify by listing sites again
    console.log(`\n🔍 Verifying creation...`);
    await listSites();
    
    console.log(`\n
╔══════════════════════════════════════════════════════════╗
║                   Success! ✨                            ║
╠══════════════════════════════════════════════════════════╣
║  Your GrahmOS site has been generated!                   ║
║                                                           ║
║  Next Steps:                                             ║
║  1. Visit your site in the Webflow dashboard            ║
║  2. Customize the design and content                     ║
║  3. Publish when ready                                   ║
╚══════════════════════════════════════════════════════════╝
    `);
    
  } catch (error) {
    console.error(`\n
╔══════════════════════════════════════════════════════════╗
║                    Error ❌                              ║
╠══════════════════════════════════════════════════════════╣
║  ${error.message.padEnd(57)} ║
╚══════════════════════════════════════════════════════════╝
    `);
    process.exit(1);
  }
}

// Run the script
main();
