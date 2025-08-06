#!/usr/bin/env node

/**
 * Build Script with Translation Update
 * 
 * This script updates translations from the database before building the application.
 * It ensures the latest translations are included in the production build.
 */

const { spawn } = require('child_process');
const path = require('path');

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔧 Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    console.log('🚀 Starting build process with translation update...\n');

    // Step 1: Update translations from database
    console.log('📥 Step 1: Updating translations from database');
    try {
      await runCommand('node', [path.join(__dirname, 'update-translations.js')]);
    } catch (error) {
      console.warn('⚠️  Translation update failed, continuing with existing files...');
      console.warn(error.message);
    }

    // Step 2: Run the actual build
    console.log('\n🏗️  Step 2: Building application');
    await runCommand('npm', ['run', 'build']);

    console.log('\n✅ Build completed successfully with updated translations!');

  } catch (error) {
    console.error('\n❌ Build failed:');
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}