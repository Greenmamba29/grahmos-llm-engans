#!/usr/bin/env node
/**
 * Test Webflow API Connection
 * Verifies API token and site access
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function testConnection() {
  console.log('🔌 Testing Webflow API Connection...\n');
  console.log(`API Token: ${API_TOKEN.substring(0, 10)}...${API_TOKEN.substring(API_TOKEN.length - 10)}`);
  console.log(`Site ID: ${SITE_ID}`);
  console.log(`Base URL: ${BASE_URL}\n`);

  try {
    // Test 1: Get site info
    console.log('📡 Test 1: Fetching site information...');
    const siteResponse = await axios.get(
      `${BASE_URL}/sites/${SITE_ID}`,
      { headers }
    );
    console.log(`✅ Site found: ${siteResponse.data.displayName || SITE_ID}`);
    console.log(`   Last published: ${siteResponse.data.lastPublished || 'Never'}\n`);

    // Test 2: Get pages
    console.log('📄 Test 2: Fetching pages...');
    const pagesResponse = await axios.get(
      `${BASE_URL}/sites/${SITE_ID}/pages`,
      { headers }
    );
    const pages = pagesResponse.data.pages || [];
    console.log(`✅ Found ${pages.length} pages`);
    if (pages.length > 0) {
      console.log(`   Sample pages: ${pages.slice(0, 3).map(p => p.name).join(', ')}\n`);
    }

    // Test 3: Get collections
    console.log('🗂️  Test 3: Fetching collections...');
    const collectionsResponse = await axios.get(
      `${BASE_URL}/sites/${SITE_ID}/collections`,
      { headers }
    );
    const collections = collectionsResponse.data.collections || [];
    console.log(`✅ Found ${collections.length} collections\n`);

    console.log('=' .repeat(50));
    console.log('✅ All API tests passed!');
    console.log('=' .repeat(50));
    console.log('\n🎉 Your Webflow API connection is working correctly!');
    console.log('   You can now run branding and automation scripts.\n');

    return {
      success: true,
      site: siteResponse.data,
      pagesCount: pages.length,
      collectionsCount: collections.length
    };

  } catch (error) {
    console.error('\n❌ API Connection Failed!\n');
    
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Message:', error.response.data?.message || error.response.statusText);
      console.error('\nFull Response:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n💡 Tip: Check your API token in .webflow-config.json');
      } else if (error.response.status === 404) {
        console.error('\n💡 Tip: Verify your Site ID is correct');
      }
    } else {
      console.error('Error:', error.message);
      console.error('\n💡 Tip: Check your internet connection and API endpoint');
    }

    return {
      success: false,
      error: error.message,
      status: error.response?.status
    };
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { testConnection };
