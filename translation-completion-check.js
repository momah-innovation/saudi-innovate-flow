#!/usr/bin/env node

/**
 * Final Translation Completion Check
 * Analyzes the current state of translation migration
 */

const fs = require('fs');
const path = require('path');

function extractTranslationKeys() {
  const srcDir = path.join(__dirname, 'src');
  const translationKeys = new Set();
  
  // Patterns to match translation keys
  const patterns = [
    /t\(['"`]([^'"`]+)['"`]\)/g,
    /getTranslation\(['"`]([^'"`]+)['"`]\)/g,
    /translation_key:\s*['"`]([^'"`]+)['"`]/g
  ];
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.includes('node_modules') && !item.startsWith('.')) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(item) && !item.includes('.test.') && !item.includes('.d.ts')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          
          patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
              translationKeys.add(match[1]);
            }
          });
        } catch (error) {
          console.error(`Error reading ${fullPath}:`, error.message);
        }
      }
    }
  }
  
  scanDirectory(srcDir);
  return Array.from(translationKeys).sort();
}

function generateReport() {
  console.log('🔍 FINAL TRANSLATION COMPLETION ANALYSIS');
  console.log('========================================');
  
  const codeKeys = extractTranslationKeys();
  
  console.log(`📊 RESULTS:`);
  console.log(`   • Translation keys found in code: ${codeKeys.length}`);
  console.log(`   • Database shows: 2,959 total keys`);
  
  // Sample of code keys to show variety
  console.log('\n📋 SAMPLE OF KEYS FOUND IN CODE:');
  codeKeys.slice(0, 20).forEach(key => {
    console.log(`   • ${key}`);
  });
  
  if (codeKeys.length > 20) {
    console.log(`   ... and ${codeKeys.length - 20} more keys`);
  }
  
  // Group by prefixes
  const keyGroups = {};
  codeKeys.forEach(key => {
    const prefix = key.split('.')[0];
    if (!keyGroups[prefix]) keyGroups[prefix] = 0;
    keyGroups[prefix]++;
  });
  
  console.log('\n🏷️  KEY GROUPS BY PREFIX:');
  Object.entries(keyGroups)
    .sort(([,a], [,b]) => b - a)
    .forEach(([prefix, count]) => {
      console.log(`   • ${prefix}: ${count} keys`);
    });
  
  // Write detailed report
  const report = {
    timestamp: new Date().toISOString(),
    analysis: 'Final Translation Completion Check',
    code_keys_count: codeKeys.length,
    database_keys_count: 2959,
    code_keys: codeKeys,
    key_groups: keyGroups,
    status: 'Code keys extracted, database has many keys but sync needs verification'
  };
  
  fs.writeFileSync('final-translation-completion-report.json', JSON.stringify(report, null, 2));
  
  console.log('\n✅ Analysis complete! Report saved to: final-translation-completion-report.json');
  console.log('\n🎯 NEXT STEPS:');
  console.log('   1. Verify which code keys are missing from database');
  console.log('   2. Add any missing translation keys');
  console.log('   3. Remove unused keys from database if needed');
  console.log('   4. Test translation system end-to-end');
}

generateReport();