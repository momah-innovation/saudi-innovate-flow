/**
 * Script to run the hardcoded values migration
 */

import { migrateAllHardcodedValues } from './migrateHardcodedValues';

async function runMigration() {
  console.log('🚀 Starting hardcoded values migration...');
  console.log('=====================================');
  
  try {
    const results = await migrateAllHardcodedValues();
    
    console.log('\n✅ Migration completed!');
    console.log('=====================================');
    
    const totalUpdated = results.reduce((sum, r) => sum + r.updated, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    
    console.log(`📊 SUMMARY:`);
    console.log(`   • Total records updated: ${totalUpdated}`);
    console.log(`   • Total errors: ${totalErrors}`);
    console.log(`   • Tables processed: ${results.length}`);
    
    console.log('\n📋 DETAILED RESULTS:');
    results.forEach(result => {
      const status = result.errors.length > 0 ? '❌' : '✅';
      console.log(`${status} ${result.table}.${result.column}: ${result.updated} updated${result.errors.length > 0 ? `, ${result.errors.length} errors` : ''}`);
      
      if (result.errors.length > 0) {
        result.errors.forEach(error => {
          console.log(`     Error: ${error}`);
        });
      }
    });
    
    if (totalErrors === 0) {
      console.log('\n🎉 All migrations completed successfully!');
      console.log('You can now use the new TranslatableSelect and TranslatableBadge components.');
    } else {
      console.log('\n⚠️  Some errors occurred. Please review the errors above.');
    }
    
    return { success: totalErrors === 0, totalUpdated, totalErrors, results };
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    return { success: false, error: String(error) };
  }
}

// Execute migration
runMigration().then(result => {
  console.log('\n🏁 Migration script completed.');
  if (typeof window !== 'undefined') {
    (window as any).migrationResult = result;
  }
});

export { runMigration };