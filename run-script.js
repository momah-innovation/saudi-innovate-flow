const { execSync } = require('child_process');

console.log('🚀 Executing scripts/run-complete-translation-migration.js\n');

try {
  execSync('node scripts/run-complete-translation-migration.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('Script execution failed:', error.message);
}