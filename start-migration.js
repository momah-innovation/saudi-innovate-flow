console.log('🚀 Starting Complete Translation Migration Process...\n');

const { execSync } = require('child_process');

try {
  // Execute the manual migration runner
  execSync('node manual-migration-runner.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('Migration execution failed:', error.message);
}