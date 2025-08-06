#!/usr/bin/env node

// Temporary script to run the upload
const { spawn } = require('child_process');

function runUpload() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Running translation upload...');
    
    const child = spawn('node', ['scripts/upload-static-translations.js'], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Upload completed successfully');
        resolve();
      } else {
        console.error('❌ Upload failed with code:', code);
        reject(new Error(`Upload failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.error('❌ Upload error:', error);
      reject(error);
    });
  });
}

runUpload().catch(console.error);