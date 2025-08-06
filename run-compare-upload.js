#!/usr/bin/env node

const { spawn } = require('child_process');

function runCompareUpload() {
  return new Promise((resolve, reject) => {
    console.log('🔍 Running translation comparison and upload...');
    
    const child = spawn('node', ['scripts/compare-and-upload-missing.js'], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Comparison and upload completed successfully');
        resolve();
      } else {
        console.error('❌ Comparison and upload failed with code:', code);
        reject(new Error(`Process failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.error('❌ Process error:', error);
      reject(error);
    });
  });
}

runCompareUpload().catch(console.error);