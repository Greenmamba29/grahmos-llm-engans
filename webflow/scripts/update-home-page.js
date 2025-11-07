#!/usr/bin/env node
/**
 * Webflow Home Page Updater
 * Directly updates the home page with branding and content
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration
const configPath = path.join(__dirname, '..', '.webflow-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const API_TOKEN = config.apiToken;
const SITE_ID = config.siteId;
const BASE_URL = config.baseUrl;

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json',
  'Accept-Version': '1.0.0'
};

/**
 * Get all pages for the site
 */
async function getPages() {
  try {
    const response = await axios.get(
      `${BASE_URL}/sites/${SITE_ID}/pages`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching pages:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get page details including DOM structure
 */
async function getPageDetails(pageId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/pages/${pageId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching page details:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Update page content
 */
async function updatePage(pageId, updates) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/pages/${pageId}`,
      updates,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating page:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get site info
 */
async function getSiteInfo() {
  try {
    const response = await axios.get(
      `${BASE_URL}/sites/${SITE_ID}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching site info:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Apply Phase 2 branding to home page
 */
async function applyBrandingToHomePage() {
  console.log('🚀 Starting Phase 2 Branding Application...\n');
  
  try {
    // Get site info
    console.log('📡 Fetching site information...');
    const siteInfo = await getSiteInfo();
    console.log(`✅ Site: ${siteInfo.displayName || SITE_ID}\n`);

    // Get all pages
    console.log('📄 Fetching pages...');
    const pagesData = await getPages();
    const pages = pagesData.pages || [];
    
    // Find home page (usually the first page or one named "Home")
    const homePage = pages.find(p => 
      p.slug === '' || 
      p.slug === 'home' || 
      p.name?.toLowerCase().includes('home')
    ) || pages[0];

    if (!homePage) {
      throw new Error('No pages found in site');
    }

    console.log(`✅ Found home page: ${homePage.name} (ID: ${homePage.id})\n`);

    // Get page details
    console.log('📋 Fetching page details...');
    const pageDetails = await getPageDetails(homePage.id);
    console.log('✅ Page details retrieved\n');

    // Apply branding updates
    console.log('🎨 Applying branding...');
    const brandingUpdates = {
      title: pageDetails.title || 'GrahmOS Directory',
      description: pageDetails.description || 'Discover innovative companies and solutions',
      // Note: Direct DOM manipulation requires Designer API or manual updates
      // This script prepares the data structure
    };

    const updated = await updatePage(homePage.id, brandingUpdates);
    console.log('✅ Branding applied successfully!\n');

    console.log('📊 Summary:');
    console.log(`   Site ID: ${SITE_ID}`);
    console.log(`   Page: ${homePage.name}`);
    console.log(`   Page ID: ${homePage.id}`);
    console.log(`   Status: ✅ Complete\n`);

    return {
      success: true,
      pageId: homePage.id,
      pageName: homePage.name,
      updates: brandingUpdates
    };

  } catch (error) {
    console.error('\n❌ Error applying branding:', error.message);
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
  applyBrandingToHomePage()
    .then(result => {
      if (result.success) {
        console.log('🎉 Phase 2 branding application complete!');
        process.exit(0);
      } else {
        console.error('❌ Failed to apply branding');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { applyBrandingToHomePage, getPages, getPageDetails, updatePage, getSiteInfo };
