#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🔍 Running missing translations upload (no duplicates)...');

const child = spawn('node', ['scripts/upload-missing-only.js'], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Missing translations upload completed successfully');
  } else {
    console.error('❌ Upload failed with code:', code);
  }
});

child.on('error', (error) => {
  console.error('❌ Process error:', error);
});