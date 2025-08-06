#!/usr/bin/env node

/**
 * Upload Updated Translations Script
 * Uploads the newly added translation keys to the database
 */

const { exec } = require('child_process');

console.log('🚀 Uploading updated translations with missing keys...\n');

exec('node scripts/upload-static-translations.js', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Upload failed:', error);
    return;
  }
  
  if (stderr) {
    console.warn('⚠️ Warnings:', stderr);
  }
  
  console.log(stdout);
  console.log('\n✅ Missing translation keys have been uploaded!');
});