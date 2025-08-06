#!/usr/bin/env node

/**
 * Quick Upload Script for New Translations
 */

const { exec } = require('child_process');

console.log('🚀 Uploading updated translations to database...\n');

exec('node scripts/upload-static-translations.js', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Upload failed:', error);
    return;
  }
  
  if (stderr) {
    console.warn('⚠️ Warnings:', stderr);
  }
  
  console.log(stdout);
  console.log('\n✅ Translation upload completed!');
});