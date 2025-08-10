#!/usr/bin/env node

/**
 * Direct execution of the complete translation migration script
 * This will run the main migration orchestrator that handles all steps
 */

const { spawn } = require('child_process');

console.log('🌟 STARTING COMPLETE TRANSLATION MIGRATION');
console.log('═'.repeat(60));
console.log('📋 Executing: scripts/run-complete-translation-migration.js');
console.log('═'.repeat(60));

const child = spawn('node', ['scripts/run-complete-translation-migration.js'], {
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

child.on('close', (code) => {
  console.log('\n═'.repeat(60));
  if (code === 0) {
    console.log('✅ Translation migration script completed successfully!');
  } else {
    console.log(`❌ Translation migration script exited with code: ${code}`);
  }
  console.log('═'.repeat(60));
});

child.on('error', (error) => {
  console.error('\n❌ Error executing migration script:', error);
});