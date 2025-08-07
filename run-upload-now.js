#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🚀 Running translation upload script...');

const child = spawn('node', ['run-bilingual-upload.js'], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Translation upload completed successfully');
  } else {
    console.error('❌ Translation upload failed with code:', code);
  }
});

child.on('error', (error) => {
  console.error('❌ Process error:', error);
});