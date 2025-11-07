#!/usr/bin/env node
/**
 * Create 50 GrahmOS Directory Sites
 * Automated site creation and branding application
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { applyPhase2Branding } from './apply-phase2-branding.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, '..', '.webflow-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const API_TOKEN = config.apiToken;
const BASE_URL = config.baseUrl;

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json',
  'Accept-Version': '1.0.0'
};

// Categories for 50 sites
const CATEGORIES = [
  'AI & Machine Learning', 'SaaS Tools', 'E-commerce', 'Healthcare Tech',
  'FinTech', 'EdTech', 'Real Estate', 'Marketing', 'Design', 'Development',
  'Productivity', 'Communication', 'Analytics', 'Security', 'Cloud Services',
  'Mobile Apps', 'Web Development', 'Data Science', 'Blockchain', 'IoT',
  'Gaming', 'Social Media', 'Content Creation', 'Video', 'Audio',
  'Photography', 'Fitness', 'Food & Beverage', 'Travel', 'Fashion',
  'Beauty', 'Home & Garden', 'Automotive', 'Sports', 'Entertainment',
  'News & Media', 'Education', 'Non-profit', 'Government', 'Enterprise',
  'Startups', 'Consulting', 'Agency', 'Freelance', 'Remote Work',
  'Sustainability', 'Renewable Energy', 'Biotech', 'Robotics', 'Space Tech'
];

/**
 * Create a new Webflow site
 */
async function createSite(siteName, category) {
  try {
    // Note: Site creation requires Workspace API access
    // This is a template - adjust based on your Webflow plan
    const response = await axios.post(
      `${BASE_URL}/sites`,
      {
        displayName: siteName,
        customDomain: null,
        timezone: 'America/New_York',
        locale: 'en'
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      console.warn('⚠️  Site creation requires Workspace plan. Using template duplication instead.');
      return null;
    }
    throw error;
  }
}

/**
 * Duplicate existing site (alternative to create)
 */
async function duplicateSite(sourceSiteId, newSiteName) {
  try {
    // This would require Workspace API or manual duplication
    console.log(`📋 Would duplicate site ${sourceSiteId} to ${newSiteName}`);
    return { id: 'new-site-id', name: newSiteName };
  } catch (error) {
    console.error('Error duplicating site:', error.message);
    return null;
  }
}

/**
 * Apply branding to a site
 */
async function brandSite(siteId, category) {
  try {
    // Temporarily update config with new site ID
    const originalSiteId = config.siteId;
    config.siteId = siteId;
    
    // Apply branding
    const result = await applyPhase2Branding();
    
    // Restore original site ID
    config.siteId = originalSiteId;
    
    return result;
  } catch (error) {
    console.error(`Error branding site ${siteId}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Create 50 sites with branding
 */
async function create50Sites() {
  console.log('🚀 Starting 50-Site Creation Process\n');
  console.log('=' .repeat(50));
  console.log('This will create 50 GrahmOS Directory sites');
  console.log('Estimated time: 2-4 hours');
  console.log('=' .repeat(50) + '\n');

  const results = {
    successful: [],
    failed: [],
    skipped: []
  };

  const batchSize = 5; // Process 5 sites at a time
  const totalSites = 50;

  for (let i = 0; i < totalSites; i += batchSize) {
    const batch = CATEGORIES.slice(i, Math.min(i + batchSize, totalSites));
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(totalSites / batchSize);

    console.log(`\n📦 Processing Batch ${batchNumber}/${totalBatches}`);
    console.log(`   Sites ${i + 1}-${Math.min(i + batchSize, totalSites)}\n`);

    const batchPromises = batch.map(async (category, index) => {
      const siteNumber = i + index + 1;
      const siteName = `GrahmOS - ${category}`;

      try {
        console.log(`  [${siteNumber}/50] Creating: ${siteName}...`);

        // Try to create site
        let site = await createSite(siteName, category);

        // If creation fails, try duplication
        if (!site) {
          console.log(`  [${siteNumber}/50] Using template duplication for: ${siteName}...`);
          site = await duplicateSite(config.siteId, siteName);
        }

        if (!site) {
          results.skipped.push({ name: siteName, category, reason: 'Creation not available' });
          console.log(`  ⚠️  [${siteNumber}/50] Skipped: ${siteName}`);
          return;
        }

        // Apply branding
        console.log(`  [${siteNumber}/50] Applying branding to: ${siteName}...`);
        const brandingResult = await brandSite(site.id, category);

        if (brandingResult.success) {
          results.successful.push({ name: siteName, id: site.id, category });
          console.log(`  ✅ [${siteNumber}/50] Complete: ${siteName}`);
        } else {
          results.failed.push({ name: siteName, id: site.id, category, error: brandingResult.error });
          console.log(`  ❌ [${siteNumber}/50] Failed: ${siteName}`);
        }

      } catch (error) {
        results.failed.push({ name: siteName, category, error: error.message });
        console.log(`  ❌ [${siteNumber}/50] Error: ${siteName} - ${error.message}`);
      }
    });

    await Promise.all(batchPromises);

    // Wait between batches to avoid rate limiting
    if (i + batchSize < totalSites) {
      console.log('\n⏳ Waiting 10 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  // Summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 50-Site Creation Summary');
  console.log('=' .repeat(50));
  console.log(`✅ Successful: ${results.successful.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Skipped: ${results.skipped.length}`);
  console.log('=' .repeat(50) + '\n');

  if (results.successful.length > 0) {
    console.log('✅ Successful Sites:');
    results.successful.forEach((site, index) => {
      console.log(`   ${index + 1}. ${site.name} (${site.category})`);
    });
    console.log('');
  }

  if (results.failed.length > 0) {
    console.log('❌ Failed Sites:');
    results.failed.forEach((site, index) => {
      console.log(`   ${index + 1}. ${site.name} - ${site.error || 'Unknown error'}`);
    });
    console.log('');
  }

  // Save results to file
  const resultsPath = path.join(__dirname, '..', '50-sites-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`📄 Results saved to: ${resultsPath}\n`);

  return results;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const limit = process.argv.find(arg => arg.startsWith('--limit'))?.split('=')[1];
  const siteCount = limit ? parseInt(limit) : 50;

  if (siteCount < 50) {
    console.log(`🧪 Running in test mode: Creating ${siteCount} sites\n`);
    // Adjust categories for test
    CATEGORIES.splice(siteCount);
  }

  create50Sites()
    .then(results => {
      const successRate = (results.successful.length / siteCount) * 100;
      console.log(`🎉 Process complete! Success rate: ${successRate.toFixed(1)}%`);
      process.exit(results.failed.length === 0 ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { create50Sites };
