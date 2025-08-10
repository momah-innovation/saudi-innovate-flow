#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🚀 Running complete translation migration...\n');

const child = spawn('node', ['scripts/run-complete-translation-migration.js'], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Migration completed successfully!');
  } else {
    console.error(`\n❌ Migration failed with exit code: ${code}`);
    process.exit(1);
  }
});

child.on('error', (error) => {
  console.error('\n❌ Migration error:', error);
  process.exit(1);
});