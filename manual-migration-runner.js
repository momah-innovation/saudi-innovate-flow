#!/usr/bin/env node

/**
 * Manual Migration Execution Script
 * Executes each step of the translation migration individually with detailed logging
 */

const { spawn } = require('child_process');
const fs = require('fs');

// Migration steps to execute
const steps = [
  {
    name: 'Upload Predefined UI Keys',
    script: 'scripts/add-ui-missing-keys.js',
    description: 'Upload 164 predefined UI translation keys to database'
  },
  {
    name: 'Extract All Translation Keys', 
    script: 'scripts/extract-all-translation-keys.js',
    description: 'Scan all frontend files and extract translation keys'
  },
  {
    name: 'Remove Fallback Strings',
    script: 'scripts/remove-fallback-strings.js', 
    description: 'Clean up hardcoded fallback strings from components'
  }
];

let currentStep = 0;
const results = [];

function executeStep(step) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🚀 Step ${currentStep + 1}/${steps.length}: ${step.name}`);
    console.log(`📋 ${step.description}`);
    console.log(`${'='.repeat(70)}\n`);

    const startTime = Date.now();
    
    const child = spawn('node', [step.script], {
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });

    child.on('close', (code) => {
      const duration = Date.now() - startTime;
      const result = {
        step: currentStep + 1,
        name: step.name,
        status: code === 0 ? 'SUCCESS' : 'FAILED',
        exitCode: code,
        duration: `${(duration / 1000).toFixed(2)}s`
      };
      
      results.push(result);

      if (code === 0) {
        console.log(`\n✅ Step ${currentStep + 1} completed successfully! (${result.duration})`);
        resolve(result);
      } else {
        console.error(`\n❌ Step ${currentStep + 1} failed with exit code: ${code}`);
        reject(new Error(`Step failed: ${step.name}`));
      }
    });

    child.on('error', (error) => {
      console.error(`\n❌ Process error in step ${currentStep + 1}:`, error);
      results.push({
        step: currentStep + 1,
        name: step.name,
        status: 'ERROR',
        error: error.message,
        duration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`
      });
      reject(error);
    });
  });
}

async function runMigration() {
  const migrationStartTime = Date.now();
  
  console.log('🌟 STARTING COMPLETE TRANSLATION MIGRATION');
  console.log('═'.repeat(70));
  console.log('📊 Migration Plan:');
  steps.forEach((step, index) => {
    console.log(`   ${index + 1}. ${step.name}`);
    console.log(`      ${step.description}`);
  });
  console.log('═'.repeat(70));

  try {
    // Execute each step sequentially
    for (const step of steps) {
      await executeStep(step);
      currentStep++;
    }

    // Generate final report
    const totalDuration = Date.now() - migrationStartTime;
    
    console.log('\n🏁 MIGRATION COMPLETE!');
    console.log('═'.repeat(70));
    console.log('📊 FINAL SUMMARY:');
    console.log(`   ⏱️  Total time: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log(`   ✅ Successful steps: ${results.filter(r => r.status === 'SUCCESS').length}`);
    console.log(`   ❌ Failed steps: ${results.filter(r => r.status !== 'SUCCESS').length}`);
    console.log('');
    
    results.forEach(result => {
      const status = result.status === 'SUCCESS' ? '✅' : '❌';
      console.log(`   ${status} ${result.step}. ${result.name} (${result.duration})`);
    });
    
    console.log('═'.repeat(70));
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      totalDuration: `${(totalDuration / 1000).toFixed(2)}s`,
      steps: results,
      summary: {
        total: steps.length,
        successful: results.filter(r => r.status === 'SUCCESS').length,
        failed: results.filter(r => r.status !== 'SUCCESS').length
      }
    };
    
    fs.writeFileSync('translation-migration-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Detailed report saved to: translation-migration-report.json');
    
    if (results.every(r => r.status === 'SUCCESS')) {
      console.log('\n🎉 ALL STEPS COMPLETED SUCCESSFULLY!');
      console.log('   Your translation system is now fully migrated to the database.');
      console.log('   Next steps:');
      console.log('   1. Test the application in both Arabic and English');
      console.log('   2. Review auto-generated translations for accuracy');
      console.log('   3. Use the admin interface to refine translations');
    } else {
      console.log('\n⚠️  Some steps failed. Please check the logs above for details.');
    }
    
  } catch (error) {
    console.error('\n💥 Migration stopped due to error:', error.message);
    
    // Save error report
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: error.message,
      completedSteps: results,
      failedAt: currentStep + 1
    };
    
    fs.writeFileSync('translation-migration-error.json', JSON.stringify(errorReport, null, 2));
    console.log('📄 Error report saved to: translation-migration-error.json');
    
    process.exit(1);
  }
}

// Handle interruption gracefully
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Migration interrupted by user');
  
  const report = {
    timestamp: new Date().toISOString(),
    status: 'INTERRUPTED',
    completedSteps: results,
    interruptedAt: currentStep + 1
  };
  
  fs.writeFileSync('translation-migration-interrupted.json', JSON.stringify(report, null, 2));
  console.log('📄 Interruption report saved to: translation-migration-interrupted.json');
  process.exit(1);
});

// Execute the migration
runMigration();