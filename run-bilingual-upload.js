#!/usr/bin/env node

const { spawn } = require('child_process');

function runBilingualUpload() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Running bilingual translation upload...');
    
    const child = spawn('node', ['scripts/upload-bilingual-translations.js'], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Bilingual upload completed successfully');
        resolve();
      } else {
        console.error('❌ Bilingual upload failed with code:', code);
        reject(new Error(`Process failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.error('❌ Process error:', error);
      reject(error);
    });
  });
}

runBilingualUpload().catch(console.error);