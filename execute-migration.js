const { execSync } = require('child_process');

console.log('🌟 COMPLETE TRANSLATION MIGRATION PROCESS STARTING');
console.log('═'.repeat(60));

try {
  console.log('📦 Running complete translation migration...\n');
  
  // Execute the migration script
  execSync('node scripts/run-complete-translation-migration.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n🎉 Migration process completed successfully!');
  
} catch (error) {
  console.error('\n❌ Migration process failed:', error.message);
  process.exit(1);
}