#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

// Progress tracking
const migrationSteps = [
  { name: 'Upload predefined UI keys', script: 'scripts/add-ui-missing-keys.js', status: 'pending' },
  { name: 'Extract all translation keys', script: 'scripts/extract-all-translation-keys.js', status: 'pending' },
  { name: 'Remove fallback strings', script: 'scripts/remove-fallback-strings.js', status: 'pending' }
];

let currentStep = 0;

function runScript(scriptPath, stepName) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Step ${currentStep + 1}/${migrationSteps.length}: ${stepName}`);
    console.log('═'.repeat(60));
    
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        migrationSteps[currentStep].status = 'completed';
        console.log(`\n✅ Step ${currentStep + 1} completed successfully: ${stepName}`);
        resolve();
      } else {
        migrationSteps[currentStep].status = 'failed';
        console.error(`\n❌ Step ${currentStep + 1} failed: ${stepName} (exit code: ${code})`);
        reject(new Error(`Script failed with exit code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      migrationSteps[currentStep].status = 'failed';
      console.error(`\n❌ Step ${currentStep + 1} error: ${stepName}`, error);
      reject(error);
    });
  });
}

function generateProgressReport() {
  const report = {
    timestamp: new Date().toISOString(),
    migrationSteps: migrationSteps.map(step => ({
      name: step.name,
      status: step.status
    })),
    summary: {
      total: migrationSteps.length,
      completed: migrationSteps.filter(s => s.status === 'completed').length,
      failed: migrationSteps.filter(s => s.status === 'failed').length,
      pending: migrationSteps.filter(s => s.status === 'pending').length
    }
  };
  
  fs.writeFileSync('translation-migration-progress.json', JSON.stringify(report, null, 2));
  return report;
}

async function main() {
  try {
    console.log('🌟 COMPLETE TRANSLATION MIGRATION PROCESS');
    console.log('═'.repeat(60));
    console.log('This process will:');
    console.log('1. Upload all predefined UI translation keys');
    console.log('2. Extract and upload all missing translation keys from source code');
    console.log('3. Remove fallback strings from all translation calls');
    console.log('═'.repeat(60));
    
    // Execute each migration step
    for (const step of migrationSteps) {
      try {
        await runScript(step.script, step.name);
        currentStep++;
      } catch (error) {
        console.error(`\nMigration stopped at step ${currentStep + 1}: ${step.name}`);
        break;
      }
    }
    
    // Generate final report
    const report = generateProgressReport();
    
    console.log('\n🏁 MIGRATION PROCESS COMPLETE');
    console.log('═'.repeat(60));
    console.log(`   📊 Total steps: ${report.summary.total}`);
    console.log(`   ✅ Completed: ${report.summary.completed}`);
    console.log(`   ❌ Failed: ${report.summary.failed}`);
    console.log(`   ⏳ Pending: ${report.summary.pending}`);
    console.log('═'.repeat(60));
    
    if (report.summary.completed === report.summary.total) {
      console.log('\n🎉 ALL MIGRATION STEPS COMPLETED SUCCESSFULLY!');
      console.log('\nYour application now has:');
      console.log('   ✓ All UI text migrated to database translations');
      console.log('   ✓ No hardcoded fallback strings in components');
      console.log('   ✓ Unified translation system with database-first loading');
      console.log('\nNext steps:');
      console.log('   1. Test the application in both Arabic and English');
      console.log('   2. Review auto-generated translations for accuracy');
      console.log('   3. Refine translations through the admin interface');
    } else {
      console.log('\n⚠️  Migration partially completed. Check the logs above for details.');
      console.log(`   Progress report saved to: translation-migration-progress.json`);
    }
    
  } catch (error) {
    console.error('\n❌ Migration process failed:', error.message);
    generateProgressReport();
    process.exit(1);
  }
}

// Handle interruption gracefully
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Migration process interrupted by user');
  generateProgressReport();
  process.exit(1);
});

// Execute
main();