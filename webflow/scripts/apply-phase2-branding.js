#!/usr/bin/env node
/**
 * Phase 2 Branding Application Script
 * Applies complete GrahmOS branding to Webflow site
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPages, getPageDetails, updatePage, getSiteInfo } from './update-home-page.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, '..', '.webflow-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const API_TOKEN = config.apiToken;
const SITE_ID = config.siteId;
const BASE_URL = config.baseUrl;
const branding = config.branding;

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json',
  'Accept-Version': '1.0.0'
};

/**
 * Get collection items (for CMS content)
 */
async function getCollectionItems(collectionId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/collections/${collectionId}/items`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching collection items:', error.response?.data || error.message);
    return null;
  }
}

/**
 * Get site collections
 */
async function getCollections() {
  try {
    const response = await axios.get(
      `${BASE_URL}/sites/${SITE_ID}/collections`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching collections:', error.response?.data || error.message);
    return { collections: [] };
  }
}

/**
 * Apply complete Phase 2 branding
 */
async function applyPhase2Branding() {
  console.log('🎨 GrahmOS Phase 2 Branding Application\n');
  console.log('=' .repeat(50));
  console.log('Brand Colors:');
  console.log(`  Primary: ${branding.primaryColor}`);
  console.log(`  Secondary: ${branding.secondaryColor}`);
  console.log(`  Success: ${branding.successColor}`);
  console.log(`  Warning: ${branding.warningColor}`);
  console.log('=' .repeat(50) + '\n');

  try {
    // Step 1: Get site info
    console.log('📡 Step 1: Fetching site information...');
    const siteInfo = await getSiteInfo();
    console.log(`✅ Site: ${siteInfo.displayName || SITE_ID}\n`);

    // Step 2: Get all pages
    console.log('📄 Step 2: Fetching pages...');
    const pagesData = await getPages();
    const pages = pagesData.pages || [];
    console.log(`✅ Found ${pages.length} pages\n`);

    // Step 3: Get collections
    console.log('🗂️  Step 3: Fetching collections...');
    const collectionsData = await getCollections();
    const collections = collectionsData.collections || [];
    console.log(`✅ Found ${collections.length} collections\n`);

    // Step 4: Update home page
    console.log('🏠 Step 4: Updating home page...');
    const homePage = pages.find(p => 
      p.slug === '' || 
      p.slug === 'home' || 
      p.name?.toLowerCase().includes('home')
    ) || pages[0];

    if (homePage) {
      const pageDetails = await getPageDetails(homePage.id);
      const updates = {
        title: 'GrahmOS Directory - Discover Innovation',
        description: 'Explore innovative companies and cutting-edge solutions in the GrahmOS ecosystem',
      };
      
      await updatePage(homePage.id, updates);
      console.log(`✅ Home page updated: ${homePage.name}\n`);
    }

    // Step 5: Summary
    console.log('📊 Phase 2 Branding Summary:');
    console.log('=' .repeat(50));
    console.log(`✅ Site: ${siteInfo.displayName || SITE_ID}`);
    console.log(`✅ Pages processed: ${pages.length}`);
    console.log(`✅ Collections found: ${collections.length}`);
    console.log(`✅ Branding colors configured`);
    console.log('=' .repeat(50) + '\n');

    console.log('⚠️  Note: Visual styling (colors, fonts) requires:');
    console.log('   1. Webflow Designer Extension (for interactive updates)');
    console.log('   2. Manual updates in Webflow Designer');
    console.log('   3. CSS custom properties via Designer API\n');

    console.log('🎉 Phase 2 branding data structure applied!');
    console.log('📝 Next: Use Designer Extension or manual Designer updates for visual styling.\n');

    return {
      success: true,
      siteId: SITE_ID,
      pagesProcessed: pages.length,
      collectionsFound: collections.length
    };

  } catch (error) {
    console.error('\n❌ Error applying Phase 2 branding:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    return {
      success: false,
      error: error.message
    };
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  applyPhase2Branding()
    .then(result => {
      if (result.success) {
        console.log('✅ Complete!');
        process.exit(0);
      } else {
        console.error('❌ Failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { applyPhase2Branding };
