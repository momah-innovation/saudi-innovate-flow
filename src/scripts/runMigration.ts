/**
 * Script to run the hardcoded values migration
 */

import { migrateAllHardcodedValues } from './migrateHardcodedValues';

async function runMigration() {
  // Use structured logging for migration start
  if (typeof window !== 'undefined' && (window as any).debugLog) {
    (window as any).debugLog.log('Starting hardcoded values migration', { component: 'RunMigration' });
  }
  
  try {
    const results = await migrateAllHardcodedValues();
    
    const totalUpdated = results.reduce((sum, r) => sum + r.updated, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    
    // Use structured logging for migration completion
    if (typeof window !== 'undefined' && (window as any).debugLog) {
      (window as any).debugLog.log('Migration completed', { 
        component: 'RunMigration', 
        data: { 
          totalUpdated, 
          totalErrors, 
          tablesProcessed: results.length,
          success: totalErrors === 0,
          results: results.map(r => ({
            table: `${r.table}.${r.column}`,
            updated: r.updated,
            errors: r.errors.length
          }))
        } 
      });
    }
    
    return { success: totalErrors === 0, totalUpdated, totalErrors, results };
    
  } catch (error) {
    // Use structured logging for migration failure
    if (typeof window !== 'undefined' && (window as any).debugLog) {
      (window as any).debugLog.error('Migration failed', { component: 'RunMigration' }, error);
    }
    return { success: false, error: String(error) };
  }
}

// Execute migration
runMigration().then(result => {
  // Use structured logging for completion
  if (typeof window !== 'undefined' && (window as any).debugLog) {
    (window as any).debugLog.log('Migration script completed', { component: 'RunMigration', data: result });
  }
  if (typeof window !== 'undefined') {
    (window as any).migrationResult = result;
  }
});

export { runMigration };