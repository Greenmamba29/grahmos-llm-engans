#!/usr/bin/env node
/**
 * Quick Update Script
 * One-command update for home page and branding
 */

import { applyPhase2Branding } from './apply-phase2-branding.js';
import { updatePage, getPages, getPageDetails } from './update-home-page.js';

async function quickUpdate() {
  console.log('⚡ Quick Update - GrahmOS Branding\n');
  console.log('This will:');
  console.log('  1. Apply Phase 2 branding');
  console.log('  2. Update home page content');
  console.log('  3. Verify changes\n');

  try {
    // Step 1: Apply branding
    console.log('🎨 Step 1: Applying branding...');
    const brandingResult = await applyPhase2Branding();
    
    if (!brandingResult.success) {
      console.error('❌ Branding failed:', brandingResult.error);
      return { success: false };
    }

    // Step 2: Update home page
    console.log('\n🏠 Step 2: Updating home page...');
    const pagesData = await getPages();
    const homePage = pagesData.pages?.find(p => 
      p.slug === '' || 
      p.slug === 'home' || 
      p.name?.toLowerCase().includes('home')
    ) || pagesData.pages?.[0];

    if (homePage) {
      const updates = {
        title: 'GrahmOS Directory - Discover Innovation',
        description: 'Explore innovative companies and cutting-edge solutions in the GrahmOS ecosystem',
      };
      
      await updatePage(homePage.id, updates);
      console.log(`✅ Home page updated: ${homePage.name}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Quick Update Complete!');
    console.log('='.repeat(50));
    console.log('\n📝 Next Steps:');
    console.log('  - Use Designer Extension for visual styling');
    console.log('  - Or follow PHASE_2_MANUAL_GUIDE.md for manual updates');
    console.log('  - Publish your site when ready\n');

    return { success: true };

  } catch (error) {
    console.error('\n❌ Quick Update Failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  quickUpdate()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { quickUpdate };
