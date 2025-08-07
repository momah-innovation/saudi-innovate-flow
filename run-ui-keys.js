#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🔍 Running UI missing keys upload...');

const child = spawn('node', ['scripts/add-ui-missing-keys.js'], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('✅ UI missing keys upload completed successfully');
  } else {
    console.error('❌ Upload failed with code:', code);
  }
});

child.on('error', (error) => {
  console.error('❌ Process error:', error);
});